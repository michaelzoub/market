'use client'
import Image from "next/image";
import { useState } from 'react'

//this array would have ITEM name, image url, condition etc, price and add cart function
const array = ['','','','','','','','','','','']


export default function Home() {
  const [filter, setFilter] = useState(false)
  const [filterPlus, setFilterplus] = useState(false)
  const [filterRarity, setFilterRarity] = useState(false)

  function filterFunc() {
    filter ? setFilter(false) : setFilter(true)
  }
  function filterPlusFunc() {

  }
  return (
    <main className="flex min-h-screen flex-row items-center bg-zinc-800 gap-8 text-white">
      <div className="flex flex-row mx-auto h-[900px]">
      <div className="flex-col w-fit">
      <div className="flex flex-row justify-between mt-20 w-60 bg-zinc-700 p-2 rounded-md">
        <div className="">You are offering:</div>
        <div className="">C$ 21 🛒</div>
      </div>
      <div className="flex flex-col w-60 p-2 bg-zinc-500 h-fit mt-3 rounded-md">
      <input className="w-full px-2 m-1 mb-2 mx-auto rounded-md bg-zinc-600" placeholder="⌕ Search"></input>
      <div className="grid grid-cols-3 grid-rows-3 overflow-scroll gap-2">
        {array.map((e) => 
        <div className="p-8 bg-zinc-600 rounded-md shadow-inner">{e}</div>
        )}
      </div>
      </div>
      </div>

      <div className="flex flex-col gap-8 mt-20 px-4">
        <button className="px-10 rounded-md bg-red-400 p-[6px] text-sm shadow-inner text-xl">TRADE</button>
        <div className="text-center">Filter</div>
        <div className="mx-auto flex flex-col  w-62 p-1 rounded-md text-center gap-4">
          <div className="text-left flex flex-col w-full gap-4 divide-y-2">Price
            <div className="flex flex-row gap-6 mx-auto text-white">
              <input className="rounded-md text-center w-32 bg-zinc-600"  placeholder="C $0"></input>
              <input className="rounded-md text-center w-32 bg-zinc-600" placeholder="C $∞"></input>
            </div>
          </div>
          <button onClick={()=> setFilterplus(!filterPlus)} className="justify-between flex flex-row"><div className="">Heroes</div><div>{filterPlus? '-' : '+'}</div></button>
          <div className={`${filterPlus? 'mt-[-10px] visible w-full text-left text-sm' : 'hidden'}`}>
            <div>Shiv</div>
            <div>Seven</div>
            <div>McGinnis</div>
          </div>

          <button onClick={()=> setFilterRarity(!filterRarity)} className="justify-between flex flex-row"><div className="">Rarity</div><div>{filterRarity? '-' : '+'}</div></button>
          <div className={`${filterRarity? 'mt-[-10px] visible w-full text-left text-sm' : 'hidden'}`}>
            <div className="text-blue-400">Common</div>
            <div className="text-green-400">Rare</div>
            <div className="text-red-400">Exotic</div>
          </div>
        </div>
      </div>

      <div className=" flex-col">
      <div className="flex flex-row justify-between mt-20 w-60 bg-zinc-700 p-2 rounded-md">
        <div className="">You are getting:</div>
        <div className="">C$ 21 🛒</div>
      </div>
      <div className="flex flex-col w-60 p-2 bg-zinc-500 h-fit mt-3 rounded-md">
      <input className="w-full px-2 m-1 mb-2 mx-auto rounded-md bg-zinc-600" placeholder="⌕ Search"></input>
      <div className="grid grid-cols-3 grid-rows-3 overflow-scroll gap-2">
        {array.map((e) => 
        <div className="p-8 bg-zinc-600 rounded-md shadow-inner border-2 border-zinc-600 hover:bg-zinc-500 hover:border-blue-500">{e}</div>
        )}
      </div>
      </div>
      </div>
      </div>
    </main>
  );
}
