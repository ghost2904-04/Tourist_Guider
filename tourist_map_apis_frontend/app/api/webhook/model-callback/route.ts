// API 6: Async model results (e.g., new facility verification)
import { type NextRequest, NextResponse } from "next/server"
import { dbConnection, getFacilities, getBlockchainProofs } from "@/lib/database"
import type { APIResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { modelId, facilityId, result, txHash, proofType } = body

    if (!modelId || !facilityId || !result) {
      return NextResponse.json(
        { success: false, error: "ModelId, facilityId, and result are required" },
        { status: 400 },
      )
    }

    await dbConnection.connect()

    // Process different types of model callbacks
    switch (result.type) {
      case "facility_verification":
        const facilities = getFacilities()
        await facilities.updateOne(
          { _id: facilityId },
          {
            $set: {
              verified: result.verified,
              verificationScore: result.score,
              proofHash: result.proofHash,
              updatedAt: new Date(),
            },
          },
        )

        // Store blockchain proof if provided
        if (txHash && result.proofHash) {
          const proofs = getBlockchainProofs()
          await proofs.insertOne({
            hash: result.proofHash,
            facilityId,
            proofType: proofType || "verification",
            timestamp: new Date(),
            txHash,
            verified: result.verified,
          })
        }
        break

      case "safety_assessment":
        // Update destination safety scores based on AI analysis
        const destinations = dbConnection.getCollection("destinations")
        await destinations.updateOne(
          { _id: result.destinationId },
          {
            $set: {
              safetyScore: result.safetyScore,
              safetyGradient: result.safetyGradient,
              lastAssessment: new Date(),
            },
          },
        )
        break

      case "review_analysis":
        // Process sentiment analysis results for reviews
        const reviews = dbConnection.getCollection("reviews")
        await reviews.updateOne(
          { _id: result.reviewId },
          {
            $set: {
              sentimentScore: result.sentiment.score,
              sentimentLabel: result.sentiment.label,
              processed: true,
              processedAt: new Date(),
            },
          },
        )
        break
    }

    const apiResponse: APIResponse = {
      success: true,
      data: {
        modelId,
        facilityId,
        processed: true,
        result,
      },
      message: "Model callback processed successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error processing model callback:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
