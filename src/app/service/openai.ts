import OpenAI from "openai";
const api = process.env.NEXT_PUBLIC_OPENAI_API;

const openai = new OpenAI({
    apiKey: api,
    dangerouslyAllowBrowser: true
});

export async function sendMsgToOpenAI(message: string) {
    const res = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You're a helpful assistant on a Deadlock (new Valve game) trading site. The user (person speaking to you) can buy and sell items. Skins are coming out on October 3rd 2024. If you don't know the answer to a question please say these exact words: 'Contacting helpdesk...'."
            },
            {
                role: "user",
                content: message
            }
        ],
        model: "gpt-3.5-turbo-0125",
        max_tokens: 100
    });
    return res.choices[0].message.content;
}