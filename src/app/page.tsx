'use client'
import Image from "next/image";
import { useState, useRef } from 'react'
import Link from "next/link";

//this array would have ITEM name, image url, condition etc, price and add cart function
const array = ['','','','','','','','','','','','','','','','','','','','','','','','','']
const heroes = ['Shiv','Seven','McGinnis']
const fakeItems = [{id:0, price: 1, hero: 'Shiv', imgurl: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFQznaKdID5D6d23ldHSwKOmZeyEz21XvZZ12LzE9t6nigbgqkplNjihJIaLMlhpF1ZeR5c/360fx360f', rarity: 'common'}, {id:1, price: 1000, hero: 'Seven', imgurl: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsQ1xmLBcF5uj2FBdy3P7HTjlH09G_hoGMkrmkNuODwG8F7ZMl2bqSoI_22ATg_0s6a2qiIofDdA5rNVmG8la5k7i6m9bi60_Jt_x9/360fx360f', rarity: 'common'}, {id:2, price: 2, hero: 'shiv', imgurl: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFQznaKdID5D6d23ldHSwKOmZeyEz21XvZZ12LzE9t6nigbgqkplNjihJIaLMlhpF1ZeR5c/360fx360f', rarity: 'common'}, {id:0, price: 1, hero: 'Shiv', imgurl: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFQznaKdID5D6d23ldHSwKOmZeyEz21XvZZ12LzE9t6nigbgqkplNjihJIaLMlhpF1ZeR5c/360fx360f', rarity: 'common'}, {id:1, price: 1000, hero: 'Seven', imgurl: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsQ1xmLBcF5uj2FBdy3P7HTjlH09G_hoGMkrmkNuODwG8F7ZMl2bqSoI_22ATg_0s6a2qiIofDdA5rNVmG8la5k7i6m9bi60_Jt_x9/360fx360f', rarity: 'common'}, {id:2, price: 2, hero: 'shiv', imgurl: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFQznaKdID5D6d23ldHSwKOmZeyEz21XvZZ12LzE9t6nigbgqkplNjihJIaLMlhpF1ZeR5c/360fx360f', rarity: 'common'}]

let temp: any = [] //this is where filters are stored until reload


// set up feature that adds item params (hero, rarity, type) to lambda obj / storage / cookies and sends to kotlin onclick

