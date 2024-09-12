'use client'
import Link from "next/link";
import Image from "next/image";
import steam from '/public/steam-1.svg'
import usa from '/public/United-states_flag_icon_round.svg.png'
import brazil from '/public/Brazilian_Flag_-_round.svg.png'
import china from '/public/china.png'
import dlockbanner from '/public/bannerdlock.png'
import { useState, createContext, useContext } from "react";
import { cookies } from "next/headers";
import { LanguageContext } from "./components/LanguageContext";
import { CurrencyContext } from "./components/CurrencyContext";
import { languagesnavbar } from "./components/languages";

export function Navbar({children}:any) {
	//update language and currency method, useEffect -> set as cookie if exists, else 

	const currencies = [
		{ code: 'USD', symbol: '$', combo: 'USD $' },
		{ code: 'EUR', symbol: '€', combo: 'EUR €' },
		{ code: 'JPY', symbol: '¥', combo: 'JPY ¥' },
		{ code: 'CNY', symbol: '¥', combo: 'CNY ¥' },
		{ code: 'BRL', symbol: 'R$', combo: 'BRL R$' },
	];

	const languages = [
		{ code: 'EN', name: 'English', flag: usa },
		{ code: 'PT', name: 'Portuguese', flag: brazil },
		{ code: 'CH', name: 'Chinese', flag: china },
	];

	const [openDropdown, setOpenDropdown] = useState<'language' | 'currency' | null>(null)
	//use cookies
	const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])
	const [selectedLanguage, setSelectedLanguage] = useState({ code: 'EN', name: 'English', flag: usa });
	//const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  	const [loginClick, setLoginClick] = useState(false)

	const toggleDropdown = (dropdown: 'language' | 'currency') => {
		setOpenDropdown(openDropdown === dropdown ? null : dropdown)
	}

  const [sidebar, setSidebar] = useState(false)
  const [showBar, setShowBar] = useState(false)
  const [heightCheck, setHeightCheck] = useState(false)

	function performLanguageChangeSetCookies() {
		//set cookie (language)
	}


    function sideBar() {
      if (sidebar) {
        setHeightCheck(false)
        setShowBar((e) => !e)
        setTimeout(()=> {
          setSidebar((e) => !e)
        }, 1000)
      } else {
      setHeightCheck(true)
      setSidebar((e) => !e)
      setTimeout(()=> {
        setShowBar((e) => !e)
      }, 300);
    }
    }

    function loginClickHandle() {
      //perform api handling
      setLoginClick(true)
    }

	let array: Array<String> = [];
	let language = useContext(LanguageContext)
	if (selectedLanguage.name === "English") {
	  console.log('english hit')
	  array = languagesnavbar.English
	  console.log(array)
	} if (selectedLanguage.name == "Portuguese") {
	  console.log('portuguese hit')
	  array = languagesnavbar.Portuguese
	  console.log(array)
	} if (selectedLanguage.name == "Chinese") {
	  array = languagesnavbar.Chinese
	}



	return (
		<CurrencyContext.Provider value={selectedCurrency.combo}>
		<LanguageContext.Provider value={selectedLanguage.name}>
		<nav className={`${sidebar? 'absolute flex flex-row overflow-hidden text-white w-full h-screen md:h-16' : `absolute flex flex-row text-white w-full overflow-x-hidden ${heightCheck ? 'h-screen' : 'h-16'} md:h-16 md:overflow-visible`}`}>
			<div className="invisible md:visible md:w-full flex justify-between text-sm">
      <div className="flex items-center space-x-10 ml-4">
				<Link href="/" className="hover:cursor-pointer mr-6">
					<Image src={dlockbanner} alt="Dlock Banner" width={140} height={60} />
				</Link>
				<Link href="/market" className="nav-tab font-bold pt-1 text-gray-500 text-sm">{array[0]}</Link>
				<Link href="/trade" className="nav-tab font-bold pt-1 text-gray-500 text-sm">{array[1]}</Link>
				<Link href="/faq" className="nav-tab font-bold pt-1 text-gray-500 text-sm">{array[2]}</Link>
			</div>
			<div className="flex items-center mr-4">
				<div className="relative">
					<button 
						className="flex items-center mx-4 text-gray-500 hover:text-white transition-colors duration-200" 
						onClick={() => toggleDropdown('language')}
					>
						<Image src={selectedLanguage.flag} alt={selectedLanguage.name} width={25} height={25} className="mr-2" />
						<span className="mr-1">{selectedLanguage.code}</span>
						<svg 
							className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'language' ? 'rotate-180' : ''}`} 
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24" 
							xmlns="http://www.w3.org/2000/svg"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					{openDropdown === 'language' && (
						<div className="absolute mt-2 w-40 bg-[#1C1F29] rounded-md shadow-lg py-1 text-gray-500">
							{languages.map((language, index) => (
								<button 
									key={index} 
									className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-700 hover:text-white transition-colors duration-200"
									onClick={() => {
										setSelectedLanguage(language);
										setOpenDropdown(null);
									}}
								>
									<Image src={language.flag} alt={language.name} width={20} height={20} className="mr-2" />
									{language.name}
								</button>
							))}
						</div>
					)}
				</div>
				<div className="relative">
					<button 
						className="flex items-center mx-4 text-gray-500 hover:text-white transition-colors duration-200" 
						onClick={() => toggleDropdown('currency')}
					>
						<span className="mr-1">{selectedCurrency.code}</span>
						<svg 
							className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'currency' ? 'rotate-180' : ''}`} 
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24" 
							xmlns="http://www.w3.org/2000/svg"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					{openDropdown === 'currency' && (
						<div className="absolute mt-2 w-32 bg-[#1C1F29] rounded-md shadow-lg py-1 text-gray-500">
							{currencies.map((currency, index) => (
								<button 
									key={index} 
									className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-700 hover:text-white transition-colors duration-200"
									onClick={() => {
										setSelectedCurrency(currency);
										setOpenDropdown(null);
									}}
								>
									{currency.code} {currency.symbol}
								</button>
							))}
						</div>
					)}
				</div>
				<button onClick={loginClickHandle} className="login-button flex items-center px-6 py-2 text-sm font-bold">
					<Image src={steam} alt='steam' width={20} height={20} className="mr-2 invert" />
					Login
				</button>
			</div>
      </div>

      <div className={`${sidebar? 'absolute flex w-full flex-row justify-end h-screen md:hidden' : 'transition delay-150 flex w-full h-0 flex-row justify-end md:hidden'}`}>
          <div className="flex flex-col w-full">
            <button className={`${sidebar? 'z-20 absolute end-0 text-end m-4 text-red-400' : 'absolute end-0 text-end m-4'}`} onClick={sideBar}>═</button>
            <div className={`${sidebar? 'z-10 flex flex-row h-screen justify-end w-full transition ease-in-out delay-150 backdrop-blur' : 'w-full navbarblur'}`}>
            <div className={`${showBar? 'z-10 flex flex-col gap-4 animate-show w-[100%] tradebox h-screen pt-14 text-left px-4' : 'hiddenLogin flex flex-col gap-4 w-[100%] h-screen tradebox pt-14 px-4'}`}>
              <div className="mx-auto flex flex-row text-xl hover:cursor-pointer font-bold">d<span className="text-red-500">lock</span>.shop</div>
              <button onClick={loginClickHandle} className="login-button flex items-center px-6 py-2 text-sm font-bold mx-auto hover:redhoveraccenttext">
					      <Image src={steam} alt='steam' width={20} height={20} className="mr-2 invert" />
					      Login
			  </button>
              <div className="border-2 border-red-400 p-1 pl-3 rounded-md hover:text-red-400 hover:cursor-pointer">Market</div>
              <div className="border-2 border-red-400 p-1 pl-3 rounded-md hover:text-red-400 hover:cursor-pointer">Trade</div>
              <div className="border-2 border-red-400 p-1 pl-3 rounded-md hover:text-red-400 hover:cursor-pointer">FAQ</div>
            </div>
            </div>
          </div>
      </div>
		</nav>
		{children}
		</LanguageContext.Provider>
		</CurrencyContext.Provider>
	);
}