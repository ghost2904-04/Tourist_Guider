// API 12: CRUD operations for reviews and ratings
import { type NextRequest, NextResponse } from "next/server"
import { dbConnection, getFacilities } from "@/lib/database"
import { huggingFaceService } from "@/lib/huggingface-models"
import type { APIResponse, Review } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const facilityId = searchParams.get("facilityId")
    const destinationId = searchParams.get("destinationId")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    if (!facilityId && !destinationId) {
      return NextResponse.json({ success: false, error: "FacilityId or destinationId is required" }, { status: 400 })
    }

    await dbConnection.connect()
    const facilities = getFacilities()

    let reviews: Review[] = []

    if (facilityId) {
      const facility = await facilities.findOne({ _id: facilityId })
      reviews = facility?.reviews || []
    } else if (destinationId) {
      const destinationFacilities = await facilities.find({ destinationId }).toArray()

      reviews = destinationFacilities
        .flatMap((facility) => facility.reviews || [])
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit)
    }

    const apiResponse: APIResponse = {
      success: true,
      data: { reviews },
      message: "Reviews retrieved successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { facilityId, userId, rating, comment } = body

    if (!facilityId || !userId || !rating) {
      return NextResponse.json(
        { success: false, error: "FacilityId, userId, and rating are required" },
        { status: 400 },
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    await dbConnection.connect()
    const facilities = getFacilities()

    // Analyze sentiment of the comment if provided
    let sentimentAnalysis = null
    if (comment) {
      sentimentAnalysis = await huggingFaceService.analyzeSentiment(comment)
    }

    const newReview: Review = {
      _id: new Date().getTime().toString(), // Simple ID generation
      userId,
      rating,
      comment: comment || "",
      verified: false, // Will be verified later
      createdAt: new Date(),
    }

    // Add review to facility and update average rating
    const facility = await facilities.findOne({ _id: facilityId })
    if (!facility) {
      return NextResponse.json({ success: false, error: "Facility not found" }, { status: 404 })
    }

    const updatedReviews = [...(facility.reviews || []), newReview]
    const averageRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0) / updatedReviews.length

    await facilities.updateOne(
      { _id: facilityId },
      {
        $set: {
          reviews: updatedReviews,
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
          updatedAt: new Date(),
        },
      },
    )

    const apiResponse: APIResponse = {
      success: true,
      data: {
        review: newReview,
        sentimentAnalysis,
        newAverageRating: averageRating,
      },
      message: "Review added successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error adding review:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
