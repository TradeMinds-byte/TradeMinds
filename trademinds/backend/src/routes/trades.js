import express from 'express'
import { authenticate } from '../middleware/auth.js'
import { supabase } from '../db/supabase.js'

const router = express.Router()

router.get('/', authenticate, async (req, res) => {
  const uid = req.user.id
  const { data, error } = await supabase.from('trades')
    .select('*, skill_offered_data:skill_offered(name), skill_requested_data:skill_requested(name), requester:requester_id(name), provider:provider_id(name)')
    .or(`requester_id.eq.${uid},provider_id.eq.${uid}`)
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json({ trades: data })
})

router.post('/', authenticate, async (req, res) => {
  const { provider_id, skill_offered, skill_requested, hours_offered, hours_requested } = req.body
  const { data, error } = await supabase.from('trades').insert({
    requester_id: req.user.id, provider_id,
    skill_offered, skill_requested,
    hours_offered, hours_requested,
    status: 'pending',
    created_at: new Date().toISOString()
  }).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json({ trade: data })
})

router.patch('/:id/status', authenticate, async (req, res) => {
  const { status } = req.body
  const allowed = ['accepted', 'rejected', 'completed']
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' })
  const { data, error } = await supabase.from('trades')
    .update({ status }).eq('id', req.params.id).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json({ trade: data })
})

router.post('/:id/rate', authenticate, async (req, res) => {
  const { stars, comment, rated_user_id } = req.body
  const { data, error } = await supabase.from('ratings').insert({
    trade_id: req.params.id,
    rated_user_id, stars, comment,
    created_at: new Date().toISOString()
  }).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json({ rating: data })
})

export default router