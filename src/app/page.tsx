import React from 'react';
import Link from 'next/link';
import '../styles/page.css';

function HomePage() {
  return (
    <div className="container">
      <div className="header-section">
        <h1>React 練習專案</h1>
      </div>
      <div className="main-section">
        <p>歡迎光臨我的頁面</p>
      </div>
      <div className="footer-section">
        <Link href="/accounting">
          <button className="start-button">開始</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
