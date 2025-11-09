"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotificacionesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">Sistema de notificaciones - Por implementar</p>
          <p className="text-sm text-center text-muted-foreground">
            Nota: No hay endpoints de notificaciones en el backend actual
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
