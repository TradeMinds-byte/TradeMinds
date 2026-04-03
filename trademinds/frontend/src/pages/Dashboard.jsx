import { useState, useEffect } from 'react'

import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

import { supabase } from '../lib/supabase'

import { Brain, ShoppingBag, Star, Plus } from 'lucide-react'



export default function Dashboard() {

  const { profile } = useAuth()

  const [skills, setSkills] = useState([])

  const [sessions, setSessions] = useState([])

  const [loading, setLoading] = useState(true)



  useEffect(() => {

    fetchData()

  }, [])



  const fetchData = async () => {

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return



    const [skillsRes, sessionsRes] = await Promise.all([

      supabase.from('skills').select('*').eq('user_id', user.id).limit(5),

      supabase.from('learning_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3)

    ])



    setSkills(skillsRes.data || [])

    setSessions(sessionsRes.data || [])

    setLoading(false)

  }



  const totalHours = skills.reduce((s, sk) => s + (sk.hours_invested || 0), 0)

  const totalValue = skills.reduce((s, sk) => s + ((sk.market_value || 0) * (sk.hours_invested || 0)), 0)



  const hour = new Date().getHours()

  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'



  if (loading) return (

    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      <div style={{ width: '32px', height: '32px', border: '2px solid var(--border-color)', borderTopColor: 'var(--text-main)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

    </div>

  )



  const cardStyle = {

    padding: '1.5rem',

    backgroundColor: 'var(--bg-card)',

    border: '1px solid var(--border-color)',

    borderRadius: '20px',

    transition: 'all 0.2s ease',

    textDecoration: 'none',

    color: 'inherit'

  }



  return (

    <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-main)' }}>

     

      {/* 1. CLEAN HERO GREETING - Hand Removed */}

      <div style={{ marginBottom: '60px' }}>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '500' }}>{greeting},</p>

        <h1 style={{ textAlign: 'left', fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-2px', margin: 0 }}>

          {profile?.full_name?.split(' ')[0] || 'Learner'}

        </h1>

        <p style={{ color: 'var(--text-muted)', marginTop: '10px', fontSize: '1.1rem' }}>

          Your skill portfolio is currently valued at <strong style={{ color: 'var(--text-main)' }}>${totalValue.toFixed(0)}</strong>.

        </p>

      </div>



      {/* 2. STATS ROW */}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '60px' }}>

        <div style={cardStyle}>

          <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Skills Tracked</p>

          <p style={{ fontSize: '2.5rem', fontWeight: '900', margin: '5px 0 0 0' }}>{skills.length}</p>

        </div>

        <div style={cardStyle}>

          <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hours Invested</p>

          <p style={{ fontSize: '2.5rem', fontWeight: '900', margin: '5px 0 0 0' }}>{totalHours.toFixed(0)}h</p>

        </div>

        <div style={cardStyle}>

          <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Sessions</p>

          <p style={{ fontSize: '2.5rem', fontWeight: '900', margin: '5px 0 0 0' }}>{sessions.length}</p>

        </div>

      </div>



      {/* 3. QUICK ACTIONS - Border Fixed for Dark/Light */}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '60px' }}>

        <Link to="/tutor" style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '15px', border: '2px solid var(--text-main)' }}>

          <Brain size={24} />

          <div>

            <p style={{ fontWeight: '800', margin: 0 }}>Start AI Session</p>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Boost your skill value</p>

          </div>

        </Link>

        <Link to="/marketplace" style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '15px' }}>

          <ShoppingBag size={24} />

          <div>

            <p style={{ fontWeight: '800', margin: 0 }}>Marketplace</p>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Find trade partners</p>

          </div>

        </Link>

      </div>



      {/* 4. CONTENT GRID */}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '40px' }}>

       

        {/* MY SKILLS SECTION */}

        <div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.5px' }}>My Skills</h2>

            <Link to="/profile" style={{

                color: 'var(--bg-main)',

                backgroundColor: 'var(--text-main)',

                padding: '6px 14px',

                borderRadius: '8px',

                fontSize: '0.8rem',

                fontWeight: '700',

                textDecoration: 'none'

            }}>

              + Add New

            </Link>

          </div>

         

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {skills.length > 0 ? skills.map(skill => (

              <Link key={skill.id} to={`/skill/${skill.id}`} style={{ ...cardStyle, padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <div>

                  <p style={{ fontWeight: '800', margin: 0 }}>{skill.name}</p>

                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', fontWeight: '700' }}>{skill.level}</p>

                </div>

                <div style={{ textAlign: 'right' }}>

                  <p style={{ fontWeight: '900', margin: 0 }}>${((skill.market_value || 0) * (skill.hours_invested || 0)).toFixed(0)}</p>

                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{skill.hours_invested}h invested</p>

                </div>

              </Link>

            )) : (

                <div style={{ ...cardStyle, border: '2px dashed var(--border-color)', backgroundColor: 'transparent', textAlign: 'center', padding: '40px' }}>

                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>No skills found. Start by adding one!</p>

                </div>

            )}

          </div>

        </div>



        {/* RECENT SESSIONS SECTION */}

        <div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '25px', letterSpacing: '-0.5px' }}>Recent AI Sessions</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {sessions.length > 0 ? sessions.map(session => (

              <div key={session.id} style={{ ...cardStyle, padding: '15px 20px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                  <p style={{ fontWeight: '800', margin: 0 }}>{session.topic}</p>

                  {session.score && (

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '900' }}>

                        <Star size={12} fill="var(--text-main)" color="var(--text-main)" /> {session.score}

                    </div>

                  )}

                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '5px', fontWeight: '500' }}>

                    {new Date(session.created_at).toLocaleDateString()} • {session.duration_mins}m session

                </p>

              </div>

            )) : (

                <p style={{ color: 'var(--text-muted)' }}>No recent sessions recorded.</p>

            )}

          </div>

        </div>



      </div>

    </div>

  )

}