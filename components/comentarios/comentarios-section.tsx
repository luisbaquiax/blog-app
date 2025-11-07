"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ComentarioItem } from "./comentario-item"
import axiosInstance from "@/lib/axios"
import type { Comentario } from "@/types"

interface ComentariosSectionProps {
  publicacionId: number
}

export function ComentariosSection({ publicacionId }: ComentariosSectionProps) {
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [nuevoComentario, setNuevoComentario] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchComentarios()
  }, [publicacionId])

  const fetchComentarios = async () => {
    try {
      const response = await axiosInstance.get(`/publicaciones/${publicacionId}/comentarios`)
      setComentarios(response.data)
    } catch (error) {
      console.error("Error al cargar comentarios:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoComentario.trim()) return

    setLoading(true)
    try {
      await axiosInstance.post(`/publicaciones/${publicacionId}/comentarios`, {
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
          <Button type="submit" disabled={loading}>
            {loading ? "Publicando..." : "Comentar"}
          </Button>
        </form>

        <div className="space-y-4">
          {comentarios.map((comentario) => (
            <ComentarioItem key={comentario.id_comentario} comentario={comentario} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
