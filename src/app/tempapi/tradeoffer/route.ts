import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { addAndSendTradeBot } from "@/app/services/steamtrade";

export async function POST(req: NextRequest) {
    try {
        const receivedBody = await req.json()
        const steamId = receivedBody.loggedInSteamId
        const items = receivedBody.itemsInCart
        addAndSendTradeBot(items, steamId)
        return NextResponse.json({status: 200, message: "Success"})
    } catch(error) {
        return NextResponse.json({status: 500, message: error})
    }
}