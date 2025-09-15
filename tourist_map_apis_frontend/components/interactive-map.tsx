"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  MapPin,
  Shield,
  Hospital,
  Car,
  Wifi,
  Coffee,
  Phone,
  Fuel,
  Search,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import type { Destination, FacilityType } from "@/lib/types"

interface MapProps {
  destinations: Destination[]
  onDestinationSelect: (destination: Destination) => void
}

const FACILITY_ICONS: Record<FacilityType, any> = {
  hospital: Hospital,
  atm: Phone,
  restaurant: Coffee,
  hotel: MapPin,
  transport: Car,
  wifi: Wifi,
  police: Shield,
  tourist_info: MapPin,
  fuel_station: Fuel,
  pharmacy: Hospital,
}

const SAFETY_COLORS = {
  high: "#10b981", // emerald-500
  medium: "#f59e0b", // amber-500
  low: "#ef4444", // red-500
}

// Mock data for demonstration
const mockDestinations: Destination[] = [
  {
    _id: "1",
    name: "Goa Beach Resort Area",
    description: "Popular beach destination with excellent safety record",
    geoCoords: { latitude: 15.2993, longitude: 74.124 },
    region: "Western India",
    state: "Goa",
    safetyScore: 9.2,
    safetyGradient: "high",
    facilities: [
      {
        _id: "f1",
        type: "hospital",
        name: "Goa Medical College",
        destinationId: "1",
        verified: true,
        proofHash: "0x123...",
        status: "active",
        rating: 4.5,
        reviews: [],
        coordinates: { latitude: 15.2993, longitude: 74.124 },
        timestamps: { createdAt: new Date(), updatedAt: new Date() },
      },
      {
        _id: "f2",
        type: "restaurant",
        name: "Beach Shack Cafe",
        destinationId: "1",
        verified: true,
        status: "active",
        rating: 4.2,
        reviews: [],
        coordinates: { latitude: 15.3, longitude: 74.125 },
        timestamps: { createdAt: new Date(), updatedAt: new Date() },
      },
    ],
    verifiedHashes: ["0x123...", "0x456..."],
    images: ["/placeholder-h13sz.png"],
    tags: ["beach", "resort", "safe", "family-friendly"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "2",
    name: "Rajasthan Desert Safari",
    description: "Adventure destination with moderate safety measures",
    geoCoords: { latitude: 27.0238, longitude: 74.2179 },
    region: "Northern India",
    state: "Rajasthan",
    safetyScore: 7.1,
    safetyGradient: "medium",
    facilities: [
      {
        _id: "f3",
        type: "hotel",
        name: "Desert Palace Hotel",
        destinationId: "2",
        verified: true,
        status: "active",
        rating: 4.0,
        reviews: [],
        coordinates: { latitude: 27.0238, longitude: 74.2179 },
        timestamps: { createdAt: new Date(), updatedAt: new Date() },
      },
    ],
    verifiedHashes: ["0x789..."],
    images: ["/placeholder-vtvc2.png"],
    tags: ["desert", "adventure", "cultural"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "3",
    name: "Kashmir Valley Trek",
    description: "Mountain destination requiring extra safety precautions",
    geoCoords: { latitude: 34.0837, longitude: 74.7973 },
    region: "Northern India",
    state: "Jammu & Kashmir",
    safetyScore: 5.8,
    safetyGradient: "low",
    facilities: [
      {
        _id: "f4",
        type: "police",
        name: "Tourist Police Station",
        destinationId: "3",
        verified: true,
        status: "active",
        rating: 3.8,
        reviews: [],
        coordinates: { latitude: 34.0837, longitude: 74.7973 },
        timestamps: { createdAt: new Date(), updatedAt: new Date() },
      },
    ],
    verifiedHashes: ["0xabc..."],
    images: ["/placeholder-9mmk3.png"],
    tags: ["mountains", "trekking", "scenic"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function InteractiveMap({ destinations = mockDestinations, onDestinationSelect }: MapProps) {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [safetyFilter, setSafetyFilter] = useState<string[]>(["high", "medium", "low"])
  const [facilityFilter, setFacilityFilter] = useState<FacilityType[]>([])
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }) // Center of India
  const [zoomLevel, setZoomLevel] = useState([5])
  const mapRef = useRef<HTMLDivElement>(null)

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesSafety = safetyFilter.includes(dest.safetyGradient)

    const matchesFacility =
      facilityFilter.length === 0 || dest.facilities.some((facility) => facilityFilter.includes(facility.type))

    return matchesSearch && matchesSafety && matchesFacility
  })

  const handleDestinationClick = (destination: Destination) => {
    setSelectedDestination(destination)
    onDestinationSelect(destination)
    setMapCenter({
      lat: destination.geoCoords.latitude,
      lng: destination.geoCoords.longitude,
    })
  }

  const getSafetyBadgeVariant = (gradient: string) => {
    switch (gradient) {
      case "high":
        return "default"
      case "medium":
        return "secondary"
      case "low":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getSafetyIcon = (gradient: string) => {
    switch (gradient) {
      case "high":
        return CheckCircle
      case "medium":
        return AlertTriangle
      case "low":
        return AlertTriangle
      default:
        return Shield
    }
  }

  return (
    <div className="w-full h-full bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Map Controls and Filters */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Input */}
              <div>
                <Input
                  placeholder="Search destinations, states, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              {/* Safety Filter */}
              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">Safety Level</label>
                <div className="flex flex-wrap gap-2">
                  {["high", "medium", "low"].map((level) => (
                    <Button
                      key={level}
                      variant={safetyFilter.includes(level) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSafetyFilter((prev) =>
                          prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
                        )
                      }}
                      className="capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Facility Filter */}
              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">Required Facilities</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(FACILITY_ICONS)
                    .slice(0, 6)
                    .map(([type, Icon]) => (
                      <Button
                        key={type}
                        variant={facilityFilter.includes(type as FacilityType) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setFacilityFilter((prev) =>
                            prev.includes(type as FacilityType)
                              ? prev.filter((f) => f !== type)
                              : [...prev, type as FacilityType],
                          )
                        }}
                        className="flex items-center gap-1 text-xs"
                      >
                        <Icon className="h-3 w-3" />
                        {type.replace("_", " ")}
                      </Button>
                    ))}
                </div>
              </div>

              {/* Zoom Control */}
              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">Map Zoom</label>
                <Slider value={zoomLevel} onValueChange={setZoomLevel} max={15} min={3} step={1} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Country</span>
                  <span>City</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Destination List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground">
                Destinations ({filteredDestinations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {filteredDestinations.map((destination) => {
                const SafetyIcon = getSafetyIcon(destination.safetyGradient)
                return (
                  <div
                    key={destination._id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedDestination?._id === destination._id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:bg-muted/50"
                    }`}
                    onClick={() => handleDestinationClick(destination)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-card-foreground text-sm">{destination.name}</h4>
                      <Badge variant={getSafetyBadgeVariant(destination.safetyGradient)} className="text-xs">
                        <SafetyIcon className="h-3 w-3 mr-1" />
                        {destination.safetyScore}/10
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{destination.state}</p>
                    <div className="flex flex-wrap gap-1">
                      {destination.facilities.slice(0, 4).map((facility) => {
                        const FacilityIcon = FACILITY_ICONS[facility.type]
                        return (
                          <div
                            key={facility._id}
                            className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs"
                          >
                            <FacilityIcon className="h-3 w-3" />
                            {facility.verified && <CheckCircle className="h-2 w-2 text-primary" />}
                          </div>
                        )
                      })}
                      {destination.facilities.length > 4 && (
                        <span className="text-xs text-muted-foreground">+{destination.facilities.length - 4}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map Display */}
        <div className="lg:col-span-3">
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Interactive India Tourism Map
                <Badge variant="outline" className="ml-auto">
                  Zoom: {zoomLevel[0]}x
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <div
                ref={mapRef}
                className="relative w-full h-96 lg:h-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-900 rounded-b-lg overflow-hidden map-container"
              >
                {/* Map Background with India Outline */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-green-100/50 dark:from-slate-700/50 dark:to-slate-800/50">
                  {/* Simulated India Map Background */}
                  <svg
                    viewBox="0 0 800 600"
                    className="w-full h-full opacity-20"
                    style={{
                      transform: `scale(${zoomLevel[0] / 5})`,
                      transformOrigin: `${mapCenter.lng}% ${mapCenter.lat}%`,
                    }}
                  >
                    <path
                      d="M200,100 L600,100 L650,200 L600,400 L500,500 L300,480 L200,400 Z"
                      fill="currentColor"
                      className="text-muted-foreground"
                    />
                  </svg>
                </div>

                {/* Safety Gradient Overlays */}
                {filteredDestinations.map((destination) => {
                  const x = ((destination.geoCoords.longitude - 68) / (97 - 68)) * 100
                  const y = ((37 - destination.geoCoords.latitude) / (37 - 8)) * 100

                  return (
                    <div
                      key={`overlay-${destination._id}`}
                      className="absolute rounded-full opacity-30 pointer-events-none"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        width: `${Math.max(50, zoomLevel[0] * 10)}px`,
                        height: `${Math.max(50, zoomLevel[0] * 10)}px`,
                        backgroundColor: SAFETY_COLORS[destination.safetyGradient],
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  )
                })}

                {/* Destination Markers */}
                {filteredDestinations.map((destination) => {
                  const x = ((destination.geoCoords.longitude - 68) / (97 - 68)) * 100
                  const y = ((37 - destination.geoCoords.latitude) / (37 - 8)) * 100
                  const SafetyIcon = getSafetyIcon(destination.safetyGradient)

                  return (
                    <div
                      key={`marker-${destination._id}`}
                      className="absolute cursor-pointer facility-marker"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      onClick={() => handleDestinationClick(destination)}
                    >
                      <div
                        className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                          selectedDestination?._id === destination._id ? "ring-2 ring-primary ring-offset-2" : ""
                        }`}
                        style={{ backgroundColor: SAFETY_COLORS[destination.safetyGradient] }}
                      >
                        <SafetyIcon className="h-4 w-4 text-white" />
                      </div>

                      {/* Facility Icons around marker */}
                      {destination.facilities.slice(0, 3).map((facility, index) => {
                        const FacilityIcon = FACILITY_ICONS[facility.type]
                        const angle = index * 120 * (Math.PI / 180)
                        const radius = 20
                        const facilityX = Math.cos(angle) * radius
                        const facilityY = Math.sin(angle) * radius

                        return (
                          <div
                            key={facility._id}
                            className="absolute w-4 h-4 bg-white rounded-full border border-gray-300 flex items-center justify-center shadow-sm"
                            style={{
                              left: `${facilityX}px`,
                              top: `${facilityY}px`,
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            <FacilityIcon className="h-2 w-2 text-gray-600" />
                            {facility.verified && (
                              <CheckCircle className="absolute -top-1 -right-1 h-2 w-2 text-primary bg-white rounded-full" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}

                {/* Selected Destination Info Popup */}
                {selectedDestination && (
                  <div className="absolute bottom-4 left-4 right-4 lg:right-auto lg:w-80">
                    <Card className="bg-card/95 backdrop-blur-sm border-border shadow-lg">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-card-foreground">{selectedDestination.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{selectedDestination.state}</p>
                          </div>
                          <Badge variant={getSafetyBadgeVariant(selectedDestination.safetyGradient)}>
                            {selectedDestination.safetyScore}/10
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-card-foreground mb-3">{selectedDestination.description}</p>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="text-sm">
                              Safety Level:{" "}
                              <span className="font-medium capitalize">{selectedDestination.safetyGradient}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="text-sm">{selectedDestination.facilities.length} verified facilities</span>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-2">
                            {selectedDestination.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button size="sm" className="w-full mt-3 bg-primary hover:bg-primary/90">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Map Legend */}
                <div className="absolute top-4 right-4">
                  <Card className="bg-card/95 backdrop-blur-sm border-border">
                    <CardContent className="p-3">
                      <h4 className="text-sm font-medium text-card-foreground mb-2">Safety Legend</h4>
                      <div className="space-y-1">
                        {Object.entries(SAFETY_COLORS).map(([level, color]) => (
                          <div key={level} className="flex items-center gap-2 text-xs">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                            <span className="capitalize text-card-foreground">{level} Safety</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
