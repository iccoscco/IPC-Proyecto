// frontend/src/App.js
import React, { useState } from 'react';
import Sidebar from './Widgets/sidebar'; 
import './App.css'; 

function App({ children }) {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleMenu = () => {
    setSidebarActive(!sidebarActive);
  };

  return (
    <div>
      <button className="menu-toggle" >☰</button>
      <div className="container">
        <div className="main-content">
          {children}
        </div>
        <div className={sidebarActive ? 'active' : ''}>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default App;