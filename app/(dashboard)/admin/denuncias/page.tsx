"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { getUserFromStorage } from "@/lib/auth"
import { Shield, Check, X } from "lucide-react"
import Link from "next/link"

export default function DenunciasAdminPage() {
  const [denuncias, setDenuncias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const user = getUserFromStorage()

  useEffect(() => {
    if (user?.tipo_usuario === "ADMINISTRADOR") {
      fetchDenuncias()
    }
  }, [])

  const fetchDenuncias = async () => {
    try {
      const response = await api.getDenunciasPendientes()
      setDenuncias(response.data.denuncias || [])
    } catch (error) {
      console.error("Error al cargar denuncias:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleActualizarEstado = async (id_denuncia: number, nuevo_estado: string) => {
    try {
      await api.actualizarEstadoDenuncia(id_denuncia, nuevo_estado)
      alert("Estado de denuncia actualizado")
      fetchDenuncias()
    } catch (error) {
      console.error("Error al actualizar denuncia:", error)
    }
  }

  if (user?.tipo_usuario !== "ADMINISTRADOR") {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-destructive">No tienes permisos para acceder a esta página</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Gestión de Denuncias</h1>
          <p className="text-muted-foreground">Revisa y gestiona las denuncias de artículos</p>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Cargando denuncias...</p>
          </CardContent>
        </Card>
      ) : denuncias.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No hay denuncias pendientes</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {denuncias.map((denuncia) => (
            <Card key={denuncia.id_denuncia}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Denuncia #{denuncia.id_denuncia}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Motivo: <Badge variant="outline">{denuncia.motivo}</Badge>
                    </p>
                  </div>
                  <Badge>{denuncia.estado}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {denuncia.Usuario && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-semibold mb-1">Denunciado por:</p>
                    <p className="text-sm">
                      {denuncia.Usuario.Persona?.nombre} {denuncia.Usuario.Persona?.apellido}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{denuncia.Usuario.nombre_usuario} - {denuncia.Usuario.tipo_usuario}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold mb-1">Descripción:</p>
                  <p className="text-sm text-muted-foreground">{denuncia.descripcion}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-semibold mb-2">Publicación denunciada:</p>
                  <Link
                    href={`/publicaciones/${denuncia.id_publicacion}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Ver publicación →
                  </Link>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={() => handleActualizarEstado(denuncia.id_denuncia, "ELIMINAR")}>
                    <Check className="h-4 w-4 mr-1" />
                    Aceptar y Eliminar Publicación
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleActualizarEstado(denuncia.id_denuncia, "RECHAZADO")}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Rechazar Denuncia
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
