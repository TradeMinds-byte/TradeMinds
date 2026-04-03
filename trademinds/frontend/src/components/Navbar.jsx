import { Link, useNavigate, useLocation } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

import { LayoutDashboard, ShoppingBag, Brain, LogOut, User } from 'lucide-react'

import toast from 'react-hot-toast'



export default function Navbar() {

  const { profile, signOut } = useAuth()

  const navigate = useNavigate()

  const location = useLocation()



  // Hide Navbar on Landing page if necessary

  if (location.pathname === '/') return null;



  const handleLogout = async () => {

    try {

      await signOut()

      toast.success('Logged out successfully')

      navigate('/login')

    } catch (error) {

      toast.error('Error signing out')

    }

  }



  return (

    <nav style={{

      position: 'fixed', // Changed to fixed to ensure it stays at top during scroll

      top: 0,

      left: 0,

      right: 0,

      zIndex: 1000,

      backgroundColor: 'rgba(255, 255, 255, 0.8)',

      backdropFilter: 'blur(12px)',

      WebkitBackdropFilter: 'blur(12px)',

      borderBottom: '1px solid #f0f0f0',

      padding: '0 40px',

      height: '70px',

      display: 'flex',

      justifyContent: 'space-between',

      alignItems: 'center'

    }}>

      {/* LOGO */}

      <Link to="/dashboard" style={{

        textDecoration: 'none',

        color: '#000',

        fontSize: '1.2rem',

        fontWeight: '900',

        letterSpacing: '-1px',

        display: 'flex',

        alignItems: 'center',

        gap: '10px'

      }}>

        <div style={{ width: '28px', height: '28px', backgroundColor: '#000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            <div style={{ width: '10px', height: '10px', border: '2px solid white', transform: 'rotate(45deg)' }}></div>

        </div>

        TradeMinds

      </Link>



      {/* CENTER LINKS */}

      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>

        <NavLink to="/dashboard" active={location.pathname === '/dashboard'}>

            <LayoutDashboard size={18} /> Dashboard

        </NavLink>

        <NavLink to="/marketplace" active={location.pathname === '/marketplace'}>

            <ShoppingBag size={18} /> Marketplace

        </NavLink>

        <NavLink to="/tutor" active={location.pathname === '/tutor'}>

            <Brain size={18} /> AI Tutor

        </NavLink>

      </div>



      {/* RIGHT SIDE: USER & ACTION */}

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>

        <Link to="/profile" style={{

            textDecoration: 'none',

            color: '#000',

            display: 'flex',

            alignItems: 'center',

            gap: '10px',

            padding: '6px 12px',

            borderRadius: '100px',

            transition: 'background 0.2s'

        }}

        className="nav-profile-link"

        >

             <div style={{

                width: '32px', height: '32px', borderRadius: '50%',

                backgroundColor: '#000', color: '#fff',

                display: 'flex', alignItems: 'center', justifyContent: 'center',

                fontSize: '0.8rem', fontWeight: '800'

             }}>

                {profile?.name?.[0]?.toUpperCase() || <User size={16} />}

             </div>

             <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{profile?.name || 'Account'}</span>

        </Link>

       

        <div style={{ width: '1px', height: '20px', backgroundColor: '#eee' }}></div>



        <button

          onClick={handleLogout}

          style={{

            background: 'none', border: 'none', cursor: 'pointer',

            color: '#999', display: 'flex', alignItems: 'center',

            padding: '8px', borderRadius: '8px', transition: 'all 0.2s'

          }}

          title="Logout"

          onMouseEnter={(e) => { e.currentTarget.style.color = '#ff4444'; e.currentTarget.style.backgroundColor = '#fff1f1'; }}

          onMouseLeave={(e) => { e.currentTarget.style.color = '#999'; e.currentTarget.style.backgroundColor = 'transparent'; }}

        >

          <LogOut size={18} />

        </button>

      </div>

    </nav>

  )

}



function NavLink({ to, children, active }) {

  return (

    <Link to={to} style={{

      textDecoration: 'none',

      color: active ? '#000' : '#666',

      fontSize: '0.85rem',

      fontWeight: active ? '800' : '500',

      padding: '10px 18px',

      borderRadius: '10px',

      backgroundColor: active ? '#f5f5f7' : 'transparent',

      display: 'flex',

      alignItems: 'center',

      gap: '8px',

      transition: 'all 0.2s ease'

    }}

    onMouseEnter={(e) => { if(!active) e.currentTarget.style.backgroundColor = '#f9f9fb'; }}

    onMouseLeave={(e) => { if(!active) e.currentTarget.style.backgroundColor = 'transparent'; }}

    >

      {children}

    </Link>

  )

}