import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface SpotlightProps {
  tags: string[]
  commonName: string
  scientificName: string
  description: string
  learnMoreLabel?: string
}

export function SpeciesSpotlight({
  tags,
  commonName,
  scientificName,
  description,
  learnMoreLabel = 'Pelajari taksonomi lebih lanjut →',
}: SpotlightProps) {
  return (
    <Card className="border-border/80 bg-muted/20 shadow-xs">
      <CardHeader className="gap-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
        <CardTitle className="text-sm sm:text-base">
          {commonName}{' '}
          <span className="italic font-normal">({scientificName})</span>
        </CardTitle>
        <CardDescription className="text-xs leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-0">
        <Button variant="link" size="sm" className="p-0 text-xs text-primary h-auto">
          {learnMoreLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}
