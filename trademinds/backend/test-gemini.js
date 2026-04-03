import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

async function run() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: 'You are TradeMinds AI Tutor.'
    })

    const chat = model.startChat({
      history: [],
    })

    const result = await chat.sendMessage('hello')
    console.log(result.response.text())
  } catch(err) {
    console.error('Gemini error:', err)
  }
}

run()
