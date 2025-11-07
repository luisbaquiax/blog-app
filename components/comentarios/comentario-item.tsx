import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Comentario } from "@/types"

interface ComentarioItemProps {
  comentario: Comentario
}

export function ComentarioItem({ comentario }: ComentarioItemProps) {
  return (
    <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{comentario.usuario?.nombre_usuario[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">{comentario.usuario?.nombre_usuario}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(comentario.fecha_comentario!).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm">{comentario.contenido}</p>
      </div>
    </div>
  )
}
