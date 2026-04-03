import React from 'react';

import { Link } from 'react-router-dom';

import { ArrowRight, Globe, Zap, Shield, Moon, Sun } from 'lucide-react';

import { useTheme } from '../context/ThemeContext'; // Import our theme hook



const Landing = () => {

  const { theme, toggleTheme } = useTheme();



  return (

    <div className="centered-hero" style={{

      minHeight: '100vh',

      backgroundColor: 'var(--bg-main)',

      color: 'var(--text-main)',

      display: 'flex',

      flexDirection: 'column',

      alignItems: 'center',

      justifyContent: 'center',

      transition: 'all 0.3s ease',

      position: 'relative'

    }}>

     

      {/* 1. THEME TOGGLE (Top Right) */}

      <div style={{ position: 'absolute', top: '30px', right: '30px', display: 'flex', gap: '10px' }}>

        <button

          onClick={() => toggleTheme('light')}

          style={{

            background: theme === 'light' ? 'var(--text-main)' : 'transparent',

            color: theme === 'light' ? 'var(--bg-main)' : 'var(--text-main)',

            border: '1px solid var(--border-color)',

            padding: '10px', borderRadius: '50%', cursor: 'pointer', display: 'flex'

          }}

        >

          <Sun size={18} />

        </button>

        <button

          onClick={() => toggleTheme('dark')}

          style={{

            background: theme === 'dark' ? 'var(--text-main)' : 'transparent',

            color: theme === 'dark' ? 'var(--bg-main)' : 'var(--text-main)',

            border: '1px solid var(--border-color)',

            padding: '10px', borderRadius: '50%', cursor: 'pointer', display: 'flex'

          }}

        >

          <Moon size={18} />

        </button>

      </div>



      {/* 2. VERSION BADGE */}

      <div style={{

        padding: '8px 16px',

        backgroundColor: 'var(--text-main)',

        color: 'var(--bg-main)',

        borderRadius: '20px',

        fontSize: '0.8rem',

        fontWeight: '700',

        marginBottom: '20px'

      }}>

        v1.0 is now live

      </div>



      {/* 3. HERO CONTENT */}

      <img src="/logo.png" alt="TradeMinds Logo" style={{ width: '120px', height: '120px', borderRadius: '30px', marginBottom: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />

      <h1 style={{

        fontSize: '4.5rem',

        fontWeight: '900',

        letterSpacing: '-3px',

        margin: '0 0 20px 0',

        color: 'var(--text-main)'

      }}>

        TradeMinds

      </h1>

     

      <p style={{

        maxWidth: '600px',

        textAlign: 'center',

        fontSize: '1.2rem',

        lineHeight: '1.6',

        color: 'var(--text-muted)',

        fontWeight: '500'

      }}>

        The ultimate marketplace for trading skills. Connect with experts,

        level up your knowledge, and grow your portfolio in a clean,

        distraction-free environment.

      </p>



      {/* 4. MAIN ACTION BUTTONS */}

      <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>

        <Link to="/register" style={{

          textDecoration: 'none',

          backgroundColor: 'var(--text-main)',

          color: 'var(--bg-main)',

          padding: '16px 32px',

          borderRadius: '12px',

          fontWeight: '800',

          display: 'flex',

          alignItems: 'center',

          gap: '10px'

        }}>

          Get Started <ArrowRight size={18} />

        </Link>

       

        <Link to="/marketplace" style={{

          textDecoration: 'none',

          backgroundColor: 'transparent',

          color: 'var(--text-main)',

          border: '1px solid var(--text-main)', // Using text color for border

          padding: '16px 32px',

          borderRadius: '12px',

          fontWeight: '800'

        }}>

          Browse Skills

        </Link>

      </div>



      {/* 5. TRUST ICONS */}

      <div style={{

        marginTop: '80px',

        display: 'flex',

        gap: '40px',

        opacity: 0.6,

        color: 'var(--text-muted)'

      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>

          <Zap size={20} /> <span>Fast</span>

        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>

          <Shield size={20} /> <span>Secure</span>

        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>

          <Globe size={20} /> <span>Global</span>

        </div>

      </div>

    </div>

  );

};



export default Landing;