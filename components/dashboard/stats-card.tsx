import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
}

export function StatsCard({ title, value, description, icon, trend, trendValue, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-5 w-5 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trendValue) && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
            {trendValue && (
              <span
                className={cn(
                  "ml-1 font-medium",
                  trend === "up" && "text-green-600",
                  trend === "down" && "text-red-600",
                )}
              >
                {trendValue}
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

