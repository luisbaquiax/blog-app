"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { api } from "@/lib/api"
import { saveUserToStorage } from "@/lib/auth"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await api.login(formData.nombre_usuario, formData.password)

      saveUserToStorage(response.data.usuario)

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="nombre_usuario">Usuario</Label>
              <Input
                id="nombre_usuario"
                type="text"
                value={formData.nombre_usuario}
                onChange={(e) => setFormData({ ...formData, nombre_usuario: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Regístrate
              </Link>
            </p>

            <p className="text-sm text-center">
              <Link href="/" className="text-primary hover:underline">
                Volver al inicio
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
