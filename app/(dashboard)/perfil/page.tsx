"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { getUserFromStorage } from "@/lib/auth"

export default function PerfilPage() {
  const [perfilData, setPerfilData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const user = getUserFromStorage()

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!user) return

      try {
        const response = await api.getUserProfile(user.id_usuario)
        setPerfilData(response.data.data)
      } catch (error) {
        console.error("Error al cargar perfil:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPerfil()
  }, [])

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Cargando...</div>
  }

  if (!perfilData) {
    return <div className="max-w-4xl mx-auto p-6">No se pudo cargar el perfil</div>
  }

  const persona = perfilData.Persona || perfilData.persona

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mi Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">
                {perfilData.nombre_usuario?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{perfilData.nombre_usuario}</h2>
                <p className="text-muted-foreground">
                  {persona?.nombre} {persona?.apellido}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge>{perfilData.tipo_usuario}</Badge>
                  {perfilData.posicion_politica && <Badge variant="outline">{perfilData.posicion_politica}</Badge>}
                </div>
              </div>

              {persona?.biografia && (
                <div>
                  <h3 className="font-semibold mb-1">Biografía</h3>
                  <p className="text-sm text-muted-foreground">{persona.biografia}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Correo:</span> {persona?.correo || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Teléfono:</span> {persona?.telefono || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Ciudad:</span> {persona?.ciudad || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">País:</span> {persona?.pais || "N/A"}
                </div>
              </div>

              {perfilData.tipo_usuario === "PERIODISTA" && perfilData.medios_comunicacion && (
                <div>
                  <span className="font-semibold">Medios de Comunicación:</span> {perfilData.medios_comunicacion}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
