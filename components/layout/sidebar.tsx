"use client"

import { Home, Users, BookOpen, TrendingUp, Shield, FileText, Edit } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { getUserFromStorage } from "@/lib/auth"

export function Sidebar() {
  const pathname = usePathname()
  const user = getUserFromStorage()

  const menuItems = [
    { href: "/dashboard", label: "Inicio", icon: Home, roles: ["COMUN", "PERIODISTA", "ADMINISTRADOR"] },
    { href: "/amigos", label: "Amigos", icon: Users, roles: ["COMUN", "PERIODISTA", "ADMINISTRADOR"] },
    { href: "/publicaciones", label: "Publicaciones", icon: BookOpen, roles: ["COMUN", "PERIODISTA", "ADMINISTRADOR"] },
    { href: "/mis-publicaciones", label: "Mis Publicaciones", icon: Edit, roles: ["COMUN", "PERIODISTA"] },
    { href: "/tendencias", label: "Tendencias", icon: TrendingUp, roles: ["COMUN", "PERIODISTA", "ADMINISTRADOR"] },
    { href: "/admin/denuncias", label: "Denuncias", icon: Shield, roles: ["ADMINISTRADOR"] },
    { href: "/admin/aprobaciones", label: "Aprobar Noticias", icon: FileText, roles: ["ADMINISTRADOR"] },
  ]

  const menuFiltrado = menuItems.filter((item) => (user ? item.roles.includes(user.tipo_usuario) : false))

  return (
    <aside className="w-64 border-r bg-card min-h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-2">
        {menuFiltrado.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
