"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { api } from "@/lib/api"
import { getUserFromStorage } from "@/lib/auth"

export function SolicitudesAmistad() {
  const [solicitudes, setSolicitudes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const user = getUserFromStorage()

  useEffect(() => {
    fetchSolicitudes()
  }, [])

  const fetchSolicitudes = async () => {
    if (!user) return

    try {
      const response = await api.getSolicitudesPendientes(user.id_usuario)
      setSolicitudes(response.data || [])
    } catch (error) {
      console.error("Error al cargar solicitudes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleResponder = async (id_usuario1: number, id_usuario2: number, aceptar: boolean) => {
    if (!user) return

    try {
      if (aceptar) {
        await api.aceptarAmigo(id_usuario1, id_usuario2)
      } else {
        await api.rechazarAmigo(id_usuario1, id_usuario2)
      }
      fetchSolicitudes()
    } catch (error) {
      console.error("Error al responder solicitud:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Cargando...</div>
  }

  return (
    <div className="space-y-4 mt-4">
      {solicitudes.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No tienes solicitudes pendientes</p>
      ) : (
        solicitudes.map((solicitud) => {
          const solicitante = solicitud.Solicitante
          const persona = solicitante?.Persona || solicitante?.persona

          return (
            <div key={solicitud.id_usuario1} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{solicitante?.nombre_usuario?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {persona?.nombre} {persona?.apellido}
                  </p>
                  <p className="text-sm text-muted-foreground">@{solicitante?.nombre_usuario} • Solicitud recibida</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="default"
                  onClick={() => handleResponder(solicitud.id_usuario1, solicitud.id_usuario2, true)}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleResponder(solicitud.id_usuario1, solicitud.id_usuario2, false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
