'use client'
import { steamOption } from "@/app/components/paymentdata"
import { paymentOptions } from "@/app/components/paymentdata"
import { cryptoOptions } from "@/app/components/paymentdata"
import { CurrencyContext } from "@/app/components/CurrencyContext"
import { steamMarketCurrencies } from "@/app/components/SteamMarketCurrencies"
import { useContext } from "react"
import { useState } from "react"
import Image from "next/image"
import qr from "/public/qr.svg"

interface cryptoType {
    name: string,
    href: string,
    img: string,
    slug: string
}

//temporary fake data, we'd fetch it from 
const fakeTxData = [
    {
        date: "2024-10-01",
        amount: 120.0
    },
    {
        date: "2024-10-01",
        amount: 120.0   
    },
    {
        date: "2024-10-01",
        amount: 1220.0
    },
    {
        date: "2024-10-01",
        amount: 120.0   
    },
    {
        date: "2024-10-01",
        amount: 2340.0
    },
    {
        date: "2024-10-01",
        amount: 120.0   
    },
    {
        date: "2024-10-01",
        amount: 114.0
    },
    {
        date: "2024-10-01",
        amount: 1110.0   
    },
]

const itemsPerPage = 6

export default function paymentSlug({ params }: any) {
    const [page, setPage] = useState(0) //page number starts at page 0
    const totalPages = Math.ceil(fakeTxData.length / itemsPerPage) //number for total amount of pages
    //start index would be the itemsPerPage times page
    const startIndex = itemsPerPage * page
    const paginatedData = fakeTxData.slice(startIndex, startIndex + itemsPerPage);

    async function sendToBackendForProcessing() {

    }

    let e1 = 1;

    let payment: any;

    const { slug } = params;
    if (slug.includes("crypto")) {
        payment = cryptoOptions.find((e) => e.slug === slug)
    } if (slug.includes("cash")) {
        payment = paymentOptions.find((e) => e.slug === slug)
    } if (slug.includes("skins")) {
        payment = steamOption.find((e) => e.slug === slug)
    }

    console.log(payment.color)

    let currencyObjectKeys = Object.keys(steamMarketCurrencies)
    let currencyContext = useContext(CurrencyContext)
    let matchingObjectKey = currencyObjectKeys.filter((e) => e === currencyContext)
    return(
        <main className="z-10 px-10 flex flex-col min-h-screen items-center bgblack gap-8 text-white overflow-auto overflow-x-hidden">
            <div className="mt-20 text-lg font-medium">Deposit <span className={`${String(payment.color)}`}>{payment.name}</span>:</div>
            <div>
                You will receive balance automatically after sending {String(payment.name)} to the address displayed below. (12 confirmations required).
            </div>
            <div className="flex flex-col gap-2 tradebox px-10 p-4 rounded-sm w-full">
                <div className="mx-auto text-lg">Wallet address:</div>
                <Image className="bg-white rounded-sm mx-auto" src={qr} width={200} alt="qr"></Image>
                <div className="mx-auto mt-4 border-2 rounded-sm border-zinc-400 p-1">Transfer only ${payment.name} to this address</div>
            </div>
            <div className="w-full shadow-inner rounded-sm tradebox flex flex-col gap-2 p-4">
                <div className="text-2xl font-medium">Transaction History:</div>
                <div className="grid grid-cols divide-y-[1px]">
                {
                    paginatedData.map((e) => 
                    <div className="flex flex-row justify-between p-1 rounded-sm">
                        <div className="text-red-200 text-left">Tx: {e1++}</div>
                        <div className="w-32 pl-4 text-left">{e.amount} {matchingObjectKey}</div>
                        <div className="">{e.date}</div>
                    </div>
                )
                }
                </div>
                <div className="flex flex-row mx-auto gap-4">
                    <button onClick={() => setPage((e) => e - 1)} className="rounded-sm px-1 bg-red-400 text-black">←</button>
                    <button onClick={() => setPage((e) => e + 1)} className="rounded-sm px-1 bg-red-400 text-black">➜</button>
                </div>
                <div className="mx-auto">Page {page + 1} / {totalPages}</div>
            </div>
        </main>
    )
}