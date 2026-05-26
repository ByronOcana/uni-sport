import { useState, useEffect } from "react"
import {
  ClipboardList, Search, TrendingUp, TrendingDown,
  Target, DollarSign, ChevronDown, ChevronUp
} from "lucide-react"
import { getTransaccionesByUsuario } from "../Services/TransaccionService"
import type { Transaccion } from "../Services/TransaccionService"
import "./BetHistory.css"

const TIPO_LABEL: Record<string, string> = {
  ganancia:  "Ganada",
  perdida:   "Perdida",
  deposito:  "Depósito",
  retiro:    "Retiro",
}

const STATUS_FILTERS = ["Todas", "Ganadas", "Perdidas", "Depósitos", "Retiros"]
const STATUS_MAP: Record<string, string | null> = {
  "Todas":     null,
  "Ganadas":   "ganancia",
  "Perdidas":  "perdida",
  "Depósitos": "deposito",
  "Retiros":   "retiro",
}

function BetHistory() {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeFilter, setActiveFilter] = useState("Todas")
  const [search, setSearch] = useState("")
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("usuario")
    if (stored) {
      const parsed = JSON.parse(stored)
      getTransaccionesByUsuario(parsed.id)
        .then(data => {
          const reales = data ?? []
          const ejemplo: Transaccion[] = [
            { monto: 50000, tipo: "ganancia", descripcion: "Copa Universitaria - Unicauca vs UniValle" },
            { monto: 20000, tipo: "perdida",  descripcion: "Torneo Baloncesto - Unicomfacauca vs Colegio Mayor" },
            { monto: 75000, tipo: "ganancia", descripcion: "Campeonato Atletismo - Unicauca" },
            { monto: 30000, tipo: "perdida",  descripcion: "Torneo Voleibol - Colegio Mayor vs Unicauca" },
            { monto: 15000, tipo: "ganancia", descripcion: "Copa Natación - UniValle vs Colegio Mayor" },
          ]
          setTransacciones([...reales, ...ejemplo])
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const filtered = transacciones.filter(t => {
    const tipoMatch = STATUS_MAP[activeFilter] === null || t.tipo === STATUS_MAP[activeFilter]
    const searchMatch = search === "" || t.descripcion?.toLowerCase().includes(search.toLowerCase())
    return tipoMatch && searchMatch
  })

  const ganancias     = transacciones.filter(t => t.tipo === "ganancia").length
  const perdidas      = transacciones.filter(t => t.tipo === "perdida").length
  const totalGanado   = transacciones.filter(t => t.tipo === "ganancia").reduce((a, t) => a + t.monto, 0)
  const totalApostado = transacciones.filter(t => t.tipo === "perdida").reduce((a, t) => a + t.monto, 0)
  const roi = totalApostado > 0 ? ((totalGanado - totalApostado) / totalApostado * 100).toFixed(1) : "0.0"

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
            <span className="stat-val">{transacciones.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
        <div className="stat-card green">
          <TrendingUp size={22} color="#4caf50" />
          <div className="stat-info">
            <span className="stat-val">{ganancias}</span>
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
            <span className="stat-val">${totalGanado.toLocaleString("es-CO")}</span>
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
            placeholder="Buscar transacción..."
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

      {/* Estados */}
      {loading && (
        <div className="no-results">
          <div className="ev-spinner" />
          <p>Cargando transacciones...</p>
        </div>
      )}

      {!loading && error && (
        <div className="no-results">
          <p style={{ color: "#f44336" }}>No se pudo conectar con el servicio.</p>
        </div>
      )}

      {/* Tabla */}
      {!loading && !error && (
        <div className="history-table-wrapper">
          {filtered.length === 0 ? (
            <div className="no-results">
              <Search size={32} color="#444" />
              <p>No hay transacciones que coincidan.</p>
            </div>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <>
                    <tr
                      key={i}
                      className={`table-row ${expandedId === i ? "expanded" : ""} ${t.tipo}`}
                      onClick={() => setExpandedId(expandedId === i ? null : i)}
                    >
                      <td className="id-cell">#{i + 1}</td>
                      <td className="pick-cell">{TIPO_LABEL[t.tipo] ?? t.tipo}</td>
                      <td className="event-cell">{t.descripcion}</td>
                      <td className={`potential-cell ${t.tipo === "ganancia" ? "won" : ""}`}>
                        ${t.monto.toLocaleString("es-CO")}
                      </td>
                      <td>
                        <div className="status-cell">
                          <span className={`status-badge ${t.tipo === "ganancia" ? "ganada" : t.tipo === "perdida" ? "perdida" : t.tipo === "deposito" ? "pendiente" : "cancelada"}`}>
                            {TIPO_LABEL[t.tipo] ?? t.tipo}
                          </span>
                          {expandedId === i
                            ? <ChevronUp size={14} color="#555" />
                            : <ChevronDown size={14} color="#555" />}
                        </div>
                      </td>
                    </tr>
                    {expandedId === i && (
                      <tr key={`${i}-detail`} className="detail-row">
                        <td colSpan={5}>
                          <div className="detail-panel">
                            <div className="detail-item">
                              <span className="detail-label">Monto</span>
                              <span className={`detail-val ${t.tipo === "ganancia" ? "positive" : t.tipo === "perdida" ? "negative" : ""}`}>
                                ${t.monto.toLocaleString("es-CO")}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Tipo</span>
                              <span className="detail-val gold">{TIPO_LABEL[t.tipo] ?? t.tipo}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Descripción</span>
                              <span className="detail-val">{t.descripcion}</span>
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
      )}

      <div className="history-footer">
        Mostrando {filtered.length} de {transacciones.length} transacciones
      </div>
    </div>
  )
}

export default BetHistory