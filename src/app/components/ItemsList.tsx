import { fakeItems } from "../utils/fakeitems"
import { useState, useMemo, useContext } from "react"
import Image from "next/image"
import { LanguageContext } from "../utils/LanguageContext"
import { languages } from "../utils/languages"

export default function ItemsList() {
    const [filterGlobal, setFilterGlobal] = useState(false) //checks wether user is filtering
    const [filterPlus, setFilterplus] = useState(false)
    const [filterRarity, setFilterRarity] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchFilter, setSearchFilter] = useState<string[]>([])
    const [searchCondition, setSearchCondition] = useState(false)
    const [checkedHeroes, setCheckedHeroes] = useState<string[]>([])
    const [checkedGlobal, setCheckedGlobal] = useState(false)
    const [smallRange, setSmallRange] = useState<number>(0)
    const [bigRange, setBigRange] = useState<number>(0)
    const [inCart, setInCart] = useState<string[]>([])
    const [cartPrice, setCartPrice] = useState<number>(0)

    function addToCart(e: any) {
        let temp = e.target.value 
        let parsed = parseInt(temp)
        if (inCart.includes(temp)) {
          setInCart((prev) => inCart.filter((e) => e !== temp))
          const find = fakeItems.find(item => item.id === parsed);
          const price: any = find?.price
         setCartPrice((e) => e - price)
        } else {
          setInCart((prev) => [...prev, temp])
          //find id and then price
          const find = fakeItems.find(item => item.id === parsed);
          const price: any = find?.price
          setCartPrice((e) => e + price)
        }
      }

      function itemSearch(e:any) {
        //add search for item functionality 
        setSearchTerm(e.target.value)
        let typedText = e.target.value
        setFilterGlobal(true)
        setSearchCondition(true)
        if (typedText == '') {
          setSearchFilter([])
          setSearchCondition(false)
        } else {
        const updatedCheckedHeroes = fakeItems.filter(hero => hero.hero.toLowerCase().includes(searchTerm.toLowerCase()));
        console.log(updatedCheckedHeroes)
        setSearchFilter(updatedCheckedHeroes.map(e => e.hero))
        console.log(searchFilter)
        }
      }

    const isPriceInRange = (price: number) => {
        return (bigRange > 0 || smallRange > 0) ? (price <= bigRange && price >= smallRange) : true;
      };
      
      const matchesFilters = (hero: string) => {
        if (filterGlobal) {
          if (searchCondition) {
            return checkedGlobal ? (checkedHeroes.includes(hero) && searchFilter.includes(hero)) : searchFilter.includes(hero);
          } else {
            return checkedGlobal ? checkedHeroes.includes(hero) : true;
          }
        }
        return true;
      };

    const filteredItems = useMemo(()=> 
        fakeItems.filter(e => 
          isPriceInRange(e.price) && matchesFilters(e.hero)
        ), [fakeItems, checkedGlobal, checkedHeroes, smallRange, bigRange, searchCondition, filterGlobal, searchFilter, isPriceInRange, matchesFilters]
      )

      let array = [''];

      let language = useContext(LanguageContext)
      if (language.toString() === "English") {
        console.log('english hit')
        array = languages.English
        console.log(array)
      } if (language.toString() == "Portuguese") {
        console.log('portuguese hit')
        array = languages.Portuguese
        console.log(array)
      } if (language == "Chinese") {
        array = languages.Chinese
      }

      return (
        <div className="flex-col w-full mt-4 md:mt-0 fade-in-largecontainer">
        <div className="flex flex-row justify-between mt-20 insidebox p-2 rounded-sm">
          <div className="">{array[13]}</div>
          <div className="whitespace-nowrap">$USD{cartPrice} 🛒</div>
        </div>
        <div className="overflow-auto p-2 tradebox h-[85%] mt-3 rounded-sm">
        <input className="w-full px-2 m-1 mb-2 mx-auto rounded-sm searchbg" placeholder={`${array[14]}`} onChange={itemSearch} value={searchTerm}></input>
            <div className="grid gap-2 items-grid">
            {filteredItems.map((e) => 
            <div className={`${checkedGlobal ? 'flex flex-col h-full w-full pb-1 px-1 insidebox rounded-sm shadow-inner border-2 borderinsidebox hover:bg-zinc-500 hover:border-yellow-500' : 'flex flex-col h-full w-full px-1 insidebox rounded-sm shadow-inner border-2 borderinsidebox pb-1 hover:bg-zinc-500 hover:border-yellow-500'}`}><Image src={e.imgurl} alt='img' width={120} height={80} className="mx-auto"></Image>
                <div className="my-1 text-sm text-zinc-100">$USD {e.price}</div>
                <button className={`${inCart.includes(`${e.id}`)? 'py-1 text-sm text-white justify-end redaccent rounded-sm' : 'py-1 text-sm text-white h-fit justify-end cartbutton w-full rounded-sm transition ease-in-out delay-150 hover:bg-red-300'}`} onClick={addToCart} value={e.id}>🛒</button>
            </div>
            )}
            </div>
        </div>
        </div>
      )
}