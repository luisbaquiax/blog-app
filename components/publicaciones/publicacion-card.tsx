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
}

export function PublicacionCard({ publicacion }: PublicacionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarFallback>{publicacion.usuario?.nombre_usuario[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{publicacion.usuario?.nombre_usuario}</h3>
              <Badge variant="secondary">{publicacion.tipo_publicacion}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(publicacion.fecha_publicacion!).toLocaleDateString()}
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
          <LikeButton
            publicacionId={publicacion.id_publicacion}
            initialLikes={publicacion.likes_count || 0}
            initialHasLiked={publicacion.has_liked || false}
          />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>{publicacion.comentarios?.length || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
