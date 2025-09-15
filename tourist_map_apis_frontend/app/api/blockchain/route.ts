// API 15: Blockchain verification and proof management
import { type NextRequest, NextResponse } from "next/server"
import { dbConnection, getBlockchainProofs, getFacilities } from "@/lib/database"
import type { APIResponse, BlockchainProof } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, facilityId, proofType, data, walletAddress } = body

    if (!action) {
      return NextResponse.json({ success: false, error: "Action is required" }, { status: 400 })
    }

    await dbConnection.connect()
    const proofs = getBlockchainProofs()

    let result: any = {}

    switch (action) {
      case "create_proof":
        if (!facilityId || !proofType || !data) {
          return NextResponse.json(
            { success: false, error: "FacilityId, proofType, and data are required" },
            { status: 400 },
          )
        }

        // Generate proof hash (in real implementation, this would be a proper hash)
        const proofHash = `0x${Date.now().toString(16)}${Math.random().toString(16).substr(2, 8)}`

        // Simulate blockchain transaction
        const txHash = `0x${Math.random().toString(16).substr(2, 64)}`

        const newProof: Omit<BlockchainProof, "_id"> = {
          hash: proofHash,
          facilityId,
          proofType: proofType as "verification" | "incident" | "review",
          timestamp: new Date(),
          txHash,
          verified: false, // Will be verified after blockchain confirmation
        }

        const proofResult = await proofs.insertOne(newProof)

        // Update facility with proof hash
        const facilities = getFacilities()
        await facilities.updateOne(
          { _id: facilityId },
          {
            $push: { verifiedHashes: proofHash },
            $set: { updatedAt: new Date() },
          },
        )

        result = {
          action: "create_proof",
          proofId: proofResult.insertedId,
          proofHash,
          txHash,
          status: "pending",
        }
        break

      case "verify_proof":
        if (!body.proofHash) {
          return NextResponse.json({ success: false, error: "ProofHash is required" }, { status: 400 })
        }

        const existingProof = await proofs.findOne({ hash: body.proofHash })
        if (!existingProof) {
          return NextResponse.json({ success: false, error: "Proof not found" }, { status: 404 })
        }

        // Simulate blockchain verification
        const blockchainVerified = Math.random() > 0.1 // 90% success rate

        await proofs.updateOne(
          { hash: body.proofHash },
          {
            $set: {
              verified: blockchainVerified,
              verifiedAt: new Date(),
            },
          },
        )

        result = {
          action: "verify_proof",
          proofHash: body.proofHash,
          verified: blockchainVerified,
          blockNumber: Math.floor(Math.random() * 1000000),
          confirmations: Math.floor(Math.random() * 100) + 10,
        }
        break

      case "get_proofs":
        if (!facilityId) {
          return NextResponse.json({ success: false, error: "FacilityId is required" }, { status: 400 })
        }

        const facilityProofs = await proofs.find({ facilityId }).sort({ timestamp: -1 }).toArray()

        result = {
          action: "get_proofs",
          facilityId,
          proofs: facilityProofs,
          totalProofs: facilityProofs.length,
          verifiedProofs: facilityProofs.filter((p) => p.verified).length,
        }
        break

      case "batch_verify":
        if (!body.proofHashes || !Array.isArray(body.proofHashes)) {
          return NextResponse.json({ success: false, error: "ProofHashes array is required" }, { status: 400 })
        }

        const batchResults = []
        for (const hash of body.proofHashes) {
          const proof = await proofs.findOne({ hash })
          if (proof) {
            const verified = Math.random() > 0.1
            await proofs.updateOne(
              { hash },
              {
                $set: {
                  verified,
                  verifiedAt: new Date(),
                },
              },
            )
            batchResults.push({ hash, verified, found: true })
          } else {
            batchResults.push({ hash, verified: false, found: false })
          }
        }

        result = {
          action: "batch_verify",
          results: batchResults,
          totalProcessed: batchResults.length,
          successfulVerifications: batchResults.filter((r) => r.verified).length,
        }
        break

      default:
        return NextResponse.json({ success: false, error: `Unsupported action: ${action}` }, { status: 400 })
    }

    const apiResponse: APIResponse = {
      success: true,
      data: result,
      message: `Blockchain ${action} completed successfully`,
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error in blockchain operation:", error)
    return NextResponse.json({ success: false, error: "Blockchain operation failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hash = searchParams.get("hash")
    const facilityId = searchParams.get("facilityId")
    const verified = searchParams.get("verified")

    await dbConnection.connect()
    const proofs = getBlockchainProofs()

    const query: any = {}
    if (hash) query.hash = hash
    if (facilityId) query.facilityId = facilityId
    if (verified !== null) query.verified = verified === "true"

    const results = await proofs.find(query).sort({ timestamp: -1 }).toArray()

    // Calculate statistics
    const stats = {
      totalProofs: results.length,
      verifiedProofs: results.filter((p) => p.verified).length,
      pendingProofs: results.filter((p) => !p.verified).length,
      proofTypes: results.reduce(
        (acc, proof) => {
          acc[proof.proofType] = (acc[proof.proofType] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    }

    const apiResponse: APIResponse = {
      success: true,
      data: {
        proofs: results,
        statistics: stats,
      },
      message: "Blockchain proofs retrieved successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error fetching blockchain proofs:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
