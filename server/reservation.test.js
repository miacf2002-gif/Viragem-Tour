import test from 'node:test'
import assert from 'node:assert/strict'

function getStatusLabel(status) {
  if (status === 'accepted') return 'Aceite'
  if (status === 'rejected') return 'Rejeitada'
  return 'Pendente de aprovação'
}

function normalizeReservation(data) {
  const date = data.date || new Date().toISOString().slice(0, 10)
  const time = data.time || '10:00'
  const startDate = new Date(`${date}T${time}:00`)
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000)
  const status = data.status || 'pending'

  return {
    summary: `Reserva - ${data.experience || 'Viragem Tour'}`,
    description: [
      `Cliente: ${data.name || 'Cliente'}`,
      `Experiência: ${data.experience || 'Viragem Tour'}`,
      `Pessoas: ${data.people || 2}`,
      `Hora: ${time}`,
      `Mensagem: ${data.message || 'Sem observações adicionais.'}`,
      `Status: ${getStatusLabel(status)}`,
      'Reserva criada pelo site da Viragem Tour.',
    ].join('\n'),
    start: { dateTime: startDate.toISOString(), timeZone: 'Europe/Lisbon' },
    end: { dateTime: endDate.toISOString(), timeZone: 'Europe/Lisbon' },
    location: 'Lisboa, Portugal',
    status,
  }
}

test('normaliza uma reserva com data, hora e estado pendente', () => {
  const reservation = normalizeReservation({
    date: '2026-10-03',
    time: '14:30',
    name: 'Maria',
    experience: 'Sintra & Peninha',
    people: 3,
    message: 'Quero uma mesa perto do mar.',
  })

  assert.equal(reservation.summary, 'Reserva - Sintra & Peninha')
  assert.match(reservation.description, /Maria/)
  assert.match(reservation.description, /Pendente de aprovação/)
  assert.equal(reservation.location, 'Lisboa, Portugal')
  assert.equal(reservation.status, 'pending')
  assert.match(reservation.start.dateTime, /2026-10-03T/)
  assert.match(reservation.end.dateTime, /2026-10-03T/)
})

test('atribui texto de estado correto para aprovação e rejeição', () => {
  assert.equal(getStatusLabel('pending'), 'Pendente de aprovação')
  assert.equal(getStatusLabel('accepted'), 'Aceite')
  assert.equal(getStatusLabel('rejected'), 'Rejeitada')
})
