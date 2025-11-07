"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserMinus } from "lucide-react"
import axiosInstance from "@/lib/axios"
import type { Amistad } from "@/types"

export function ListaAmigos() {
  const [amigos, setAmigos] = useState<Amistad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAmigos()
  }, [])

  const fetchAmigos = async () => {
    try {
      const response = await axiosInstance.get("/amigos")
      setAmigos(response.data)
    } catch (error) {
      console.error("Error al cargar amigos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminarAmigo = async (idAmigo: number) => {
    try {
      await axiosInstance.delete(`/amigos/${idAmigo}`)
      fetchAmigos()
    } catch (error) {
      console.error("Error al eliminar amigo:", error)
    }
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-4 mt-4">
      {amigos.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No tienes amigos agregados</p>
      ) : (
        amigos.map((amistad) => (
          <div key={amistad.id_usuario2} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{amistad.usuario?.nombre_usuario[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{amistad.usuario?.nombre_usuario}</p>
                <p className="text-sm text-muted-foreground">{amistad.usuario?.tipo_usuario}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleEliminarAmigo(amistad.id_usuario2)}>
              <UserMinus className="h-4 w-4" />
            </Button>
          </div>
        ))
      )}
    </div>
  )
}
