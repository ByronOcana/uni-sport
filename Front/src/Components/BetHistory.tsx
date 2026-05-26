import { useState } from "react"
import {
  ClipboardList, Search, TrendingUp, TrendingDown,
  Target, DollarSign, ChevronDown, ChevronUp
} from "lucide-react"
import "./BetHistory.css"

interface BetRecord {
  id: number
  date: string
  event: string
  league: string
  pick: string
  odds: number
  stake: number
  status: "ganada" | "perdida" | "pendiente" | "cancelada"
  potential: number
}

const HISTORY: BetRecord[] = [
  { id: 1,  date: "22 may 2026 · 18:05", event: "Atl. Nacional vs Deportes Tolima",   league: "Primera A",       pick: "Atl. Nacional",  odds: 1.65, stake: 50000,  status: "pendiente", potential: 82500  },
  { id: 2,  date: "21 may 2026 · 20:31", event: "Junior vs Independiente SF",          league: "Primera A",       pick: "Empate",         odds: 3.40, stake: 20000,  status: "perdida",   potential: 68000  },
  { id: 3,  date: "20 may 2026 · 14:03", event: "Real Madrid vs Athletic Bilbao",      league: "La Liga",         pick: "Real Madrid",    odds: 1.46, stake: 100000, status: "ganada",    potential: 146000 },
  { id: 4,  date: "19 may 2026 · 22:10", event: "Boston Celtics vs Miami Heat",        league: "NBA",             pick: "Boston Celtics", odds: 1.55, stake: 30000,  status: "ganada",    potential: 46500  },
  { id: 5,  date: "18 may 2026 · 15:30", event: "Djokovic vs Alcaraz",                 league: "ATP Tour",        pick: "Alcaraz",        odds: 1.95, stake: 25000,  status: "perdida",   potential: 48750  },
  { id: 6,  date: "17 may 2026 · 13:02", event: "Bayern Munich vs VfB Stuttgart",      league: "DFB Pokal",       pick: "Bayern Munich",  odds: 1.30, stake: 75000,  status: "ganada",    potential: 97500  },
  { id: 7,  date: "16 may 2026 · 10:15", event: "Tottenham vs Everton",                league: "Premier League",  pick: "Tottenham",      odds: 1.80, stake: 40000,  status: "cancelada", potential: 72000  },
  { id: 8,  date: "15 may 2026 · 20:00", event: "Boca Juniors vs River Plate (Comb.)", league: "Liga Prof.",      pick: "Combinada x3",   odds: 5.87, stake: 15000,  status: "perdida",   potential: 88050  },
  { id: 9,  date: "14 may 2026 · 16:45", event: "Millonarios vs América de Cali",      league: "Primera A",       pick: "América",        odds: 3.20, stake: 10000,  status: "ganada",    potential: 32000  },
  { id: 10, date: "13 may 2026 · 09:00", event: "West Ham vs Leeds United",            league: "Premier League",  pick: "West Ham",       odds: 2.10, stake: 20000,  status: "perdida",   potential: 42000  },
]

const STATUS_FILTERS = ["Todas", "Ganadas", "Perdidas", "Pendientes", "Canceladas"]
const STATUS_MAP: Record<string, BetRecord["status"] | null> = {
  "Todas": null, "Ganadas": "ganada", "Perdidas": "perdida",
  "Pendientes": "pendiente", "Canceladas": "cancelada",
}
const STATUS_LABEL: Record<BetRecord["status"], string> = {
  ganada: "Ganada", perdida: "Perdida", pendiente: "Pendiente", cancelada: "Cancelada",
}

