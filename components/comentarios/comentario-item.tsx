"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Comentario } from "@/types"
import { api } from "@/lib/api"
import { getUserFromStorage } from "@/lib/auth"

interface ComentarioItemProps {
  comentario: Comentario
  onDelete?: () => void
}

export function ComentarioItem({ comentario, onDelete }: ComentarioItemProps) {
  const user = getUserFromStorage()
  const usuario = comentario.Usuario || comentario.usuario
  const persona = usuario?.Persona || usuario?.persona

  const isOwner = user?.id_usuario === comentario.id_usuario

  const handleDelete = async () => {
    if (!user || !isOwner) return

    try {
      await api.eliminarComentario(user.id_usuario, comentario.id_comentario)
      onDelete?.()
    } catch (error) {
      console.error("Error al eliminar comentario:", error)
    }
  }

  return (
    <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{usuario?.nombre_usuario?.[0]?.toUpperCase() || "U"}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">
              {persona?.nombre} {persona?.apellido}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(comentario.fecha_comentario!).toLocaleDateString("es-ES")}
            </span>
          </div>
          {isOwner && (
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
        <p className="text-sm">{comentario.contenido}</p>
      </div>
    </div>
  )
}
