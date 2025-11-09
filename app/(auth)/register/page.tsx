"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { api } from "@/lib/api"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    dpi: "",
    correo: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    pais: "Guatemala",
    codigo_postal: "",
    sexo: "M",
    tipo_sangre: "",
    biografia: "",
    nombre_usuario: "",
    password: "",
    confirmPassword: "",
    tipo_usuario: "COMUN",
    posicion_politica: "NEUTRO",
    medios_comunicacion: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    try {
      const { confirmPassword, ...dataToSend } = formData
      await api.register(dataToSend)

      router.push("/login?registered=true")
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrar usuario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Registro de Usuario</CardTitle>
          <CardDescription>Completa los datos para crear tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{error}</div>}

            {/* Datos Personales */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Datos Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</Label>
                  <Input
                    id="fecha_nacimiento"
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dpi">DPI *</Label>
                  <Input
                    id="dpi"
                    maxLength={13}
                    value={formData.dpi}
                    onChange={(e) => setFormData({ ...formData, dpi: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correo">Correo Electrónico *</Label>
                  <Input
                    id="correo"
                    type="email"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    maxLength={8}
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select value={formData.sexo} onValueChange={(value) => setFormData({ ...formData, sexo: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Femenino</SelectItem>
                      <SelectItem value="OTRO">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Datos de Usuario */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Datos de Cuenta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre_usuario">Nombre de Usuario *</Label>
                  <Input
                    id="nombre_usuario"
                    value={formData.nombre_usuario}
                    onChange={(e) => setFormData({ ...formData, nombre_usuario: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo_usuario">Tipo de Usuario *</Label>
                  <Select
                    value={formData.tipo_usuario}
                    onValueChange={(value) => setFormData({ ...formData, tipo_usuario: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COMUN">Común</SelectItem>
                      <SelectItem value="PERIODISTA">Periodista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="posicion_politica">Posición Política</Label>
                  <Select
                    value={formData.posicion_politica}
                    onValueChange={(value) => setFormData({ ...formData, posicion_politica: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IZQUIERDA">Izquierda</SelectItem>
                      <SelectItem value="CENTRO">Centro</SelectItem>
                      <SelectItem value="DERECHA">Derecha</SelectItem>
                      <SelectItem value="NEUTRO">Neutro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.tipo_usuario === "PERIODISTA" && (
                  <div className="space-y-2">
                    <Label htmlFor="medios_comunicacion">Medios de Comunicación</Label>
                    <Input
                      id="medios_comunicacion"
                      value={formData.medios_comunicacion}
                      onChange={(e) => setFormData({ ...formData, medios_comunicacion: e.target.value })}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="biografia">Biografía</Label>
              <Textarea
                id="biografia"
                value={formData.biografia}
                onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Inicia Sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
