"use client"

import { useState } from "react"
import InteractiveMap from "@/components/interactive-map"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Share2, Bookmark, Navigation } from "lucide-react"
import Link from "next/link"
import type { Destination } from "@/lib/types"

export default function MapPage() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)

  const handleDestinationSelect = (destination: Destination) => {
    setSelectedDestination(destination)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Interactive Tourism Map</h1>
                <p className="text-sm text-muted-foreground">Explore India with AI-powered insights</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <main className="container mx-auto px-4 py-6 h-[calc(100vh-120px)]">
        <InteractiveMap destinations={[]} onDestinationSelect={handleDestinationSelect} />
      </main>

      {/* Selected Destination Details Modal/Sidebar */}
      {selectedDestination && (
        <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-xl z-40 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-card-foreground">{selectedDestination.name}</h2>
                <p className="text-muted-foreground">{selectedDestination.state}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDestination(null)}>
                ×
              </Button>
            </div>

            <div className="space-y-6">
              {/* Destination Image */}
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={selectedDestination.images[0] || "/placeholder.svg"}
                  alt={selectedDestination.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Safety and Rating */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">Safety Score</span>
                    <Badge variant="outline">{selectedDestination.safetyScore}/10</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(selectedDestination.safetyScore / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">About</h3>
                <p className="text-sm text-muted-foreground">{selectedDestination.description}</p>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDestination.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">Available Facilities</h3>
                <div className="space-y-2">
                  {selectedDestination.facilities.map((facility) => (
                    <Card key={facility._id} className="bg-muted/50">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{facility.name}</h4>
                            <p className="text-xs text-muted-foreground capitalize">
                              {facility.type.replace("_", " ")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {facility.verified && (
                              <Badge variant="outline" className="text-xs">
                                Verified
                              </Badge>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {facility.rating}/5
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button className="w-full bg-primary hover:bg-primary/90">Get Directions</Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Save to Favorites
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Share Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
