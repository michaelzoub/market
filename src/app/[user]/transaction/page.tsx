"use client"
import { useState, useEffect, useContext } from "react"
import { SteamidContext } from "@/app/utils/UserContext"

export default function Transactions() {
    const [txid, setTxid] = useState<any>("")
    const steamid = useContext(SteamidContext)

    useEffect(() => {
        console.log(steamid)
        async function fetchTransactionInformation() {
            const response = await fetch("http://localhost:8080/api/fetchtransactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: steamid
            })
            const body = await response.json()
            console.log(body)
            setTxid(body)
        }
        fetchTransactionInformation()
    },[])
    return (
        <main className="z-10 flex min-h-screen flex-col items-center bgblack gap-8 text-white overflow-auto overflow-x-hidden">
            {txid.map((e:any) => 
                <div>{e}</div>
            )}
        </main>
    )
}