import { useState, useEffect } from 'react'
import brandLogoAsset from './imports/Viragem Logo.png'

const WHATSAPP_NUMBER = '351913977456'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const MANAGER_PASSWORD = import.meta.env.VITE_MANAGER_PASSWORD || 'viragem2026'

function toGoogleCalendarLink(data: { name: string; experience: string; date: string; time: string; people: string; message: string }) {
  if (!data.date) return wa('Olá! Gostaria de pedir uma reserva para a experiência Viragem Tour.')

  const cleanExperience = data.experience || 'Experiência Viragem Tour'
  const title = `${cleanExperience} — Reserva` 
  const safeName = data.name || 'Cliente'
  const safeTime = data.time || '10:00'
  const startDate = new Date(`${data.date}T${safeTime}:00`)
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000)

  const formatGoogleDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
  }

  const details = [
    `Cliente: ${safeName}`,
    `Experiência: ${cleanExperience}`,
    `Pessoas: ${data.people || 2}`,
    `Hora: ${safeTime}`,
    `Mensagem: ${data.message || 'Sem observações adicionais.'}`,
    'Reserva gerada pelo site da Viragem Tour.',
  ].join('\n')

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${encodeURIComponent(formatGoogleDate(startDate))}/${encodeURIComponent(formatGoogleDate(endDate))}&details=${encodeURIComponent(details)}&location=${encodeURIComponent('Lisboa, Portugal')}&sf=true&output=xml`
}

function wa(msg = '') {
  return `https://wa.me/${WHATSAPP_NUMBER}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`
}

const experiences = [
  {
    title: 'Lisboa & Cascais',
    emoji: '🌊',
    tagline: 'Costa atlântica e charme',
    description: 'Passeio confortável até Cascais, com vista para o mar, pequenas aldeias e um ritmo relaxado entre o mar e a cidade.',
    duration: '5h',
    location: 'Cascais, Portugal',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&auto=format',
    badge: 'Mais pedido',
  },
  {
    title: 'Sintra & Peninha',
    emoji: '🏰',
    tagline: 'Palácios e mistério',
    description: 'Sintra com os seus palácios, jardins e vistas que parecem saídos de um filme. Ideal para quem quer cultura e beleza sem pressa.',
    duration: '6h',
    location: 'Sintra, Portugal',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&h=600&fit=crop&auto=format',
    badge: 'Top',
  },
  {
    title: 'Belém & Alcântara',
    emoji: '⛵',
    tagline: 'História e Tejo',
    description: 'Passeio por Belém, monumentos históricos e o melhor da zona ribeirinha de Lisboa, com paragem para provar os famosos pastéis.',
    duration: '4h',
    location: 'Belém, Portugal',
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop&auto=format',
    badge: null,
  },
  {
    title: 'Alentejo & Évora',
    emoji: '🌾',
    tagline: 'Paisagem e tradição',
    description: 'Uma viagem para fora da cidade, com histórias, vilas históricas e uma experiência mais tranquila e genuína.',
    duration: '8h',
    location: 'Évora, Portugal',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop&auto=format',
    badge: 'Fora da cidade',
  },
  {
    title: 'Nazaré & Costa Oeste',
    emoji: '🌊',
    tagline: 'Mar e paisagem',
    description: 'Nazaré com o mar atlântico, vistas panorâmicas e um ritmo descontraído, perfeito para quem quer algo autêntico e memorável.',
    duration: '7h',
    location: 'Nazaré, Portugal',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop&auto=format',
    badge: null,
  },
  {
    title: 'Óbidos & Oeste',
    emoji: '🏰',
    tagline: 'Aldeia medieval',
    description: 'Uma vila encantada, com muralhas, ruas históricas e um charme que faz parar o tempo. Uma das experiências mais fotogénicas do país.',
    duration: '6h',
    location: 'Óbidos, Portugal',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&h=600&fit=crop&auto=format',
    badge: 'Especial',
  },
]

const routes = ['Lisboa', 'Belém', 'Cascais', 'Sintra', 'Évora', 'Fátima', 'Nazaré', 'Óbidos', 'Porto']

