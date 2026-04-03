import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Send, User, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function TradeChat({ tradeId, recipientName }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [isTutorMode, setIsTutorMode] = useState(false)
  const [isAiThinking, setIsAiThinking] = useState(false)
  const scrollRef = useRef()

  // This MUST match the ID used in your Edge Function and SQL Editor
  const AI_ID = '00000000-0000-0000-0000-000000000000'

  useEffect(() => {
    fetchMessages()

    // Realtime listener: Automatically adds new messages (User or AI) to the UI
    const channel = supabase
      .channel(`trade-room-${tradeId}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `trade_id=eq.${tradeId}`
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.find(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [tradeId])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isAiThinking])

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('trade_id', tradeId)
      .order('created_at', { ascending: true })

    if (error) console.error("Error fetching messages:", error)
    setMessages(data || [])
    setLoading(false)
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || isAiThinking) return

    const content = newMessage
    setNewMessage('')

    // 1. Insert User Message into Database
    const { error: userError } = await supabase.from('messages').insert({
      trade_id: tradeId,
      sender_id: user.id,
      content: content
    })

    if (userError) {
      toast.error('Failed to send message')
      return
    }

    // 2. If Tutor Mode is on, call the Edge Function
    if (isTutorMode) {
      setIsAiThinking(true)
      try {
        // Get the fresh session to fix the 401 Unauthorized error
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (!session || sessionError) {
          throw new Error("Session expired. Please log out and back in.");
        }

        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            messages: [{ role: 'user', content: content }],
            topic: tradeId
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "AI failed to respond")
        }

        const responseData = await response.json()

        const { error: aiError } = await supabase.from('messages').insert({
          trade_id: tradeId,
          sender_id: AI_ID,
          content: responseData.content
        })

        if (aiError) {
          throw new Error("Failed to save AI response")
        }

      } catch (err) {
        console.error("Tutor Error:", err)
        toast.error(err.message)
      } finally {
        setIsAiThinking(false)
      }
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '70vh', minHeight: '500px',
      backgroundColor: 'var(--bg-card)', borderRadius: '24px',
      border: '1px solid var(--border-color)', overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-main)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--text-main)', color: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontWeight: '800' }}>{recipientName}</h4>
            <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '800' }}>● LIVE CHAT</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsTutorMode(!isTutorMode)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '14px',
            border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem',
            backgroundColor: isTutorMode ? '#8b5cf6' : 'var(--bg-card)',
            color: isTutorMode ? 'white' : 'var(--text-muted)',
            boxShadow: isTutorMode ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none',
            transition: '0.3s all ease'
          }}
        >
          <Sparkles size={16} /> {isTutorMode ? 'TUTOR ACTIVE' : 'ACTIVATE TUTOR'}
        </button>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Loading history...</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user.id
            const isAI = msg.sender_id === AI_ID
            return (
              <div key={msg.id} style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                backgroundColor: isAI ? '#f3e8ff' : (isMe ? 'var(--text-main)' : 'var(--bg-card)'),
                color: isAI ? '#6b21a8' : (isMe ? 'var(--bg-main)' : 'var(--text-main)'),
                padding: '14px 18px',
                borderRadius: isMe ? '22px 22px 4px 22px' : '22px 22px 22px 4px',
                border: isMe ? 'none' : '1px solid var(--border-color)',
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                {isAI && <div style={{ fontSize: '0.65rem', marginBottom: '4px', fontWeight: '900', textTransform: 'uppercase' }}>✨ AI Intelligence</div>}
                {msg.content}
              </div>
            )
          })
        )}
        {isAiThinking && (
          <div style={{ alignSelf: 'flex-start', backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '12px 18px', borderRadius: '22px 22px 22px 4px', fontSize: '0.9rem' }}>
            AI is thinking...
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} style={{ padding: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px', backgroundColor: 'var(--bg-main)' }}>
        <input
          style={{
            flex: 1, backgroundColor: 'var(--bg-card)', border: isTutorMode ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
            padding: '14px 20px', borderRadius: '16px', color: 'var(--text-main)', outline: 'none',
            fontSize: '1rem'
          }}
          placeholder={isTutorMode ? "Ask your strategy tutor..." : "Write a message..."}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" disabled={!newMessage.trim() || isAiThinking} style={{
          backgroundColor: isTutorMode ? '#8b5cf6' : 'var(--text-main)', color: 'white',
          border: 'none', width: '52px', height: '52px', borderRadius: '16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Send size={22} />
        </button>
      </form>
    </div>
  )
}