function BetHistory() {
  const [activeFilter, setActiveFilter] = useState("Todas")
  const [search, setSearch] = useState("")
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filtered = HISTORY.filter(b => {
    const statusMatch = STATUS_MAP[activeFilter] === null || b.status === STATUS_MAP[activeFilter]
    const searchMatch = search === "" ||
      b.event.toLowerCase().includes(search.toLowerCase()) ||
      b.pick.toLowerCase().includes(search.toLowerCase())
    return statusMatch && searchMatch
  })

  const ganadas     = HISTORY.filter(b => b.status === "ganada").length
  const perdidas    = HISTORY.filter(b => b.status === "perdida").length
  const totalStaked = HISTORY.reduce((a, b) => a + b.stake, 0)
  const totalWon    = HISTORY.filter(b => b.status === "ganada").reduce((a, b) => a + b.potential, 0)
  const roi         = ((totalWon - totalStaked) / totalStaked * 100).toFixed(1)

  return (
    <div className="history-container">
      <div className="history-header">
        <div className="history-title-row">
          <ClipboardList size={20} color="#c7a110" />
          <h2 className="history-title">Mis Apuestas</h2>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <Target size={22} color="#c7a110" />
          <div className="stat-info">
            <span className="stat-val">{HISTORY.length}</span>
            <span className="stat-label">Total Apuestas</span>
          </div>
        </div>
        <div className="stat-card green">
          <TrendingUp size={22} color="#4caf50" />
          <div className="stat-info">
            <span className="stat-val">{ganadas}</span>
            <span className="stat-label">Ganadas</span>
          </div>
        </div>
        <div className="stat-card red">
          <TrendingDown size={22} color="#f44336" />
          <div className="stat-info">
            <span className="stat-val">{perdidas}</span>
            <span className="stat-label">Perdidas</span>
          </div>
        </div>
        <div className="stat-card gold">
          <DollarSign size={22} color="#c7a110" />
          <div className="stat-info">
            <span className="stat-val">${totalWon.toLocaleString("es-CO")}</span>
            <span className="stat-label">Total Ganado</span>
          </div>
        </div>
        <div className={`stat-card ${parseFloat(roi) >= 0 ? "green" : "red"}`}>
          <TrendingUp size={22} color={parseFloat(roi) >= 0 ? "#4caf50" : "#f44336"} />
          <div className="stat-info">
            <span className="stat-val">{roi}%</span>
            <span className="stat-label">ROI</span>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="history-controls">
        <div className="search-wrapper">
          <Search size={15} color="#555" className="search-icon" />
          <input
            className="search-input"
            placeholder="Buscar apuesta..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="status-filters">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              className={`status-filter-btn ${activeFilter === f ? "active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="history-table-wrapper">
        {filtered.length === 0 ? (
          <div className="no-results">
            <Search size={32} color="#444" />
            <p>No hay apuestas que coincidan.</p>
          </div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>#</th><th>Fecha</th><th>Evento</th><th>Liga</th>
                <th>Selección</th><th>Cuota</th><th>Apostado</th><th>Potencial</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(bet => (
                <>
                  <tr
                    key={bet.id}
                    className={`table-row ${expandedId === bet.id ? "expanded" : ""} ${bet.status}`}
                    onClick={() => setExpandedId(expandedId === bet.id ? null : bet.id)}
                  >
                    <td className="id-cell">#{bet.id}</td>
                    <td className="date-cell">{bet.date}</td>
                    <td className="event-cell">{bet.event}</td>
                    <td className="league-cell">{bet.league}</td>
                    <td className="pick-cell">{bet.pick}</td>
                    <td className="odds-cell">{bet.odds.toFixed(2)}</td>
                    <td className="stake-cell">${bet.stake.toLocaleString("es-CO")}</td>
                    <td className={`potential-cell ${bet.status === "ganada" ? "won" : ""}`}>
                      ${bet.potential.toLocaleString("es-CO")}
                    </td>
                    <td>
                      <div className="status-cell">
                        <span className={`status-badge ${bet.status}`}>{STATUS_LABEL[bet.status]}</span>
                        {expandedId === bet.id
                          ? <ChevronUp size={14} color="#555" />
                          : <ChevronDown size={14} color="#555" />}
                      </div>
                    </td>
                  </tr>
                  {expandedId === bet.id && (
                    <tr key={`${bet.id}-detail`} className="detail-row">
                      <td colSpan={9}>
                        <div className="detail-panel">
                          <div className="detail-item">
                            <span className="detail-label">Ganancia neta</span>
                            <span className={`detail-val ${bet.status === "ganada" ? "positive" : "negative"}`}>
                              {bet.status === "ganada"
                                ? `+$${(bet.potential - bet.stake).toLocaleString("es-CO")}`
                                : bet.status === "perdida"
                                ? `-$${bet.stake.toLocaleString("es-CO")}`
                                : "—"}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Cuota aplicada</span>
                            <span className="detail-val gold">{bet.odds.toFixed(2)}x</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">ID Apuesta</span>
                            <span className="detail-val">UNS-{String(bet.id).padStart(6, "0")}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="history-footer">
        Mostrando {filtered.length} de {HISTORY.length} apuestas
      </div>
    </div>
  )
}

export default BetHistory