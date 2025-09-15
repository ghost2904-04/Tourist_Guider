// API 14: MetaMask wallet operations
import { type NextRequest, NextResponse } from "next/server"
import { dbConnection, getUsers } from "@/lib/database"
import type { APIResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, walletAddress, signature, message } = body

    if (!action) {
      return NextResponse.json({ success: false, error: "Action is required" }, { status: 400 })
    }

    await dbConnection.connect()
    const users = getUsers()

    let result: any = {}

    switch (action) {
      case "connect":
        if (!userId || !walletAddress) {
          return NextResponse.json({ success: false, error: "UserId and walletAddress are required" }, { status: 400 })
        }

        // Update user with wallet address
        await users.updateOne(
          { _id: userId },
          {
            $set: {
              wallet: walletAddress,
              walletConnectedAt: new Date(),
              updatedAt: new Date(),
            },
          },
          { upsert: true },
        )

        result = {
          action: "connect",
          userId,
          walletAddress,
          connected: true,
        }
        break

      case "verify":
        if (!walletAddress || !signature || !message) {
          return NextResponse.json(
            { success: false, error: "WalletAddress, signature, and message are required" },
            { status: 400 },
          )
        }

        // In a real implementation, you would verify the signature here
        // For now, we'll simulate verification
        const isValidSignature = signature.length > 100 // Simple check

        result = {
          action: "verify",
          walletAddress,
          verified: isValidSignature,
          message: isValidSignature ? "Signature verified" : "Invalid signature",
        }
        break

      case "disconnect":
        if (!userId) {
          return NextResponse.json({ success: false, error: "UserId is required" }, { status: 400 })
        }

        await users.updateOne(
          { _id: userId },
          {
            $unset: { wallet: "", walletConnectedAt: "" },
            $set: { updatedAt: new Date() },
          },
        )

        result = {
          action: "disconnect",
          userId,
          disconnected: true,
        }
        break

      case "transaction":
        if (!walletAddress || !body.transactionHash) {
          return NextResponse.json(
            { success: false, error: "WalletAddress and transactionHash are required" },
            { status: 400 },
          )
        }

        // Store transaction record
        const transactions = dbConnection.getCollection("transactions")
        const transaction = {
          walletAddress,
          transactionHash: body.transactionHash,
          type: body.type || "verification",
          amount: body.amount || "0",
          status: "pending",
          createdAt: new Date(),
        }

        const txResult = await transactions.insertOne(transaction)

        result = {
          action: "transaction",
          transactionId: txResult.insertedId,
          transaction,
        }
        break

      default:
        return NextResponse.json({ success: false, error: `Unsupported action: ${action}` }, { status: 400 })
    }

    const apiResponse: APIResponse = {
      success: true,
      data: result,
      message: `Wallet ${action} completed successfully`,
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error in wallet operation:", error)
    return NextResponse.json({ success: false, error: "Wallet operation failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("walletAddress")
    const userId = searchParams.get("userId")

    if (!walletAddress && !userId) {
      return NextResponse.json({ success: false, error: "WalletAddress or userId is required" }, { status: 400 })
    }

    await dbConnection.connect()
    const users = getUsers()

    const query = walletAddress ? { wallet: walletAddress } : { _id: userId }
    const user = await users.findOne(query)

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Get transaction history if wallet is connected
    let transactions = []
    if (user.wallet) {
      const transactionCollection = dbConnection.getCollection("transactions")
      transactions = await transactionCollection
        .find({ walletAddress: user.wallet })
        .sort({ createdAt: -1 })
        .limit(20)
        .toArray()
    }

    const apiResponse: APIResponse = {
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          wallet: user.wallet,
          walletConnectedAt: user.walletConnectedAt,
        },
        transactions,
      },
      message: "Wallet information retrieved successfully",
      timestamp: new Date(),
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Error fetching wallet info:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
