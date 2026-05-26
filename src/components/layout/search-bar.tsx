'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { CATEGORIES } from "@/lib/constants"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SearchBar() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set("q", location)
    if (category) params.set("category", category)
    if (date) params.set("date", format(date, "yyyy-MM-dd"))
    router.push(`/explore?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white rounded-xl shadow-md p-3"
    >
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Location */}
        <div className="flex-1 min-w-0">
          <Input
            type="text"
            placeholder="Search by location, e.g., 'London' or 'Manchester'"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-11 w-full border-slate-200 text-slate-900 placeholder:text-slate-500 focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
          />
        </div>

        {/* Category */}
        <div className="flex-1 min-w-0">
          <Select value={category} onValueChange={(val) => setCategory(val ?? "")}>
            <SelectTrigger className="h-11 w-full border-slate-200 text-slate-900 data-placeholder:text-slate-500">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="flex-1 min-w-0">
          <Popover>
            <PopoverTrigger
              className={cn(
                "h-11 w-full flex items-center gap-2 rounded-lg border border-slate-200 bg-transparent px-2.5 text-sm text-left transition-colors outline-none hover:border-slate-300 focus-visible:border-teal-500 focus-visible:ring-3 focus-visible:ring-teal-500/20",
                !date && "text-slate-500"
              )}
            >
              <CalendarIcon className="size-4 shrink-0 text-slate-500" />
              <span className="flex-1 truncate">
                {date ? format(date, "dd MMM yyyy") : "Pick a date"}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Search button */}
        <Button
          type="submit"
          size="lg"
          className="h-11 px-6 rounded-lg shrink-0"
        >
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
    </form>
  )
}
