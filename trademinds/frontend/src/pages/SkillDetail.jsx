import { useState, useEffect } from 'react'

import { useParams, useNavigate, Link } from 'react-router-dom'

import { supabase } from '../lib/supabase'

import { ArrowLeft, Brain, Clock, DollarSign, TrendingUp, Star } from 'lucide-react'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'



export default function SkillDetail() {

  const { id } = useParams()

  const navigate = useNavigate()

  const [skill, setSkill] = useState(null)

  const [sessions, setSessions] = useState([])

  const [logs, setLogs] = useState([])

  const [loading, setLoading] = useState(true)



  useEffect(() => {

    const fetch = async () => {

      const [skillRes, sessionsRes, logsRes] = await Promise.all([

        supabase.from('skills').select('*').eq('id', id).single(),

        supabase.from('learning_sessions').select('*').eq('skill_id', id).order('created_at', { ascending: false }),

        supabase.from('finance_logs').select('*').eq('skill_id', id).order('logged_at', { ascending: false })

      ])

      setSkill(skillRes.data)

      setSessions(sessionsRes.data || [])

      setLogs(logsRes.data || [])

      setLoading(false)

    }

    fetch()

  }, [id])



  if (loading) return (

    <div className="centered-hero">

      <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin" />

    </div>

  )



  if (!skill) return (

    <div className="centered-hero">

      <p>Skill not found.</p>

      <button onClick={() => navigate(-1)} className="cta-button mt-4">Go back</button>

    </div>

  )



  const totalValue = (skill.market_value || 0) * (skill.hours_invested || 0)

  const chartData = logs.slice(0, 10).reverse().map((l, i) => ({

    index: i + 1,

    hours: l.hours_logged,

    value: l.value_earned || 0

  }))



  return (

    <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>

      {/* Navigation */}

      <button

        onClick={() => navigate(-1)}

        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px', fontWeight: '600' }}

      >

        <ArrowLeft size={18} /> Back to Dashboard

      </button>



      {/* Header Section */}

      <div className="skill-card" style={{ marginBottom: '40px', padding: '40px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>

          <div>

            <h1 className="hero-title" style={{ fontSize: '3.5rem', textAlign: 'left', marginBottom: '10px' }}>{skill.name}</h1>

            <div style={{ display: 'flex', gap: '10px' }}>

              <span className="price-tag" style={{ background: '#000', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem' }}>{skill.category}</span>

              <span className="price-tag" style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', border: '1px solid #ddd' }}>{skill.level}</span>

            </div>

          </div>

          <Link to="/tutor" state={{ topic: skill.name }} className="cta-button" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

            <Brain size={18} /> Study with AI

          </Link>

        </div>



        {/* Big Stats Row */}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '30px' }}>

          <div>

            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14}/> Hours Invested</p>

            <p style={{ fontSize: '2rem', fontWeight: '800' }}>{skill.hours_invested || 0}h</p>

          </div>

          <div>

            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}><DollarSign size={14}/> Hourly Rate</p>

            <p style={{ fontSize: '2rem', fontWeight: '800' }}>${skill.market_value || 0}</p>

          </div>

          <div>

            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}><TrendingUp size={14}/> Asset Value</p>

            <p style={{ fontSize: '2rem', fontWeight: '800' }}>${totalValue.toFixed(0)}</p>

          </div>

        </div>

      </div>



      {/* Analytics Grid */}

      <div style={{ display: 'grid', gridTemplateColumns: 'grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>

       

        {/* Progress Chart */}

        <div className="skill-card">

          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Progress Analytics</h2>

          {chartData.length === 0 ? (

            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No data logged yet.</div>

          ) : (

            <ResponsiveContainer width="100%" height={250}>

              <AreaChart data={chartData}>

                <defs>

                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">

                    <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>

                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>

                  </linearGradient>

                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />

                <XAxis dataKey="index" hide />

                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />

                <Tooltip

                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}

                />

                <Area type="monotone" dataKey="hours" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />

              </AreaChart>

            </ResponsiveContainer>

          )}

        </div>



        {/* AI Learning History */}

        <div className="skill-card">

          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>AI Learning History</h2>

          {sessions.length === 0 ? (

            <div style={{ textAlign: 'center', padding: '40px' }}>

              <p style={{ color: '#999', marginBottom: '20px' }}>No sessions found.</p>

              <Link to="/tutor" className="cta-button" style={{ fontSize: '0.9rem' }}>Start Session</Link>

            </div>

          ) : (

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              {sessions.map(s => (

                <div key={s.id} style={{ padding: '15px', borderRadius: '12px', border: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                  <div>

                    <p style={{ fontWeight: '600', margin: 0 }}>{s.topic}</p>

                    <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>{new Date(s.created_at).toLocaleDateString()} • {s.duration_mins}m</p>

                  </div>

                  {s.score && (

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#f9f9fb', padding: '5px 10px', borderRadius: '8px' }}>

                      <Star size={12} fill="black" />

                      <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>{s.score}</span>

                    </div>

                  )}

                </div>

              ))}

            </div>

          )}

        </div>



      </div>

    </div>

  )

}