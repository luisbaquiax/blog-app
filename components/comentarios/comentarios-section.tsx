"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ComentarioItem } from "./comentario-item"
import type { Comentario } from "@/types"
import { api } from "@/lib/api"
import { getUserFromStorage } from "@/lib/auth"

interface ComentariosSectionProps {
  publicacionId: number
}

export function ComentariosSection({ publicacionId }: ComentariosSectionProps) {
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [nuevoComentario, setNuevoComentario] = useState("")
  const [loading, setLoading] = useState(false)
  const user = getUserFromStorage()

  useEffect(() => {
    fetchComentarios()
  }, [publicacionId])

  const fetchComentarios = async () => {
    try {
      const response = await api.getComentariosPorPublicacion(publicacionId)
      setComentarios(response.data.data || [])
    } catch (error) {
      console.error("Error al cargar comentarios:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoComentario.trim() || !user) return

    setLoading(true)
    try {
      await api.agregarComentario({
        id_publicacion: publicacionId,
        id_usuario: user.id_usuario,
        contenido: nuevoComentario,
      })
      setNuevoComentario("")
      fetchComentarios()
    } catch (error) {
      console.error("Error al crear comentario:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comentarios ({comentarios.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            placeholder="Escribe un comentario..."
            rows={3}
          />
          <Button type="submit" disabled={loading || !user}>
            {loading ? "Publicando..." : "Comentar"}
          </Button>
        </form>

        <div className="space-y-4">
          {comentarios.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No hay comentarios aún</p>
          ) : (
            comentarios.map((comentario) => (
              <ComentarioItem key={comentario.id_comentario} comentario={comentario} onDelete={fetchComentarios} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
