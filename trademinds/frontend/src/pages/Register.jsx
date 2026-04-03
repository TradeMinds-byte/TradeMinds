import { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

import { Zap, ArrowLeft } from 'lucide-react'

import toast from 'react-hot-toast'



export default function Register() {

  const { signUp } = useAuth()

  const navigate = useNavigate()

  const [name, setName] = useState('')

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)



  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!name.trim() || !email.trim() || !password) {

      toast.error('Please fill in name, email and password')

      return

    }

    if (password.length < 6) {

      toast.error('Password must be at least 6 characters')

      return

    }

    setLoading(true)

    try {

      await signUp(email.trim(), password, name.trim())

      toast.success('Account created! Sign in to continue.')

      navigate('/login')

    } catch (err) {

      toast.error(err?.message || 'Registration failed')

    } finally {

      setLoading(false)

    }

  }



  const inputStyle = {

    width: '100%',

    padding: '12px',

    borderRadius: '10px',

    backgroundColor: 'var(--bg-main)',

    color: 'var(--text-main)',

    border: '1px solid var(--border-color)',

    outline: 'none',

    marginTop: '5px'

  }



  return (

    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', transition: '0.3s' }}>

     

      {/* HEADER */}

      <header style={{ padding: '20px' }}>

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600' }}>

            <ArrowLeft size={16} /> Back

          </Link>

          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Account</span>

        </div>

      </header>



      {/* FORM CONTAINER */}

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>

        <div style={{ width: '100%', maxWidth: '400px' }}>

         

          {/* LOGO */}

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '40px', textDecoration: 'none', color: 'var(--text-main)' }}>

            <div style={{ width: '44px', height: '44px', backgroundColor: 'var(--text-main)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

              <Zap size={22} color="var(--bg-main)" fill="var(--bg-main)" />

            </div>

            <span style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-1px' }}>TradeMinds</span>

          </Link>



          {/* REGISTER CARD */}

          <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-color)' }}>

            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>Create account</h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>Set up your profile to start tracking skill value.</p>

           

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              <div>

                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Full Name</label>

                <input

                  type="text"

                  style={inputStyle}

                  placeholder="Your name"

                  value={name}

                  onChange={(e) => setName(e.target.value)}

                  required

                />

              </div>



              <div>

                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email</label>

                <input

                  type="email"

                  style={inputStyle}

                  placeholder="you@example.com"

                  value={email}

                  onChange={(e) => setEmail(e.target.value)}

                  required

                />

              </div>

             

              <div>

                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Password</label>

                <input

                  type="password"

                  style={inputStyle}

                  placeholder="At least 6 characters"

                  value={password}

                  onChange={(e) => setPassword(e.target.value)}

                  required

                />

              </div>



              <button

                type="submit"

                disabled={loading}

                style={{

                  backgroundColor: 'var(--text-main)',

                  color: 'var(--bg-main)',

                  padding: '14px',

                  borderRadius: '12px',

                  border: 'none',

                  fontWeight: '800',

                  fontSize: '1rem',

                  cursor: 'pointer',

                  marginTop: '10px',

                  opacity: loading ? 0.7 : 1

                }}

              >

                {loading ? 'Creating account...' : 'Create account'}

              </button>

            </form>



            <p style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>

              Already have an account?{' '}

              <Link to="/login" style={{ color: 'var(--text-main)', fontWeight: '800', textDecoration: 'none' }}>Sign in</Link>

            </p>

          </div>

        </div>

      </div>

    </div>

  )

}