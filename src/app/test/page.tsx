'use client'
import { useState } from "react"

export default function Test() {

    const [animate, setAnimate] = useState(false)

    function animateFunc() {
        if (!animate) {
            setAnimate(true)
            setTimeout(() => {
                setAnimate(false)
            }, 3000)
        } 
    }

    const hero = {
        hero: 'shiv',
        rarity: 'exotic'
    }

     async function handleTest() {
        const response = await fetch('http://localhost:8080/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(hero)
        })
        console.log(response.body)
    }
    return (
        <main className="flex min-h-screen w-full flex-row items-center bgblack gap-8 text-white">

            <div className="hidden absolute">
            <div className="z-50 absolute w-full items-center justify-center">
                <div className="p-8 rounded-md border-2 border-red-400 shadow-inner searchbg text-white font-semibold text-center text-xs text-warp w-36 ml-[225px] mb-[290px]">Dlock.shop factory.</div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="500">
                <defs>
                    <linearGradient id="glow_gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="gray" stopOpacity="1" />
                    <stop offset="100%" stopColor="white" stopOpacity="1" />
                    </linearGradient>
                </defs>
                <defs>
                <filter id="glow">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" /> {/* Apply blur to the alpha channel */}
                    <feMerge>
                        <feMergeNode /> {/* Original shape */}
                        <feMergeNode in="SourceGraphic" /> {/* Glowing effect */}
                    </feMerge>
                </filter>
            </defs>

                <path id="path1" d="M 100 15 L 300 96" stroke="url(#glow_gradient)" stroke-width="2" fill="transparent"/>
                <path d="M 100 100 L 300 100" stroke="white" stroke-width="2" fill="transparent"/>
                <path d="M 100 200 L 300 104" stroke="white" stroke-width="2" fill="transparent"/>

                <path d="M 305 100 L 500 100" stroke="white" stroke-width="2" fill="transparent"></path>

                <g className="animated-circleFinal" filter="url(#glow)">
                    <text className="" fontSize={13} dy="0.5rem" font-family="Inter, sans-serif" font-weight="400" alignmentBaseline="hanging" textAnchor="middle" fill="white">Dlock.shop</text>
                    <circle className="circle-glow" fill="red" filter="url(#glow)" r="3"></circle>  
                </g>

                <g className="animated-circle" filter="url(#glow)">
                    <text className="" fontSize={13} dy="-1em" font-family="Inter, sans-serif" font-weight="400" alignmentBaseline="hanging" textAnchor="middle" fill="white">Cosmetics</text>
                    <circle className="circle-glow" fill="red" filter="url(#glow)" r="3"></circle>
                </g>
                <g className="animated-circle2" filter="url(#glow)">
                    <circle className="circle-glow" fill="red" filter="url(#glow)" r="3"></circle>
                    <text className="" fontSize={13} dy="0.5em" font-family="Inter, sans-serif" font-weight="400" alignmentBaseline="hanging" textAnchor="middle" fill="white">Crypto</text>
                </g>
                <g className="animated-circle3" filter="url(#glow)">
                    <circle className="circle-glow" fill="red" filter="url(#glow)" r="3"></circle>
                    <text className="" fontSize={13} dy="0.5em" font-family="Inter, sans-serif" font-weight="400" alignmentBaseline="hanging" textAnchor="middle" fill="white">Test</text>
                </g>
            </svg>


            </div>

            <div className="w-[800px] mx-auto mb-[80px]">
                <div className="absolute mt-[-50px] mr-[90px] z-20 text-md p-8 rounded-md shadow-inner searchbg border-[1px] border-zinc-700">👾</div>
                <div className="absolute mt-[65px] mr-[90px] z-20 text-md p-8 rounded-md shadow-inner searchbg border-[1px] border-zinc-700">👨‍💻</div>
                <div className="absolute mt-[170px] mr-[90px] z-20 text-md p-8 rounded-md shadow-inner searchbg border-[1px] border-zinc-700">💰</div>
                <svg width="800px"className="z-10 absolute" viewBox="0 0 1027 272" fill="none" xmlns="http://www.w3.org/2000/svg">
                    
                    <defs>
                        <linearGradient id="gradient">
                            <stop offset="0" stop-color="White" stopOpacity={0}></stop>
                            <stop offset="0.8" stop-color="White" stopOpacity={1}></stop>
                            <stop offset="0.8" stop-color="White" stopOpacity={0}></stop>
                        </linearGradient>
                        
                        <mask id="gradient-mask">
                            <rect className={`${animate ? "mask-animation" : "hidden"}`} x="0" y="0" width="100%" height="100%" fill="url(#gradient)"></rect>
                        </mask>
                    </defs>
                    
                    <path d="M4 255.5C242.5 301 957.5 236 1026 178.5" stroke="red" strokeWidth={3}  mask="url(#gradient-mask)" />
                    <path d="M1 172C269.5 109 948 161 1026 135" stroke="red" strokeWidth={3} mask="url(#gradient-mask)"/>
                    <path d="M3 13.5C136.5 -47 675 126.5 1021.5 103.5" stroke="red" strokeWidth={3}  mask="url(#gradient-mask)"/>
                </svg>

                <svg width="800px" className="absolute" viewBox="0 0 1027 272" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 255.5C242.5 301 957.5 236 1026 178.5" stroke="white" strokeWidth={3} />
                    <path d="M1 172C269.5 109 948 161 1026 135" stroke="white" strokeWidth={3} />
                    <path d="M3 13.5C136.5 -47 675 126.5 1021.5 103.5" stroke="white" strokeWidth={3} />
                </svg>

                <div className="z-20 absolute ml-[780px] mt-[60px] p-10 text-2xl rounded-md shadow-inner searchbg border-[1px] border-zinc-700">🛍️</div>
            </div>
            <button className="p-2 border-[2px] border-zinc-700 searchbg shadow-inner" onClick={animateFunc}>Test animation</button>
        </main>
    )
}