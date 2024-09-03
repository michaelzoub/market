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

    function languageClick() {
        languagearrow ? setLanguagearrow(false) : setLanguagearrow(true)
    }
    return (
        <main className="absolute flex flex-row justify-between w-full h-16 justifiy-center text-white p-2">
          <div className="flex flex-row">
          <div className="flex flex-row mx-2 text-lg my-auto hover:cursor-pointer">d<span className="text-red-500">lock</span>.shop</div>
          <div className="flex flex-row ml-10 my-auto hover:text-red-400 hover:cursor-pointer">Market</div>
          <div className="flex flex-row mx-4 my-auto hover:text-red-400 hover:cursor-pointer">Trade</div>
          <div className="flex flex-row my-auto hover:text-red-400 hover:cursor-pointer">FAQ</div>
          </div>
          <div className="flex flex-row">
          <button className="flex flex-row my-auto mx-8" onClick={languageClick}><Image className="mx-2 my-auto" src={usa} alt='english' width={25} height={25}></Image>
            {languagearrow ? '⇑' : '⇓'}
          </button>
            <div className={`${languagearrow ? 'absolute mt-12 flex flex-col w-fit bg-zinc-700 h-fit rounded-md p-1 px-3 border-[1px] border-zinc-600 gap-3' : 'hidden'}`}>
                <div className="flex flex-row"><Image className="mx-2 my-auto" src={brazil} alt='english' width={23} height={25}></Image>Portuguese</div>
                <div className="flex flex-row"><Image className="mx-2 my-auto" src={brazil} alt='english' width={23} height={25}></Image>Portuguese</div>
                <div className="flex flex-row"><Image className="mx-2 my-auto" src={spanish} alt='spanish' width={23} height={25}></Image>Spanish</div>
            </div>
            <button className="flex flex-row-reverse px-6 pr-8 rounded-md bg-red-400 h-7 text-sm my-auto"><div className="flex flex-row my-auto"><Image className="mx-1" src={steam} alt='steam' width={20} height={20}></Image>LOGIN</div></button>
            </div>
        </main> 
      );
}