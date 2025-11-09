"use client"

import { Bell, User, LogOut, PenSquare } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { removeUserFromStorage } from "@/lib/auth"

export function Navbar() {
  const router = useRouter()

  const handleLogout = () => {
    removeUserFromStorage()
    router.push("/")
  }

  return (
    <nav className="border-b bg-card">
      <div className="flex items-center justify-between p-4">
        <Link href="/dashboard" className="text-xl font-bold">
          Blog Social
        </Link>

        <div className="flex items-center gap-4">
          <Button asChild>
            <Link href="/publicaciones/crear">
              <PenSquare className="h-4 w-4 mr-2" />
              Nueva Publicación
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/notificaciones">
              <Bell className="h-5 w-5" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/perfil">Mi Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
