"use client"

import { useEffect, useState } from "react"
import { PublicacionCard } from "./publicacion-card"
import { api } from "@/lib/api"
import { getUserFromStorage } from "@/lib/auth"

export function FeedPublicaciones() {
  const [publicaciones, setPublicaciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const user = getUserFromStorage()
        if (!user) return

        const response = await api.getPublicacionesVisibles(user.id_usuario)
        // El backend devuelve array de { publicacion, likes }
        setPublicaciones(response.data || [])
      } catch (error) {
        console.error("Error al cargar publicaciones:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPublicaciones()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Cargando publicaciones...</div>
  }

  return (
    <div className="space-y-4">
      {publicaciones.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No hay publicaciones disponibles</p>
      ) : (
        publicaciones.map((item) => (
          <PublicacionCard
            key={item.publicacion.id_publicacion}
            publicacion={item.publicacion}
            likesCount={item.likes}
          />
        ))
      )}
    </div>
  )
}
