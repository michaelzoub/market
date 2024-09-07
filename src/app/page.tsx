'use client'
import Image from "next/image";
import { useState, useRef } from 'react'
import Link from "next/link";

//this array would have ITEM name, image url, condition etc, price and add cart function
const array = ['','','','','','','','','','','','','','','','','','','','','','','','','']
const heroes = ['Shiv','Seven','McGinnis']
const fakeItems = [{id:0, price: 1, hero: 'Shiv', imgurl: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFQznaKdID5D6d23ldHSwKOmZeyEz21XvZZ12LzE9t6nigbgqkplNjihJIaLMlhpF1ZeR5c/360fx360f', rarity: 'common'}, {id:1, price: 1000, hero: 'Seven', imgurl: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsQ1xmLBcF5uj2FBdy3P7HTjlH09G_hoGMkrmkNuODwG8F7ZMl2bqSoI_22ATg_0s6a2qiIofDdA5rNVmG8la5k7i6m9bi60_Jt_x9/360fx360f', rarity: 'common'}, {id:2, price: 2, hero: 'shiv', imgurl: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFQznaKdID5D6d23ldHSwKOmZeyEz21XvZZ12LzE9t6nigbgqkplNjihJIaLMlhpF1ZeR5c/360fx360f', rarity: 'common'}]

let temp: any = [] //this is where filters are stored until reload


// set up feature that adds item params (hero, rarity, type) to lambda obj / storage / cookies and sends to kotlin onclick

export default function Home() {
  const [filter, setFilter] = useState(false)
  const [filterPlus, setFilterplus] = useState(false)
  const [filterRarity, setFilterRarity] = useState(false)
  const [addCartButtonColor, setAddCartButtonColor] = useState(null)

  const [checkedHeroes, setCheckedHeroes] = useState<string[]>([])
  const [checkedGeneral, setCheckedGeneral] = useState(false)

  const [inCart, setInCart] = useState<string[]>([])

  const [pricerange, setPricerange] = useState(0)

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
    setPricerange(e.target.value)
    console.log('price range:',pricerange)
    console.log(fakeItems.filter((test:any) => test.price > pricerange))
    if (fakeItems.find((test:any) => test.price < pricerange)) {
      console.log('under target price')
    } else {
      console.log('in the bounds')
      let test = fakeItems.filter((test:any) => test.price > pricerange)
      console.log('test:', test)
      let test2 = test.map((e) => e.hero)
      console.log('for each try:', test.map((e) => e.hero))
      setCheckedGeneral(true)
      setCheckedHeroes(test2)
      console.log('checked heroes:',checkedHeroes)
    }
  }

  function infinity() {
//copy fixed code above and inverse
  }

  function itemSearch() {
    //add search for item functionality 
  }

  return (
    <main className="flex min-h-screen flex-row items-center bgblack gap-8 text-white overflow-hidden">

      <div className="flex flex-row mx-auto h-screen">
      <div className="flex-col w-fit">
      <div className="flex flex-row justify-between mt-20 tradebox p-2 rounded-md">
        <div className="">You are offering:</div>
        <div className="">C$ 21 🛒</div>
      </div>
      <div className="flex flex-col p-2 tradebox h-[85%] mt-3 rounded-md">
      <input className="w-full px-2 m-1 mb-2 mx-auto rounded-md searchbg " placeholder="⌕ Search"></input>
      <div className="grid grid-cols-1 overflow-auto gap-2 md:grid-cols-3">
        {array.map((e) => 
        <div className="w-32 h-32 insidebox rounded-md shadow-inner">{e}</div>
        )}
      </div>
      </div>
      </div>

      <div className="flex flex-col gap-8 mt-20 mx-8 pt-8 p-1 h-[90%] filterbg rounded-md">
        <button className="mx-auto rounded-md redaccent py-[10px] text-sm shadow-inner text-lg w-[65%]">TRADE</button>
        <div className="text-center">Filter</div>
        <div className="mx-auto flex flex-col  w-50 p-1 rounded-md text-center gap-4 md:w-62">
          <div className="text-left flex flex-col w-full gap-4 divide-y-2">Price
            <div className="flex flex-row gap-6 mx-auto text-white">
              <input className="rounded-md text-center w-28 searchbg "  placeholder="C $0" value={pricerange} onChange={zero}></input>
              <input className="rounded-md text-center w-28 searchbg " placeholder="C $∞"></input>
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
        <button onClick={clearFilterButton}>Clear</button>
        <button onClick={handleSendToApiFilter}></button>
      </div>

      <div className=" flex-col">
      <div className="flex flex-row justify-between mt-20 insidebox p-2 rounded-md">
        <div className="">You are getting:</div>
        <div className="">C$ 21 🛒</div>
      </div>
      <div className="flex flex-col overflow-auto p-2 tradebox h-[85%] mt-3 rounded-md">
      <input className="w-full px-2 m-1 mb-2 mx-auto rounded-md searchbg " placeholder="⌕ Search"></input>
      <div className="grid overflow-auto gap-2 grid-cols-1 md:grid-cols-3">
        {fakeItems.map((e) => 
          <div className={`${checkedGeneral ? `${checkedHeroes.includes(e.hero) ? 'w-32 h-32 px-1 insidebox rounded-sm shadow-inner border-2 borderinsidebox hover:bg-zinc-500 hover:border-blue-500' : 'hidden'}` : 'w-32 h-32 px-1 insidebox rounded-sm shadow-inner border-2 borderinsidebox hover:bg-zinc-500 hover:border-blue-500'}`}><Image src={e.imgurl} alt='img' width={90} height={90} className="mx-auto"></Image>
            <button className={`${inCart.includes(`${e.id}`)? 'text-white justify-end redhoveraccent w-full rounded-md' : 'text-white justify-end bg-zinc-600 w-full rounded-md transition ease-in-out delay-150 hover:bg-red-300'}`} onClick={addToCart} value={e.id}>🛒</button>
          </div>
        )}
      </div>
      </div>
      </div>
      </div>
    </main>
  );
}
