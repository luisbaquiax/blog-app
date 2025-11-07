"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import axiosInstance from "@/lib/axios"
import type { Usuario, Persona } from "@/types"

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [persona, setPersona] = useState<Persona | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const userStr = localStorage.getItem("user")
        if (userStr) {
          const user = JSON.parse(userStr)
          const response = await axiosInstance.get(`/usuarios/${user.id_usuario}`)
          setUsuario(response.data.usuario)
          setPersona(response.data.persona)
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPerfil()
  }, [])

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mi Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">{usuario?.nombre_usuario[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{usuario?.nombre_usuario}</h2>
                <p className="text-muted-foreground">
                  {persona?.nombre} {persona?.apellido}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge>{usuario?.tipo_usuario}</Badge>
                  {usuario?.posicion_politica && <Badge variant="outline">{usuario.posicion_politica}</Badge>}
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
                  <span className="font-semibold">Correo:</span> {persona?.correo}
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

              <Button>Editar Perfil</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
