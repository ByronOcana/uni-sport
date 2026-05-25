export const getEvents = async () => {

    const response = await fetch("http://localhost:5000/eventos")

    const data = await response.json()

    if (!response.ok) {
        throw new Error("Error obteniendo eventos")
    }

    return data.eventos
}