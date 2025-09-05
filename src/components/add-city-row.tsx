"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddCityRowProps {
  onAddCity: () => void
}

export function AddCityRow({ onAddCity }: AddCityRowProps) {
  return (
    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
      <td className="p-6">
        <Button
          variant="ghost"
          onClick={onAddCity}
          className="w-full h-16 text-muted-foreground hover:text-foreground hover:bg-muted/50 border-2 border-dashed border-muted-foreground hover:border-foreground transition-all"
        >
          <div className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span className="text-lg">Add City</span>
          </div>
        </Button>
      </td>
      <td className="p-6 text-center text-muted-foreground">
        -
      </td>
      <td className="p-6 text-center text-muted-foreground">
        -
      </td>
      <td className="w-16"></td>
    </tr>
  )
}
