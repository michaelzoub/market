"use client"
import { useEffect, useState } from "react"

export default function TransactionInfo() {
    const [info, setInfo] = useState<any>([])
    useEffect(() => {
        const txIdPathname = window.location.pathname.split("/")[3]
        async function fetchDetailedTransactionInfo(transaction: any) {
            const response = await fetch("http://localhost:8080/api/singletransactioninfo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: txIdPathname,
                credentials: "include"
            })
            const body = await response.json()
            setInfo(body)
            console.log('received from fetchexacttransaction', body)
        }
        console.log(window.location.pathname.split("/"))
        fetchDetailedTransactionInfo(txIdPathname)
    }, [])

    return (
        <main className="z-10 flex min-h-screen flex-col items-center bgblack gap-8 text-white overflow-auto overflow-x-hidden">
            <div className="flex flex-col mt-20 gap-2">
                <div className="flex flex-col">
                    <div>{info.items}</div>
                    <div>{info.correspondingPrices}</div>
                </div>
                <div className="">{new Date(info.time).toLocaleDateString()}</div>
            </div>
        </main>
    )
}