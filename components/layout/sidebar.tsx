"use client"

import { Home, Users, BookOpen, TrendingUp } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const menuItems = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/amigos", label: "Amigos", icon: Users },
  { href: "/publicaciones", label: "Publicaciones", icon: BookOpen },
  { href: "/tendencias", label: "Tendencias", icon: TrendingUp },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-card min-h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
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
