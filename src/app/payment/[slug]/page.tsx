'use client'
import { steamOption } from "@/app/components/paymentdata"
import { paymentOptions } from "@/app/components/paymentdata"
import { cryptoOptions } from "@/app/components/paymentdata"
import { CurrencyContext } from "@/app/components/CurrencyContext"
import { steamMarketCurrencies } from "@/app/components/SteamMarketCurrencies"
import { useContext, useEffect, useState } from "react"
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
        amount: 1.1
    },
    {
        date: "2024-10-01",
        amount: 2.0   
    },
    {
        date: "2024-10-01",
        amount: 3.0
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

const itemsPerPage = 1;

export default function paymentSlug({ params }: any) {
    const totalPages = Math.ceil(fakeTxData.length / itemsPerPage) //number for total amount of pages
    const [center, setCenter] = useState(Math.ceil(totalPages / 2))
    const [page, setPage] = useState(0)
    const [over, setOver] = useState(false)
    //start index would be the itemsPerPage times page
    const startIndex = itemsPerPage * page
    const paginatedData = fakeTxData.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        if (totalPages <= 4) {
            setOver(true)
        }
    },[])
    
    let parsedPages: any = [];

    for (let i = 1; i <= totalPages; i++) {
        parsedPages.push(i)
    }

    function performSelectSelection(e:any) {
        const target = e.target.value
        setPage(e.target.value - 1)
    }

    function rightPage(e:any) {
        if (e.target.value >= totalPages - 1) {
            if (e.target.value > totalPages - 1) {

            } else {
                setPage(e.target.value - 1)
            }
        } else {
            setPage(e.target.value - 1)
            let plus = center + 1
            setCenter(plus)
        }
    }

    function leftPage(e:any) {
        if (e.target.value <= 2) {
            if (e.target.value < 2) {

            } else {
                setPage(e.target.value - 1)
            }
        } else {
            setPage(e.target.value - 1)
            let minus = center - 1
            setCenter(minus)
        }
    }

    function first(e:any) {
        setPage(e.target.value - 1)
        if (totalPages < 5) {
            setCenter(2)
        } else {
            setCenter(3)
        }
    }

    function last(e:any) {
        setPage(e.target.value - 1)
        if (totalPages < 5) {
            if (over) {
                setCenter(totalPages - 2)
            } else {
                setCenter(totalPages - 1)
            }
        } else {
            setCenter(totalPages - 2)
        }
    }

    async function sendToBackendForProcessing() {

    }

    let e1 = 1;
    let centerCalc = Math.ceil(totalPages / 2)

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
            <div className="w-full shadow-inner rounded-sm bgblack flex flex-col gap-2 p-4">
                <div className="text-2xl font-medium">Transaction History:</div>
                <div className="grid grid-cols divide-y-[1px]">
                <div className="flex flex-row justify-between text-zinc-300 my-2">
                    <div>Type</div>
                    <div>Amount</div>
                    <div>Date</div>
                </div>
                {
                    paginatedData.map((e) => 
                    <div className="flex flex-row justify-between p-1 rounded-sm">
                        <div className="text-red-400 text-left">Sell</div>
                        <div className="w-52 pl-24 text-left">{e.amount} {matchingObjectKey}</div>
                        <div className="text-zinc-300">{e.date}</div>
                    </div>
                )
                }
                </div>
                <div className="flex flex-row mx-auto gap-4">
                                <button className="rounded-md bg-red-400 p-2 w-fit" onClick={first} value={1}>First</button>
                                <div className="flex flex-row gap-2">
                                    <button className={`${over ? "hidden" : "rounded-md bg-red-400 p-2 w-7"}`} onClick={leftPage} value={center - 1}>{center - 1}</button>
                                    <button className="rounded-md bg-red-400 p-2 w-7" onClick={(e:any) => setPage(e.target.value - 1)} value={center}>{center}</button>
                                    <button className="rounded-md bg-red-400 p-2 w-7" onClick={rightPage} value={center + 1}>{center + 1}</button>
                                </div>
                                <button className="rounded-md bg-red-400 p-2 w-fit" onClick={last} value={totalPages}>Last</button>
                </div>
                <div className="text-sm text-zinc-400 mx-auto m-2">Page {page + 1} - {totalPages}</div>
            </div>
        </main>
    )
}