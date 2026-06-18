import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();

  const styles = {
    nav: {
      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      padding: '0 30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      boxShadow: '0 2px 10px rgba(79,70,229,0.3)',
    },
    brand: { color: '#fff', fontSize: '20px', fontWeight: '700', textDecoration: 'none' },
    links: { display: 'flex', gap: '10px' },
    link: (active) => ({
      color: active ? '#fff' : 'rgba(255,255,255,0.7)',
      textDecoration: 'none',
      padding: '8px 18px',
      borderRadius: '8px',
      background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
      fontWeight: active ? '600' : '400',
      transition: 'all 0.2s',
    })
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🎓 Student MS</Link>
      <div style={styles.links}>
        <Link to="/"    style={styles.link(pathname === '/')}>Students</Link>
        <Link to="/add" style={styles.link(pathname === '/add')}>+ Add Student</Link>
      </div>
    </nav>
  );
}