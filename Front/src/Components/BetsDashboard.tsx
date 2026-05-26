import { useState } from "react"
import { Trophy, Radio, Filter, X, Wallet, CheckCircle } from "lucide-react"
import { MdSportsSoccer, MdSportsBasketball, MdSportsTennis } from "react-icons/md"
import "./BetsDashboard.css"

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
  live?: boolean
}

interface BetSelection {
  eventId: number
  teamA: string
  teamB: string
  pick: "A" | "Draw" | "B"
  label: string
  odds: number
}

const EVENTS: Event[] = [
  { id: 1, league: "Primera A", leagueFlag: "CO", date: "Hoy", time: "18:00", teamA: "Atl. Nacional", teamB: "Deportes Tolima", oddsA: 1.65, oddsDraw: 3.85, oddsB: 5.25, sport: "football", live: true },
  { id: 2, league: "Primera A", leagueFlag: "CO", date: "Hoy", time: "20:30", teamA: "Junior Barranquilla", teamB: "Independiente Santa Fe", oddsA: 1.97, oddsDraw: 3.40, oddsB: 4.00, sport: "football", live: true },
  { id: 3, league: "La Liga", leagueFlag: "ES", date: "Hoy", time: "14:00", teamA: "Real Madrid", teamB: "Athletic Bilbao", oddsA: 1.46, oddsDraw: 4.20, oddsB: 7.10, sport: "football" },
  { id: 4, league: "Premier League", leagueFlag: "EN", date: "Mañana", time: "10:00", teamA: "Tottenham", teamB: "Everton", oddsA: 1.80, oddsDraw: 3.60, oddsB: 4.49, sport: "football" },
  { id: 5, league: "Premier League", leagueFlag: "EN", date: "Mañana", time: "12:30", teamA: "West Ham", teamB: "Leeds United", oddsA: 2.10, oddsDraw: 3.20, oddsB: 3.85, sport: "football" },
  { id: 6, league: "DFB Pokal", leagueFlag: "DE", date: "Hoy", time: "13:00", teamA: "Bayern Munich", teamB: "VfB Stuttgart", oddsA: 1.30, oddsDraw: 5.80, oddsB: 8.20, sport: "football" },
  { id: 7, league: "NBA", leagueFlag: "US", date: "Hoy", time: "22:00", teamA: "Boston Celtics", teamB: "Miami Heat", oddsA: 1.55, oddsDraw: 0, oddsB: 2.50, sport: "basketball" },
  { id: 8, league: "ATP Tour", leagueFlag: "WD", date: "Hoy", time: "15:00", teamA: "Djokovic", teamB: "Alcaraz", oddsA: 1.90, oddsDraw: 0, oddsB: 1.95, sport: "tennis" },
]

const SPORTS_FILTER = [
  { key: "Todos",      label: "Todos" },
  { key: "football",   label: "Fútbol" },
  { key: "basketball", label: "Basketball" },
  { key: "tennis",     label: "Tenis" },
]

const SPORT_ICON: Record<string, React.ReactNode> = {
  football:   <MdSportsSoccer size={20} color="#c7a110" />,
  basketball: <MdSportsBasketball size={20} color="#c7a110" />,
  tennis:     <MdSportsTennis size={20} color="#c7a110" />,
}

const FLAG_URL = (code: string) =>
  `https://flagcdn.com/20x15/${code.toLowerCase()}.png`

function BetsDashboard() {
  const [selections, setSelections] = useState<BetSelection[]>([])
  const [amounts, setAmounts] = useState<Record<number, string>>({})
  const [activeFilter, setActiveFilter] = useState("Todos")
  const [betPlaced, setBetPlaced] = useState(false)
  const [betType, setBetType] = useState<"simple" | "combinada">("simple")

  const saldo = 1250.00

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
    ? EVENTS
    : EVENTS.filter(e => e.sport === activeFilter)

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

        <div className="events-list">
          {filteredEvents.map(event => (
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
                    : `${event.date} · ${event.time}`}
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
            </div>
          ))}
        </div>
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