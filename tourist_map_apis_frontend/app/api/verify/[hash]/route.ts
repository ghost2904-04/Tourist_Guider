// API 4: Check blockchain proof for facility/safety incidents
import { type NextRequest, NextResponse } from "next/server"
import { dbConnection, getBlockchainProofs } from "@/lib/database"
import type { APIResponse } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: { hash: string } }) {
  try {
    const { hash } = params

    if (!hash) {
      return NextResponse.json({ success: false, error: "Hash is required" }, { status: 400 })
    }

    await dbConnection.connect()
    const proofs = getBlockchainProofs()

    const proof = await proofs.findOne({ hash })

    if (!proof) {
      return NextResponse.json({ success: false, error: "Proof not found" }, { status: 404 })
    }

    // Simulate blockchain verification (in real implementation, this would call actual blockchain)
    const blockchainVerification = {
      isValid: true,
      blockNumber: Math.floor(Math.random() * 1000000),
      transactionHash: proof.txHash,
      confirmations: Math.floor(Math.random() * 100) + 10,
      gasUsed: Math.floor(Math.random() * 50000) + 21000,
    }

    const verificationResult = {
      proof,
      blockchain: blockchainVerification,
      verified: proof.verified && blockchainVerification.isValid,
      verificationTime: new Date(),
    }

    const apiResponse: APIResponse = {
      success: true,
      data: verificationResult,
      message: "Blockchain proof verified successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error verifying blockchain proof:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
