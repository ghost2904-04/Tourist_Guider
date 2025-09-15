// API 7: CRUD operations for destinations
import { type NextRequest, NextResponse } from "next/server"
import { dbConnection, getDestinations } from "@/lib/database"
import { huggingFaceService } from "@/lib/huggingface-models"
import type { APIResponse, Destination } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const region = searchParams.get("region")
    const safetyLevel = searchParams.get("safetyLevel")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    await dbConnection.connect()
    const destinations = getDestinations()

    // Build query
    const query: any = {}
    if (region) query.region = region
    if (safetyLevel) query.safetyGradient = safetyLevel
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    const results = await destinations.find(query).skip(offset).limit(limit).toArray()

    const total = await destinations.countDocuments(query)

    const apiResponse: APIResponse = {
      success: true,
      data: {
        destinations: results,
        pagination: { total, limit, offset, hasMore: offset + limit < total },
      },
      message: "Destinations retrieved successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error fetching destinations:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, geoCoords, region, state, facilities, tags } = body

    if (!name || !geoCoords || !region || !state) {
      return NextResponse.json(
        { success: false, error: "Name, geoCoords, region, and state are required" },
        { status: 400 },
      )
    }

    await dbConnection.connect()
    const destinations = getDestinations()

    // Use AI to analyze description and generate additional tags
    const aiTags = await huggingFaceService.classifyText(description, [
      "adventure",
      "cultural",
      "family",
      "budget",
      "luxury",
      "scenic",
      "historical",
      "beach",
      "mountain",
    ])

    const newDestination: Omit<Destination, "_id"> = {
      name,
      description,
      geoCoords,
      region,
      state,
      safetyScore: 5.0, // Default, will be updated by AI assessment
      safetyGradient: "medium",
      facilities: facilities || [],
      verifiedHashes: [],
      images: [],
      tags: [...(tags || []), ...(aiTags.labels?.slice(0, 3) || [])],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await destinations.insertOne(newDestination)

    const apiResponse: APIResponse = {
      success: true,
      data: { destinationId: result.insertedId, destination: newDestination },
      message: "Destination created successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error creating destination:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
