import { useEffect, useState } from "react"
import { getEvents } from "../Services/EventService"
import { useNavigate } from "react-router-dom"
import "./Events.css"
function eventsForm() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {

        const loadEvents = async () => {

            try {
                debugger;
                const data = await getEvents()
                if (data.error) {
                    setError(data.error)
                    return
                }
                setEvents(data ? data : [])
            } catch (err: any) {
                console.error(err)
                setError("No se pudieron cargar los eventos")
            } finally {
                setLoading(false)
            }
        }
        loadEvents()
    }, [])


    const liveEvents = events.filter(
        e => e.estado == "en vivo"
    )

    const nextEvents = events.filter(
        e => e.estado == "proximo"
    )

    return (

        <div className="dashboardContainer">

            {/* IZQUIERDA */}
            <div className="dashboardLeft">

                {/* EN VIVO */}
                <div className="dashboardCard">

                    <div className="cardHeader">
                        <h2>En Vivo</h2>
                    </div>
                    <div className="eventsGrid">
                        {liveEvents.length > 0 ? (
                            liveEvents.map((event) => (
                                <div className="eventCard" key={event.id}>
                                    <div className="eventInfo">
                                        <div className="teams" style={{ color: "#ffff" }}>
                                            <p>{event.equipos[0]} VS {event.equipos[1]}</p>
                                            <p>{new Date(event.fecha).toLocaleDateString("es-CO")}</p>
                                        </div>
                                        <span className="sportTagLive">
                                            {event.deporte}
                                        </span>
                                    </div>
                                    <div className="score">
                                        {event.resultado}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No hay eventos en vivo</p>
                        )}
                    </div>
                </div>


                {/* PROXIMOS EVENTOS */}
                <div className="dashboardCard">
                    <div className="cardHeader">
                        <h2>Próximos Eventos</h2>
                    </div>
                    <div className="eventsGrid">
                        {nextEvents.length > 0 ? (
                            nextEvents.map((event) => (
                                <div className="nextEventCard" key={event.id}>
                                    <div className="eventDetails">
                                        <p className="eventTeams" style={{ color: "#ffff" }}>
                                            {event.equipos.join(" vs ")}
                                        </p>
                                        <span className="sportTag">
                                            {event.deporte}
                                        </span>
                                        <span className="eventDate">
                                            {new Date(event.fecha).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <button className="detailsButton">
                                        Ver más
                                    </button>

                                </div>
                            ))
                        ) : (
                            <p>No hay próximos eventos</p>
                        )}
                    </div>
                </div>
            </div>


            {/* DERECHA */}
            <div className="dashboardRight">
                <div className="dashboardCard cardRight">
                    <div className="cardHeader">
                        <h2>Resumen</h2>
                    </div>
                    <div className="summaryItem">
                        <span>Total eventos: </span>
                        <strong>{events.length}</strong>
                    </div>
                    <div className="summaryItem">
                        <span>Eventos en vivo: </span>
                        <strong>{liveEvents.length}</strong>
                    </div>
                    <div className="summaryItem">
                        <span>Próximos eventos: </span>
                        <strong>{nextEvents.length}</strong>
                    </div>
                    <button
                        className="betsButton"
                        onClick={() => navigate("/online")}>
                        Ir a Mis Apuestas
                    </button>
                </div>
            </div>
        </div>
    )
}



export default eventsForm