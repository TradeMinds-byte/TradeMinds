import { useState, useEffect } from 'react'

import { useAuth } from '../context/AuthContext'

import { supabase } from '../lib/supabase'

import { User, Edit3, Trash2, Award, Star, Plus, Check } from 'lucide-react'

import toast from 'react-hot-toast'



export default function Profile() {

  const { profile, updateProfile, user } = useAuth()

  const [isEditing, setIsEditing] = useState(false)

  const [name, setName] = useState('')

  const [mySkills, setMySkills] = useState([])

  const [showAddForm, setShowAddForm] = useState(false)

 

  const [skillName, setSkillName] = useState('')

  const [category, setCategory] = useState('Technology')

  const [level, setLevel] = useState('beginner')



  useEffect(() => {

    if (profile?.name) setName(profile.name)

    if (user) fetchMySkills()

  }, [profile, user])



  const fetchMySkills = async () => {

    const { data } = await supabase.from('skills').select('*').eq('user_id', user.id)

    setMySkills(data || [])

  }



  const handleUpdateAccount = async () => {

    const { error } = await updateProfile({ name: name.trim() })

    if (!error) { toast.success('Profile Updated'); setIsEditing(false); }

  }



  const handleAddSkill = async (e) => {

    e.preventDefault()

    if (!skillName) return toast.error('Enter a skill name')

    const { error } = await supabase.from('skills').insert([{

      user_id: user.id, name: skillName, category, level, is_offering: true

    }])

    if (!error) {

      toast.success('Skill Listed!'); setSkillName(''); setShowAddForm(false); fetchMySkills();

    }

  }



  const deleteSkill = async (id) => {

    await supabase.from('skills').delete().eq('id', id)

    fetchMySkills()

    toast.success('Removed')

  }



  return (

    <div style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)' }}>

      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', marginBottom: '60px' }}>

        <div style={{ width: '120px', height: '120px', background: 'var(--text-main)', borderRadius: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-main)' }}>

          <User size={60}/>

        </div>

        <div style={{ flex: 1 }}>

          {isEditing ? (

            <div style={{ display: 'flex', gap: '15px' }}>

              <input style={{ border: '3px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', padding: '12px', borderRadius: '12px', fontSize: '1.5rem', fontWeight: '900', width: '100%', maxWidth: '300px' }} value={name} onChange={e => setName(e.target.value)} autoFocus />

              <button onClick={handleUpdateAccount} style={{ background: 'var(--text-main)', color: 'var(--bg-main)', padding: '12px 25px', borderRadius: '12px', fontWeight: '900', border: 'none', cursor: 'pointer' }}>SAVE</button>

            </div>

          ) : (

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px' }}>

              <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: '900', margin: 0, letterSpacing: '-2px', color: 'var(--text-main)' }}>{profile?.name || 'Learner'}</h1>

              <Edit3 size={24} cursor="pointer" onClick={() => setIsEditing(true)} color="var(--text-main)" />

            </div>

          )}

          <p style={{ margin: '5px 0', fontSize: '1.1rem', fontWeight: '600', opacity: 0.5, color: 'var(--text-main)' }}>{profile?.email}</p>

        </div>

      </header>



      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px', marginBottom: '60px' }}>

        <div style={{ border: '3px solid var(--border-color)', padding: '30px', borderRadius: '25px', background: 'var(--bg-card)' }}>

          <Award size={30} style={{ marginBottom: '15px' }} color="var(--text-main)" />

          <span style={{ fontSize: '0.8rem', fontWeight: '900', opacity: 0.4, color: 'var(--text-main)' }}>MEMBER STATUS</span>

          <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)' }}>Elite Trader</h3>

        </div>

        <div style={{ border: '3px solid var(--border-color)', padding: '30px', borderRadius: '25px', background: 'var(--bg-card)' }}>

          <Star size={30} style={{ marginBottom: '15px' }} color="var(--text-main)" />

          <span style={{ fontSize: '0.8rem', fontWeight: '900', opacity: 0.4, color: 'var(--text-main)' }}>TOTAL SWAPS</span>

          <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)' }}>12 Sessions</h3>

        </div>

      </div>



      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>

        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px', color: 'var(--text-main)' }}>My Active Skills</h2>

        <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: 'var(--text-main)', color: 'var(--bg-main)', padding: '15px 30px', borderRadius: '15px', fontWeight: '900', border: 'none', cursor: 'pointer' }}>

          {showAddForm ? 'CANCEL' : '+ ADD NEW'}

        </button>

      </div>



      {showAddForm && (

        <form onSubmit={handleAddSkill} style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '30px', border: '4px solid var(--border-color)', marginBottom: '40px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>

            <input style={{ padding: '15px', borderRadius: '12px', border: '2px solid var(--border-color)', fontWeight: '700', background: 'var(--bg-main)', color: 'var(--text-main)' }} placeholder="Skill Name..." value={skillName} onChange={e => setSkillName(e.target.value)} />

            <select style={{ padding: '15px', borderRadius: '12px', border: '2px solid var(--border-color)', fontWeight: '700', background: 'var(--bg-main)', color: 'var(--text-main)' }} value={category} onChange={e => setCategory(e.target.value)}>

              {['Technology', 'Design', 'Music', 'Language', 'Business', 'Other'].map(c => <option key={c}>{c}</option>)}

            </select>

          </div>

          <button type="submit" style={{ width: '100%', padding: '20px', background: 'var(--text-main)', color: 'var(--bg-main)', borderRadius: '15px', fontWeight: '900', border: 'none', fontSize: '1.2rem' }}>LIST ON MARKETPLACE</button>

        </form>

      )}



      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {mySkills.map(s => (

          <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px 40px', border: '3px solid var(--border-color)', borderRadius: '25px', background: 'var(--bg-card)' }}>

            <div>

              <h4 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main)' }}>{s.name}</h4>

              <p style={{ margin: 0, fontWeight: '700', opacity: 0.4, textTransform: 'uppercase', color: 'var(--text-main)' }}>{s.category} • {s.level}</p>

            </div>

            <Trash2 size={24} color="#ff4444" cursor="pointer" onClick={() => deleteSkill(s.id)} />

          </div>

        ))}

      </div>

    </div>

  )

}