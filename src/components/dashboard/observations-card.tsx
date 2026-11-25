import { Camera01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { ObservationItem } from '@/types'

interface ObservationsCardProps {
  observations: ObservationItem[]
  onAddClick?: () => void
}

function ObservationRow({ item }: { item: ObservationItem }) {
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-lg">
        {item.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs sm:text-sm font-semibold text-foreground">{item.name}</p>
        <p className="truncate text-xs italic text-muted-foreground">{item.scientificName}</p>
        <p className="text-[10px] text-muted-foreground/80 mt-0.5">
          {item.location} · {item.date}
        </p>
      </div>
      <Badge
        variant={item.status === 'Terverifikasi' ? 'secondary' : 'outline'}
        className="shrink-0 text-[10px]"
      >
        {item.status}
      </Badge>
    </div>
  )
}

export function ObservationsCard({ observations, onAddClick }: ObservationsCardProps) {
  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Observasi Terbaru</CardTitle>
          <Link to="/student" className="text-xs font-medium text-primary hover:underline">
            Buka Jurnal
          </Link>
        </div>
        <CardDescription className="text-xs">Temuan spesies tanaman dari lapangan</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-border/60 p-0 px-6">
        {observations.map((item) => (
          <ObservationRow key={item.name} item={item} />
        ))}
      </CardContent>
      <CardFooter className="border-t border-border/80 pt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddClick}
          className="w-full text-xs gap-1.5"
        >
          <HugeiconsIcon icon={Camera01Icon} data-icon="inline-start" />
          Tambah Foto Observasi Baru
        </Button>
      </CardFooter>
    </Card>
  )
}
