"use client"

import { Bell } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Notificacion } from "@/types"

interface NotificacionItemProps {
  notificacion: Notificacion
}

export function NotificacionItem({ notificacion }: NotificacionItemProps) {
  const content = (
    <div
      className={cn(
        "flex gap-3 p-3 rounded-lg border transition-colors",
        !notificacion.leida ? "bg-primary/5" : "bg-muted/30",
      )}
    >
      <Bell className="h-5 w-5 text-primary mt-0.5" />
      <div className="flex-1">
        <p className="text-sm">{notificacion.mensaje}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(notificacion.fecha_creacion!).toLocaleDateString()}
        </p>
      </div>
      {!notificacion.leida && <div className="h-2 w-2 rounded-full bg-primary mt-2" />}
    </div>
  )

  if (notificacion.url_destino) {
    return <Link href={notificacion.url_destino}>{content}</Link>
  }

  return content
}
