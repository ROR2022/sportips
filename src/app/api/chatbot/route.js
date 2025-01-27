import OpenAI from 'openai';
import { NextResponse } from "next/server";

const { OPENAI_API_KEY } = process.env;

const client = new OpenAI({
  apiKey: OPENAI_API_KEY, 
});

// POST /api/nlp - Get response from NLP model chatbot


export async function POST(req) {
    try {
        const { message } = req.json();
        const completion = await client.chat.completions.create({
            store: true,
            messages: [{ role: 'user', content: message }],
            model: 'gpt-3.5-turbo',
          });

        
        
        console.log(completion.choices[0].message);
        return NextResponse.json({ message: completion.choices[0].message }, { status: 200 });
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to get response from chatbot" }, { status: 500 });
    }
}