const availability = {
  'Lisboa & Cascais': [
    { day: 'Hoje', slots: [{ time: '09:30', status: 'available' }, { time: '11:00', status: 'busy' }, { time: '14:30', status: 'available' }, { time: '17:00', status: 'available' }] },
    { day: 'Amanhã', slots: [{ time: '09:00', status: 'available' }, { time: '12:00', status: 'busy' }, { time: '15:00', status: 'available' }, { time: '18:00', status: 'busy' }] },
    { day: 'Sex', slots: [{ time: '10:00', status: 'available' }, { time: '11:30', status: 'available' }, { time: '13:30', status: 'busy' }, { time: '16:30', status: 'available' }] },
  ],
  'Sintra & Peninha': [
    { day: 'Hoje', slots: [{ time: '08:30', status: 'busy' }, { time: '10:30', status: 'available' }, { time: '13:00', status: 'available' }, { time: '16:00', status: 'busy' }] },
    { day: 'Amanhã', slots: [{ time: '09:00', status: 'available' }, { time: '11:00', status: 'available' }, { time: '14:00', status: 'busy' }, { time: '17:00', status: 'available' }] },
    { day: 'Dom', slots: [{ time: '09:30', status: 'busy' }, { time: '12:30', status: 'available' }, { time: '15:30', status: 'available' }, { time: '18:30', status: 'busy' }] },
  ],
  'Belém & Alcântara': [
    { day: 'Hoje', slots: [{ time: '09:00', status: 'available' }, { time: '10:30', status: 'busy' }, { time: '12:30', status: 'available' }, { time: '15:00', status: 'available' }] },
    { day: 'Amanhã', slots: [{ time: '08:30', status: 'available' }, { time: '11:00', status: 'busy' }, { time: '14:00', status: 'available' }, { time: '17:00', status: 'busy' }] },
    { day: 'Sáb', slots: [{ time: '09:30', status: 'busy' }, { time: '12:00', status: 'available' }, { time: '15:30', status: 'available' }, { time: '18:00', status: 'busy' }] },
  ],
  'Alentejo & Évora': [
    { day: 'Hoje', slots: [{ time: '07:30', status: 'busy' }, { time: '09:00', status: 'available' }, { time: '12:00', status: 'busy' }, { time: '15:00', status: 'available' }] },
    { day: 'Amanhã', slots: [{ time: '08:00', status: 'available' }, { time: '10:30', status: 'available' }, { time: '13:30', status: 'busy' }, { time: '16:00', status: 'available' }] },
    { day: 'Seg', slots: [{ time: '08:30', status: 'busy' }, { time: '11:00', status: 'available' }, { time: '14:00', status: 'busy' }, { time: '18:00', status: 'available' }] },
  ],
  'Nazaré & Costa Oeste': [
    { day: 'Hoje', slots: [{ time: '08:00', status: 'available' }, { time: '10:00', status: 'busy' }, { time: '13:00', status: 'available' }, { time: '16:00', status: 'busy' }] },
    { day: 'Amanhã', slots: [{ time: '09:30', status: 'available' }, { time: '11:30', status: 'available' }, { time: '14:00', status: 'busy' }, { time: '17:30', status: 'available' }] },
    { day: 'Dom', slots: [{ time: '08:30', status: 'busy' }, { time: '11:00', status: 'available' }, { time: '14:30', status: 'busy' }, { time: '18:00', status: 'available' }] },
  ],
  'Óbidos & Oeste': [
    { day: 'Hoje', slots: [{ time: '09:00', status: 'available' }, { time: '11:00', status: 'busy' }, { time: '14:30', status: 'available' }, { time: '17:00', status: 'busy' }] },
    { day: 'Amanhã', slots: [{ time: '08:30', status: 'busy' }, { time: '10:30', status: 'available' }, { time: '13:00', status: 'available' }, { time: '16:00', status: 'busy' }] },
    { day: 'Sáb', slots: [{ time: '09:00', status: 'available' }, { time: '12:30', status: 'available' }, { time: '15:00', status: 'busy' }, { time: '17:30', status: 'available' }] },
  ],
}

const advantages = [
  {
    title: 'Roteiro pensado para a zona',
    description: 'Cada experiência nasce a pensar na localização e no melhor horário para aproveitar bem a região.',
  },
  {
    title: 'Contacto simples e rápido',
    description: 'A reserva é clara, direta e pode ser confirmada por WhatsApp em poucos minutos.',
  },
  {
    title: 'Experiências mais reais',
    description: 'Sem roteiros genéricos. Focamo-nos no que faz a zona valer a pena e na forma como a vive.',
  },
]

const brandLogoSrc = brandLogoAsset

