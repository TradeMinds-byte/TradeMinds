import React from 'react'

import ReactDOM from 'react-dom/client'

import App from './App.jsx'

import './styles/globals.css'



class ErrorBoundary extends React.Component {

  state = { error: null }

  static getDerivedStateFromError(error) {

    return { error }

  }

  render() {

    if (this.state.error) {

      return (

        <div style={{

          minHeight: '100vh',

          background: '#0a0a0f',

          color: '#f0f0ff',

          padding: 24,

          fontFamily: 'system-ui, sans-serif',

        }}>

          <h1 style={{ color: '#ff7c2a', marginBottom: 16 }}>Something went wrong</h1>

          <pre style={{ background: '#16162a', padding: 16, borderRadius: 8, overflow: 'auto' }}>

            {this.state.error?.message || String(this.state.error)}

          </pre>

          <p style={{ marginTop: 16, color: '#b0b0d8' }}>

            Check the browser console (F12) for more details.

          </p>

        </div>

      )

    }

    return this.props.children

  }

}



ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>

    <ErrorBoundary>

      <App />

    </ErrorBoundary>

  </React.StrictMode>

)