import { Link, useLocation } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

import { Zap, LayoutDashboard, Brain, ShoppingBag, TrendingUp, User, LogOut, Settings as SettingsIcon } from 'lucide-react'



const NAV = [

  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },

  { to: '/tutor', label: 'Tutor', icon: Brain },

  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },

  { to: '/finance', label: 'Finance', icon: TrendingUp },

  { to: '/profile', label: 'Profile', icon: User },

  { to: '/settings', label: 'Settings', icon: SettingsIcon } // Added Settings here

]



export default function Layout({ children }) {

  const { profile, signOut } = useAuth()

  const location = useLocation()



  return (

    <div style={{

      minHeight: '100vh',

      backgroundColor: 'var(--bg-main)', // Themed background

      display: 'flex',

      flexDirection: 'column',

      transition: 'background-color 0.3s ease'

    }}>

     

      {/* HEADER / NAVBAR */}

      <header style={{

        position: 'fixed',

        top: 0,

        left: 0,

        right: 0,

        zIndex: 1000,

        backgroundColor: 'var(--nav-bg)', // Themed blurred background

        backdropFilter: 'blur(12px)',

        WebkitBackdropFilter: 'blur(12px)',

        borderBottom: '1px solid var(--border-color)', // Themed border

        height: '70px',

        display: 'flex',

        alignItems: 'center',

        transition: 'all 0.3s ease'

      }}>

        <div style={{

          width: '100%',

          maxWidth: '1200px',

          margin: '0 auto',

          padding: '0 20px',

          display: 'flex',

          justifyContent: 'space-between',

          alignItems: 'center'

        }}>

         

          {/* LOGO */}

          <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>

            <img src="/logo.png" alt="TradeMinds Logo" style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} />

            <div style={{ lineHeight: 1.1 }}>

              <span style={{ fontWeight: '900', fontSize: '1.1rem', display: 'block', letterSpacing: '-0.5px' }}>TradeMinds</span>

              <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '800', letterSpacing: '1px' }}>Workspace</span>

            </div>

          </Link>



          {/* NAVIGATION LINKS */}

          <nav className="desktop-nav" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>

            {NAV.map(({ to, label, icon: Icon }) => {

              const active = location.pathname === to

              return (

                <Link

                  key={to}

                  to={to}

                  style={{

                    textDecoration: 'none',

                    display: 'flex',

                    alignItems: 'center',

                    gap: '8px',

                    padding: '8px 16px',

                    borderRadius: '100px',

                    fontSize: '0.85rem',

                    fontWeight: active ? '800' : '500',

                    color: active ? 'var(--text-main)' : 'var(--text-muted)',

                    backgroundColor: active ? 'var(--bg-card)' : 'transparent',

                    transition: 'all 0.2s ease'

                  }}

                >

                  <Icon size={16} />

                  <span className="nav-label" style={{ display: 'inline' }}>{label}</span>

                </Link>

              )

            })}

          </nav>



          {/* USER ACTIONS */}

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

            <div style={{ textAlign: 'right' }} className="user-info-desktop">

               <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)' }}>{profile?.full_name || 'Account'}</p>

               <p style={{ margin: 0, fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Session</p>

            </div>

           

            <button

              onClick={() => signOut()}

              style={{

                background: 'none', border: 'none', cursor: 'pointer',

                color: '#ff4444', // Keep error/exit colors red for safety

                display: 'flex', alignItems: 'center', gap: '8px',

                padding: '8px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem'

              }}

            >

              <LogOut size={16} />

              <span className="nav-label">Exit</span>

            </button>

          </div>

        </div>

      </header>



      {/* MOBILE BOTTOM NAVIGATION */}

      <nav className="mobile-bottom-nav" style={{

        position: 'fixed',

        bottom: 0,

        left: 0,

        right: 0,

        backgroundColor: 'var(--nav-bg)',

        backdropFilter: 'blur(12px)',

        WebkitBackdropFilter: 'blur(12px)',

        borderTop: '1px solid var(--border-color)',

        display: 'none', /* Shown via CSS on mobile */

        justifyContent: 'space-around',

        alignItems: 'center',

        height: '70px',

        zIndex: 1000,

        paddingBottom: 'env(safe-area-inset-bottom)'

      }}>

        {NAV.map(({ to, label, icon: Icon }) => {

          const active = location.pathname === to

          return (

            <Link

              key={to}

              to={to}

              style={{

                textDecoration: 'none',

                display: 'flex',

                flexDirection: 'column',

                alignItems: 'center',

                justifyContent: 'center',

                gap: '4px',

                width: '100%',

                height: '100%',

                color: active ? 'var(--text-main)' : 'var(--text-muted)',

                transition: 'all 0.2s ease'

              }}

            >

              <div style={{

                padding: '6px 16px',

                borderRadius: '100px',

                backgroundColor: active ? 'var(--bg-card)' : 'transparent',

                display: 'flex',

                alignItems: 'center',

                justifyContent: 'center'

              }}>

                <Icon size={20} strokeWidth={active ? 2.5 : 2} />

              </div>

              <span style={{ fontSize: '0.65rem', fontWeight: active ? '700' : '500' }}>{label}</span>

            </Link>

          )

        })}

      </nav>



      {/* MAIN CONTENT AREA */}

      <main className="main-content" style={{ flex: 1, paddingTop: '70px', width: '100%', color: 'var(--text-main)' }}>

        {children}

      </main>



      {/* Mobile Responsiveness CSS */}

      <style>{`

        @media (max-width: 900px) {

          .desktop-nav { display: none !important; }

          .user-info-desktop { display: none !important; }

          .mobile-bottom-nav { display: flex !important; }

          .main-content { padding-bottom: calc(90px + env(safe-area-inset-bottom)) !important; }

        }

      `}</style>

    </div>

  )

}