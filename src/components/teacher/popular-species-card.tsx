import { Leaf01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

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
import { Progress } from '@/components/ui/progress'
import type { PopularSpeciesItem } from '@/types'

interface PopularSpeciesCardProps {
  items: PopularSpeciesItem[]
}

export function PopularSpeciesCard({ items }: PopularSpeciesCardProps) {
  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base sm:text-lg">Spesies Terbanyak Diamati</CardTitle>
          </div>
          <Badge variant="secondary" className="text-[11px] font-medium text-primary">
            Taman Sekolah
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Spesimen flora dengan frekuensi laporan identifikasi tertinggi oleh siswa
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3.5">
        {items.map((item, index) => (
          <div key={item.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">
                  #{index + 1}
                </span>
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-base">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                  <p className="text-[10px] italic text-muted-foreground truncate">
                    {item.scientificName} · {item.family}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold">
                  {item.observationCount} laporan
                </Badge>
              </div>
            </div>

            {/* Percentage bar */}
            <div className="flex items-center gap-2 pl-6">
              <Progress value={item.percentage} className="h-1.5 flex-1" />
              <span className="text-[10px] font-medium text-muted-foreground shrink-0 w-8 text-right">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="border-t border-border/80 pt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <HugeiconsIcon icon={Leaf01Icon} size={13} className="text-primary" />
          Total 124 laporan observasi
        </span>
        <Button variant="ghost" size="sm" className="text-xs h-7">
          Lihat Peta Flora
        </Button>
      </CardFooter>
    </Card>
  )
}
