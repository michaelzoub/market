import React, {useEffect, useRef, useState} from 'react';
import { sendMsgToOpenAI } from '../service/openai';
import Image, { StaticImageData } from 'next/image';
import bot from '/public/bot.png'
import user from '/public/user.png'

interface Message {
    fromUser: boolean;
    message: string;
    image: StaticImageData;
}

export default function Chatbot() {
    const [text, setText] = useState('')
    const [iconClicked, setIconClicked] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])

    function addMsg(msg: Message): void {
        setMessages((prevMessages:any) => [...prevMessages, msg]);
    }
    
    async function addMessage(event:any) {
            if (event.key === 'Enter') {
            console.log(messages)
            const newMessage: Message = {fromUser: true, message: text, image: user}; // Assuming 'fromChet' was a typo
            // setMessages([...messages, newMessage]);
            addMsg(newMessage)
            setText('');

            try {
                const response = await sendMsgToOpenAI(text);
                if (response != null) {
                    const chetGPTMsg: Message = {fromUser: false, message: response.toString(), image: bot};
                    addMsg(chetGPTMsg)
                }
                console.log("Response from OpenAI:", response);
            } catch (error) {
                console.error("Error communicating with OpenAI:", error);
            }  
        }

    }
    return (
        <div className={`${iconClicked ? 'flex flex-col justify-end text-black absolute end-0 bottom-0 m-4 w-52 h-64 bg-zinc-100 overflow-auto rounded-md' : 'rounded-full text-black absolute end-0 bottom-0 m-2 w-12 h-12 overflow-hidden'}`}>
            <svg className={`${iconClicked? 'hidden' : 'w-10 h-10 hover:cursor-pointer'}`} onClick={()=> setIconClicked(true)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e96969" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
            <div className={`${iconClicked? 'absolute flex start-0 top-0 w-full redaccent text-white py-2' : 'hidden'}`}>
                <div className="ml-2 font-medium">DLOCK SUPPORT</div>
                <button className={`${iconClicked ? 'absolute top-0 end-0 m-2' : 'hidden'}`} onClick={()=> setIconClicked(false)}>✖</button>
            </div>
            <ul className={`${iconClicked ? 'overflow-scroll' : 'hidden'}`}>
                {messages.map(e => 
                <div className="w-40 gap-4 text-zinc-700 mx-2">
                    <Image src={e.image} alt='' height={20} width={20}></Image>
                    <div className="flex flex-row mb-2 ml-1">{e.message}</div>
                </div>
                )}
            </ul>
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={addMessage} className={`${iconClicked ? 'visible rounded-sm mt-2 px-[1.3px]' : 'hidden'}`} placeholder="Trade queries..."></input>
        </div>
    )
}