'use client'
import Link from "next/link";
import Image from "next/image";
import steam from '/public/steam-1.svg'
import usa from '/public/United-states_flag_icon_round.svg.png'
import brazil from '/public/Brazilian_Flag_-_round.svg.png'
import china from '/public/china.png'
import dlockbanner from '/public/bannerdlock.png'
import { useState, useEffect } from "react";
import { LanguageContext } from "./utils/LanguageContext";
import { CurrencyContext } from "./utils/CurrencyContext";
import { UserprofilepicContext, UsernameContext, SteamidContext, TotalTradesContext, BalanceContext, TradeLinkContext } from '@/app/utils/UserContext'
import { languagesnavbar } from "./data/languages";
import Deposit from "./components/depositmodal";
import { authorizationUrl } from "./services/openid";
import { useRouter } from 'next/router';

export function Navbar({children}:any) {
	//update language and currency method, useEffect -> set as cookie if exists, else 

	const [openDropdown, setOpenDropdown] = useState<'language' | 'currency' | null>(null)
	const [selectedLanguage, setSelectedLanguage]:any = useState({ code: 'EN', name: 'English', flag: usa });
  	const [loginClick, setLoginClick] = useState(false)
	const [path, setPath] = useState(location.pathname)
	const [loggedInUsername, setLoggedInUsername] = useState("")
	const [loggedInPfp, setLoggedInPfp] = useState("")
	const [loggedInBalance, setLoggedInBalance] = useState("0.0")
	const [balanceTest, setBalanceTest] = useState("")
	const [loggedInSteamId, setLoggedInSteamId] = useState("")
	const [loggedInTransactions, setLoggedInTransactions] = useState("")
	const [loggedInTradeLink, setLoggedInTradeLink] = useState("")
	const [openProfileSettings, setOpenProfileSettings] = useState(false)
	const [profileOpen, setProfileOpen] = useState(false)
	const [languageslength, setLanguageslength] = useState<any>()
	const [languagesSettingClicked, setLanguagesSettingClicked] = useState(false)
	const [tradeLinkWindow, setTradeLinkWindow] = useState(false)
	const [tradeLinkValue, setTradeLinkValue] = useState("")
	const[tradeLinkButtonState, setTradeLinkButtonState] = useState("Set")

	const toggleDropdown = (dropdown: 'language' | 'currency') => {
		setOpenDropdown(openDropdown === dropdown ? null : dropdown)
	}

  const [sidebar, setSidebar] = useState(false)
  const [showBar, setShowBar] = useState(false)
  const [heightCheck, setHeightCheck] = useState(false)

  const languagesArray = [{ code: 'EN', name: 'English', flag: usa }, 
	{ code: 'PT', name: 'Portuguese', flag: brazil }, 
	{ code: 'CH', name: 'Chinese', flag: china }]

  useEffect(() => {
	async function updateBalance() {
		const response = await fetch("http://localhost:8080/api/updatebalance", {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: 'include'
		})
		const body = await response.json()
		console.log(body)
		if (body) {
			setLoggedInBalance(body.toString())
		}
	}
	updateBalance()
  },[balanceTest])

  useEffect(() => {
    setLoggedInUsername("");
    setLoggedInPfp("null");
    setLoggedInBalance("0.0");
	setLoggedInSteamId("null")
	setLoggedInTransactions("")

	setLanguageslength(Object.keys(languagesnavbar).length)

    setPath(location.pathname);

    async function fetchCookies() {
        try {
            const response = await fetch("http://localhost:8080/api/usercookies", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const body = await response.json();
            console.log('response:', body);

            const splitUsername = body[0];
            console.log('response ok:', response.ok);

            if (response.ok) {
                setLoggedInUsername(splitUsername);
                setLoggedInPfp(body[1]);
                setLoggedInBalance(body[2]);
				setLoggedInSteamId(body[3])
				console.log('BODY HERE: ',body)
				setLoggedInTransactions(body[4])
				setLoggedInTradeLink(body[5])
            }
        } catch (error) {
            console.error('Error fetching cookies:', error);
        }
    }

    // Check if path includes '/auth/callback'
    if (window.location.pathname.includes('/auth/callback') || window.location.pathname.includes('')) {
        console.log('Window.location works');
        fetchCookies()
		//window.location.reload()
    }

}, []);

	async function clearCookies() {
		const response = await fetch("http://localhost:8080/api/clearcookies", {
			method: "POST",
			credentials: "include"
		})
		const body = await response.text()
		console.log("cleared cookies:", body)
		setLoggedInBalance("null")
		setLoggedInPfp("null")
		setLoggedInUsername("")
		setLoggedInTransactions("")
		setLoggedInSteamId("")
		window.location.reload()
	}

	function setTradeLinkCookie(e: any) {
		async function sendToServer(tradeLink: string, steamId: string) {
			const response = await fetch("http://localhost:8080/api/add-trade-link", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({tradeLink: tradeLink, steamId: steamId}),
				credentials: "include"
			})
			const tradeLinkCookies = await response.json()
			console.log("Trade link cookies set: ", tradeLinkCookies)
			return tradeLinkCookies
		}

		if (e.key == "Enter" || !e.key) {
			setTradeLinkButtonState("Setting...")
			//turn trade link into array and check if includes wanted fields https://steamcommunity.com/tradeoffer/new/?partner=440715549&token=mB8IC961
			const tradeLinkArray: any = tradeLinkValue.split("?")[1]
			console.log(tradeLinkArray)
			const arrays = tradeLinkArray.split("&")
			const partner = arrays[0].split("=")
			const token = arrays[1].split("=")
			if (!partner.includes("partner") || !token.includes("token")) {
				setTradeLinkButtonState("Error")
				setTimeout(() => {
					setTradeLinkWindow(false)
				}, 600)
			} else {
				setLoggedInTradeLink(tradeLinkValue)
				const serverResponse = sendToServer(tradeLinkValue, loggedInSteamId)
				setTimeout(() => {
					setTradeLinkWindow(false)
				}, 600)
			}
		}
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

	function onTradeBalanceContext(state: any) {
		setBalanceTest(state)
	}

	let array: Array<String> = [];

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


	const [deposit, setDeposit] = useState(false)



	return (
		<UserprofilepicContext.Provider value="test">
		<CurrencyContext.Provider value="$USD">
		<UsernameContext.Provider value={loggedInUsername}>
		<LanguageContext.Provider value={selectedLanguage.name}>
		<SteamidContext.Provider value={loggedInSteamId}>
		<BalanceContext.Provider value={{loggedInBalance, onTradeBalanceContext}}>
		<TradeLinkContext.Provider value={loggedInTradeLink}>
		<TotalTradesContext.Provider value={loggedInTransactions}>
	<nav className={`${sidebar? 'absolute flex flex-row overflow-hidden text-white w-full h-screen md:h-16' : `absolute flex flex-row text-white w-full overflow-x-hidden ${heightCheck ? 'h-screen z-100' : 'h-16'} md:h-16 md:overflow-visible`}`}>
		<div className={`${tradeLinkWindow ? "absolute z-50 w-full h-screen backdrop-blur" : "hidden"}`}>
			<div className={`${tradeLinkWindow ? "z-25 w-fit flex flex-col backdrop-blur mx-auto mt-36 p-10 py-16 rounded-md searchbg gap-2 border-2 border-zinc-600 shadow-inner text-center" : "hidden"}`}>
				<text>Set or change your trade link:</text>
				<input placeholder="Paste your trade link" className="px-[12px] py-[8px] shadow-md shadow-red-600 rounded-sm text-sm bg-[#2B2F3C] border-[1.5px] border-[#e96969]" onChange={(e:any) => setTradeLinkValue(e.target.value)} value={tradeLinkValue} onKeyDown={setTradeLinkCookie}></input>
				<text className="text-sm">You can find your trade link here:</text>
				<div className="flex flex-row gap-2 w-44 justify-between mx-auto">
					<Link href={`https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url`} prefetch={true} target="_blank" className="mx-[-1px] shadow shadow-red-700 redaccent rounded-sm py-[1px] w-20">Link ↗</Link>
					<button className="mx-[-1px] shadow shadow-red-700 redaccent rounded-sm py-[1px] w-20" onClick={setTradeLinkCookie} value={tradeLinkValue}>{tradeLinkButtonState}</button>
				</div>
			</div>
		</div>
		<div className="z-50 fade-in-navbar z-10 invisible md:visible md:w-full flex justify-between text-sm">
      		<div className="flex items-center space-x-6 ml-4">
				<Link href="/" prefetch={true} className="hover:cursor-pointer mr-2">
					<Image src={dlockbanner} alt="Dlock Banner" width={140} height={60} />
				</Link>
				<Link href="/market" prefetch={true} className="z-50 nav-tab font-semibold pt-1 text-gray-500 text-sm hover:text-gray-600">{array[0]}</Link>
				<Link href="/trade" prefetch={true} className="nav-tab  pt-1 font-semibold text-gray-500 text-sm hover:text-gray-600">{array[1]}</Link>
				<Link href="/components/statsimage" prefetch={true} className="nav-tab font-semibold pt-1 text-gray-500 text-sm hover:text-gray-600">{array[2]}</Link>
			</div>
			<div className="flex items-center mr-2">
				<Link href="/payment" prefetch={true} className="z-10 login-button redaccent rounded-sm py-[8px] flex items-center w-[75px] justify-center text-sm mx-1 text-sm" onClick={() => setDeposit(true)}>Deposit</Link>
				<Link href="/payment" prefetch={true} className="z-10 login-button searchbg rounded-sm py-[8px] flex items-center w-[75px] justify-center text-sm mx-1 text-zinc-300 text-sm" onClick={() => console.log('add withdraw')}>Withdraw</Link>
				<Link href="/payment" prefetch={true} className="z-10 login-button searchbg rounded-sm py-[8px] px-[5px] flex items-center w-fit justify-center text-sm mx-2 text-zinc-300 text-sm truncate ">${loggedInBalance?.includes("null") ? '0' : loggedInBalance}</Link>
				<Link href={authorizationUrl} prefetch={true} className={`${loggedInUsername ? "hidden" : "relative login-button flex items-center mx-3 w-16 py-1 text-sm font-bold rounded-sm"}`}>
					<Image src={steam} alt='steam' width={20} height={20} className={`mr-1 invert`} />
					Login
				</Link>
				<button className={`${!loggedInUsername.includes("null") ? "flex flex-col login-button searchbg flex items-center mx-3 mr-6 w-18 py-1 text-sm font-bold rounded-sm" : "hidden"}`}>
					<div className="flex flex-row">
						<Image src={loggedInPfp.includes("null") ? '' : loggedInPfp} alt="User's profile picture" width={30} height={30} className={`${loggedInPfp.includes("null")? "hidden" : "rounded-sm my-auto mx-[3px]"}`}></Image>
						<button className={`${loggedInUsername ? 'mx-2 max-w-fit h-[100A%]' : 'hidden'}`} onClick={() => setOpenProfileSettings((prev:any) => !prev)}>
							<div className={`${openProfileSettings ? "transition-transform duration-150 rotate-180 h-2" : "w-fit h-2 transition-transform duration-150"}`} onClick={() => setProfileOpen((e) => !e)}>
								<svg className="visible" width="18" height="9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 12">
									<path d="M0 0 L9 9 L18 0" fill="none" stroke="gray" stroke-width="3"></path>
								</svg>
							</div>
							<div className="hidden">{loggedInBalance}</div>
						</button>
					</div>
					<div className={`${openProfileSettings ? languagesSettingClicked ? "absolute mr-[286px] mt-[52px] flex flex-col border-[1px] border-zinc-700 searchbg px-1 py-1 text-sm font-normal rounded-md shadow-inner text-gray-200" : "hidden" : "hidden"}`} onMouseLeave={() => setLanguagesSettingClicked(false)}>
										<button className="text-white text-left rounded-md w-full py-1 px-2 hover:cartbutton hover:text-indigo-400">{languagesArray[0].name}</button>
										<button className="text-white text-left rounded-md w-full py-1 px-2 hover:cartbutton hover:text-indigo-400">{languagesArray[1].name}</button>
										<button className="text-white text-left rounded-md w-full py-1 px-2 hover:cartbutton hover:text-indigo-400">{languagesArray[2].name}</button>
					</div>
					<div className={`absolute top-full w-36 mt-[-7px] ml-[-29.8px] transition-max-height duration-150 overflow-hidden ${openProfileSettings ? "" : "max-h-0"}`}>
						<div className={`${openProfileSettings ? "flex flex-col searchbg px-1 py-1 text-sm font-normal rounded-md shadow-inner text-gray-200 border-[1px] border-zinc-700" : "hidden"}`}>
								<Link href={`http://localhost:3000/${loggedInSteamId}/transaction`} prefetch={true} className="text-left rounded-md w-full py-1 px-2 hover:cartbutton hover:text-indigo-400">Transactions</Link>
								<button className="text-left rounded-md w-full py-1 px-2 hover:cartbutton hover:text-indigo-400" onClick={() => setTradeLinkWindow(curr => !curr)}>Trade link</button>
								<button className="text-left rounded-md w-full py-1 px-2 hover:cartbutton hover:text-indigo-400" onMouseEnter={() => setLanguagesSettingClicked(true)}>Languages</button>
								<button className="text-left rounded-md w-full py-1 px-2 text-red-400 hover:cartbutton" onClick={clearCookies}>Logout</button>
						</div>
					</div>
				</button>
			</div>
      </div>

		<div className={`${sidebar? 'absolute flex w-full flex-row justify-end h-screen md:hidden' : 'transition delay-150 flex w-full h-0 flex-row justify-end md:hidden'}`}>
			<div className="flex flex-col w-full">
				<button className={`${sidebar? 'z-20 absolute end-0 text-end m-4 text-red-400' : 'absolute end-0 text-end m-4'}`} onClick={sideBar}>═</button>
				<div className={`${sidebar? 'z-10 flex flex-row h-screen justify-end w-full transition ease-in-out delay-150 backdrop-blur' : 'w-full navbarblur'}`}>
				<div className={`${showBar? 'z-10 flex flex-col gap-2 animate-show w-[100%] tradebox h-screen pt-14 text-left px-4' : 'hiddenLogin flex flex-col gap-2 w-[100%] h-screen tradebox pt-14 px-4'}`}>
				<div className="mx-auto flex flex-row text-xl hover:cursor-pointer font-bold">d<span className="text-red-500">lock</span>.shop</div>
				<Link href={authorizationUrl} prefetch={true} className={`${loggedInUsername ? "hidden" : "login-button flex items-center px-6 py-2 text-md font-bold mx-auto"}`}>
							<Image src={steam} alt='steam' width={20} height={20} className="mr-2 invert" />
							Login
				</Link>
				<div className="rounded-md p-1 pl-3 hover:cartbutton">Transactions</div>
				<div className="rounded-md p-1 pl-3 hover:cartbutton" onClick={() => setTradeLinkWindow(curr => !curr)}>Trade link</div>
				<div className="rounded-md p-1 pl-3 text-red-400 hover:text-red-500 hover:cartbutton" onClick={clearCookies}>Logout</div>
				</div>
				</div>
			</div>
		</div>
	</nav>
		{children}
		</TotalTradesContext.Provider>
		</TradeLinkContext.Provider>
		</BalanceContext.Provider>
		</SteamidContext.Provider>
		</LanguageContext.Provider>
		</UsernameContext.Provider>
		</CurrencyContext.Provider>
		</UserprofilepicContext.Provider>
	);
}