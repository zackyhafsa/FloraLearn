import * as React from 'react'
import { CheckmarkCircle02Icon, SparklesIcon } from '@hugeicons/core-free-icons'
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

interface Option {
  id: string
  text: string
  isCorrect: boolean
  explanation: string
}

interface ModuleCheckpointProps {
  question: string
  options: Option[]
}

export function ModuleCheckpoint({ question, options }: ModuleCheckpointProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [submitted, setSubmitted] = React.useState(false)

  const selectedOption = options.find((o) => o.id === selectedId)

  return (
    <Card className="border-border bg-muted/20 shadow-xs">
      <CardHeader className="gap-1.5">
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary" className="gap-1 text-primary text-[10px]">
            <HugeiconsIcon icon={SparklesIcon} />
            Kuis Pemahaman Cepat
          </Badge>
        </div>
        <CardTitle className="text-sm sm:text-base">{question}</CardTitle>
        <CardDescription className="text-xs">
          Pilih salah satu jawaban untuk menguji pemahaman materi ini.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {options.map((option) => {
          const isSelected = selectedId === option.id
          let optionStyles = 'border-border/80 bg-background hover:bg-muted/50 text-foreground'

          if (submitted) {
            if (option.isCorrect) {
              optionStyles = 'border-primary bg-primary/10 text-primary font-medium'
            } else if (isSelected && !option.isCorrect) {
              optionStyles = 'border-destructive bg-destructive/10 text-destructive'
            }
          } else if (isSelected) {
            optionStyles = 'border-primary bg-primary/5 text-foreground ring-1 ring-primary'
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={submitted}
              onClick={() => setSelectedId(option.id)}
              className={`flex items-center justify-between rounded-xl border p-3 text-left text-xs transition-colors ${optionStyles}`}
            >
              <span>{option.text}</span>
              {submitted && option.isCorrect && (
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={16}
                  className="text-primary shrink-0 ml-2"
                />
              )}
            </button>
          )
        })}

        {submitted && selectedOption && (
          <div
            className={`mt-2 rounded-xl p-3 text-xs leading-relaxed ${
              selectedOption.isCorrect
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <p className="font-semibold mb-0.5">
              {selectedOption.isCorrect ? 'Benar sekali! 🎉' : 'Kurang tepat 💡'}
            </p>
            <p>{selectedOption.explanation}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-1">
        {!submitted ? (
          <Button
            size="sm"
            disabled={!selectedId}
            onClick={() => setSubmitted(true)}
            className="text-xs"
          >
            Periksa Jawaban
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubmitted(false)
              setSelectedId(null)
            }}
            className="text-xs"
          >
            Coba Lagi
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
