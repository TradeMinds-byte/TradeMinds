import { useState, useEffect } from 'react'

import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

import { supabase } from '../lib/supabase'

import { TrendingUp, BarChart3, ArrowRight, DollarSign, Clock, Zap } from 'lucide-react'



export default function Finance() {

  const { user } = useAuth()

  const [skills, setSkills] = useState([])

  const [loading, setLoading] = useState(true)

  const [liveEquity, setLiveEquity] = useState(0)



  useEffect(() => {

    fetchData()

   

    // Listen for real-time updates from the Tutor

    const subscription = supabase

      .channel('skills_changes')

      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'skills' }, () => {

        fetchData()

      })

      .subscribe()



    return () => supabase.removeChannel(subscription)

  }, [])



  const fetchData = async () => {

    const { data } = await supabase

      .from('skills')

      .select('*')

      .eq('user_id', user?.id)

      .order('hours_invested', { ascending: false })

   

    setSkills(data || [])

    const initialValue = data?.reduce((s, sk) => s + ((sk.market_value || 0) * (sk.hours_invested || 0)), 0) || 0

    setLiveEquity(initialValue)

    setLoading(false)

  }



  // --- THE LIVE TICKER LOGIC ---

  useEffect(() => {

    if (skills.length === 0) return;



    const totalHourlyRate = skills.reduce((s, sk) => s + (sk.hourly_rate || sk.market_value || 0), 0)

    const valuePerSecond = totalHourlyRate / 3600



    const interval = setInterval(() => {

      setLiveEquity(prev => prev + valuePerSecond)

    }, 1000)



    return () => clearInterval(interval)

  }, [skills])



  const totalMinutes = skills.reduce((s, sk) => s + (sk.hours_invested || 0) * 60, 0)

  const avgRate = skills.length ? skills.reduce((s, sk) => s + (sk.hourly_rate || 0), 0) / skills.length : 0



  return (

    <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto', color: 'var(--text-main)', backgroundColor: 'var(--bg-main)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

     

      {/* HEADER */}

      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>

        <div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1.5px', margin: 0 }}>Skill Finance</h1>

          <p style={{ color: 'var(--text-muted)', fontWeight: '500', marginTop: '5px' }}>Live market equity tracking.</p>

        </div>

        <div style={{ textAlign: 'right', padding: '10px 20px', backgroundColor: 'rgba(0, 160, 233, 0.1)', borderRadius: '12px', border: '1px solid rgba(0, 160, 233, 0.3)' }}>

          <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: '900', color: '#00A0E9', textTransform: 'uppercase' }}>Live Growth</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#00A0E9' }}>

            <Zap size={14} fill="#00A0E9" />

            <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>+${(avgRate/3600).toFixed(4)}/s</span>

          </div>

        </div>

      </div>



      {/* STAT CARDS */}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>

        <StatCard label="Time Invested" value={`${Math.floor(totalMinutes)}m`} icon={<Clock size={16}/>} />

       

        <StatCard

          label="Net Skill Value"

          value={`$${liveEquity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}

          icon={<DollarSign size={16}/>}

          highlight

        />

       

        <StatCard label="Skills Active" value={skills.length} icon={<BarChart3 size={16}/>} />

        <StatCard label="Avg. Rate" value={`$${avgRate.toFixed(0)}/h`} icon={<TrendingUp size={16}/>} />

      </div>



      {loading ? (

        <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>Analyzing...</div>

      ) : skills.length === 0 ? (

        <div style={{ padding: '60px', textAlign: 'center', backgroundColor: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>

          <BarChart3 size={48} color="var(--text-muted)" style={{ marginBottom: '20px' }} />

          <h2 style={{ fontWeight: '800' }}>No Data</h2>

          <Link to="/profile" style={{ textDecoration: 'none', backgroundColor: 'var(--text-main)', color: 'var(--bg-main)', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>

            Go to Profile <ArrowRight size={18} />

          </Link>

        </div>

      ) : (

        <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-color)' }}>

          <h2 style={{ fontWeight: '900', fontSize: '1.2rem', marginBottom: '35px', opacity: 0.9 }}>Asset Breakdown</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

            {skills.map((sk) => {

              const value = (sk.market_value || 0) * (sk.hours_invested || 0)

              const totalVal = skills.reduce((s, sk) => s + ((sk.market_value || 0) * (sk.hours_invested || 0)), 0)

              const percentage = totalVal > 0 ? (value / totalVal) * 100 : 0

             

              return (

                <div key={sk.id} style={{ paddingBottom: '25px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                  <div style={{ flex: 1 }}>

                    <p style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem' }}>{sk.name}</p>

                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{Math.round(sk.hours_invested * 60)}m logged</p>

                    <div style={{ width: '250px', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '10px', marginTop: '15px', overflow: 'hidden' }}>

                        <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#00A0E9', transition: 'width 1s ease-in-out' }}></div>

                    </div>

                  </div>

                  <div style={{ textAlign: 'right' }}>

                    <p style={{ margin: 0, fontWeight: '900', fontSize: '1.6rem', letterSpacing: '-1px' }}>${value.toLocaleString()}</p>

                    <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '900' }}>Equity</p>

                  </div>

                </div>

              )

            })}

          </div>

        </div>

      )}

    </div>

  )

}



function StatCard({ label, value, icon, highlight = false }) {

  return (

    <div style={{

      padding: '25px',

      backgroundColor: highlight ? '#00A0E9' : 'var(--bg-card)',

      color: highlight ? '#ffffff' : 'var(--text-main)',

      borderRadius: '20px',

      border: highlight ? 'none' : '1px solid var(--border-color)',

      boxShadow: highlight ? '0 10px 30px rgba(0,160,233, 0.2)' : 'none',

      transition: 'all 0.3s ease'

    }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: highlight ? '#ffffff' : 'var(--text-muted)', marginBottom: '10px', opacity: 0.8 }}>

        {icon}

        <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>{label}</span>

      </div>

      <div style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-1px', fontFamily: highlight ? 'monospace' : 'inherit' }}>{value}</div>

    </div>

  )

}