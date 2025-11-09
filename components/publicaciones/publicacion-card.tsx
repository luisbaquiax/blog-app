"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LikeButton } from "./like-button"
import { MessageSquare } from "lucide-react"
import type { Publicacion } from "@/types"

interface PublicacionCardProps {
  publicacion: Publicacion
  likesCount?: number
}

export function PublicacionCard({ publicacion, likesCount = 0 }: PublicacionCardProps) {
  const usuario = publicacion.Usuario || publicacion.usuario
  const persona = usuario?.Persona || usuario?.persona

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarFallback>{usuario?.nombre_usuario?.[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">
                {persona?.nombre} {persona?.apellido}
              </h3>
              <Badge variant="secondary">{publicacion.tipo_publicacion}</Badge>
              <Badge variant="outline">{usuario?.tipo_usuario}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              @{usuario?.nombre_usuario} • {new Date(publicacion.fecha_publicacion!).toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link href={`/publicaciones/${publicacion.id_publicacion}`}>
          <h2 className="text-xl font-bold hover:underline">{publicacion.titulo}</h2>
          <p className="text-muted-foreground line-clamp-3 mt-2">{publicacion.contenido}</p>
        </Link>

        <div className="flex items-center gap-4 pt-2 border-t">
          <LikeButton publicacionId={publicacion.id_publicacion} initialLikes={likesCount} />
          <Link href={`/publicaciones/${publicacion.id_publicacion}`}>
            <div className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>Comentarios</span>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
