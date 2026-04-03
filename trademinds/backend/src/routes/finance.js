import express from 'express'
import { authenticate } from '../middleware/auth.js'
import { supabase } from '../db/supabase.js'

const router = express.Router()

router.get('/logs', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('finance_logs')
    .select('*, skills(name)').eq('user_id', req.user.id)
    .order('logged_at', { ascending: false }).limit(50)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ logs: data })
})

router.post('/log', authenticate, async (req, res) => {
  const { skill_id, hours_logged, value_earned, log_type } = req.body
  const { data, error } = await supabase.from('finance_logs').insert({
    user_id: req.user.id, skill_id,
    hours_logged, value_earned: value_earned || 0,
    log_type: log_type || 'session',
    logged_at: new Date().toISOString()
  }).select().single()
  if (error) return res.status(500).json({ error: error.message })

  const skill = await supabase.from('skills').select('hours_invested').eq('id', skill_id).single()
  if (skill.data) {
    await supabase.from('skills').update({
      hours_invested: (skill.data.hours_invested || 0) + hours_logged
    }).eq('id', skill_id)
  }
  res.json({ log: data })
})

router.get('/summary', authenticate, async (req, res) => {
  const uid = req.user.id
  const [skillsRes, logsRes] = await Promise.all([
    supabase.from('skills').select('*').eq('user_id', uid),
    supabase.from('finance_logs').select('*').eq('user_id', uid)
  ])
  const skills = skillsRes.data || []
  const logs = logsRes.data || []
  const totalHours = skills.reduce((s, sk) => s + (sk.hours_invested || 0), 0)
  const totalValue = skills.reduce((s, sk) => s + ((sk.market_value || 0) * (sk.hours_invested || 0)), 0)
  const totalEarned = logs.reduce((s, l) => s + (l.value_earned || 0), 0)
  res.json({ totalHours, totalValue, totalEarned, skillCount: skills.length })
})

export default router