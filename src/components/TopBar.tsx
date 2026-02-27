import React from 'react';
import { Bell, Menu } from 'lucide-react';
import './TopBar.css';

interface TopBarProps {
    title: string;
    showProfile?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ title, showProfile }) => {
    return (
        <header className="top-bar">
            <div className="top-bar-left">
                {showProfile ? (
                    <div className="profile-pic">
                        <img src="https://i.pravatar.cc/150?img=11" alt="Farmer Profile" />
                    </div>
                ) : (
                    <button className="icon-btn">
                        <Menu />
                    </button>
                )}
                <h1 className="top-bar-title">{title}</h1>
            </div>
            <div className="top-bar-right">
                <button className="icon-btn notification-btn">
                    <Bell />
                    <span className="badge"></span>
                </button>
            </div>
        </header>
    );
};