function BrandLogo({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return (
    <img
      src={brandLogoSrc}
      alt="Viragem Tour"
      className={`${className}`}
      style={{
        width: light ? '110px' : '150px',
        height: 'auto',
        display: 'block',
        objectFit: 'contain',
        filter: light ? 'brightness(0) invert(1)' : 'none',
        opacity: light ? 1 : 1,
      }}
    />
  )
}

function toDateIsoValue(date: Date) {
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

function getRelativeDate(dayLabel: string) {
  const today = new Date()
  const normalized = dayLabel.trim()

  if (normalized === 'Hoje') return toDateIsoValue(today)
  if (normalized === 'Amanhã') return toDateIsoValue(new Date(today.getTime() + 86400000))

  const weekdayOrder = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const currentIndex = today.getDay()
  const targetIndex = weekdayOrder.indexOf(normalized)

  if (targetIndex === -1) return toDateIsoValue(today)

  const diff = (targetIndex - currentIndex + 7) % 7 || 7
  return toDateIsoValue(new Date(today.getTime() + diff * 86400000))
}

function isManagerRoute() {
  if (typeof window === 'undefined') return false
  const path = window.location.pathname.toLowerCase()
  const hash = window.location.hash.toLowerCase()
  const search = window.location.search.toLowerCase()
  return path.includes('/admin') || hash.includes('admin') || search.includes('admin=1')
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [form, setForm] = useState({ name: '', date: '', time: '10:00', people: '', experience: '', message: '' })
  const [selectedExperience, setSelectedExperience] = useState(experiences[0].title)
  const [managerRequests, setManagerRequests] = useState([] as Array<{ id: string; name: string; experience: string; date: string; time: string; people: number; status: 'pending' | 'accepted' | 'rejected'; htmlLink?: string }>)
  const [isManagerView, setIsManagerView] = useState(isManagerRoute())
  const [managerPassword, setManagerPassword] = useState('')
  const [isManagerAuthenticated, setIsManagerAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('viragem-manager-auth') === 'true'
  })

  useEffect(() => {
    const syncManagerView = () => setIsManagerView(isManagerRoute())
    window.addEventListener('hashchange', syncManagerView)
    window.addEventListener('popstate', syncManagerView)
    return () => {
      window.removeEventListener('hashchange', syncManagerView)
      window.removeEventListener('popstate', syncManagerView)
    }
  }, [])

  useEffect(() => {
    const loadReservations = async () => {
      if (!isManagerView || !isManagerAuthenticated) return

      try {
        const response = await fetch(`${API_BASE_URL}/api/reservas`)
        const json = await response.json()

        if (response.ok && json.ok) {
          setManagerRequests(json.reservations || [])
        }
      } catch (error) {
        console.error('Erro ao carregar reservas do calendário:', error)
      }
    }

    loadReservations()
  }, [isManagerView, isManagerAuthenticated])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  function handleExperienceSelect(nextExperience: string) {
    setSelectedExperience(nextExperience)
    setForm(f => ({ ...f, experience: nextExperience }))
  }

  function handleSlotSelect(experience: string, dayLabel: string, time: string) {
    handleExperienceSelect(experience)
    setForm(f => ({
      ...f,
      experience,
      date: getRelativeDate(dayLabel),
      time,
    }))
  }

  async function handleManagerDecision(id: string, decision: 'accepted' | 'rejected') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reservas/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: decision }),
      })

      const json = await response.json()

      if (!response.ok || !json.ok) {
        throw new Error(json.message || 'Não foi possível atualizar a reserva.')
      }

      setManagerRequests(prev => prev.map(req => req.id === id ? { ...req, status: decision } : req))
    } catch (error) {
      console.error('Erro ao atualizar a reserva:', error)
      alert('Não foi possível atualizar a reserva no Google Calendar.')
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const value = e.target.value
    setForm(f => ({ ...f, [e.target.name]: value }))

    if (e.target.name === 'experience') {
      setSelectedExperience(value)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.name || !form.date || !form.experience || !form.people) {
      alert('Preencha nome, data, experiência e número de pessoas antes de enviar a reserva.')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          people: Number(form.people),
          status: 'pending',
        }),
      })

      const json = await response.json()

      if (!response.ok || !json.ok) {
        throw new Error(json.message || 'Não foi possível criar a reserva.')
      }

      const msg = `Olá! 👋 Enviámos uma reserva para a experiência *${form.experience}* em ${form.date} às ${form.time}.\n\n👤 Nome: ${form.name}\n👥 Pessoas: ${form.people}\n\nEstado: Pendente de aprovação pelo gestor.\n\nLink do evento: ${json.htmlLink}`

      window.open(json.htmlLink, '_blank')
      window.open(wa(msg), '_blank')
      alert('Pedido de reserva enviado com sucesso. A gestão vai aprovar ou rejeitar a disponibilidade.')
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Erro ao criar a reserva.'
      const googleLink = toGoogleCalendarLink(form)
      const msg = `Olá! 👋 Gostaria de reservar a experiência *${form.experience || 'Lisboa'}* para ${form.date || 'a definir'} às ${form.time || '10:00'}.\n\n👤 Nome: ${form.name}\n👥 Pessoas: ${form.people || 2}\n\n💬 ${form.message || 'Aguardo informações!'}\n\nObs.: ${reason}`

      window.open(googleLink, '_blank')
      window.open(wa(msg), '_blank')
      alert('Reserva não foi criada automaticamente. Foi aberta a opção de confirmação manual pelo Google Calendar e WhatsApp.')
    }
  }

  const navLinks = [
    { label: 'Experiências', href: '#experiencias' },
    { label: 'Agenda', href: '#agenda' },
    { label: 'Porquê Nós', href: '#vantagens' },
    { label: 'Contacto', href: '#contacto' },
  ]

  const handleManagerLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (managerPassword === MANAGER_PASSWORD) {
      window.localStorage.setItem('viragem-manager-auth', 'true')
      setIsManagerAuthenticated(true)
      return
    }

    alert('Password do gestor incorreta.')
  }

  if (isManagerView) {
    if (!isManagerAuthenticated) {
      return (
        <div className="min-h-screen bg-[#1c1c1c] text-white flex items-center justify-center px-6">
          <div className="w-full max-w-md rounded-2xl border border-[#d9c8a4] bg-[#faf6ef] p-8 text-[#1c1c1c] shadow-xl">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#8d7d69]">Área interna</p>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="mt-3 text-3xl font-semibold">
              Gestor de reservas
            </h1>
            <form onSubmit={handleManagerLogin} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#7a7060]">
                  Palavra-passe
                </label>
                <input
                  type="password"
                  value={managerPassword}
                  onChange={(e) => setManagerPassword(e.target.value)}
                  placeholder="Introduz a palavra-passe"
                  className="w-full rounded-xl border border-[#ddd5c4] bg-white px-4 py-3.5 text-sm text-[#1c1c1c] placeholder:text-[#b8ab98] focus:outline-none focus:border-[#c9a96e]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#25d366] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1aa851] transition-colors"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-[#1c1c1c] text-white px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#c9a96e]">Área interna</p>
              <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="mt-3 text-4xl md:text-5xl font-semibold text-white">
                Gestor de reservas
              </h1>
            </div>

            <button
              type="button"
              onClick={() => {
                window.localStorage.removeItem('viragem-manager-auth')
                setIsManagerAuthenticated(false)
                setManagerPassword('')
              }}
              className="rounded-full border border-[#d9c8a4] bg-[#f7f0e3] px-4 py-2 text-sm font-semibold text-[#5d5247] hover:bg-[#efe4d2] transition-colors"
            >
              Sair
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {managerRequests.length === 0 ? (
              <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-[#d9c8a4] bg-[#faf6ef] p-6 text-[#1c1c1c]">
                Não há reservas no calendário neste momento.
              </div>
            ) : (
              managerRequests.map(request => {
                const isPending = request.status === 'pending'
                const statusLabel = request.status === 'accepted' ? 'Aceite' : request.status === 'rejected' ? 'Não aceite' : 'Pendente'

                return (
                  <div key={request.id} className="rounded-2xl border border-[#d9c8a4] bg-[#faf6ef] p-5 text-[#1c1c1c] shadow-sm">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8d7d69]">Cliente</p>
                        <h3 className="text-xl font-semibold">{request.name}</h3>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${
                        request.status === 'accepted'
                          ? 'bg-[#ebf9f0] text-[#216e4d]'
                          : request.status === 'rejected'
                            ? 'bg-[#fdf0f0] text-[#9a4c4c]'
                            : 'bg-[#f5efe7] text-[#5a5040]'
                      }`}>
                        {statusLabel}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-[#5d5247]">
                      <p><strong>Experiência:</strong> {request.experience}</p>
                      <p><strong>Data:</strong> {request.date}</p>
                      <p><strong>Hora:</strong> {request.time}</p>
                      <p><strong>Pessoas:</strong> {request.people}</p>
                    </div>

                    {isPending ? (
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleManagerDecision(request.id, 'accepted')}
                          className="rounded-xl bg-[#25d366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1aa851] transition-colors"
                        >
                          Aceitar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleManagerDecision(request.id, 'rejected')}
                          className="rounded-xl border border-[#d9c8a4] bg-[#f7f0e3] px-4 py-2.5 text-sm font-semibold text-[#5d5247] hover:bg-[#efe4d2] transition-colors"
                        >
                          Não aceitar
                        </button>
                      </div>
                    ) : (
                      <div className="mt-5 rounded-xl bg-[#f7f0e3] px-3 py-2 text-xs text-[#5d5247]">
                        {request.status === 'accepted' ? 'Reserva aceita para confirmação.' : 'Reserva recusada e marcada como indisponível.'}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div style={{ fontFamily: "'Outfit', system-ui, sans-serif" }} className="min-h-screen bg-[#faf6ef] text-[#1c1c1c]">

      {/* ── HEADER ── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${
          scrolled ? 'bg-[#1c1c1c]/96 backdrop-blur-sm shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
          <a href="#" aria-label="Viragem Tour" className="flex items-center justify-center">
            <BrandLogo light className="h-auto max-h-10 w-auto" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium tracking-wide text-white/80 hover:text-[#c9a96e] transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href={wa('Olá! Gostaria de saber mais sobre os vossos tours em Lisboa. 🙂')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#25d366] hover:bg-[#1aa851] text-white text-sm font-semibold rounded-full transition-colors"
            >
              <WhatsAppIcon /> Falar pelo WhatsApp
            </a>
          </nav>

          {/* Hamburger */}
          <button className="md:hidden p-2 flex flex-col gap-1.5" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-80' : 'max-h-0'} bg-[#141414]`}>
          <div className="px-6 pt-4 pb-8 flex flex-col gap-5">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className="text-base font-medium text-[#e8d5b0] hover:text-[#c9a96e] transition-colors">
                {l.label}
              </a>
            ))}
            <a href={wa('Olá! Gostaria de saber mais sobre os vossos tours. 🙂')} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#25d366] hover:bg-[#1aa851] text-white text-sm font-semibold transition-colors">
              <WhatsAppIcon /> Falar pelo WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative h-screen min-h-[620px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#1c1c1c]">
          <img
            src="https://images.unsplash.com/photo-1501927023255-9063be98970c?w=1920&h=1080&fit=crop&auto=format"
            alt="Vista de Lisboa, Alfama"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c]/80 via-[#1c1c1c]/20 to-[#1c1c1c]/30" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Logo grande no hero */}
          <div className="mb-10 flex justify-center">
            <BrandLogo light className="h-auto w-[220px] md:w-[280px]" />
          </div>

          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.08] mb-6">
            Descubra Portugal<br />
            <span className="italic text-[#c9a96e]">de uma forma diferente.</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl font-light max-w-lg mx-auto mb-10 leading-relaxed">
            Tours com guia local. Sem script ensaiado, sem grupos de 50 pessoas. Só Portugal de verdade.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#experiencias"
              className="px-8 py-4 border-2 border-[#c9a96e] text-[#c9a96e] text-sm font-semibold tracking-wide rounded-full hover:bg-[#c9a96e] hover:text-white transition-all duration-300">
              Ver Experiências
            </a>
            <a href={wa('Olá! Quero saber mais sobre os vossos tours em Lisboa! 🙂')} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-[#25d366] hover:bg-[#1aa851] text-white text-sm font-semibold rounded-full transition-colors">
              <WhatsAppIcon /> Falar pelo WhatsApp
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] tracking-[0.4em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#c9a96e]/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="bg-[#1c1c1c] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-[#c9a96e]/15 text-[#c9a96e] text-xs font-semibold tracking-widest uppercase rounded-full mb-6">
                A nossa filosofia
              </span>
              <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="text-4xl md:text-5xl font-semibold text-white leading-[1.1] mb-6">
                Mais do que visitar.<br />
                <span className="italic text-[#c9a96e]">Viva a cidade.</span>
              </h2>
              <p className="text-[#9a9080] font-light text-lg leading-relaxed mb-5">
                Lisboa não se explica — sente-se. O cheiro a maresia, o som do fado a escapar por uma janela entreaberta, a luz dourada que cobre Alfama ao final do dia.
              </p>
              <p className="text-[#9a9080] font-light text-lg leading-relaxed mb-10">
                A Viragem Tour nasceu para mostrar essa Lisboa verdadeira. Sem guiões decorados. Sem autocarros turísticos. Só histórias reais, contadas por quem as viveu — e com bom humor garantido.
              </p>
              <a href="#contacto"
                className="inline-flex items-center gap-2 text-[#c9a96e] font-semibold text-sm hover:gap-3 transition-all">
                Vamos conversar <span>→</span>
              </a>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#2a2520]">
                <img
                  src="https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=1000&fit=crop&auto=format"
                  alt="Elétrico amarelo em Lisboa"
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-600"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-5 bg-[#c9a96e] rounded-2xl px-5 py-4 shadow-xl hidden lg:block">
                <p className="text-white text-xs font-semibold tracking-wide">⭐ Tours desde 2019</p>
                <p className="text-white/80 text-xs mt-0.5">+500 viajantes felizes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCES ── */}
      <section id="experiencias" className="bg-[#faf6ef] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[#c9a96e]/15 text-[#c9a96e] text-xs font-semibold tracking-widest uppercase rounded-full mb-5">
              Experiências
            </span>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-4xl md:text-5xl font-semibold text-[#1c1c1c] leading-tight">
              Cada tour, uma Lisboa diferente.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {experiences.map(exp => (
              <div key={exp.title} className="group bg-white rounded-2xl overflow-hidden border border-[#e8dfd0] hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#e8dfd0]">
                  {exp.badge && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-[#c9a96e] text-white text-[10px] font-bold tracking-widest uppercase rounded-full">
                      {exp.badge}
                    </div>
                  )}
                  <img src={exp.image} alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold text-[#c9a96e] tracking-wide uppercase mb-1">
                        {exp.emoji} {exp.tagline}
                      </p>
                      <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                        className="text-2xl font-semibold text-[#1c1c1c]">{exp.title}</h3>
                    </div>
                    <span className="shrink-0 ml-3 mt-1 text-xs font-semibold border-2 border-[#c9a96e]/40 text-[#c9a96e] px-2.5 py-1 rounded-full">
                      {exp.duration}
                    </span>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8d7d69] mb-4">{exp.location}</p>
                  <p className="text-[#7a7060] text-sm leading-relaxed flex-1 mb-6">{exp.description}</p>
                  <a href={wa(`Olá! Tenho interesse na experiência "${exp.title}". Podem dar-me mais informações? 😊`)}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25d366] hover:bg-[#1aa851] text-white text-sm font-semibold rounded-xl transition-colors">
                    <WhatsAppIcon /> Reservar Esta Experiência
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING ── */}
      <section id="agenda" className="bg-[#f0e8d8] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
            <div className="lg:sticky lg:top-28">
              <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="text-4xl md:text-5xl font-semibold text-[#1c1c1c] leading-[1.1] mb-5">
                Reserve a sua<br />
                <span className="italic text-[#c9a96e]">experiência.</span>
              </h2>
              <p className="text-[#7a7060] font-light text-lg leading-relaxed mb-8">
                Escolha a data e a hora em Portugal e confirme a sua reserva por WhatsApp. A equipa valida a disponibilidade e responde com alternativas se o horário estiver ocupado.
              </p>
              <div className="mb-8">
                <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#b8ab98] mb-4">Disponibilidade por experiência</p>
                <div className="rounded-2xl border border-[#ddd5c4] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#b8ab98]">Experiência ativa</p>
                      <p className="text-lg font-semibold text-[#1c1c1c]">{selectedExperience}</p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#f5efe7] px-3 py-1.5 text-[11px] font-semibold text-[#5a5040]">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#25d366]" /> Disponível agora
                    </span>
                  </div>

                  <div className="grid gap-3">
                    {(availability[selectedExperience] || availability[experiences[0].title]).map(day => (
                      <div key={day.day} className="rounded-xl border border-[#eee3d0] bg-[#faf6ef] p-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8d7d69]">{day.day}</p>
                        <div className="flex flex-wrap gap-2">
                          {day.slots.map(slot => {
                            const isAvailable = slot.status === 'available'

                            return (
                              <button
                                type="button"
                                key={`${day.day}-${slot.time}`}
                                onClick={() => isAvailable && handleSlotSelect(selectedExperience, day.day, slot.time)}
                                disabled={!isAvailable}
                                title={isAvailable ? `Selecionar ${slot.time}` : `Indisponível: ${slot.time} já está ocupada`}
                                aria-label={isAvailable ? `Selecionar ${slot.time}` : `Indisponível: ${slot.time} já está ocupada`}
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-medium border transition-colors ${
                                  isAvailable
                                    ? 'border-[#bfe5cc] bg-[#ebf9f0] text-[#216e4d] hover:bg-[#dff7e9] cursor-pointer'
                                    : 'border-[#f2d4d4] bg-[#fdf0f0] text-[#9a4c4c] cursor-not-allowed opacity-80'
                                }`}
                              >
                                <span className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-[#25d366]' : 'bg-[#d35d5d]'}`} />
                                {slot.time}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#ddd5c4] rounded-2xl p-5">
                <p className="text-xs font-semibold tracking-widest uppercase text-[#b8ab98] mb-2">Preferes falar primeiro?</p>
                <a href={wa('Olá! Gostaria de verificar a disponibilidade antes de reservar. 🙂')}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#25d366] font-semibold text-sm hover:text-[#1aa851] transition-colors">
                  <WhatsAppIcon /> Falar pelo WhatsApp
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#ddd5c4] shadow-sm p-6 md:p-8">
              <div className="mb-5">
                <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#b8ab98]">Portugal</p>
                <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="mt-2 text-3xl text-[#1c1c1c]">Reservar experiência</h3>
              </div>
              <div className="grid gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-[#7a7060] mb-2">Nome *</label>
                  <input name="name" required value={form.name} onChange={handleChange}
                    placeholder="O seu nome"
                    className="w-full border border-[#ddd5c4] bg-[#faf6ef] rounded-xl px-4 py-3.5 text-sm text-[#1c1c1c] placeholder:text-[#b8ab98] focus:outline-none focus:border-[#c9a96e] transition-colors" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-[#7a7060] mb-2">Data *</label>
                    <input type="date" name="date" required value={form.date} onChange={handleChange}
                      className="w-full border border-[#ddd5c4] bg-[#faf6ef] rounded-xl px-4 py-3.5 text-sm text-[#1c1c1c] focus:outline-none focus:border-[#c9a96e] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-[#7a7060] mb-2">Hora em Portugal</label>
                    <input type="time" name="time" value={form.time} onChange={handleChange}
                      className="w-full border border-[#ddd5c4] bg-[#faf6ef] rounded-xl px-4 py-3.5 text-sm text-[#1c1c1c] focus:outline-none focus:border-[#c9a96e] transition-colors" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-[#7a7060] mb-2">Pessoas *</label>
                    <input type="number" name="people" required min="1" max="20" value={form.people} onChange={handleChange} placeholder="2"
                      className="w-full border border-[#ddd5c4] bg-[#faf6ef] rounded-xl px-4 py-3.5 text-sm text-[#1c1c1c] placeholder:text-[#b8ab98] focus:outline-none focus:border-[#c9a96e] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-[#7a7060] mb-2">Experiência *</label>
                    <select name="experience" required value={form.experience} onChange={handleChange}
                      className="w-full border border-[#ddd5c4] bg-[#faf6ef] rounded-xl px-4 py-3.5 text-sm text-[#1c1c1c] focus:outline-none focus:border-[#c9a96e] transition-colors appearance-none cursor-pointer">
                      <option value="">Escolher</option>
                      {experiences.map(e => <option key={e.title} value={e.title}>{e.title}</option>)}
                    </select>
                  </div>
                </div>
                <div className="rounded-xl border border-[#d9c8a4] bg-[#f7f0e3] p-3 text-xs text-[#5d5247]">
                  <p>Os horários ocupados aparecem marcados como indisponíveis e não podem ser selecionados.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-[#7a7060] mb-2">Mensagem</label>
                  <textarea name="message" value={form.message} rows={4} onChange={handleChange}
                    placeholder="Alguma preferência ou pedido especial?"
                    className="w-full border border-[#ddd5c4] bg-[#faf6ef] rounded-xl px-4 py-3.5 text-sm text-[#1c1c1c] placeholder:text-[#b8ab98] focus:outline-none focus:border-[#c9a96e] transition-colors resize-none" />
                </div>
                <div className="rounded-xl border border-[#d9c8a4] bg-[#f7f0e3] p-3 text-xs text-[#5d5247]">
                  <p>Disponibilidade visual por experiência. Se o horário estiver ocupado, a equipa sugere uma alternativa prática.</p>
                </div>
                <button type="button" onClick={handleSubmit}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-[#25d366] hover:bg-[#1aa851] text-white text-sm font-semibold rounded-xl transition-colors">
                  <WhatsAppIcon /> Agendar reserva automaticamente
                </button>
                <a href={wa(`Olá! Gostaria de confirmar a minha reserva para ${form.experience || 'Lisboa'} na data ${form.date || 'a definir'}. 🙂`)}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 border border-[#c9a96e] text-[#c9a96e] rounded-xl text-sm font-semibold hover:bg-[#c9a96e] hover:text-white transition-colors">
                  <WhatsAppIcon /> Confirmar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROUTES ── */}
      <section className="bg-[#1c1c1c] py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-[#c9a96e]/15 text-[#c9a96e] text-xs font-semibold tracking-widest uppercase rounded-full mb-5">
              Rotas
            </span>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-4xl md:text-5xl font-semibold text-white leading-tight">
              Descubra Portugal com a Viragem Tour
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {routes.map(route => (
              <span key={route} className="px-4 py-2 rounded-full border border-[#c9a96e]/30 bg-[#f5efe7] text-[#1c1c1c] text-sm font-medium">
                {route}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO BREAK ── */}
      <div className="relative h-72 md:h-96 overflow-hidden bg-[#1c1c1c]">
        <img
          src="https://images.unsplash.com/photo-1653580978823-2f087049fa04?w=1920&h=640&fit=crop&auto=format"
          alt="Lisboa vista do Tejo"
          className="w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
          <p style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-3xl md:text-5xl italic text-white text-center drop-shadow-lg max-w-3xl">
            "A melhor forma de conhecer Lisboa? Com alguém que a ama."
          </p>
          <a href={wa('Olá! Gostaria de marcar um tour em Lisboa. 😊')} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 py-3.5 bg-[#25d366] hover:bg-[#1aa851] text-white text-sm font-semibold rounded-full transition-colors">
            <WhatsAppIcon /> Falar Connosco
          </a>
        </div>
      </div>

      {/* ── ADVANTAGES ── */}
      <section id="vantagens" className="bg-[#1c1c1c] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-[#c9a96e]/15 text-[#c9a96e] text-xs font-semibold tracking-widest uppercase rounded-full mb-5">
              Como funciona
            </span>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-4xl md:text-5xl font-semibold text-white leading-tight">
              Simples, direto e pensado para o seu tempo.<br />
              <span className="italic text-[#c9a96e]">Tudo em poucos passos.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {advantages.map(adv => (
              <div key={adv.title} className="bg-white/5 border border-white/8 rounded-2xl p-8 hover:bg-white/8 transition-colors">
                <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  className="text-xl font-semibold text-white mb-3">{adv.title}</h3>
                <p className="text-[#9a9080] font-light text-sm leading-relaxed">{adv.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-r from-[#c9a96e]/20 to-[#c9a96e]/5 border border-[#c9a96e]/25 rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="text-2xl font-semibold text-white mb-2">
                Pronto para descobrir Lisboa de verdade?
              </p>
              <p className="text-[#9a9080] font-light text-sm">Sem compromisso. Só boa conversa. 🙂</p>
            </div>
            <a href={wa('Olá! Quero descobrir Lisboa convosco! Podem dizer-me mais? 😊')} target="_blank" rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 px-8 py-4 bg-[#25d366] hover:bg-[#1aa851] text-white text-sm font-semibold rounded-full transition-colors">
              <WhatsAppIcon /> Iniciar Conversa
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contacto" className="bg-[#faf6ef] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
            {/* Left */}
            <div>
              <span className="inline-block px-4 py-1.5 bg-[#c9a96e]/15 text-[#c9a96e] text-xs font-semibold tracking-widest uppercase rounded-full mb-6">
                Contacto
              </span>
              <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="text-4xl md:text-5xl font-semibold text-[#1c1c1c] leading-[1.1] mb-5">
                Reserve a sua<br />
                <span className="italic text-[#c9a96e]">experiência.</span>
              </h2>
              <p className="text-[#7a7060] font-light text-lg leading-relaxed mb-10">
                Preencha o formulário e entraremos em contacto pelo WhatsApp para tratar de tudo. Rápido, simples, e sem chatices.
              </p>

              <div className="flex flex-col gap-5">
                <ContactItem icon={<PhoneIcon />} label="WhatsApp / Telefone"
                  value="+351 913 977 456" href={wa()} />
                <ContactItem icon={<InstagramIcon />} label="Instagram"
                  value="@viragemtour" href="https://instagram.com/viragemtour" />
                <ContactItem icon={<EmailIcon />} label="Email"
                  value="marcus_2425tt@gmail.com" href="mailto:marcus_2425tt@gmail.com" />
                <ContactItem icon={<LocationIcon />} label="Localização"
                  value="Lisboa, Portugal" href={undefined} />
              </div>

              <div className="mt-10">
                <BrandLogo className="opacity-25" />
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-8 lg:p-10 border border-[#e8dfd0] shadow-sm">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-[#7a7060] mb-2">
                    Nome *
                  </label>
                  <input name="name" required value={form.name} onChange={handleChange}
                    placeholder="O seu nome"
                    className="w-full border border-[#ddd5c4] bg-[#faf6ef] rounded-xl px-4 py-3.5 text-sm text-[#1c1c1c] placeholder:text-[#b8ab98] focus:outline-none focus:border-[#c9a96e] transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-[#7a7060] mb-2">
                      Data *
                    </label>
                    <input type="date" name="date" required value={form.date} onChange={handleChange}
                      className="w-full border border-[#ddd5c4] bg-[#faf6ef] rounded-xl px-4 py-3.5 text-sm text-[#1c1c1c] focus:outline-none focus:border-[#c9a96e] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-[#7a7060] mb-2">
                      Pessoas *
                    </label>
                    <input type="number" name="people" required min="1" max="20"
                      value={form.people} onChange={handleChange} placeholder="1 – 20"
                      className="w-full border border-[#ddd5c4] bg-[#faf6ef] rounded-xl px-4 py-3.5 text-sm text-[#1c1c1c] placeholder:text-[#b8ab98] focus:outline-none focus:border-[#c9a96e] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-[#7a7060] mb-2">
                    Experiência *
                  </label>
                  <select name="experience" required value={form.experience} onChange={handleChange}
                    className="w-full border border-[#ddd5c4] bg-[#faf6ef] rounded-xl px-4 py-3.5 text-sm text-[#1c1c1c] focus:outline-none focus:border-[#c9a96e] transition-colors appearance-none cursor-pointer">
                    <option value="">Escolher experiência</option>
                    {experiences.map(e => <option key={e.title} value={e.title}>{e.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-[#7a7060] mb-2">
                    Mensagem
                  </label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                    placeholder="Alguma questão ou pedido especial? 😊"
                    className="w-full border border-[#ddd5c4] bg-[#faf6ef] rounded-xl px-4 py-3.5 text-sm text-[#1c1c1c] placeholder:text-[#b8ab98] focus:outline-none focus:border-[#c9a96e] transition-colors resize-none" />
                </div>
                <button type="submit"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-[#25d366] hover:bg-[#1aa851] text-white text-sm font-semibold rounded-xl transition-colors">
                  <WhatsAppIcon /> Enviar Pedido pelo WhatsApp
                </button>
                <p className="text-center text-xs text-[#b8ab98]">
                  Será redirecionado para o WhatsApp com os seus dados. Respondemos rapidamente! 🙂
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#141414] py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 pb-10 border-b border-white/8">
            <div>
              <BrandLogo light className="mb-4 opacity-70" />
              <p className="text-[#7a7060] font-light text-sm max-w-xs leading-relaxed">
                Tours exclusivos em Lisboa. Experiências autênticas, guia local, memórias para sempre.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-10 sm:gap-16">
              <div>
                <p className="text-[#c9a96e] text-[10px] font-semibold tracking-[0.4em] uppercase mb-4">Navegação</p>
                {navLinks.map(l => (
                  <a key={l.href} href={l.href}
                    className="block text-[#7a7060] hover:text-[#e8d5b0] font-light text-sm mb-2.5 transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
              <div>
                <p className="text-[#c9a96e] text-[10px] font-semibold tracking-[0.4em] uppercase mb-4">Contacto</p>
                <a href={wa()} className="block text-[#7a7060] hover:text-[#25d366] font-light text-sm mb-2.5 transition-colors">
                  +351 913 977 456
                </a>
                <a href="https://instagram.com/viragemtour" className="block text-[#7a7060] hover:text-[#e8d5b0] font-light text-sm mb-2.5 transition-colors">
                  @viragemtour
                </a>
                <a href="mailto:marcus_2425tt@gmail.com" className="block text-[#7a7060] hover:text-[#e8d5b0] font-light text-sm mb-2.5 transition-colors">
                  marcus_2425tt@gmail.com
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#444] font-light text-xs">
              © {new Date().getFullYear()} Viragem Tour · Lisboa, Portugal
            </p>
            <p className="text-[#444] font-light text-xs">Feito com 🧡 para os amantes de Lisboa</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ── Icons ──────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.81 19.79 19.79 0 012 2.18 2 2 0 013.98 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ContactItem({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-center gap-4 group">
      <div className="w-11 h-11 rounded-xl border border-[#ddd5c4] flex items-center justify-center text-[#c9a96e] shrink-0 group-hover:bg-[#c9a96e]/8 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#b8ab98] mb-0.5">{label}</p>
        <p className="text-[#1c1c1c] font-medium text-sm">{value}</p>
      </div>
    </div>
  )
  return href
    ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{inner}</a>
    : <div>{inner}</div>
}
