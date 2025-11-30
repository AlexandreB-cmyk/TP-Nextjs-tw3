"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

interface BerryStatsProps {
  flavors: {
    potency: number
    flavor: {
      name: string
    }
  }[]
}

const chartConfig = {
  flavors: {
    label: "Saveurs",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function BerryStats({ flavors }: BerryStatsProps) {
  // Translate flavor names to French
  const flavorTranslation: Record<string, string> = {
    spicy: "Épicé",
    dry: "Sec",
    sweet: "Doux",
    bitter: "Amer",
    sour: "Acide",
  }

  const chartData = flavors.map((f) => ({
    subject: flavorTranslation[f.flavor.name] || f.flavor.name,
    value: f.potency,
    fullMark: 40, // Max potency usually around 40-60 for common berries, but can go higher. 
                  // We can adjust or make it dynamic. Let's stick to a reasonable fixed max or max of current data.
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-4">
        <CardTitle>Profil de Saveur</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarGrid className="fill-[--color-chart-2] opacity-20" />
            <PolarAngleAxis dataKey="subject" />
            <Radar
              dataKey="value"
              name="Saveurs"
              fill="var(--color-chart-2)"
              fillOpacity={0.5}
              stroke="var(--color-chart-2)"
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
