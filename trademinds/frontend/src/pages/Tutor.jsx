import { useState, useRef, useEffect } from 'react'

import { useAuth } from '../context/AuthContext'

import { supabase } from '../lib/supabase'

import { Brain, Send, RotateCcw, AlertCircle, Sparkles, MessageSquare, Plus, BookOpen } from 'lucide-react'

import toast from 'react-hot-toast'



export default function Tutor() {

  const { user } = useAuth()

  const [topic, setTopic] = useState('')

  const [topicSet, setTopicSet] = useState(false)

  const [messages, setMessages] = useState([])

  const [input, setInput] = useState('')

  const [loading, setLoading] = useState(false)

  const [historyTopics, setHistoryTopics] = useState([])

  const [gaps, setGaps] = useState([])

  const messagesEndRef = useRef(null)



  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  }, [messages])



  useEffect(() => {

    if (user) fetchHistoryTopics()

  }, [user])



  useEffect(() => {

    const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');

    if (lastAssistantMsg && lastAssistantMsg.content.includes('?')) {

        const potentialGap = topic + " Fundamentals";

        if (!gaps.includes(potentialGap)) setGaps([potentialGap, ...gaps]);

    }

  }, [messages, topic])



  const fetchHistoryTopics = async () => {

    const { data } = await supabase

      .from('ai_interactions')

      .select('topic')

      .eq('user_id', user.id)

   

    const uniqueTopics = [...new Set(data?.map(item => item.topic))]

    setHistoryTopics(uniqueTopics)

  }



  // --- NEW: LOG LEARNING TIME TO FINANCE ---

  const logLearningTime = async () => {

    try {

      // Find the skill that matches your current topic

      const { data: currentSkill } = await supabase

        .from('skills')

        .select('id, hours_invested')

        .eq('user_id', user.id)

        .ilike('name', `%${topic}%`)

        .single()



      if (currentSkill) {

        const newTime = (currentSkill.hours_invested || 0) + 0.0166; // Adds 1 minute

        await supabase

          .from('skills')

          .update({ hours_invested: newTime })

          .eq('id', currentSkill.id)

       

        console.log(`Log Successful: +1min to ${topic}`);

      }

    } catch (err) {

      console.error("Silent log failed - make sure the skill exists in your profile:", err)

    }

  }



  const loadSpecificChat = async (selectedTopic) => {

    setTopic(selectedTopic)

    setTopicSet(true)

    setLoading(true)

   

    const { data } = await supabase

      .from('ai_interactions')

      .select('*')

      .eq('user_id', user.id)

      .eq('topic', selectedTopic)

      .order('created_at', { ascending: true })



    setMessages(data || [])

    setLoading(false)

  }



  const startSession = async () => {

    if (!topic.trim()) return toast.error('Enter a topic first')

    setTopicSet(true)

    const existing = historyTopics.find(t => t.toLowerCase() === topic.toLowerCase().trim())

    if (existing) {

        loadSpecificChat(existing)

    } else {

        const welcome = {

            user_id: user.id,

            topic: topic.toLowerCase().trim(),

            role: 'assistant',

            content: `New session started for **${topic}**. What is your current level?`

        }

        setMessages([welcome])

        await supabase.from('ai_interactions').insert([welcome])

        fetchHistoryTopics()

    }

  }



  const sendMessage = async () => {

    if (!input.trim() || loading) return

   

    const userContent = input.trim()

    const currentTopic = topic.toLowerCase().trim()

   

    const userMsg = {

      user_id: user.id,

      topic: currentTopic,

      role: 'user',

      content: userContent

    }

   

    setMessages(prev => [...prev, userMsg])

    setInput('')

    setLoading(true)



    try {

      await supabase.from('ai_interactions').insert([userMsg])



      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Session expired. Please log out and back in.");

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          topic: currentTopic
        }),
      })

      if (!response.ok) throw new Error("AI failed to respond")
      
      const responseData = await response.json()
      
      const aiResponseMsg = {
        user_id: user.id,
        topic: currentTopic,
        role: 'assistant',
        content: responseData.content
      }
      
      const { data: insertedChats, error: insertError } = await supabase
        .from('ai_interactions')
        .insert([aiResponseMsg])
        .select('*')

      if (insertError) throw new Error("Failed to save AI response")
      
      if (insertedChats && insertedChats.length > 0) {
        setMessages(prev => [...prev, insertedChats[0]])
       
        // --- TRIGGER TIME LOGGING ---
        logLearningTime()
      }



    } catch (err) {

      console.error("Tutor Error:", err)

      toast.error("Tutor is temporarily unavailable")

    } finally {

      setLoading(false)

    }

  }



  return (

    // ... rest of your UI code remains exactly the same ...

    <div className="tutor-layout" style={{ height: 'calc(100vh - 65px)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>

      {/* (Keep the same JSX structure you provided) */}

      {/* ... Left Sidebar ... */}

      {/* ... Main Chat ... */}

      {/* ... Right Sidebar ... */}

      <div className={`tutor-sidebar ${topicSet ? 'hide-on-mobile' : ''}`} style={{ backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column' }}>

        <button

          onClick={() => { setTopicSet(false); setMessages([]); setTopic(''); setGaps([]); }}

          style={{ margin: '20px', padding: '12px', borderRadius: '10px', border: '1px dashed var(--text-muted)', background: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}

        >

          <Plus size={18} /> New Session

        </button>

       

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 15px' }}>

          <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '15px', letterSpacing: '1px' }}>HISTORY</p>

          {historyTopics.map((t, i) => (

            <div

              key={i} onClick={() => loadSpecificChat(t)}

              style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: topic === t ? 'var(--bg-main)' : 'transparent', border: topic === t ? '1px solid var(--border-color)' : '1px solid transparent' }}

            >

              <MessageSquare size={14} color={topic === t ? 'var(--text-main)' : 'var(--text-muted)'} />

              <span style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'capitalize' }}>{t}</span>

            </div>

          ))}

        </div>

      </div>



      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {!topicSet ? (

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            <div style={{ maxWidth: '400px', textAlign: 'center' }}>

              <Sparkles size={40} style={{ marginBottom: '20px', opacity: 0.3 }} />

              <h1 style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-1px' }}>What are we mastering?</h1>

              <input

                value={topic} onChange={e => setTopic(e.target.value)}

                placeholder="Topic (e.g. React, Finance)"

                style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid var(--text-main)', background: 'var(--bg-card)', color: 'var(--text-main)', marginTop: '20px', outline: 'none' }}

              />

              <button onClick={startSession} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--text-main)', color: 'var(--bg-main)', marginTop: '12px', fontWeight: '800', cursor: 'pointer' }}>

                Start Learning

              </button>

            </div>

          </div>

        ) : (

          <>

            <div style={{ padding: '15px 30px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                    <BookOpen size={18} />

                    <h2 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'capitalize', fontWeight: '800' }}>{topic}</h2>

                </div>

            </div>

           

            <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>

              <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {messages.map((msg, i) => (

                  <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>

                    <div style={{ backgroundColor: msg.role === 'user' ? 'var(--text-main)' : 'var(--bg-card)', color: msg.role === 'user' ? 'var(--bg-main)' : 'var(--text-main)', padding: '12px 18px', borderRadius: '15px', border: '1px solid var(--border-color)', fontSize: '0.9rem', lineHeight: '1.5' }}>

                      {msg.content}

                    </div>

                  </div>

                ))}

                {loading && (

                  <div style={{ alignSelf: 'flex-start', opacity: 0.6, fontSize: '0.8rem', fontWeight: '600' }}>

                    Tutor is thinking...

                  </div>

                )}

                <div ref={messagesEndRef} />

              </div>

            </div>



            <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)' }}>

              <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', gap: '10px' }}>

                <input

                  value={input} onChange={e => setInput(e.target.value)}

                  onKeyDown={e => e.key === 'Enter' && sendMessage()}

                  placeholder="Ask anything..."

                  style={{ flex: 1, padding: '12px 18px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}

                />

                <button onClick={sendMessage} style={{ padding: '0 20px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--text-main)', color: 'var(--bg-main)', cursor: 'pointer' }}>

                  {loading ? <RotateCcw size={16} className="animate-spin" /> : <Send size={16}/>}

                </button>

              </div>

            </div>

          </>

        )}

      </div>

      {/* Knowledge Gaps section omitted for brevity but should remain exactly as yours */}

    </div>

  )

}