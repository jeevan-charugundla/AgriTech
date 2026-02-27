import React from 'react';
import { TopBar } from '../components/TopBar';
import { Sun, CloudRain, Droplets, AlertTriangle, TrendingUp, IndianRupee, Leaf, FileText, ScanLine, ShoppingBag, MessageSquare, BookOpen, Landmark, ChevronRight } from 'lucide-react';
import './HomeScreen.css';

export const HomeScreen: React.FC = () => {
    return (
        <div className="screen-container">
            <TopBar title="Smart Farmer" showProfile={true} />

            <div className="content-padding">
                {/* Greeting */}
                <div className="greeting-section">
                    <h2>Good Morning, Ram Kishan</h2>
                    <p>Here is your farm summary today.</p>
                </div>

                {/* Weather Card */}
                <div className="weather-card">
                    <div className="weather-header">
                        <div>
                            <h3>Pune, Maharashtra</h3>
                            <p>Mostly Sunny</p>
                        </div>
                        <Sun className="weather-icon-main" />
                    </div>
                    <div className="weather-stats">
                        <div className="stat">
                            <span className="stat-val">32°C</span>
                            <span className="stat-label">Temp</span>
                        </div>
                        <div className="stat">
                            <Droplets className="stat-icon" />
                            <span className="stat-val">45%</span>
                            <span className="stat-label">Humidity</span>
                        </div>
                        <div className="stat">
                            <CloudRain className="stat-icon" />
                            <span className="stat-val">10%</span>
                            <span className="stat-label">Rain Prob.</span>
                        </div>
                    </div>
                </div>

                {/* Smart Alerts */}
                <h3 className="section-title">Smart AI Alerts</h3>
                <div className="alerts-container">
                    <div className="alert-card warning">
                        <AlertTriangle className="alert-icon" />
                        <div className="alert-content">
                            <h4>Pest Risk Alert</h4>
                            <p>High risk of Whitefly in Cotton. Spray recommended today.</p>
                        </div>
                    </div>
                    <div className="alert-card info">
                        <Droplets className="alert-icon" />
                        <div className="alert-content">
                            <h4>Irrigation Reminder</h4>
                            <p>Wheat fields need water. Soil moisture is below 30%.</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <h3 className="section-title">Quick Actions</h3>
                <div className="quick-actions-grid">
                    <button className="action-btn">
                        <div className="icon-wrapper bg-green"><ScanLine /></div>
                        <span>Scan Crop</span>
                    </button>
                    <button className="action-btn">
                        <div className="icon-wrapper bg-orange"><ShoppingBag /></div>
                        <span>Sell Produce</span>
                    </button>
                    <button className="action-btn">
                        <div className="icon-wrapper bg-blue"><MessageSquare /></div>
                        <span>Ask AI</span>
                    </button>
                    <button className="action-btn">
                        <div className="icon-wrapper bg-yellow"><TrendingUp /></div>
                        <span>Market Price</span>
                    </button>
                    <button className="action-btn">
                        <div className="icon-wrapper bg-teal"><Leaf /></div>
                        <span>Fertilizer</span>
                    </button>
                    <button className="action-btn">
                        <div className="icon-wrapper bg-purple"><Landmark /></div>
                        <span>Schemes</span>
                    </button>
                </div>

                {/* Farm Dashboard / Profit Summary */}
                <h3 className="section-title">Farm Summary</h3>
                <div className="farm-summary-grid">
                    <div className="summary-card">
                        <IndianRupee className="summary-icon text-green" />
                        <span className="summary-value">₹45,000</span>
                        <span className="summary-label">Earnings this month</span>
                    </div>
                    <div className="summary-card">
                        <FileText className="summary-icon text-orange" />
                        <span className="summary-value">3 Active</span>
                        <span className="summary-label">Crops growing</span>
                    </div>
                    <div className="summary-card">
                        <TrendingUp className="summary-icon text-blue" />
                        <span className="summary-value">12.5 T</span>
                        <span className="summary-label">Expected yield</span>
                    </div>
                    <div className="summary-card">
                        <ShoppingBag className="summary-icon text-purple" />
                        <span className="summary-value">2</span>
                        <span className="summary-label">Pending orders</span>
                    </div>
                </div>

                {/* Market Insights */}
                <div className="market-card">
                    <div className="market-header">
                        <h3>Market Price Insights</h3>
                        <button className="text-btn">Detailed Trends <ChevronRight size={16} /></button>
                    </div>
                    <div className="market-prices">
                        <div className="market-item">
                            <span>Cotton (Premium)</span>
                            <span className="price-up">₹7,200/q <TrendingUp size={14} /></span>
                        </div>
                        <div className="market-item">
                            <span>Wheat (Lokwan)</span>
                            <span className="price-neutral">₹2,800/q</span>
                        </div>
                    </div>
                </div>

                {/* AI Recommendations */}
                <h3 className="section-title">Smart AI Recommendations</h3>
                <div className="recommendations-container">
                    <div className="rec-card">
                        <img src="https://images.unsplash.com/photo-1594916894087-3c072b22ceae?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="Crop" />
                        <div className="rec-info">
                            <h4>Suggested Next Crop</h4>
                            <p>Consider planting Soybeans next season based on current soil Nitrogen levels and market demand.</p>
                        </div>
                    </div>
                </div>

                {/* Schemes */}
                <div className="schemes-banner">
                    <Landmark size={24} />
                    <div className="banner-content">
                        <h4>PM Kisan Samman Nidhi</h4>
                        <p>New installment releasing next week. Check status.</p>
                    </div>
                    <ChevronRight />
                </div>

            </div>
        </div>
    );
};
