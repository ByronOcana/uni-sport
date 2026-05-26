export interface Transaccion {
  monto: number
  tipo: string
  descripcion: string
}

export async function getTransaccionesByUsuario(userId: number): Promise<Transaccion[]> {
  try {
    const res = await fetch(`http://localhost:5000/transacciones/usuario/${userId}`)
    const data = await res.json()
    return Array.isArray(data) ? data.map((t: any[]) => ({
      monto: t[0],
      tipo: t[1],
      descripcion: t[2],
    })) : []
  } catch (error) {
    console.error("Error al obtener transacciones:", error)
    return []
  }
}