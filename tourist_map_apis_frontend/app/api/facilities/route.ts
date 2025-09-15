// API 8: CRUD operations for facilities
import { type NextRequest, NextResponse } from "next/server"
import { dbConnection, getFacilities } from "@/lib/database"
import type { APIResponse, Facility } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const destinationId = searchParams.get("destinationId")
    const type = searchParams.get("type")
    const verified = searchParams.get("verified")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    await dbConnection.connect()
    const facilities = getFacilities()

    const query: any = {}
    if (destinationId) query.destinationId = destinationId
    if (type) query.type = type
    if (verified !== null) query.verified = verified === "true"

    const results = await facilities.find(query).limit(limit).toArray()

    const apiResponse: APIResponse = {
      success: true,
      data: { facilities: results },
      message: "Facilities retrieved successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error fetching facilities:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, name, destinationId, coordinates, contact } = body

    if (!type || !name || !destinationId || !coordinates) {
      return NextResponse.json(
        { success: false, error: "Type, name, destinationId, and coordinates are required" },
        { status: 400 },
      )
    }

    await dbConnection.connect()
    const facilities = getFacilities()

    const newFacility: Omit<Facility, "_id"> = {
      type,
      name,
      destinationId,
      verified: false,
      status: "active",
      contact,
      rating: 0,
      reviews: [],
      coordinates,
      timestamps: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }

    const result = await facilities.insertOne(newFacility)

    const apiResponse: APIResponse = {
      success: true,
      data: { facilityId: result.insertedId, facility: newFacility },
      message: "Facility created successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error creating facility:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
