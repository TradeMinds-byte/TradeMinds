import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.post('/chat', authenticate, async (req, res) => {
  const { messages, systemPrompt, topic } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array required' })
  }

  if (!process.env.GEMINI_API_KEY?.trim()) {
    return res.status(503).json({
      error: 'AI not configured',
      detail: 'Set GEMINI_API_KEY in trademinds/backend/.env and restart the server.'
    })
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt || `You are TradeMinds AI Tutor. Help the user learn ${topic || 'the requested topic'} by asking questions, identifying knowledge gaps, and explaining concepts clearly.`
    })

    // Gemini expects messages in { role: 'user' | 'model', parts: [{ text: "..." }] }
    // Clean out any empty texts
    let formattedHistory = messages.slice(-20).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: (typeof m.content === 'string' ? m.content : String(m.content ?? '')).trim() || "..." }]
    })).filter(m => m.parts[0].text)

    // Collapse consecutive messages with the same role (Gemini requires strict alternating roles)
    const collapsedHistory = [];
    for (const msg of formattedHistory) {
      if (collapsedHistory.length > 0 && collapsedHistory[collapsedHistory.length - 1].role === msg.role) {
        collapsedHistory[collapsedHistory.length - 1].parts[0].text += '\n\n' + msg.parts[0].text;
      } else {
        collapsedHistory.push(msg);
      }
    }

    // Gemini history MUST NOT start with a model message
    if (collapsedHistory.length > 0 && collapsedHistory[0].role === 'model') {
       collapsedHistory.unshift({ role: 'user', parts: [{ text: topic ? `Let's talk about ${topic}.` : 'Hello' }] });
    }

    if (collapsedHistory.length === 0) {
       collapsedHistory.push({ role: 'user', parts: [{ text: topic ? `I'd like to learn about "${topic}".` : 'Please continue as my tutor.' }] })
    }

    const currentMessage = collapsedHistory.pop()
    
    const chat = model.startChat({
      history: collapsedHistory,
    })

    const result = await chat.sendMessage(currentMessage.parts[0].text)
    const content = result.response.text() ? result.response.text().trim() : "I'm here to help. Could you elaborate?"

    const gapKeywords = ['gap', 'missing', 'unclear', 'suggest', 'recommend', 'should explore', 'might want to']
    const hasGap = gapKeywords.some(k => content.toLowerCase().includes(k))

    res.json({ content, hasGap })
  } catch (err) {
    console.error('AI chat error:', err)
    const detail = err.message || 'Gemini API request failed.'
    res.status(502).json({ error: 'AI service error', detail })
  }
})

router.post('/analyze-gaps', authenticate, async (req, res) => {
  const { conversation, topic } = req.body

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: 'You are an expert knowledge analyst. Analyze the conversation and return a JSON array of knowledge gaps found. Format: [{"gap": "string", "severity": "low|medium|high", "suggestion": "string"}]'
    })

    const result = await model.generateContent(`Topic: ${topic}\n\nConversation:\n${JSON.stringify(conversation)}\n\nIdentify knowledge gaps. Return only valid JSON array.`)
    const text = result.response.text() || '[]'
    
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    const gaps = jsonMatch ? JSON.parse(jsonMatch[0]) : []

    res.json({ gaps })
  } catch (err) {
    res.json({ gaps: [] })
  }
})

router.post('/skill-value', authenticate, async (req, res) => {
  const { skillName, level } = req.body

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: 'You are a tech labor market expert. Return only a JSON object with estimated hourly rates.'
    })

    const result = await model.generateContent(`What is the estimated hourly market rate for "${skillName}" at ${level} level in 2024? Return JSON: {"low": number, "mid": number, "high": number, "currency": "USD"}`)
    const text = result.response.text() || '{}'
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const value = jsonMatch ? JSON.parse(jsonMatch[0]) : { low: 15, mid: 30, high: 60, currency: 'USD' }

    res.json({ value })
  } catch (err) {
    res.json({ value: { low: 15, mid: 30, high: 60, currency: 'USD' } })
  }
})

router.post('/learning-path', authenticate, async (req, res) => {
  const { topic, gaps, level } = req.body

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: 'You are a curriculum designer. Return a JSON learning path.'
    })

    const result = await model.generateContent(`Create a learning path for "${topic}" at ${level} level. Known gaps: ${JSON.stringify(gaps)}. Return JSON: {"steps": [{"title": "string", "description": "string", "estimatedHours": number, "resources": ["string"]}]}`)
    const text = result.response.text() || '{}'
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const path = jsonMatch ? JSON.parse(jsonMatch[0]) : { steps: [] }

    res.json({ path })
  } catch (err) {
    res.json({ path: { steps: [] } })
  }
})

export default router