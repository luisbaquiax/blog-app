"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle } from "lucide-react"
import { api } from "@/lib/api"

interface DenunciarButtonProps {
  publicacionId: number
  userId: number
}

export function DenunciarButton({ publicacionId, userId }: DenunciarButtonProps) {
  const [open, setOpen] = useState(false)
  const [motivo, setMotivo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [loading, setLoading] = useState(false)

  const handleDenunciar = async () => {
    if (!motivo || !descripcion) {
      alert("Por favor completa todos los campos")
      return
    }

    setLoading(true)

    try {
      await api.denunciarPublicacion({
        id_usuario: userId,
        id_publicacion: publicacionId,
        motivo,
        descripcion,
      })
      alert("Denuncia enviada correctamente. Será revisada por un administrador.")
      setOpen(false)
      setMotivo("")
      setDescripcion("")
    } catch (error: any) {
      console.error("Error al denunciar:", error)
      alert(error.response?.data?.message || "Error al enviar la denuncia")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          <AlertTriangle className="h-4 w-4 mr-1" />
          Denunciar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Denunciar Artículo</DialogTitle>
          <DialogDescription>
            Si encuentras contenido inapropiado, puedes reportarlo. Un administrador lo revisará.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo</Label>
            <Select value={motivo} onValueChange={setMotivo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONTENIDO_OFENSIVO">Contenido ofensivo</SelectItem>
                <SelectItem value="INFORMACION_FALSA">Información falsa</SelectItem>
                <SelectItem value="SPAM">Spam</SelectItem>
                <SelectItem value="ACOSO">Acoso</SelectItem>
                <SelectItem value="OTRO">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe el problema..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleDenunciar} disabled={loading}>
            {loading ? "Enviando..." : "Enviar Denuncia"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
