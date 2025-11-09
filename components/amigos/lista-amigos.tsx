"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserMinus } from "lucide-react"
import { api } from "@/lib/api"
import { getUserFromStorage } from "@/lib/auth"

export function ListaAmigos() {
  const [amigos, setAmigos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const user = getUserFromStorage()

  useEffect(() => {
    fetchAmigos()
  }, [])

  const fetchAmigos = async () => {
    if (!user) return

    try {
      const response = await api.listarAmigos(user.id_usuario)
      setAmigos(response.data || [])
    } catch (error) {
      console.error("Error al cargar amigos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminarAmigo = async (id_usuario1: number, id_usuario2: number) => {
    if (!user) return

    try {
      await api.eliminarAmigo(id_usuario1, id_usuario2)
      fetchAmigos()
    } catch (error) {
      console.error("Error al eliminar amigo:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Cargando...</div>
  }

  return (
    <div className="space-y-4 mt-4">
      {amigos.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No tienes amigos agregados</p>
      ) : (
        amigos.map((amistad) => {
          const amigo = amistad.id_usuario1 === user?.id_usuario ? amistad.Receptor : amistad.Solicitante

          const persona = amigo?.Persona || amigo?.persona

          return (
            <div
              key={amistad.id_usuario1 + "-" + amistad.id_usuario2}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{amigo?.nombre_usuario?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {persona?.nombre} {persona?.apellido}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    @{amigo?.nombre_usuario} • {amigo?.tipo_usuario}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEliminarAmigo(amistad.id_usuario1, amistad.id_usuario2)}
              >
                <UserMinus className="h-4 w-4" />
              </Button>
            </div>
          )
        })
      )}
    </div>
  )
}
