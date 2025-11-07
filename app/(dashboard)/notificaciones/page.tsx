"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NotificacionItem } from "@/components/notificaciones/notificacion-item"
import axiosInstance from "@/lib/axios"
import type { Notificacion } from "@/types"

export default function NotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const response = await axiosInstance.get("/notificaciones")
        setNotificaciones(response.data)
      } catch (error) {
        console.error("Error al cargar notificaciones:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotificaciones()
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Cargando...</div>
          ) : notificaciones.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No tienes notificaciones</p>
          ) : (
            <div className="space-y-2">
              {notificaciones.map((notificacion) => (
                <NotificacionItem key={notificacion.id_notificacion} notificacion={notificacion} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
