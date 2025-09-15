// API 2: Fetch destination map data, safety metrics, facility status
import { type NextRequest, NextResponse } from "next/server"
import { dbConnection, getDestinations, getFacilities } from "@/lib/database"
import type { APIResponse, MapData } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get("region")
    const safetyLevel = searchParams.get("safetyLevel")
    const facilityType = searchParams.get("facilityType")
    const bounds = searchParams.get("bounds")

    await dbConnection.connect()

    // Build query filters
    const filters: any = {}
    if (region) filters.region = region
    if (safetyLevel) filters.safetyGradient = safetyLevel

    // Parse bounds if provided
    let boundsFilter = {}
    if (bounds) {
      const [north, south, east, west] = bounds.split(",").map(Number)
      boundsFilter = {
        "geoCoords.latitude": { $gte: south, $lte: north },
        "geoCoords.longitude": { $gte: west, $lte: east },
      }
    }

    // Fetch destinations
    const destinations = await getDestinations()
      .find({ ...filters, ...boundsFilter })
      .toArray()

    // Fetch facilities
    const facilities = await getFacilities()
      .find(facilityType ? { type: facilityType } : {})
      .toArray()

    // Generate safety overlays
    const safetyOverlay = destinations.map((dest) => ({
      coordinates: [
        [dest.geoCoords.longitude - 0.1, dest.geoCoords.latitude - 0.1],
        [dest.geoCoords.longitude + 0.1, dest.geoCoords.latitude + 0.1],
      ],
      safetyLevel: dest.safetyGradient,
      color: dest.safetyGradient === "high" ? "#10b981" : dest.safetyGradient === "medium" ? "#f59e0b" : "#ef4444",
      opacity: 0.3,
    }))

    // Generate facility markers
    const facilityMarkers = facilities.map((facility) => ({
      id: facility._id,
      type: facility.type,
      coordinates: [facility.coordinates.longitude, facility.coordinates.latitude] as [number, number],
      name: facility.name,
      verified: facility.verified,
      rating: facility.rating,
    }))

    const mapData: MapData = {
      destinations,
      safetyOverlay,
      facilityMarkers,
      bounds: {
        north: Math.max(...destinations.map((d) => d.geoCoords.latitude)),
        south: Math.min(...destinations.map((d) => d.geoCoords.latitude)),
        east: Math.max(...destinations.map((d) => d.geoCoords.longitude)),
        west: Math.min(...destinations.map((d) => d.geoCoords.longitude)),
      },
    }

    const apiResponse: APIResponse<MapData> = {
      success: true,
      data: mapData,
      message: "Map data retrieved successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error fetching map data:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
