import express from 'express'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Optional: endpoint to verify token (e.g. for frontend)
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user })
})

export default router
