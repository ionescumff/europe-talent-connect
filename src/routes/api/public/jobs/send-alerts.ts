import { createFileRoute } from '@tanstack/react-router'
import { authenticateCronRequest } from '@/integrations/supabase/cron-auth'
import { matchesAlert } from '@/lib/job-alerts'

const SITE = 'https://www.vreaujobs.com'

export const Route = createFileRoute('/api/public/jobs/send-alerts')({
  staticData: { sitemap: false },
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authFailure = await authenticateCronRequest(request)
        if (authFailure) return authFailure

        const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
        const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')

        const { data: alerts, error: aErr } = await supabaseAdmin.from('job_alerts').select('*').eq('active', true)
        if (aErr) return Response.json({ error: 'alerts' }, { status: 500 })
        if (!alerts?.length) return Response.json({ sent: 0 })

        const oldest = alerts.reduce((m, a) => (a.last_sent_at < m ? a.last_sent_at : m), alerts[0]!.last_sent_at)
        const { data: jobs, error: jErr } = await supabaseAdmin
          .from('job_posts')
          .select('id, slug, title, sector, city, salary, created_at, company_name, translations')
          .eq('published', true).eq('status', 'open').ilike('company_name', 'Triangle%')
          .gt('created_at', oldest).order('created_at', { ascending: false })
        if (jErr) return Response.json({ error: 'jobs' }, { status: 500 })

        let sent = 0
        for (const alert of alerts) {
          const matches = (jobs ?? []).filter((j) => matchesAlert(alert, j)).slice(0, 15)
          const newest = matches[0]
          if (!newest) continue
          const items = matches.map((j) => {
            const tr = (j.translations as Record<string, any> | null)?.[alert.lang] ?? {}
            return { title: tr.title ?? j.title, city: j.city, pay: tr.pay ?? j.salary, url: `${SITE}/jobs/${j.slug ?? j.id}` }
          })
          try {
            await sendTemplateEmail('job-alert', alert.email, {
              templateData: { lang: alert.lang, jobs: items, accountUrl: `${SITE}/candidate-account` },
              idempotencyKey: `job-alert-${alert.id}-${newest.id}`,
            })
            sent++
          } catch (e) {
            console.error('job alert send failed', alert.id, e)
            continue
          }
          await supabaseAdmin.from('job_alerts').update({ last_sent_at: newest.created_at }).eq('id', alert.id)
        }
        return Response.json({ sent })
      },
    },
  },
})
