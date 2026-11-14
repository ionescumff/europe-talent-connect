import React from 'react'
import { Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface AlertJobItem { title: string; city: string; pay?: string; url: string }
interface Props { lang?: 'ro' | 'en'; jobs?: AlertJobItem[]; accountUrl?: string }

const NAVY = '#1B2E4B'
const GOLD = '#C9A227'

const Email = ({ lang = 'ro', jobs = [], accountUrl = 'https://www.vreaujobs.com/candidate-account' }: Props) => {
  const ro = lang === 'ro'
  return (
    <Html lang={lang} dir="ltr">
      <Head />
      <Preview>{ro ? `${jobs.length} posturi noi potrivite pentru tine` : `${jobs.length} new jobs matching your alert`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>IONMAN <span style={{ color: GOLD }}>WORKFORCE</span></Text>
          <Heading style={h1}>{ro ? 'Posturi noi pentru tine' : 'New jobs for you'}</Heading>
          <Text style={text}>{ro ? 'Au fost publicate posturi noi care se potrivesc alertei tale:' : 'New jobs matching your alert have been posted:'}</Text>
          {jobs.map((j) => (
            <Section key={j.url} style={card}>
              <Link href={j.url} style={jobTitle}>{j.title}</Link>
              <Text style={meta}>{j.city}{j.pay ? ` · ${j.pay}` : ''}</Text>
            </Section>
          ))}
          <Text style={small}>{ro ? 'Condițiile fiecărui post sunt stabilite de angajator și se confirmă înainte de plecare. Nu percepem nicio taxă candidaților.' : 'Each job’s terms are set by the employer and confirmed before travel. We never charge candidates any fee.'}</Text>
          <Button href={accountUrl} style={button}>{ro ? 'Modifică alerta' : 'Change your alert'}</Button>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => d.lang === 'en' ? `New jobs matching your alert (${d.jobs?.length ?? 0})` : `Posturi noi pentru tine (${d.jobs?.length ?? 0})`,
  displayName: 'Job alert',
  previewData: { lang: 'ro', jobs: [{ title: 'Operator depozit', city: 'Utrecht', pay: '€14–16/oră', url: 'https://www.vreaujobs.com/jobs/example' }] },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const brand = { fontSize: '18px', fontWeight: 700, color: NAVY, letterSpacing: '1px' }
const h1 = { fontSize: '22px', color: NAVY, margin: '16px 0' }
const text = { fontSize: '15px', color: '#333333', lineHeight: '24px' }
const card = { borderLeft: `3px solid ${GOLD}`, padding: '4px 12px', margin: '12px 0' }
const jobTitle = { fontSize: '16px', fontWeight: 700, color: NAVY }
const meta = { fontSize: '13px', color: '#666666', margin: '4px 0 0' }
const small = { fontSize: '12px', color: '#666666', lineHeight: '18px', marginTop: '20px' }
const button = { backgroundColor: NAVY, color: '#ffffff', padding: '12px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: 700 }