export default function Home() {
  const [filter, setFilter] = useState(false)
  const [filterPlus, setFilterplus] = useState(false)
  const [filterRarity, setFilterRarity] = useState(false)
  const [addCartButtonColor, setAddCartButtonColor] = useState(null)
  const [signed, setSigned] = useState(false)

  const [checkedHeroes, setCheckedHeroes] = useState<string[]>([])
  const [checkedGeneral, setCheckedGeneral] = useState(false)

  const [inCart, setInCart] = useState<string[]>([])

  const [smallRange, setSmallRange] = useState<number>(0)
  const [bigRange, setBigRange] = useState<number>(0)

  function filterFunc() {
    filter ? setFilter(false) : setFilter(true)
  }
  function filterPlusFunc() {

  }

  function checkboxFilter(e:any) {
    //add all object (id, hero, price, etc)
    let hero = e.target.value 
    if (e.target.checked) {
      // Add checked hero to the array
      setCheckedGeneral(true)
      setCheckedHeroes((prevHeroes) => [...prevHeroes, hero]);
      
    } else {
      setCheckedHeroes((prevHeroes) => prevHeroes.filter((h) => h !== hero));
      if (checkedHeroes.length == 0) {
        setCheckedGeneral(false)
      }
    }
  }

  function clearFilterButton() {
    setCheckedGeneral(false)
    setCheckedHeroes([])
  }

  const object = {
    hero: checkedHeroes
  }

  async function signedIn() {
    //verify if user is signed in through cookies
    setSigned(true)
  }

  async function handleSendToApiFilter() {
    console.log(checkedHeroes)
    const response = await fetch('http://localhost:8080/api/filterFunc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(object)
    }
    )

    console.log(response.body)
  }

  function addToCart(e: any) {
    let temp = e.target.value 
    if (inCart.includes(temp)) {
      setInCart((prev) => inCart.filter((e) => e !== temp))
    } else {
      setInCart((prev) => [...prev, temp])
    }
  }


  function zero(e: any) {
    //check tomorrow (drunk)
    setSmallRange(e.target.value)
    console.log(smallRange)
  }

  function infinity(e:any) {
//copy fixed code above and inverse
setBigRange(e.target.value)
console.log(bigRange)
  }

  function itemSearch() {
    //add search for item functionality 
  }

  return (
    <main className="z-10 flex min-h-screen flex-row items-center bgblack gap-8 text-white overflow-auto">
      <div className="flex flex-row mx-auto w-[85%]">
      <div className="flex mx-auto h-screen w-full">
      <div className="flex-col w-full">
      <div className="flex flex-row justify-between mt-20 insidebox p-2 rounded-md">
        <div className="">You are getting:</div>
        <div className="">C$ 21 🛒</div>
      </div>
      <div className="overflow-auto p-2 tradebox h-[85%] mt-3 rounded-md">
      <input className="w-full px-2 m-1 mb-2 mx-auto rounded-md searchbg" placeholder="⌕ Search"></input>
      <div className="grid gap-2 items-grid">
        {fakeItems.map((e) => 
          <div className={`${checkedGeneral ? `${checkedHeroes.includes(e.hero) && fakeItems.some(e => e.price < 100 && e.price > smallRange) ? 'flex flex-col h-full w-full pb-1 px-1 insidebox rounded-sm shadow-inner border-2 borderinsidebox hover:bg-zinc-500 hover:border-blue-500' : 'hidden'}` : 'flex flex-col h-full w-full px-1 insidebox rounded-sm shadow-inner border-2 borderinsidebox pb-1 hover:bg-zinc-500 hover:border-blue-500'}`}><Image src={e.imgurl} alt='img' width={120} height={80} className="mx-auto"></Image>
            <button className={`${inCart.includes(`${e.id}`)? 'text-white justify-end redhoveraccent w-full rounded-md' : 'w-full text-white h-fit justify-end bg-zinc-600 w-full rounded-md transition ease-in-out delay-150 hover:bg-red-300'}`} onClick={addToCart} value={e.id}>ADD</button>
          </div>
        )}
      </div>
      </div>
      </div>

      <div className="flex flex-col mx-5 rounded-md w-fit">
        <button className="mt-20 mx-auto rounded-md redaccent py-[10px] text-sm shadow-inner text-lg w-[65%]">TRADE</button>
        <div className="justify-between flex flex-col filterbg h-[85%] rounded-md p-2 mt-3 overflow-auto">
        <div className="mx-auto flex flex-col p-1 mt-3 rounded-md text-center gap-4">
          <div className="text-center">Filter</div>
          <div className="text-left flex flex-col w-full gap-4 divide-y-2">Price
            <div className="flex flex-row gap-6 mx-auto text-white">
              <input className="rounded-md text-center w-14 searchbg sm:w-28"  placeholder="C $0" value={smallRange} onChange={zero}></input>
              <input className="rounded-md text-center w-14 searchbg sm:w-28" placeholder="C $∞" value={bigRange} onChange={infinity}></input>
            </div>
          </div>
          <button onClick={()=> setFilterplus(!filterPlus)} className="justify-between flex flex-row"><div className="">Heroes</div><div>{filterPlus? '-' : '+'}</div></button>
          <div className={`${filterPlus? 'mt-[-10px] visible w-full text-left text-sm' : 'hidden'}`}>
            {heroes.map((e) => 
          <div className="flex flex-row">
            <input type="checkbox" checked={checkedHeroes.includes(e)} className="mx-2 mr-3" onChange={checkboxFilter} value={e}></input>
            <div>{e}</div>
          </div>
            )}
          </div>

          <button onClick={()=> setFilterRarity(!filterRarity)} className="justify-between flex flex-row"><div className="">Rarity</div><div>{filterRarity? '-' : '+'}</div></button>
          <div className={`${filterRarity? 'mt-[-10px] visible w-full text-left text-sm' : 'hidden'}`}>
            <div className="text-blue-400">Common</div>
            <div className="text-green-400">Rare</div>
            <div className="text-red-400">Exotic</div>
          </div>
        </div>
        <button onClick={clearFilterButton} className="mx-auto border-2 border-red-400 px-6 rounded-md">Clear</button>
        </div>
        <button onClick={handleSendToApiFilter}></button>
      </div>

      <div className="flex-col w-full">
      <div className="flex flex-row justify-between mt-20 insidebox p-2 rounded-md">
        <div className="">You are getting:</div>
        <div className="">C$ 21 🛒</div>
      </div>
      <div className="overflow-auto p-2 tradebox h-[85%] mt-3 rounded-md">
      <input className="w-full px-2 m-1 mb-2 mx-auto rounded-md searchbg" placeholder="⌕ Search"></input>
      <div className="grid gap-2 items-grid">
        {fakeItems.map((e) => 
          <div className={`${checkedGeneral ? `${checkedHeroes.includes(e.hero) && fakeItems.some(e => e.price < 100 && e.price > smallRange) ? 'flex flex-col h-full w-full pb-1 px-1 insidebox rounded-sm shadow-inner border-2 borderinsidebox hover:bg-zinc-500 hover:border-blue-500' : 'hidden'}` : 'flex flex-col h-full w-full px-1 insidebox rounded-sm shadow-inner border-2 borderinsidebox pb-1 hover:bg-zinc-500 hover:border-blue-500'}`}><Image src={e.imgurl} alt='img' width={120} height={80} className="mx-auto"></Image>
            <button className={`${inCart.includes(`${e.id}`)? 'text-white justify-end redhoveraccent w-full rounded-md' : 'w-full text-white h-fit justify-end bg-zinc-600 w-full rounded-md transition ease-in-out delay-150 hover:bg-red-300'}`} onClick={addToCart} value={e.id}>🛒</button>
          </div>
        )}
      </div>
      </div>
      </div>
      </div>
      </div>
    </main>
  );
}
