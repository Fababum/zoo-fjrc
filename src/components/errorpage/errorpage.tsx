// src/pages/NotFound.tsx
import './errorpage.css';
import tumbleweed from './Tumbleweed.png';
import errorpage from './background.png';


export default function NotFound() {
  return (
    <div style={{
      backgroundImage: `url(${errorpage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      position: 'relative'
    }}>
        <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          paddingLeft: '100px',
          paddingRight: '100px',
          paddingBottom: '20px',
          paddingTop: '0px',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}
      >
        <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "0", marginTop: "20px" }}>Error</h1>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "0", marginTop: "-15px" }}>404</h1>
        <div
        style={{
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}>

      </div>
        <p style={{ marginBottom: "0", marginTop: "15px"}}>Page not found</p>
        <a href="/" style={{ color: '#0066cc' }}>
          ← Go back home
        </a>
      </div>
        <div>
        <img
          src={tumbleweed}
          alt="Error Illustration"
          className="tumbleweed"
        />
      </div>
    </div>

  );
}