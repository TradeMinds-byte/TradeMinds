import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { createServer } from 'http'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth.js'
import aiRoutes from './routes/ai.js'
import skillRoutes from './routes/skills.js'
import tradeRoutes from './routes/trades.js'
import financeRoutes from './routes/finance.js'
import userRoutes from './routes/users.js'

dotenv.config()

const app = express()
const server = createServer(app)
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests' })
const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 30, message: 'AI rate limit exceeded' })
app.use(limiter)

app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.use('/api/auth', authRoutes)
app.use('/api/ai', aiLimiter, aiRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/trades', tradeRoutes)
app.use('/api/finance', financeRoutes)
app.use('/api/users', userRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

server.listen(PORT, () => {
  console.log(`🚀 TradeMinds backend running on port ${PORT}`)
})
export default app;