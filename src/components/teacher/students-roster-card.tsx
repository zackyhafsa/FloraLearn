import * as React from 'react'
import {
  Camera01Icon,
  CheckmarkCircle02Icon,
  Search01Icon,
  UserGroupIcon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import type { TeacherStudentItem } from '@/types'

interface StudentsRosterCardProps {
  students: TeacherStudentItem[]
  onSelectStudent?: (student: TeacherStudentItem) => void
}

export function StudentsRosterCard({ students, onSelectStudent }: StudentsRosterCardProps) {
  const [selectedClass, setSelectedClass] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredStudents = students.filter((student) => {
    const matchClass = selectedClass === 'all' || student.className === selectedClass
    const matchSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nisn.includes(searchQuery)
    return matchClass && matchSearch
  })

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg">Data Siswa & Portofolio Praktikum</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {students.length} Siswa Terdaftar
              </Badge>
            </div>
            <CardDescription className="text-xs mt-1">
              Pantau jumlah temuan observasi, nilai rata-rata, dan ketuntasan tugas praktikum botani setiap siswa
            </CardDescription>
          </div>

          {/* Quick class filter buttons */}
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            <Button
              variant={selectedClass === 'all' ? 'default' : 'outline'}
              size="sm"
              className="text-xs h-7 px-2.5"
              onClick={() => setSelectedClass('all')}
            >
              Semua ({students.length})
            </Button>
            <Button
              variant={selectedClass === '10 IPA 1' ? 'default' : 'outline'}
              size="sm"
              className="text-xs h-7 px-2.5"
              onClick={() => setSelectedClass('10 IPA 1')}
            >
              10 IPA 1
            </Button>
            <Button
              variant={selectedClass === '10 IPA 2' ? 'default' : 'outline'}
              size="sm"
              className="text-xs h-7 px-2.5"
              onClick={() => setSelectedClass('10 IPA 2')}
            >
              10 IPA 2
            </Button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative mt-2">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            placeholder="Cari siswa berdasarkan nama atau nomor NISN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs sm:text-sm bg-muted/20"
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col divide-y divide-border/60 p-0 px-4 sm:px-6">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => {
            const completionPercent = Math.round(
              (student.tasksCompleted / student.totalTasks) * 100,
            )

            return (
              <div
                key={student.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                {/* Student Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar size="default">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {student.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">{student.name}</p>
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">
                        {student.className}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">NISN: {student.nisn} · Aktif {student.lastActive}</p>
                  </div>
                </div>

                {/* Metrics: Observations & Average Score */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 shrink-0">
                  <div className="flex flex-col text-left sm:text-center">
                    <span className="text-[10px] text-muted-foreground">Observasi</span>
                    <span className="text-xs font-bold text-foreground flex items-center gap-1">
                      <HugeiconsIcon icon={Camera01Icon} size={12} className="text-primary" />
                      {student.observationsCount} spesimen
                    </span>
                  </div>

                  <div className="flex flex-col text-left sm:text-center">
                    <span className="text-[10px] text-muted-foreground">Rata-rata Nilai</span>
                    <Badge variant="secondary" className="text-xs font-semibold text-primary">
                      {student.averageScore}
                    </Badge>
                  </div>

                  {/* Task Progress */}
                  <div className="flex flex-col w-28 gap-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">Tugas:</span>
                      <span className="font-semibold text-foreground">
                        {student.tasksCompleted}/{student.totalTasks}
                      </span>
                    </div>
                    <Progress value={completionPercent} className="h-1.5 w-full" />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2.5"
                    onClick={() => onSelectStudent?.(student)}
                  >
                    Portofolio
                  </Button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Tidak ada siswa yang sesuai dengan filter pencarian.
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-border/80 pt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Menampilkan {filteredStudents.length} dari {students.length} siswa bimbingan</span>
        <Button variant="ghost" size="sm" className="text-xs h-7">
          Unduh Buku Nilai (.xlsx)
        </Button>
      </CardFooter>
    </Card>
  )
}
