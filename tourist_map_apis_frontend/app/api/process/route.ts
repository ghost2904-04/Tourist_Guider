// API 1: Process queries, recommendations, and facility data submission
import { type NextRequest, NextResponse } from "next/server"
import { dbConnection, getDestinations, getFacilities, getQueryHistory } from "@/lib/database"
import { huggingFaceService } from "@/lib/huggingface-models"
import type { APIResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, userId, type, preferences, location } = body

    if (!query || !userId) {
      return NextResponse.json({ success: false, error: "Query and userId are required" }, { status: 400 })
    }

    await dbConnection.connect()

    let response: any = {}

    switch (type) {
      case "recommendation":
        // Use AI to classify user intent and provide recommendations
        const classification = await huggingFaceService.classifyText(query, [
          "safety",
          "adventure",
          "cultural",
          "family",
          "budget",
          "luxury",
        ])

        // Get embeddings for semantic search
        const embeddings = await huggingFaceService.getEmbeddings(query)

        // Find matching destinations based on preferences
        const destinations = await getDestinations()
          .find({
            $or: [
              { tags: { $in: classification.labels?.slice(0, 3) || [] } },
              { region: preferences?.regions?.[0] },
              { safetyGradient: preferences?.safetyLevel },
            ],
          })
          .limit(10)
          .toArray()

        response = {
          type: "recommendation",
          recommendations: destinations,
          reasoning: classification,
          query_embeddings: embeddings,
        }
        break

      case "facility_submission":
        // Submit new facility data
        const facilities = getFacilities()
        const newFacility = {
          ...body.facility,
          verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        const result = await facilities.insertOne(newFacility)
        response = {
          type: "facility_submission",
          facilityId: result.insertedId,
          status: "pending_verification",
        }
        break

      case "safety_query":
        // Analyze safety-related queries
        const sentiment = await huggingFaceService.analyzeSentiment(query)
        const entities = await huggingFaceService.extractEntities(query)

        response = {
          type: "safety_query",
          sentiment_analysis: sentiment,
          extracted_entities: entities,
          safety_recommendations: [],
        }
        break

      default:
        // General query processing
        const summary = await huggingFaceService.summarizeText(query)
        response = {
          type: "general",
          summary,
          processed_query: query,
        }
    }

    // Save query history
    const history = getQueryHistory()
    await history.insertOne({
      userId,
      query,
      response: JSON.stringify(response),
      modelId: "multiple",
      timestamp: new Date(),
    })

    const apiResponse: APIResponse = {
      success: true,
      data: response,
      message: "Query processed successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error processing query:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
