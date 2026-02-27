import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { MarketScreen } from './screens/MarketScreen';
import { ScanScreen } from './screens/ScanScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/marketplace" element={<MarketScreen />} />
            <Route path="/scan" element={<ScanScreen />} />
            <Route path="/insights" element={<InsightsScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
