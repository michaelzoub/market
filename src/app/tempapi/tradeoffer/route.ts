import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { addAndSendTradeBot } from "@/app/services/steamtrade";
import { getSteamIdAndToken } from "@/app/services/steamtrade";


export async function POST(req: NextRequest) {
    try {
        const receivedBody = await req.json()
        const steamId = receivedBody.loggedInSteamId
        const items = receivedBody.itemsInCart
        const userItems = receivedBody.userItemsInCart
        const tradeLink = receivedBody.tradeLink
        const transactionId = receivedBody.transactionId
        const {token, steamId3} = getSteamIdAndToken(steamId, tradeLink)
        const botCartValue = receivedBody.botCartValue
        const userCartValue = receivedBody.userCartValue
        setTimeout(() => {
            messageToSend = "Cancelled"
            //communicate with backend to remove txid and not debit user
        },1200000)
        const returnFromTrade = await addAndSendTradeBot(items, userItems, steamId3, token, transactionId)
        let messageToSend
        if (returnFromTrade.includes("Error")) {
            messageToSend = "Cancelled"
            await fetch("http://localhost:8080/api/confirmtrade", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( { steamId: steamId, message: messageToSend, transactionId: transactionId, userCartValue: userCartValue, botCartValue: botCartValue } )
            })
        } else {
            messageToSend = returnFromTrade.offerId
            const response = await fetch("http://localhost:8080/api/confirmtrade", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify( { steamId: steamId, message: messageToSend, transactionId: transactionId, userCartValue: userCartValue, botCartValue: botCartValue } )
            })
            const awaitedjson = await response.json()
            console.log("Trade confirmed: ", awaitedjson)
        }
        return NextResponse.json({status: 200, message: messageToSend})
    } catch(error) {
        return NextResponse.json({status: 500, message: error})
    }
}