import { useState, useEffect } from 'react'

import { useAuth } from '../context/AuthContext'

import { supabase } from '../lib/supabase'

import { Search, ArrowRightLeft, X, MessageSquare, Star, Filter } from 'lucide-react'

import toast from 'react-hot-toast'

import TradeChat from '../components/TradeChat'



export default function Marketplace() {

  const { user } = useAuth()

  const [listings, setListings] = useState([])

  const [mySkills, setMySkills] = useState([])

  const [search, setSearch] = useState('')

  const [tab, setTab] = useState('browse')

  const [showModal, setShowModal] = useState(false)

  const [selected, setSelected] = useState(null)

  const [offerSkillId, setOfferSkillId] = useState('')



  useEffect(() => { if (user) fetchData() }, [user])



  const fetchData = async () => {

    const [lisRes, myRes] = await Promise.all([

      supabase.from('skills').select('*, users:user_id(name)').eq('is_offering', true),

      supabase.from('skills').select('*').eq('user_id', user.id)

    ])

    setListings(lisRes.data || [])

    setMySkills(myRes.data || [])

  }



  const filtered = listings.filter(l =>

    l.name.toLowerCase().includes(search.toLowerCase()) ||

    l.users?.name?.toLowerCase().includes(search.toLowerCase())

  )



  const submitTrade = async () => {

    if (!offerSkillId) return toast.error('Select a skill to offer')

    const { error } = await supabase.from('trades').insert([{

      requester_id: user.id,

      provider_id: selected.user_id,

      skill_offered: offerSkillId,

      skill_requested: selected.id,

      hours_offered: 1, hours_requested: 1, status: 'pending'

    }])

    if (!error) { toast.success('Proposal Sent!'); setShowModal(false); }

  }



  return (

    <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-main)' }}>

      <header style={{ textAlign: 'center', marginBottom: '60px' }}>

        <h1 style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', fontWeight: '900', letterSpacing: '-4px', margin: 0, color: 'var(--text-main)' }}>Marketplace</h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>

          <button onClick={() => setTab('browse')} style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: tab === 'browse' ? '900' : '400', borderBottom: tab === 'browse' ? '4px solid var(--text-main)' : 'none', cursor: 'pointer', paddingBottom: '10px' }}>BROWSE EXPERTS</button>

          <button onClick={() => setTab('trades')} style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: tab === 'trades' ? '900' : '400', borderBottom: tab === 'trades' ? '4px solid var(--text-main)' : 'none', cursor: 'pointer', paddingBottom: '10px' }}>ACTIVE TRADES</button>

        </div>

      </header>



      {tab === 'browse' ? (

        <>

          <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto 50px auto' }}>

            <Search style={{ position: 'absolute', left: '20px', top: '18px', color: 'var(--text-main)' }} size={24} />

            <input

              style={{ boxSizing: 'border-box', width: '100%', padding: 'clamp(15px, 4vw, 20px) 20px clamp(15px, 4vw, 20px) 60px', borderRadius: '20px', border: '4px solid var(--border-color)', fontSize: 'clamp(1rem, 4vw, 1.3rem)', fontWeight: '700', color: 'var(--text-main)', background: 'var(--bg-card)' }}

              placeholder="Search by skill or member name..."

              value={search}

              onChange={e => setSearch(e.target.value)}

            />

          </div>



          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '30px' }}>

            {filtered.map(item => (

              <div key={item.id} style={{ border: '4px solid var(--border-color)', padding: 'clamp(20px, 6vw, 35px)', borderRadius: '30px', background: 'var(--bg-card)' }}>

                 <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>

                    <div style={{ width: '40px', height: '40px', background: 'var(--text-main)', color: 'var(--bg-main)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', flexShrink: 0 }}>{item.users?.name?.charAt(0)}</div>

                    <span style={{ fontWeight: '900', fontSize: '1.1rem', color: 'var(--text-main)', wordBreak: 'break-word' }}>{item.users?.name}</span>

                 </div>

                 <h3 style={{ margin: '0 0 25px 0', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: '900', letterSpacing: '-1px', color: 'var(--text-main)', wordBreak: 'break-word' }}>{item.name}</h3>

                 <button onClick={() => { setSelected(item); setShowModal(true) }} style={{ width: '100%', padding: '15px', background: 'var(--text-main)', color: 'var(--bg-main)', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '1rem' }}>PROPOSE A SWAP</button>

              </div>

            ))}

          </div>

        </>

      ) : (

        <MyTrades user={user} />

      )}



      {showModal && (

        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>

          <div style={{ background: 'var(--bg-card)', padding: 'clamp(20px, 5vw, 50px)', borderRadius: '40px', width: '100%', maxWidth: '500px', border: '5px solid var(--border-color)', boxShadow: '20px 20px 0px var(--text-main)' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>

              <h2 style={{ fontWeight: '900', fontSize: '2rem', margin: 0, color: 'var(--text-main)' }}>Swap Proposal</h2>

              <X cursor="pointer" onClick={() => setShowModal(false)} size={30} color="var(--text-main)" />

            </div>

            <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: 'var(--text-main)' }}>Requesting <b>{selected.name}</b> from {selected.users?.name}.</p>

            <label style={{ fontWeight: '900', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Choose your offering:</label>

            <select style={{ width: '100%', padding: '15px', marginTop: '10px', borderRadius: '15px', border: '3px solid var(--border-color)', fontWeight: '700', background: 'var(--bg-main)', color: 'var(--text-main)' }} value={offerSkillId} onChange={e => setOfferSkillId(e.target.value)}>

              <option value="">Select a skill...</option>

              {mySkills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}

            </select>

            <button onClick={submitTrade} style={{ width: '100%', padding: '20px', marginTop: '40px', borderRadius: '15px', background: 'var(--text-main)', color: 'var(--bg-main)', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>SEND SWAP REQUEST</button>

          </div>

        </div>

      )}

    </div>

  )

}



function MyTrades({ user }) {

  const [trades, setTrades] = useState([])

  const [activeTrade, setActiveTrade] = useState(null)

  useEffect(() => { fetchTrades() }, [])

  const fetchTrades = async () => {

    const { data } = await supabase.from('trades').select('*, requester:requester_id(name), provider:provider_id(name), offered:skill_offered(name), requested:skill_requested(name)').or(`requester_id.eq.${user.id},provider_id.eq.${user.id}`)

    setTrades(data || [])

  }

  const updateStatus = async (id, status) => {

    await supabase.from('trades').update({ status }).eq('id', id)

    fetchTrades(); toast.success(`Trade ${status}`);

  }



  if (activeTrade) return (

    <div>

      <button onClick={() => setActiveTrade(null)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', marginBottom: '30px', fontWeight: '900', fontSize: '1.2rem' }}>← BACK TO TRADES</button>

      <TradeChat tradeId={activeTrade.id} recipientName={activeTrade.requester_id === user.id ? activeTrade.provider?.name : activeTrade.requester?.name} />

    </div>

  )



  return (

    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {trades.map(t => (

        <div key={t.id} style={{ border: '4px solid var(--border-color)', padding: 'clamp(20px, 4vw, 30px)', borderRadius: '25px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>

          <div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontWeight: '900', fontSize: '1.5rem', color: 'var(--text-main)' }}>

              {t.offered?.name} <ArrowRightLeft size={20} /> {t.requested?.name}

            </div>

            <p style={{ margin: '5px 0', fontWeight: '700', color: 'var(--text-muted)' }}>With: {t.requester_id === user.id ? t.provider?.name : t.requester?.name}</p>

          </div>

          <div>

            {t.status === 'accepted' ? <button onClick={() => setActiveTrade(t)} style={{ background: 'var(--text-main)', color: 'var(--bg-main)', padding: '12px 25px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', border: 'none' }}>CHAT</button>

            : t.status === 'pending' && t.provider_id === user.id ? (

              <div style={{ display: 'flex', gap: '15px' }}>

                <button onClick={() => updateStatus(t.id, 'accepted')} style={{ background: 'var(--text-main)', color: 'var(--bg-main)', padding: '12px 25px', borderRadius: '12px', border: 'none', fontWeight: '900', cursor: 'pointer' }}>ACCEPT</button>

                <button onClick={() => updateStatus(t.id, 'rejected')} style={{ background: 'none', color: '#ff4444', border: 'none', fontWeight: '900', cursor: 'pointer' }}>DECLINE</button>

              </div>

            ) : <span style={{ fontWeight: '900', color: 'var(--text-muted)', fontSize: '1.2rem' }}>{t.status.toUpperCase()}</span>}

          </div>

        </div>

      ))}

    </div>

  )

}