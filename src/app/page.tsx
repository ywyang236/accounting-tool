// src/app/page.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import '../styles/page.css';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

function HomePage() {
  return (
    <div className="container">
      <div className="header-section">
        <h1>React 練習專案</h1>
      </div>
      <div className="main-section">
        <p>歡迎光臨我的頁面</p>
        <SignIn />
        <SignUp />
      </div>
      <div className="footer-section">
        <Link href="/accounting">
          <a>
            <button className="start-button">開始</button>
          </a>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;