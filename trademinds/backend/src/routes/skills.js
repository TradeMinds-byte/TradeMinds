import express from 'express'
import { authenticate } from '../middleware/auth.js'
import { supabase } from '../db/supabase.js'

const router = express.Router()

router.get('/', authenticate, async (req, res) => {
  const { category, level, search } = req.query
  let query = supabase.from('skills').select('*, users(name, avatar_url)').eq('is_offering', true).neq('user_id', req.user.id)
  if (category) query = query.eq('category', category)
  if (level) query = query.eq('level', level)
  if (search) query = query.ilike('name', `%${search}%`)
  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json({ skills: data })
})

router.get('/mine', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('skills').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json({ skills: data })
})

router.post('/', authenticate, async (req, res) => {
  const { name, category, level, market_value, is_offering } = req.body
  const { data, error } = await supabase.from('skills').insert({
    user_id: req.user.id, name, category, level,
    market_value: market_value || 0,
    is_offering: is_offering || false,
    hours_invested: 0,
    created_at: new Date().toISOString()
  }).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json({ skill: data })
})

router.patch('/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('skills')
    .update(req.body).eq('id', req.params.id).eq('user_id', req.user.id).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json({ skill: data })
})

router.delete('/:id', authenticate, async (req, res) => {
  const { error } = await supabase.from('skills').delete().eq('id', req.params.id).eq('user_id', req.user.id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ success: true })
})

export default router