import { NextResponse } from "next/server";

export async function GET() {
    const responseArray = ["Pending", "Completed", "Cancelled"]
    const random = Math.floor(Math.random() * 3) + 1
    return NextResponse.json(responseArray[random])
}