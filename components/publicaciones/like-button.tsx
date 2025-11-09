"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { getUserFromStorage } from "@/lib/auth"

interface LikeButtonProps {
  publicacionId: number
  initialLikes: number
}

export function LikeButton({ publicacionId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [hasLiked, setHasLiked] = useState(false)
  const user = getUserFromStorage()

  const handleLike = async () => {
    if (!user) return

    try {
      if (hasLiked) {
        await api.quitarLike(user.id_usuario, publicacionId)
        setLikes(likes - 1)
        setHasLiked(false)
      } else {
        await api.darLike(user.id_usuario, publicacionId)
        setLikes(likes + 1)
        setHasLiked(true)
      }
    } catch (error) {
      console.error("Error al dar like:", error)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLike} className="gap-1">
      <Heart className={cn("h-4 w-4", hasLiked && "fill-red-500 text-red-500")} />
      <span>{likes}</span>
    </Button>
  )
}
