'use client'
import { steamOption } from "@/app/data/paymentdata"
import { paymentOptions } from "@/app/data/paymentdata"
import { cryptoOptions } from "@/app/data/paymentdata"
import { CurrencyContext } from "@/app/utils/CurrencyContext"
import { steamMarketCurrencies } from "@/app/data/steamMarketCurrencies"
import { useContext, useEffect, useState } from "react"
import Image from "next/image"
import qr from "/public/qr.svg"
import { formInterface } from "./interface"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PayButton from "@/app/components/checkoutform"
import { createUUIDForCryptoTx } from "@/app/utils/uuid"

const stripePromise = loadStripe("pk_test_51Q2bcKGPi4c603NdurI8SIfP2kblRigYA84OIWosdNUgYtwcMfN6fxa4b9cVhEX6QmUHdsNZb3PlNm83hhxPH3vo00NlENq6XE");

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

const suggestedDeposits = [10, 25, 75, 250]

const itemsPerPage = 3;

export default function paymentSlug({ params }: any) { //number for total amount of pages
    const totalPages = Math.ceil(fakeTxData.length / itemsPerPage)
    const [center, setCenter] = useState(Math.ceil(totalPages / 2))
    const [page, setPage] = useState(0)
    const [over, setOver] = useState(false)
    const [loading, setLoading] = useState(<div></div>)
    const [inputAmount, setInputAmount] = useState<number>()
    const [currencyState, setCurrencyState] = useState("usd")
    const [loadingTimer, setLoadingTimer] = useState(false)
    const [paymentResponse, setPaymentResponse] = useState("")
    const [clientSecretState, setClientSecretState] = useState("")
    const [buttonColor, setButtonColor] = useState(false)
    const [notNumberError, setNotNumberError] = useState("")
    const [xamaxWalletAddress, setXamaxWalletAddress] = useState("")
    const [accessToken, setAccessToken] = useState("")

    const startIndex = itemsPerPage * page
    const paginatedData = fakeTxData.slice(startIndex, startIndex + itemsPerPage);

    let parsedPages: any = [];

    let currencyObjectKeys = Object.keys(steamMarketCurrencies)
    let currencyContext = useContext(CurrencyContext)
    let matchingObjectKey = currencyObjectKeys.filter((e) => e === currencyContext)

    //TO DO: implement price conversion https://api.coingecko.com/api/v3/simple/price

    const xamaxApiKey = process.env.XAMA_API

    const object: formInterface = {
        payment: inputAmount ?? 0,
        currency: currencyState
    }

    useEffect(() => {
        matchingObjectKey.includes("EUR") ? setCurrencyState("eur") :  (matchingObjectKey.includes("JPY") ? setCurrencyState("jpy") : matchingObjectKey.includes("CNY") ? setCurrencyState("cny") : matchingObjectKey.includes("BRL") ? setCurrencyState("brl") : setCurrencyState("usd"))
        if (slug.includes("cash")) {
        }
        if (totalPages <= 4) {
            setOver(true)
        }
        for (let i = 1; i <= totalPages; i++) {
            parsedPages.push(i)
        }
    },[])

    useEffect(() => {

        async function sendToXamax() {
            const response = await fetch("https://auth.xamax.io/v1/auth/refresh",{
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: JSON.stringify({
                    refresh_token: xamaxApiKey
                })
            })
            const access_token = await response.json()
            setAccessToken(access_token)
        }
        if(slug.includes("crypto")) {
            sendToXamax()
        }
    },[])

    async function createXamaxInvoice() {

        const uuid = createUUIDForCryptoTx()

        const response = await fetch("https://api.sandbox.xamax.io/v1/transaction/invoice", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                txId: uuid,
                code: payment.name.toLowerCase(),
                amount: inputAmount,
                type: "invoice_type_default"
            })
        })
        const body = await response.json()
        setXamaxWalletAddress(body.walletAddress)
        console.log("createXamaxInvoice: ", body)
    }

    function performSelectSelection(e:any) {
        const target = e.target.value
        setPage(e.target.value - 1)
    }

    function isNumber(input:any): boolean {
        return !isNaN(Number(input))
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

    async function fetchPaymentIntent(e:any) {
        if (e.type === 'click' || (e.type === 'keydown' && e.key === 'Enter')) {
            if (inputAmount === 0) {
                setNotNumberError("Required field")
                return;
            }
            else if (!isNumber(inputAmount)) {
                setNotNumberError("Enter a number")
                return;
            } 
            const response = await fetch("http://localhost:8080/api/create-payment-intent", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(object)
            })
            setLoading(<div className="z-10 animate-spin radius mx-auto mt-32"></div>)
            const body = await response.json()
            setLoading(<div></div>)
            setLoadingTimer(true)
            //setLoading(<div className="z-10 animate-spin radius mx-auto mt-32"></div>)
            //setTimeout(() => setLoadingTimer(true), body? 399 : 1000)
            //setTimeout(() => setLoading(<div></div>), body ? 399 : 1000) 
            setClientSecretState(body.clientSecret)
        }
    }

    let payment: any;

    const { slug } = params;
    if (slug.includes("crypto")) {
        payment = cryptoOptions.find((e) => e.slug === slug)
    } if (slug.includes("cash")) {
        payment = paymentOptions.find((e) => e.slug === slug)
    } if (slug.includes("skins")) {
        payment = steamOption.find((e) => e.slug === slug)
    }

    const appearance = {
        theme: 'night',
        variables: {
          fontFamily: 'Sohne, system-ui, sans-serif',
          fontWeightNormal: '500',
          borderRadius: '2px',
          colorBackground: '#2B2F3C',
          colorPrimary: '#e96969',
          accessibleColorOnColorPrimary: '#1A1B25',
          colorText: 'white',
          colorTextSecondary: 'white',
          colorTextPlaceholder: '#ABB2BF',
          tabIconColor: 'white',
          logoColor: 'dark'
        },
        rules: {
          '.Input': {
            backgroundColor: '#2B2F3C',
            border: '1px solid var(--colorPrimary)'
          }
        }
      };
      const options:any = {
        clientSecret: clientSecretState,
        appearance
      };

    return(
        <main className="z-10 px-10 flex flex-col min-h-screen items-center bgblack gap-8 text-white overflow-auto overflow-x-hidden">
            {slug.includes("!crypto") ?  
             <div className="w-full">
             {loading}
                <div className={`${xamaxWalletAddress ? "hidden" : "w-fit p-10 px-16 mt-32 mx-auto flex flex-col hoversearchbg rounded-md shadow-inner border-2 border-gray-600"}`}>
                    <div className="py-2 font-medium text-gray-100 text-lg">Deposit with {payment.name}</div>
                    <div className="mt-1 mb-4 text-gray-300 text-sm">Enter the amount you would like to checkout with.</div>
                    <div className="flex flex-row justify-end mx-auto">
                        <input placeholder="Payment Amount" className="px-[12px] pr-[170px] py-[8px] rounded-sm text-sm bg-[#2B2F3C] border-[1.5px] border-[#e96969]" onChange={(e:any) => setInputAmount(e.target.value)} value={inputAmount} onKeyDown={createXamaxInvoice}></input>
                    </div>
                    <button className="mt-6 mx-[-1px] shadow shadow-red-700 redaccent rounded-sm py-1" onClick={createXamaxInvoice}>Continue</button>
                    <div className={`${notNumberError ? "absolute flex flex-row mt-[5.5rem] ml-[375px]" : "hidden"}`}>
                    <div className="absolute right-[-1.8px] text-red-500 text-sm">◀</div>
                            <span className="absolute bg-red-500 text-white text-xs rounded py-1 px-2 w-[110px]">{notNumberError}</span>
                    </div>
                    <div className="py-2 mt-4 font-medium text-gray-100">Or select an amount</div>
                    <div className="grid prices-grid">
                        {
                            suggestedDeposits.map((e:number) => 
                                <button className="redaccent rounded-sm px-12 py-1 text-gray-200 text-sm shadow shadow-red-700 hover:shadow-red-600" value={e} onClick={(t: any) => setInputAmount(t.target.value)}>{e}$</button>
                            )
                        }
                    </div>
                </div>
                <div className={`${xamaxWalletAddress ? "w-fit p-10 px-16 mt-32 mx-auto flex flex-col hoversearchbg rounded-md shadow-inner border-2 border-gray-600 text-left" : "hidden"}`}>
                        <text className="text-lg font-semibold">New invoice</text>
                        <text>Amount: {inputAmount}{payment.name}</text>
                        <text className="text-gray-300">Send to: </text>
                        <div>{xamaxWalletAddress}</div>
                </div>
             </div> 
            : (slug.includes("cash") ? 
            <div className="w-full">
            {loading}
            <div className={`${clientSecretState ? "hidden" : "w-fit p-10 px-16 mt-32 mx-auto flex flex-col hoversearchbg rounded-md shadow-inner border-2 border-gray-600"}`}>
                <div className="py-2 font-medium text-gray-100 text-lg">Deposit with {payment.name}</div>
                <div className="mt-1 mb-4 text-gray-300 text-sm">Enter the amount you would like to checkout with.</div>
                <div className="flex flex-row justify-end mx-auto">
                    <input placeholder="Payment Amount" className="px-[12px] pr-[170px] py-[8px] rounded-sm text-sm bg-[#2B2F3C] border-[1.5px] border-[#e96969]" onChange={(e:any) => setInputAmount(e.target.value)} value={inputAmount} onKeyDown={fetchPaymentIntent}></input>
                </div>
                <button className="mt-6 mx-[-1px] shadow shadow-red-700 redaccent rounded-sm py-1" onClick={fetchPaymentIntent}>Continue</button>
                <div className={`${notNumberError ? "absolute flex flex-row mt-[5.5rem] ml-[375px]" : "hidden"}`}>
                <div className="absolute right-[-1.8px] text-red-500 text-sm">◀</div>
                        <span className="absolute bg-red-500 text-white text-xs rounded py-1 px-2 w-[110px]">{notNumberError}</span>
                </div>
                <div className="py-2 mt-4 font-medium text-gray-100">Or select an amount</div>
                <div className="grid prices-grid">
                    {
                        suggestedDeposits.map((e:number) => 
                            <button className="redaccent rounded-sm px-12 py-1 text-gray-200 text-sm shadow shadow-red-700 hover:shadow-red-600" value={e} onClick={(t: any) => setInputAmount(t.target.value)}>{e}$</button>
                        )
                    }
                </div>
            </div>
            {clientSecretState && loadingTimer && ( 
                <Elements options={options} stripe={stripePromise}>
                    <div className={loadingTimer ? "w-96 mt-32 text-black mx-auto" : "hidden"}>
                        <PayButton currency={matchingObjectKey} amount={inputAmount} value='e'></PayButton>
                        <div className={`${paymentResponse ? "visible" : "hidden"}`}>{paymentResponse}</div>
                    </div>
                </Elements>
                )}
            </div> : 
            <div></div>)}
            <div className={`${paymentResponse ? 'absolute start-0 top-[95%] animate-show-error w-fit px-1 py-2 my-auto mx-auto justify-center items-center rounded-sm border-[1px] border-red-700 redaccent font-semibold text-sm' : 'right-[-100px] mt-10 hiddenError'}`}>{paymentResponse}</div>
        </main>
    )
}