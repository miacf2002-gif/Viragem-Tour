import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { google } from 'googleapis'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

function buildAuth() {
  const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON

  if (rawJson) {
    const serviceAccount = JSON.parse(rawJson)
    return new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    })
  }

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!clientEmail || !privateKey) {
    return null
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })
}

const auth = buildAuth()
const calendar = auth ? google.calendar({ version: 'v3', auth }) : null

function getStatusLabel(status) {
  if (status === 'accepted') return 'Aceite'
  if (status === 'rejected') return 'Rejeitada'
  return 'Pendente de aprovação'
}

function getStatusSummary(status, experience) {
  const base = experience || 'Viragem Tour'
  if (status === 'accepted') return `Reserva aceite - ${base}`
  if (status === 'rejected') return `Reserva rejeitada - ${base}`
  return `Reserva pendente de aprovação - ${base}`
}

function normalizeReservation(data) {
  const date = data.date || new Date().toISOString().slice(0, 10)
  const time = data.time || '10:00'
  const startDate = new Date(`${date}T${time}:00`)
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000)
  const status = data.status || 'pending'

  return {
    summary: getStatusSummary(status, data.experience),
    description: [
      `Cliente: ${data.name || 'Cliente'}`,
      `Experiência: ${data.experience || 'Viragem Tour'}`,
      `Pessoas: ${data.people || 2}`,
      `Hora: ${time}`,
      `Mensagem: ${data.message || 'Sem observações adicionais.'}`,
      `Estado: ${getStatusLabel(status)}`,
      'Reserva criada pelo site da Viragem Tour.',
    ].join('\n'),
    start: {
      dateTime: startDate.toISOString(),
      timeZone: 'Europe/Lisbon',
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: 'Europe/Lisbon',
    },
    location: 'Lisboa, Portugal',
    reminders: {
      useDefault: true,
    },
    colorId: status === 'accepted' ? '10' : status === 'rejected' ? '11' : '6',
    status,
  }
}

function parseReservationStatusFromEvent(event) {
  const summary = event.summary || ''
  if (summary.startsWith('Reserva aceite')) return 'accepted'
  if (summary.startsWith('Reserva rejeitada')) return 'rejected'
  return 'pending'
}

function mapCalendarEventToReservation(event) {
  const description = event.description || ''
  const matches = {
    name: description.match(/Cliente:\s*(.*)/)?.[1]?.trim(),
    experience: description.match(/Experiência:\s*(.*)/)?.[1]?.trim(),
    people: description.match(/Pessoas:\s*(\d+)/)?.[1],
    time: description.match(/Hora:\s*(.*)/)?.[1]?.trim(),
    message: description.match(/Mensagem:\s*(.*)/)?.[1]?.trim(),
  }

  const start = event.start?.dateTime || event.start?.date
  const date = start ? new Date(start).toISOString().slice(0, 10) : ''
  const status = parseReservationStatusFromEvent(event)

  return {
    id: event.id,
    name: matches.name || 'Cliente',
    experience: matches.experience || 'Viragem Tour',
    people: Number(matches.people || 2),
    date,
    time: matches.time || '10:00',
    message: matches.message || '',
    status,
    htmlLink: event.htmlLink,
  }
}

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/reservas', async (_req, res) => {
  try {
    if (!calendar) {
      return res.status(500).json({
        ok: false,
        message: 'Credenciais do Google Calendar ausentes. Configure GOOGLE_SERVICE_ACCOUNT_JSON ou GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY.',
      })
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary'
    const response = await calendar.events.list({
      calendarId,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 100,
    })

    const reservations = (response.data.items || [])
      .filter((item) => item.summary && /Reserva/.test(item.summary))
      .map(mapCalendarEventToReservation)

    return res.json({ ok: true, reservations })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao listar reservas.'
    console.error('Google Calendar list error:', error)
    return res.status(500).json({ ok: false, message })
  }
})

app.post('/api/reservas', async (req, res) => {
  try {
    const reservation = req.body

    if (!reservation || !reservation.date || !reservation.name || !reservation.experience) {
      return res.status(400).json({
        ok: false,
        message: 'Preencha nome, data e experiência para criar a reserva.',
      })
    }

    if (!calendar) {
      return res.status(500).json({
        ok: false,
        message: 'Credenciais do Google Calendar ausentes. Configure GOOGLE_SERVICE_ACCOUNT_JSON ou GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY.',
      })
    }

    const event = normalizeReservation({
      ...reservation,
      status: reservation.status || 'pending',
    })
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary'

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    })

    return res.json({
      ok: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
      summary: event.summary,
      status: event.status,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar a reserva.'
    console.error('Google Calendar error:', error)
    return res.status(500).json({ ok: false, message })
  }
})

app.patch('/api/reservas/:eventId/status', async (req, res) => {
  try {
    const { eventId } = req.params
    const { status } = req.body
    const allowed = ['accepted', 'rejected']

    if (!allowed.includes(status)) {
      return res.status(400).json({ ok: false, message: 'Estado inválido.' })
    }

    if (!calendar) {
      return res.status(500).json({
        ok: false,
        message: 'Credenciais do Google Calendar ausentes. Configure GOOGLE_SERVICE_ACCOUNT_JSON ou GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY.',
      })
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary'
    const eventResponse = await calendar.events.get({ calendarId, eventId })
    const event = eventResponse.data
    const originalSummary = event.summary || 'Reserva - Viragem Tour'
    const experience = originalSummary.replace(/^Reserva (aceite|rejeitada|pendente de aprovação)\s*-\s*/i, '').replace(/^Reserva\s*-\s*/i, '') || 'Viragem Tour'
    const updated = normalizeReservation({
      name: event.description?.match(/Cliente:\s*(.*)/)?.[1]?.trim() || 'Cliente',
      experience,
      people: Number(event.description?.match(/Pessoas:\s*(\d+)/)?.[1] || 2),
      date: event.start?.dateTime ? new Date(event.start.dateTime).toISOString().slice(0, 10) : (event.start?.date || new Date().toISOString().slice(0, 10)),
      time: event.description?.match(/Hora:\s*(.*)/)?.[1]?.trim() || '10:00',
      message: event.description?.match(/Mensagem:\s*(.*)/)?.[1]?.trim() || 'Sem observações adicionais.',
      status,
    })

    const response = await calendar.events.update({
      calendarId,
      eventId,
      requestBody: {
        ...event,
        summary: updated.summary,
        description: updated.description,
        colorId: updated.colorId,
      },
    })

    return res.json({
      ok: true,
      status,
      eventId,
      event: mapCalendarEventToReservation(response.data),
      htmlLink: response.data.htmlLink,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao atualizar a reserva.'
    console.error('Google Calendar update error:', error)
    return res.status(500).json({ ok: false, message })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
