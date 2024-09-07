'use client'
import Link from "next/link";
import Image from "next/image";
import * as steam from '/public/steam-1.svg'
import * as usa from '/public/United-states_flag_icon_round.svg.png'
import * as brazil from '/public/Brazilian_Flag_-_round.svg.png'
import * as spanish from '/public/Spain_flag_icon.svg.png'
import { useState } from "react";

export function Navbar() {
    const [languagearrow, setLanguagearrow] = useState(false)
    const [loginClick, setLoginClick] = useState(false)
    const [sidebar, setSidebar] = useState(false)
    const [showBar, setShowBar] = useState(false)

    const [heightCheck, setHeightCheck] = useState(false)

    function sideBar() {
      if (sidebar) {
        setHeightCheck(false)
        setShowBar((e) => !e)
        setTimeout(()=> {
          setSidebar((e) => !e)
        }, 400)
      } else {
      setHeightCheck(true)
      setSidebar((e) => !e)
      setTimeout(()=> {
        setShowBar((e) => !e)
      }, 300);
    }
    }


    function languageClick() {
        languagearrow ? setLanguagearrow(false) : setLanguagearrow(true)
    }

    function loginClickHandle() {
      //perform api handling
      setLoginClick(true)
    }
    return (
        <main className={`${sidebar? 'absolute flex flex-row justifiy-center overflow-hidden text-white w-full h-screen md:h-16' : `absolute flex flex-row justifiy-center overflow-hidden text-white w-full ${heightCheck ? 'h-screen' : 'h-16'} md:h-16`}`}>
          <div className="hidden md:w-full">
          <div className="hidden md:flex flex-row h-16 w-full justify-between">
          <div className="flex flex-row">
          <div className="flex flex-row ml-14 text-lg my-auto hover:cursor-pointer font-bold">d<span className="text-red-500">lock</span>.shop</div>
          <div className="flex flex-row ml-10 my-auto hover:text-red-400 hover:cursor-pointer">Market</div>
          <div className="flex flex-row mx-4 my-auto hover:text-red-400 hover:cursor-pointer">Trade</div>
          <div className="flex flex-row my-auto hover:text-red-400 hover:cursor-pointer">FAQ</div>
          </div>
          <div className="flex flex-row">
          <button className="flex my-auto mx-8" onClick={languageClick}><Image className="mx-2 my-auto" src={usa} alt='english' width={25} height={25}></Image>
            {languagearrow ? '⇑' : '⇓'}
          </button>
            <div className={`${languagearrow ? 'animate-show absolute mt-12 flex flex-col w-fit insidebox h-fit rounded-md p-1 px-3 border-[1px] border-zinc-700 gap-3' : 'hidden'}`}>
                <div className="flex flex-row"><Image className="mx-2 my-auto" src={brazil} alt='english' width={23} height={25}></Image>Portuguese</div>
                <div className="flex flex-row"><Image className="mx-2 my-auto" src={brazil} alt='english' width={23} height={25}></Image>Portuguese</div>
                <div className="flex flex-row"><Image className="mx-2 my-auto" src={spanish} alt='spanish' width={23} height={25}></Image>Spanish</div>
            </div>
            <button onClick={loginClickHandle} className="flex mr-4 px-6 pr-8 rounded-2xl redaccent h-7 text-sm my-auto"><div className="flex flex-row my-auto"><Image className="mx-1" src={steam} alt='steam' width={20} height={20}></Image>LOGIN</div></button>
            </div>
            </div>
            </div>

            <div className={`${sidebar? 'flex w-full flex-row justify-end h-screen md:hidden' : 'transition delay-150 flex w-full h-0 flex-row justify-end md:hidden'}`}>
              <div className="flex flex-col w-full">
              <button className={`${sidebar? 'z-20 absolute end-0 text-end m-4 text-red-400' : 'absolute end-0 text-end m-4'}`} onClick={sideBar}>═</button>
              <div className={`${sidebar? 'z-10 flex flex-row h-screen justify-end w-full transition ease-in-out delay-150 backdrop-blur' : 'navbarblur'}`}>
              <div className={`${showBar? 'z-10 flex flex-col gap-4 animate-show w-[40%] tradebox h-screen pt-14 text-left px-4' : 'hiddenLogin flex flex-col gap-4 w-[40%] h-screen tradebox pt-14 px-4'}`}>
                <div className="mx-auto flex flex-row text-xl hover:cursor-pointer font-bold">d<span className="text-red-500">lock</span>.shop</div>
                <button onClick={loginClickHandle} className="flex px-6 pr-8 mb-6 rounded-md shadow-inner redaccent h-7 text-sm"><div className="flex flex-row my-auto mx-auto"><Image className="mx-1" src={steam} alt='steam' width={20} height={20}></Image>LOGIN</div></button>
                <div className="border-2 border-red-400 p-1 pl-3 rounded-md hover:text-red-400 hover:cursor-pointer">Market</div>
                <div className="border-2 border-red-400 p-1 pl-3 rounded-md hover:text-red-400 hover:cursor-pointer">Trade</div>
                <div className="border-2 border-red-400 p-1 pl-3 rounded-md hover:text-red-400 hover:cursor-pointer">FAQ</div>
              </div>
              </div>
            </div>
            </div>
        </main> 
      );
}