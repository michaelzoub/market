"use client"
import { useState, useEffect, useContext } from "react"
import { SteamidContext } from "@/app/utils/UserContext"
import Link from "next/link"

export default function Transactions() {
    const [txid, setTxid] = useState<any[]>([])
    const steamid = useContext(SteamidContext)
    const [page, setPage]= useState(0)

    const itemsPerPage = 40

    let startIndex = itemsPerPage * page
    let paginatedData = txid.slice(startIndex, startIndex + itemsPerPage);

    let startIndexForDisplay = startIndex + 1
    //total pages is the length of txid

    useEffect(() => {
        console.log(steamid)
        console.log(window.location.pathname)
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

    useEffect(() => {
        
    }, [])

    return (
        <main className="z-10 flex min-h-screen flex-col items-center bgblack gap-8 text-white overflow-auto overflow-x-hidden">
            <div className="mt-20 p-2 rounded-sm searchbg shadow-inner border-[1px] border-red-500 w-[500px]">
                {paginatedData.map((e) =>
                    <div className="flex flex-row justify-between gap-2">
                        <div>{startIndexForDisplay++}</div>
                        <Link href={`${window.location.pathname}/${e}`} className="text-left">{e.split("=")}</Link> 
                    </div> 
                )}
            </div>
        </main>
    )
}