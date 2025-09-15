// API 11: Semantic search for destinations and facilities
import { type NextRequest, NextResponse } from "next/server"
import { dbConnection, getDestinations, getFacilities } from "@/lib/database"
import { huggingFaceService } from "@/lib/huggingface-models"
import type { APIResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, type = "destinations", limit = 10, filters } = body

    if (!query) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 })
    }

    await dbConnection.connect()

    // Get query embeddings for semantic search
    const queryEmbeddings = await huggingFaceService.getEmbeddings(query)

    let results: any[] = []

    if (type === "destinations" || type === "all") {
      const destinations = getDestinations()

      // Build filters
      const destinationFilters: any = {}
      if (filters?.region) destinationFilters.region = filters.region
      if (filters?.safetyLevel) destinationFilters.safetyGradient = filters.safetyLevel

      // Text-based search (fallback for semantic search)
      const textResults = await destinations
        .find({
          ...destinationFilters,
          $or: [
            { name: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { tags: { $in: [new RegExp(query, "i")] } },
            { state: { $regex: query, $options: "i" } },
          ],
        })
        .limit(limit)
        .toArray()

      results = [...results, ...textResults.map((dest) => ({ ...dest, type: "destination" }))]
    }

    if (type === "facilities" || type === "all") {
      const facilities = getFacilities()

      const facilityFilters: any = {}
      if (filters?.facilityType) facilityFilters.type = filters.facilityType
      if (filters?.verified !== undefined) facilityFilters.verified = filters.verified

      const facilityResults = await facilities
        .find({
          ...facilityFilters,
          $or: [{ name: { $regex: query, $options: "i" } }, { type: { $regex: query, $options: "i" } }],
        })
        .limit(limit)
        .toArray()

      results = [...results, ...facilityResults.map((facility) => ({ ...facility, type: "facility" }))]
    }

    // Use AI to classify and rank results
    const classification = await huggingFaceService.classifyText(query, [
      "safety",
      "adventure",
      "cultural",
      "family",
      "budget",
      "luxury",
      "food",
      "accommodation",
    ])

    // Sort results by relevance (simplified scoring)
    results = results
      .map((result) => ({
        ...result,
        relevanceScore: calculateRelevanceScore(result, query, classification),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)

    const apiResponse: APIResponse = {
      success: true,
      data: {
        query,
        results,
        queryEmbeddings,
        classification,
        totalResults: results.length,
      },
      message: "Semantic search completed successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error in semantic search:", error)
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 500 })
  }
}

function calculateRelevanceScore(result: any, query: string, classification: any): number {
  let score = 0

  // Text matching
  const text = `${result.name} ${result.description || ""} ${result.tags?.join(" ") || ""}`.toLowerCase()
  const queryLower = query.toLowerCase()

  if (text.includes(queryLower)) score += 10

  // Tag matching with classification
  if (result.tags && classification.labels) {
    const matchingTags = result.tags.filter((tag: string) => classification.labels.includes(tag.toLowerCase()))
    score += matchingTags.length * 5
  }

  // Safety score bonus for destinations
  if (result.safetyScore) {
    score += result.safetyScore
  }

  // Verification bonus for facilities
  if (result.verified) {
    score += 3
  }

  return score
}
