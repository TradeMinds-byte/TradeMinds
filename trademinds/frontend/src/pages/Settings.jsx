import { useTheme } from '../context/ThemeContext';

import { Moon, Sun, Check, Monitor, Shield, Bell } from 'lucide-react';



export default function Settings() {

  const { theme, toggleTheme } = useTheme();



  const sectionStyle = {

    marginBottom: '40px',

    padding: '30px',

    backgroundColor: 'var(--bg-card)',

    borderRadius: '24px',

    border: '1px solid var(--border-color)',

  };



  const optionButtonStyle = (mode) => ({

    flex: 1,

    padding: '25px',

    borderRadius: '16px',

    cursor: 'pointer',

    transition: 'all 0.2s ease',

    display: 'flex',

    flexDirection: 'column',

    alignItems: 'center',

    gap: '12px',

    position: 'relative',

    backgroundColor: mode === 'dark' ? '#000' : '#fff',

    border: theme === mode ? '2px solid var(--text-main)' : '1px solid var(--border-color)',

  });



  return (

    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>

      <header style={{ marginBottom: '40px' }}>

        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1.5px', margin: 0 }}>Settings</h1>

        <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Customize your TradeMinds workspace.</p>

      </header>



      {/* APPEARANCE SECTION */}

      <section style={sectionStyle}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>

          <Monitor size={18} />

          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>Appearance</h2>

        </div>



        <div style={{ display: 'flex', gap: '20px' }}>

          {/* DARK MODE */}

          <div onClick={() => toggleTheme('dark')} style={optionButtonStyle('dark')}>

            <div style={{ width: '40px', height: '40px', backgroundColor: '#111', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

              <Moon size={20} color="white" />

            </div>

            <span style={{ fontWeight: '700', color: '#fff', fontSize: '0.9rem' }}>Pitch Black</span>

            {theme === 'dark' && <Check size={16} color="white" style={{ position: 'absolute', top: 15, right: 15 }} />}

          </div>



          {/* LIGHT MODE */}

          <div onClick={() => toggleTheme('light')} style={optionButtonStyle('light')}>

            <div style={{ width: '40px', height: '40px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

              <Sun size={20} color="black" />

            </div>

            <span style={{ fontWeight: '700', color: '#000', fontSize: '0.9rem' }}>Pure White</span>

            {theme === 'light' && <Check size={16} color="black" style={{ position: 'absolute', top: 15, right: 15 }} />}

          </div>

        </div>

      </section>



      {/* PLACEHOLDER SECTIONS FOR SCALE */}

      <section style={{ ...sectionStyle, opacity: 0.5, cursor: 'not-allowed' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>

          <Shield size={18} />

          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>Privacy & Security</h2>

        </div>

        <p style={{ fontSize: '0.85rem', margin: 0 }}>Two-factor authentication and data controls (Coming Soon)</p>

      </section>

    </div>

  );

}