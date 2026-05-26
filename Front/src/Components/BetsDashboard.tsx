import { useState, useEffect } from "react"
import { Trophy, Radio, Filter, X, Wallet, CheckCircle, MapPin, Calendar } from "lucide-react"
import { MdSportsSoccer, MdSportsBasketball } from "react-icons/md"
import { GiChessKnight } from "react-icons/gi"
import { getEvents } from "../Services/EventService"
import "./BetsDashboard.css"

interface EventoAPI {
  id: number
  nombre: string
  deporte: string
  equipos: string[]
  fecha: string
  lugar: string
  estado: string
  resultado?: string
}

interface Event {
  id: number
  league: string
  leagueFlag: string
  date: string
  time: string
  teamA: string
  teamB: string
  oddsA: number
  oddsDraw: number
  oddsB: number
  sport: string
  live: boolean
  lugar: string
}

interface BetSelection {
  eventId: number
  teamA: string
  teamB: string
  pick: "A" | "Draw" | "B"
  label: string
  odds: number
}

const SPORT_MAP: Record<string, string> = {
  "Fútbol":     "football",
  "Baloncesto": "basketball",
  "Atletismo":  "athletics",
  "Voleibol":   "volleyball",
  "Natación":   "swimming",
  "Ajedrez":    "chess",
}

const SPORT_ICON: Record<string, React.ReactNode> = {
  football:   <MdSportsSoccer size={20} color="#c7a110" />,
  basketball: <MdSportsBasketball size={20} color="#c7a110" />,
  chess:      <GiChessKnight size={20} color="#c7a110" />,
}

const FLAG_URL = (code: string) =>
  `https://flagcdn.com/20x15/${code.toLowerCase()}.png`

const randomOdd = (min: number, max: number) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(2))

const adaptarEvento = (e: EventoAPI): Event => ({
  id: e.id,
  league: e.nombre,
  leagueFlag: "CO",
  date: new Date(e.fecha).toLocaleDateString("es-CO", { day: "numeric", month: "short" }),
  time: new Date(e.fecha).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
  teamA: e.equipos[0] ?? "Equipo A",
  teamB: e.equipos[1] ?? "Equipo B",
  oddsA: randomOdd(1.2, 3.5),
  oddsDraw: e.equipos.length === 2 ? randomOdd(2.5, 5.0) : 0,
  oddsB: randomOdd(1.2, 3.5),
  sport: SPORT_MAP[e.deporte] ?? "football",
  live: e.estado === "en vivo",
  lugar: e.lugar,
})

const SPORTS_FILTER = [
  { key: "Todos",      label: "Todos" },
  { key: "football",   label: "Fútbol" },
  { key: "basketball", label: "Basketball" },
  { key: "chess",      label: "Ajedrez" },
]

function BetsDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selections, setSelections] = useState<BetSelection[]>([])
  const [amounts, setAmounts] = useState<Record<number, string>>({})
  const [activeFilter, setActiveFilter] = useState("Todos")
  const [betPlaced, setBetPlaced] = useState(false)
  const [betType, setBetType] = useState<"simple" | "combinada">("simple")

  const saldo = 1250.00

  useEffect(() => {
    getEvents()
      .then(data => {
        if (!data || data.error) { setError(true); return }
        setEvents(data.map(adaptarEvento))
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const toggleSelection = (event: Event, pick: "A" | "Draw" | "B") => {
    const odds = pick === "A" ? event.oddsA : pick === "Draw" ? event.oddsDraw : event.oddsB
    const label = pick === "A" ? event.teamA : pick === "Draw" ? "Empate" : event.teamB
    setSelections(prev => {
      const exists = prev.find(s => s.eventId === event.id && s.pick === pick)
      if (exists) return prev.filter(s => !(s.eventId === event.id && s.pick === pick))
      const filtered = prev.filter(s => s.eventId !== event.id)
      return [...filtered, { eventId: event.id, teamA: event.teamA, teamB: event.teamB, pick, label, odds }]
    })
  }

  const isSelected = (eventId: number, pick: "A" | "Draw" | "B") =>
    selections.some(s => s.eventId === eventId && s.pick === pick)

  const removeSelection = (eventId: number) => {
    setSelections(prev => prev.filter(s => s.eventId !== eventId))
    setAmounts(prev => { const n = { ...prev }; delete n[eventId]; return n })
  }

  const totalStake = betType === "simple"
    ? selections.reduce((acc, s) => acc + parseFloat(amounts[s.eventId] || "0"), 0)
    : parseFloat(amounts[0] || "0")

  const potentialWin = betType === "simple"
    ? selections.reduce((acc, s) => acc + parseFloat(amounts[s.eventId] || "0") * s.odds, 0)
    : parseFloat(amounts[0] || "0") * selections.reduce((acc, s) => acc * s.odds, 1)

  const filteredEvents = activeFilter === "Todos"
    ? events
    : events.filter(e => e.sport === activeFilter)

  const handleConfirm = () => {
    if (selections.length === 0 || totalStake <= 0) return
    setBetPlaced(true)
    setTimeout(() => { setBetPlaced(false); setSelections([]); setAmounts({}) }, 3000)
  }

  const quickAdd = (eventId: number, val: number) => {
    const key = betType === "combinada" ? 0 : eventId
    setAmounts(prev => ({ ...prev, [key]: String(parseFloat(prev[key] || "0") + val) }))
  }

  return (
    <div className="bets-layout">

      {/* Lista de eventos */}
      <div className="bets-main">
        <div className="bets-header">
          <div className="bets-title-row">
            <Trophy size={20} color="#c7a110" />
            <h2 className="bets-title">En Vivo</h2>
          </div>
          <div className="sport-filters">
            {SPORTS_FILTER.map(f => (
              <button
                key={f.key}
                className={`filter-btn ${activeFilter === f.key ? "active" : ""}`}
                onClick={() => setActiveFilter(f.key)}
              >
                <Filter size={12} />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="eventos-state">
            <div className="ev-spinner" />
            <p>Cargando eventos...</p>
          </div>
        )}

        {!loading && error && (
          <div className="eventos-state error">
            <p>No se pudo conectar con el servicio de eventos.</p>
            <small>El circuit breaker puede estar activo.</small>
          </div>
        )}

        {!loading && !error && (
          <div className="events-list">
            {filteredEvents.length === 0 ? (
              <div className="eventos-state">
                <p>No hay eventos para este deporte.</p>
              </div>
            ) : (
              filteredEvents.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-meta">
                    <div className="event-league-info">
                      <img
                        src={FLAG_URL(event.leagueFlag)}
                        alt={event.leagueFlag}
                        className="flag-img"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                      />
                      <span className="event-league">{event.league}</span>
                    </div>
                    <span className="event-time">
                      {event.live
                        ? <span className="live-badge"><Radio size={10} /> EN VIVO</span>
                        : <span className="date-time"><Calendar size={11} /> {event.date} · {event.time}</span>}
                    </span>
                  </div>

                  <div className="event-body">
                    <div className="event-teams">
                      <span className="sport-icon-char">
                        {SPORT_ICON[event.sport] ?? <MdSportsSoccer size={20} color="#c7a110" />}
                      </span>
                      <div className="teams-names">
                        <span className="team">{event.teamA}</span>
                        <span className="vs">vs</span>
                        <span className="team">{event.teamB}</span>
                      </div>
                    </div>
                    <div className="event-odds">
                      <button className={`odd-btn ${isSelected(event.id, "A") ? "selected" : ""}`} onClick={() => toggleSelection(event, "A")}>
                        <span className="odd-label">1</span>
                        <span className="odd-val">{event.oddsA.toFixed(2)}</span>
                      </button>
                      {event.oddsDraw > 0 && (
                        <button className={`odd-btn ${isSelected(event.id, "Draw") ? "selected" : ""}`} onClick={() => toggleSelection(event, "Draw")}>
                          <span className="odd-label">X</span>
                          <span className="odd-val">{event.oddsDraw.toFixed(2)}</span>
                        </button>
                      )}
                      <button className={`odd-btn ${isSelected(event.id, "B") ? "selected" : ""}`} onClick={() => toggleSelection(event, "B")}>
                        <span className="odd-label">2</span>
                        <span className="odd-val">{event.oddsB.toFixed(2)}</span>
                      </button>
                    </div>
                  </div>

                  <div className="event-lugar">
                    <MapPin size={11} color="#555" />
                    <span>{event.lugar}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Betslip */}
      <div className="betslip-panel">
        <div className="betslip-header">
          <div className="betslip-title-row">
            <Trophy size={16} color="#c7a110" />
            <span className="betslip-title">Apuesta</span>
          </div>
          <span className="betslip-count">{selections.length}</span>
        </div>

        <div className="betslip-tabs">
          <button className={`tab-btn ${betType === "simple" ? "active" : ""}`} onClick={() => setBetType("simple")}>Simple</button>
          <button className={`tab-btn ${betType === "combinada" ? "active" : ""}`} onClick={() => setBetType("combinada")} disabled={selections.length < 2}>Combinada</button>
        </div>

        <div className="betslip-body">
          {selections.length === 0 ? (
            <div className="betslip-empty">
              <Trophy size={40} color="#333" />
              <p>Selecciona una cuota para comenzar</p>
            </div>
          ) : (
            <>
              {betType === "simple" ? (
                selections.map(sel => (
                  <div key={sel.eventId} className="betslip-item">
                    <div className="betslip-item-top">
                      <div className="betslip-pick-info">
                        <span className="betslip-pick">{sel.label}</span>
                        <span className="betslip-match">{sel.teamA} vs {sel.teamB}</span>
                      </div>
                      <div className="betslip-right">
                        <span className="betslip-odds">{sel.odds.toFixed(2)}</span>
                        <button className="remove-btn" onClick={() => removeSelection(sel.eventId)}>
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="betslip-amount-row">
                      <div className="quick-amounts">
                        {[5000, 10000, 50000].map(v => (
                          <button key={v} className="quick-btn" onClick={() => quickAdd(sel.eventId, v)}>
                            +{v >= 1000 ? `${v / 1000}k` : v}
                          </button>
                        ))}
                      </div>
                      <input
                        className="amount-input"
                        type="number"
                        placeholder="Monto $"
                        value={amounts[sel.eventId] || ""}
                        onChange={e => setAmounts(prev => ({ ...prev, [sel.eventId]: e.target.value }))}
                      />
                    </div>
                    {amounts[sel.eventId] && parseFloat(amounts[sel.eventId]) > 0 && (
                      <div className="betslip-potential">
                        Ganancia: <strong>${(parseFloat(amounts[sel.eventId]) * sel.odds).toLocaleString("es-CO", { maximumFractionDigits: 0 })}</strong>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <>
                  {selections.map(sel => (
                    <div key={sel.eventId} className="betslip-item combined">
                      <div className="betslip-item-top">
                        <div className="betslip-pick-info">
                          <span className="betslip-pick">{sel.label}</span>
                          <span className="betslip-match">{sel.teamA} vs {sel.teamB}</span>
                        </div>
                        <div className="betslip-right">
                          <span className="betslip-odds">{sel.odds.toFixed(2)}</span>
                          <button className="remove-btn" onClick={() => removeSelection(sel.eventId)}>
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="combined-odds-display">
                    Cuota combinada: <strong>{selections.reduce((a, s) => a * s.odds, 1).toFixed(2)}</strong>
                  </div>
                  <div className="betslip-amount-row">
                    <div className="quick-amounts">
                      {[5000, 10000, 50000].map(v => (
                        <button key={v} className="quick-btn" onClick={() => quickAdd(0, v)}>
                          +{v >= 1000 ? `${v / 1000}k` : v}
                        </button>
                      ))}
                    </div>
                    <input
                      className="amount-input"
                      type="number"
                      placeholder="Monto $"
                      value={amounts[0] || ""}
                      onChange={e => setAmounts(prev => ({ ...prev, 0: e.target.value }))}
                    />
                  </div>
                </>
              )}

              <div className="betslip-totals">
                <div className="total-row">
                  <span>Apuesta total</span>
                  <span>${totalStake.toLocaleString("es-CO", { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="total-row highlight">
                  <span>Ganancias potenciales</span>
                  <span className="win-amount">${potentialWin.toLocaleString("es-CO", { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              <div className="saldo-row">
                <Wallet size={13} color="#555" />
                <span>Saldo disponible</span>
                <span>${saldo.toLocaleString("es-CO")}</span>
              </div>
            </>
          )}
        </div>

        <button className={`confirm-btn ${betPlaced ? "success" : ""}`} onClick={handleConfirm} disabled={selections.length === 0 || totalStake <= 0}>
          {betPlaced
            ? <><CheckCircle size={16} /> Apuesta Confirmada</>
            : `Confirmar $${totalStake.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`}
        </button>

        {betPlaced && <div className="bet-success-msg">Tu apuesta fue registrada exitosamente</div>}
      </div>
    </div>
  )
}

export default BetsDashboard