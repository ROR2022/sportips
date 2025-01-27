import OpenAI from 'openai';
import { NextResponse } from "next/server";

const { OPENAI_API_KEY } = process.env;

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function POST(req) {
    try {
        const data = await req.json();
        const { message, lang } = data;

        // Validar que el mensaje sea válido
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return NextResponse.json({ error: "Invalid or empty message" }, { status: 400 });
        }

        console.log('Mensaje recibido:', message);
        const roleContent = lang === 'es' ? 'Eres un consejero de vida que proporciona sabiduría y orientación a las personas que buscan respuestas a sus preguntas más profundas.' : 'You are a life coach who provides wisdom and guidance to people seeking answers to their deepest questions.';

        // Crear la solicitud al modelo
        const completion = await client.chat.completions.create({
            model: 'gpt-4', 
            max_tokens: 500,
            messages: [
                {
                    role: 'system',
                    content: roleContent
                  },
                { role: 'user', content: message },
            ],
        });

        
        console.log('Respuesta del modelo:', completion.choices[0].message.content);
        return NextResponse.json({ message: completion.choices[0].message.content }, { status: 200 });

    } catch (error) {
        console.error('Error al obtener la respuesta del chatbot:', error.response?.data || error.message);
        return NextResponse.json(
            { error: error.response?.data?.error?.message || "Failed to get response from chatbot" },
            { status: 500 }
        );
    }
}


/*

export async function POST(req) {
    try {
        const data = await req.json();
        const { message } = data;

        if (!message || typeof message !== 'string' || message.trim() === '') {
            return NextResponse.json({ error: "Invalid or empty message" }, { status: 400 });
        }

        console.log('Mensaje recibido:', message);

        // Datos ficticios de los próximos partidos
        const matchesSummary = `
        1. Puebla vs Mazatlán el 27 de enero.
        2. León vs Guadalajara el 28 de enero.
        3. Santos Laguna vs Atlas el 29 de enero.
        4. América vs Pachuca el 30 de enero.
        5. Tigres vs Toluca el 31 de enero.
        `;

        const prompt = `Los próximos partidos de fútbol en la Liga MX son:\n${matchesSummary}\nAnaliza quiénes son los favoritos para ganar y por qué.`;

        const completion = await client.chat.completions.create({
            model: 'gpt-4',
            max_tokens: 500,
            messages: [
                {
                    role: 'system',
                    content: 'Eres un analista deportivo experto en fútbol mexicano que proporciona análisis precisos y actualizados sobre los partidos próximos de la Liga MX.'
                },
                { role: 'user', content: prompt },
            ],
        });

        console.log('Respuesta del modelo:', completion.choices[0].message.content);
        return NextResponse.json({ message: completion.choices[0].message.content }, { status: 200 });

    } catch (error) {
        console.error('Error al obtener la respuesta del chatbot:', error.response?.data || error.message);
        return NextResponse.json(
            { error: error.response?.data?.error?.message || "Failed to get response from chatbot" },
            { status: 500 }
        );
    }
}


*/