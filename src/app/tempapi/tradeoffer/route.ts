import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { addAndSendTradeBot } from "@/app/services/steamtrade";
import { getSteamIdAndToken } from "@/app/services/steamtrade";

export async function POST(req: NextRequest) {
    try {
        const receivedBody = await req.json()
        const steamId = receivedBody.loggedInSteamId
        const items = receivedBody.itemsInCart
        const tradeLink = receivedBody.tradeLink
        const transactionId = receivedBody.transactionId
        const {token, steamId3} = getSteamIdAndToken(steamId, tradeLink)
        addAndSendTradeBot(items, steamId3, token, transactionId)
        return NextResponse.json({status: 200, message: "Trade offer sent."})
    } catch(error) {
        return NextResponse.json({status: 500, message: error})
    }
}