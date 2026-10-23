import React from 'react'
import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  email?: string
  password?: string
  loginUrl?: string
}

const NAVY = '#1B2E4B'
const GOLD = '#C9A227'

const Email = ({ name, email, password, loginUrl }: Props) => (
  <Html lang="ro" dir="ltr">
    <Head />
    <Preview>Contul tău de candidat IONMAN Workforce este gata</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brand}>IONMAN <span style={{ color: GOLD }}>WORKFORCE</span></Text>
        </Section>
        <Heading style={h1}>Contul tău de candidat este gata</Heading>
        <Text style={text}>Bună{ name ? ` ${name}` : ''},</Text>
        <Text style={text}>
          Îți mulțumim pentru CV! Ți-am creat automat un cont de candidat, ca să poți urmări
          oricând starea candidaturii tale.
        </Text>
        <Section style={credentials}>
          <Text style={credLabel}>Datele tale de autentificare</Text>
          <Text style={credRow}><strong>Email:</strong> {email}</Text>
          <Text style={credRow}><strong>Parola temporară:</strong> <span style={passwordStyle}>{password}</span></Text>
        </Section>
        <Button style={button} href={loginUrl}>Autentifică-te în contul tău</Button>
        <Text style={text}>
          Poți schimba parola oricând: după autentificare, în pagina contului tău, sau prin linkul
          „Ai uitat parola?" de pe pagina de autentificare.
        </Text>
        <Hr style={hr} />
        <Text style={small}>
          English: Your candidate account is ready. Sign in with the email and temporary password
          above — you can change your password anytime from your account page.
        </Text>
        <Text style={small}>
          Recrutarea este gratuită pentru candidați, întotdeauna. Ai întrebări? Scrie-ne la{' '}
          <Link href="mailto:contact@vreaujobs.eu" style={link}>contact@vreaujobs.eu</Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Contul tău de candidat IONMAN Workforce',
  displayName: 'Candidate account created',
  previewData: {
    name: 'Ana Popescu',
    email: 'ana@email.ro',
    password: 'Xk29-mQp4-Lz71',
    loginUrl: 'https://europe-talent-connect.lovable.app/candidate-portal',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 25px', maxWidth: '560px' }
const header = { borderBottom: `3px solid ${GOLD}`, paddingBottom: '12px', marginBottom: '24px' }
const brand = { color: NAVY, fontSize: '18px', fontWeight: 'bold' as const, letterSpacing: '1px', margin: '0' }
const h1 = { color: NAVY, fontSize: '24px', margin: '0 0 16px' }
const text = { color: '#333333', fontSize: '15px', lineHeight: '24px' }
const credentials = { backgroundColor: '#F4F6FA', borderLeft: `4px solid ${NAVY}`, padding: '16px 20px', margin: '20px 0' }
const credLabel = { color: NAVY, fontSize: '12px', fontWeight: 'bold' as const, textTransform: 'uppercase' as const, letterSpacing: '1px', margin: '0 0 10px' }
const credRow = { color: '#333333', fontSize: '15px', margin: '4px 0' }
const passwordStyle = { fontFamily: 'monospace', fontSize: '16px', color: NAVY }
const button = { backgroundColor: NAVY, color: '#ffffff', fontSize: '15px', fontWeight: 'bold' as const, padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', display: 'inline-block', margin: '8px 0 16px' }
const hr = { borderColor: '#E5E8EF', margin: '24px 0' }
const small = { color: '#777777', fontSize: '12px', lineHeight: '18px' }
const link = { color: NAVY, textDecoration: 'underline' }
