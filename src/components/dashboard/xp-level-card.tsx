import {
  Award01Icon,
  CheckmarkCircle02Icon,
  FireIcon,
  Leaf01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface XpLevelCardProps {
  currentXp?: number
  currentLevel?: number
  nextLevelXp?: number
  prevLevelXp?: number
}

const recentBadges = [
  {
    id: 'b-1',
    name: 'Penemu 10 Spesies',
    icon: Leaf01Icon,
    tone: 'bg-primary/10 text-primary border-primary/20',
    desc: 'Telah mengidentifikasi 10 flora lokal berbeda',
  },
  {
    id: 'b-2',
    name: 'Streak 5 Hari',
    icon: FireIcon,
    tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    desc: 'Aktif belajar & mengamati selama 5 hari berturut-turut',
  },
  {
    id: 'b-3',
    name: 'Pengamat Teliti',
    icon: Award01Icon,
    tone: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    desc: 'Observasi disetujui guru dengan nilai A',
  },
]

export function XpLevelCard({
  currentXp = 1240,
  currentLevel = 4,
  nextLevelXp = 1500,
  prevLevelXp = 1000,
}: XpLevelCardProps) {
  const xpNeeded = nextLevelXp - currentXp
  const progressPercent = Math.round(
    ((currentXp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100,
  )

  return (
    <Card className="border-border/80 bg-gradient-to-r from-primary/5 via-background to-secondary/30 shadow-xs">
      <CardContent className="p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Level Title & XP */}
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
              <HugeiconsIcon icon={SparklesIcon} size={22} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  Level {currentLevel} · Naturalis Muda
                </span>
                <Badge variant="secondary" className="text-[10px] py-0 px-2 h-4 text-primary font-semibold">
                  Tier Perunggu
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                <span className="font-semibold text-foreground">{currentXp.toLocaleString('id-ID')} XP</span>
                {' '}/ {nextLevelXp.toLocaleString('id-ID')} XP ({xpNeeded} XP lagi menuju Level 5)
              </p>
            </div>
          </div>

          {/* Quick Badges Showcase */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground hidden lg:inline-block mr-1">
              Lencana Terbaru:
            </span>
            <div className="flex items-center gap-1.5">
              {recentBadges.map((badge) => (
                <Tooltip key={badge.id}>
                  <TooltipTrigger
                    render={
                      <div
                        className={`flex size-8 items-center justify-center rounded-xl border cursor-pointer transition-transform hover:scale-105 ${badge.tone}`}
                      />
                    }
                  >
                    <HugeiconsIcon icon={badge.icon} size={16} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex flex-col gap-0.5">
                      <p className="font-semibold text-xs">{badge.name}</p>
                      <p className="text-[11px] text-muted-foreground">{badge.desc}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            <Link to="/achievements">
              <Button variant="ghost" size="sm" className="text-xs text-primary ml-1 h-8">
                Lihat Semua
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Bar & Milestone Info */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Level 4 (1.000 XP)</span>
            <span className="font-medium text-foreground">{progressPercent}% Menuju Level 5: Ahli Taksonomi</span>
            <span>Level 5 (1.500 XP)</span>
          </div>
          <Progress value={progressPercent} className="h-2 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
