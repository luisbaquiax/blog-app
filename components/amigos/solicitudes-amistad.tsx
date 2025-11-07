"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import axiosInstance from "@/lib/axios"
import type { Amistad } from "@/types"

export function SolicitudesAmistad() {
  const [solicitudes, setSolicitudes] = useState<Amistad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSolicitudes()
  }, [])

  const fetchSolicitudes = async () => {
    try {
      const response = await axiosInstance.get("/amigos/solicitudes")
      setSolicitudes(response.data)
    } catch (error) {
      console.error("Error al cargar solicitudes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleResponder = async (idUsuario: number, respuesta: "ACEPTADO" | "RECHAZADO") => {
    try {
      await axiosInstance.put(`/amigos/${idUsuario}`, { estado: respuesta })
      fetchSolicitudes()
    } catch (error) {
      console.error("Error al responder solicitud:", error)
    }
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-4 mt-4">
      {solicitudes.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No tienes solicitudes pendientes</p>
      ) : (
        solicitudes.map((solicitud) => (
          <div key={solicitud.id_usuario1} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{solicitud.usuario?.nombre_usuario[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{solicitud.usuario?.nombre_usuario}</p>
                <p className="text-sm text-muted-foreground">Solicitud recibida</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="default" onClick={() => handleResponder(solicitud.id_usuario1, "ACEPTADO")}>
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => handleResponder(solicitud.id_usuario1, "RECHAZADO")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
