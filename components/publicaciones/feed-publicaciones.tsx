"use client"

import { useEffect, useState } from "react"
import { PublicacionCard } from "./publicacion-card"
import axiosInstance from "@/lib/axios"
import type { Publicacion } from "@/types"

export function FeedPublicaciones() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const response = await axiosInstance.get("/publicaciones")
        setPublicaciones(response.data)
      } catch (error) {
        console.error("Error al cargar publicaciones:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPublicaciones()
  }, [])

  if (loading) {
    return <div>Cargando publicaciones...</div>
  }

  return (
    <div className="space-y-4">
      {publicaciones.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No hay publicaciones disponibles</p>
      ) : (
        publicaciones.map((publicacion) => (
          <PublicacionCard key={publicacion.id_publicacion} publicacion={publicacion} />
        ))
      )}
    </div>
  )
}
