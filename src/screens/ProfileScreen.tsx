import React, { useState } from 'react';
import { TopBar } from '../components/TopBar';
import {
    User, MapPin, Maximize, Sprout, Languages, Edit3, Bell, Moon,
    Landmark, PhoneCall, HelpCircle, Shield, LogOut, ChevronRight,
    FileText, Umbrella, CalendarDays, MessageSquare, BookOpen, Key, Lock, Settings, ArrowLeft
} from 'lucide-react';
import './ProfileScreen.css';
import { ProfileViewState, SupportedLanguage, FarmDetails, NotificationPrefs } from '../types/profile';

export const ProfileScreen: React.FC = () => {
    // Top component state
    const [viewState, setViewState] = useState<ProfileViewState>('main');
    const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Profile internal state
    const [language, setLanguage] = useState<SupportedLanguage>('English');
    const [darkMode, setDarkMode] = useState(false);

    const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>({
        diseaseAlerts: true,
        marketAlerts: true,
        orderAlerts: true,
        weatherAlerts: true,
        govSchemes: false
    });

    const [farmDetails, setFarmDetails] = useState<FarmDetails>({
        size: '5 Acres',
        soilType: 'Black Cotton',
        irrigationType: 'Drip',
        equipment: ['Tractor D21'],
        cropTypes: ['Tomato', 'Wheat', 'Soybean']
    });

    // Sub-view component helpers
    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleBack = () => setViewState('main');

    // === MODAL RENDERS ===
    const renderLanguageModal = () => (
        <div className="modal-overlay" onClick={() => setLanguageMenuOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3 className="modal-title">Select Language</h3>
                <div className="lang-grid">
                    {(['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Marathi'] as SupportedLanguage[]).map(lang => (
                        <button
                            key={lang}
                            className={`lang-btn ${language === lang ? 'selected' : ''}`}
                            onClick={() => {
                                setLanguage(lang);
                                setLanguageMenuOpen(false);
                                showToast(`Language changed to ${lang}`);
                            }}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    // === SUB-VIEWS ===
    const renderFarmDetailsForm = () => (
        <div className="content-padding animate-entrance">
            <div className="subview-header">
                <button className="back-btn" onClick={handleBack}><ArrowLeft size={24} /></button>
                <h2>Farm Details</h2>
            </div>
            <div className="settings-card" style={{ padding: '24px 20px' }}>
                <div className="form-group">
                    <label className="form-label">Farm Size</label>
                    <input type="text" className="form-control" defaultValue={farmDetails.size} />
                </div>
                <div className="form-group">
                    <label className="form-label">Soil Type</label>
                    <input type="text" className="form-control" defaultValue={farmDetails.soilType} />
                </div>
                <div className="form-group">
                    <label className="form-label">Irrigation Type</label>
                    <input type="text" className="form-control" defaultValue={farmDetails.irrigationType} />
                </div>
                <div className="form-group">
                    <label className="form-label">Primary Crops</label>
                    <input type="text" className="form-control" defaultValue={farmDetails.cropTypes.join(', ')} />
                </div>
                <button
                    className="btn-primary"
                    onClick={() => {
                        handleBack();
                        showToast('Farm details successfully updated!');
                    }}
                >
                    Save Details
                </button>
            </div>
        </div>
    );

    const renderNotificationsView = () => (
        <div className="content-padding animate-entrance">
            <div className="subview-header">
                <button className="back-btn" onClick={handleBack}><ArrowLeft size={24} /></button>
                <h2>Notification Settings</h2>
            </div>
            <div className="settings-card">
                {Object.keys(notifPrefs).map((key) => {
                    const prefKey = key as keyof NotificationPrefs;
                    return (
                        <div className="s-item" key={key}>
                            <div className="s-text">
                                <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                            </div>
                            <div
                                className={`toggle-switch ${notifPrefs[prefKey] ? 'active' : ''}`}
                                onClick={() => {
                                    setNotifPrefs({ ...notifPrefs, [prefKey]: !notifPrefs[prefKey] });
                                }}
                            ></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderServiceStub = (title: string, subtitle: string, icon: JSX.Element) => (
        <div className="content-padding animate-entrance">
            <div className="subview-header">
                <button className="back-btn" onClick={handleBack}><ArrowLeft size={24} /></button>
                <h2>{title}</h2>
            </div>
            <div className="settings-card text-center" style={{ padding: '40px 20px' }}>
                <div className="mx-auto mb-4 text-green-600 flex justify-center w-full">
                    {icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{title} Portal</h3>
                <p className="text-secondary">{subtitle}</p>
                <button className="btn-primary mt-8">Apply / Browse</button>
            </div>
        </div>
    );

    // === MAIN SCREEN ===
    const renderMainScreen = () => (
        <div className="content-padding pb-24 animate-entrance">
            {/* TOP PROFILE CARD */}
            <div className="profile-hero-card">
                <div className="profile-info-row">
                    <div className="profile-avatar-wrapper">
                        <img src="https://i.pravatar.cc/150?img=11" alt="Farmer" />
                    </div>
                    <div className="profile-details-main">
                        <h2>Ram Kishan</h2>
                        <p className="verified-badge"><Shield size={14} className="text-green" /> Verified Farmer</p>
                        <button className="btn-edit-profile-small">
                            <Edit3 size={14} /> Edit Profile
                        </button>
                    </div>
                </div>

                <div className="profile-stats-grid">
                    <div className="p-stat">
                        <MapPin size={16} className="text-primary" />
                        <span>Pune, MH</span>
                    </div>
                    <div className="p-stat">
                        <Maximize size={16} className="text-primary" />
                        <span>{farmDetails.size}</span>
                    </div>
                    <div className="p-stat">
                        <Sprout size={16} className="text-primary" />
                        <span>{farmDetails.cropTypes.slice(0, 2).join(', ')}</span>
                    </div>
                    <div className="p-stat">
                        <Languages size={16} className="text-primary" />
                        <span>{language}, etc.</span>
                    </div>
                </div>
            </div>

            {/* ACCOUNT MANAGEMENT SECTION */}
            <div className="settings-section">
                <h3 className="section-header">Account Management</h3>
                <div className="settings-card">
                    <div className="s-item">
                        <div className="s-icon-bg" style={{ background: '#E0F2FE', color: '#0284C7' }}><User size={20} /></div>
                        <div className="s-text">
                            <h4>Edit Personal Details</h4>
                            <p>Name, phone, address</p>
                        </div>
                        <ChevronRight size={18} className="text-muted" />
                    </div>

                    <div className="s-item" onClick={() => setViewState('farmDetails')}>
                        <div className="s-icon-bg" style={{ background: '#DCFCE7', color: '#16A34A' }}><Sprout size={20} /></div>
                        <div className="s-text">
                            <h4>Add/Update Farm Details</h4>
                            <p>Soil type, irrigation, equipment</p>
                        </div>
                        <ChevronRight size={18} className="text-muted" />
                    </div>

                    <div className="s-item" onClick={() => setLanguageMenuOpen(true)}>
                        <div className="s-icon-bg" style={{ background: '#F3E8FF', color: '#9333EA' }}><Languages size={20} /></div>
                        <div className="s-text">
                            <h4>Change Language</h4>
                            <p>App language preferences</p>
                        </div>
                        <span className="s-val" style={{ color: '#10B981' }}>{language}</span>
                    </div>

                    <div className="s-item" onClick={() => setViewState('notifications')}>
                        <div className="s-icon-bg" style={{ background: '#FFEDD5', color: '#EA580C' }}><Bell size={20} /></div>
                        <div className="s-text">
                            <h4>Notification Settings</h4>
                            <p>Alerts & alert priorities</p>
                        </div>
                        <ChevronRight size={18} className="text-muted" />
                    </div>

                    <div className="s-item">
                        <div className="s-icon-bg" style={{ background: '#F3F4F6', color: '#4B5563' }}><Moon size={20} /></div>
                        <div className="s-text">
                            <h4>Dark/Light Mode</h4>
                            <p>Toggle theme appearance</p>
                        </div>
                        <div
                            className={`toggle-switch ${darkMode ? 'active' : ''}`}
                            onClick={() => setDarkMode(!darkMode)}
                        ></div>
                    </div>
                </div>
            </div>

            {/* SERVICES SECTION */}
            <div className="settings-section">
                <h3 className="section-header">Services</h3>
                <div className="settings-card">
                    <div className="s-item" onClick={() => setViewState('govSchemes')}>
                        <div className="s-icon-bg" style={{ background: '#FEF9C3', color: '#CA8A04' }}><Landmark size={20} /></div>
                        <div className="s-text">
                            <h4>Government Schemes</h4>
                            <p>Find eligible schemes for farmers</p>
                        </div>
                        <ChevronRight size={18} className="text-muted" />
                    </div>

                    <div className="s-item" onClick={() => setViewState('financialAssist')}>
                        <div className="s-icon-bg" style={{ background: '#CCFBF1', color: '#0D9488' }}><FileText size={20} /></div>
                        <div className="s-text">
                            <h4>Subsidy & Loan Info</h4>
                            <p>Apply for agriculture loans</p>
                        </div>
                        <div className="badge-new">New</div>
                    </div>

                    <div className="s-item" onClick={() => setViewState('insuranceOptions')}>
                        <div className="s-icon-bg" style={{ background: '#E0E7FF', color: '#4F46E5' }}><Umbrella size={20} /></div>
                        <div className="s-text">
                            <h4>Insurance Options</h4>
                            <p>Crop & equipment insurance</p>
                        </div>
                        <ChevronRight size={18} className="text-muted" />
                    </div>

                    <div className="s-item" onClick={() => showToast('Connecting to Kisan Helpline...')}>
                        <div className="s-icon-bg" style={{ background: '#DCFCE7', color: '#16A34A' }}><PhoneCall size={20} /></div>
                        <div className="s-text">
                            <h4>Contact Agriculture Expert</h4>
                            <p>Call toll-free Kisan Helpline</p>
                        </div>
                        <ChevronRight size={18} className="text-muted" />
                    </div>

                    <div className="s-item" onClick={() => setViewState('consultationBooking')}>
                        <div className="s-icon-bg" style={{ background: '#DBEAFE', color: '#2563EB' }}><CalendarDays size={20} /></div>
                        <div className="s-text">
                            <h4>Book Expert Consultation</h4>
                            <p>Schedule a farm visit or video call</p>
                        </div>
                        <ChevronRight size={18} className="text-muted" />
                    </div>
                </div>
            </div>

            {/* HELP & SUPPORT SECTION */}
            <div className="settings-section">
                <h3 className="section-header">Help & Support</h3>
                <div className="settings-card">
                    <div className="s-item" onClick={() => setViewState('faq')}>
                        <div className="s-icon-bg" style={{ background: '#F3F4F6', color: '#4B5563' }}><HelpCircle size={20} /></div>
                        <div className="s-text">
                            <h4>FAQ</h4>
                            <p>Frequently asked questions</p>
                        </div>
                        <ChevronRight size={18} className="text-muted" />
                    </div>

                    <div className="s-item" onClick={() => setViewState('chatSupport')}>
                        <div className="s-icon-bg" style={{ background: '#DBEAFE', color: '#10B981' }}><MessageSquare size={20} /></div>
                        <div className="s-text">
                            <h4>Chat Support</h4>
                            <p>Get instant help</p>
                        </div>
                        <ChevronRight size={18} className="text-muted" />
                    </div>
                </div>
            </div>

            <p className="text-center text-xs text-secondary mt-8 font-medium">Agrismart v1.0.0 • Designed for Bharat 🇮🇳</p>
        </div>
    );

    return (
        <div className="profile-container">
            {toastMessage && <div className="toast">{toastMessage}</div>}
            {languageMenuOpen && renderLanguageModal()}

            {viewState === 'main' && <TopBar title="Profile & Services" />}

            {viewState === 'main' && renderMainScreen()}
            {viewState === 'farmDetails' && renderFarmDetailsForm()}
            {viewState === 'notifications' && renderNotificationsView()}

            {/* STUBBED SERVICE VIEWS */}
            {viewState === 'govSchemes' && renderServiceStub('Government Schemes', 'Connect to National Agricultural Portal to check active subsidy availability, PM Kisan status, and apply for direct benefit transfers.', <Landmark size={64} />)}
            {viewState === 'financialAssist' && renderServiceStub('Bank Subsidies & Loans', 'Find KCC limits and loan waivers tailored for your crop area footprint.', <FileText size={64} />)}
            {viewState === 'insuranceOptions' && renderServiceStub('Crop Insurance', 'Insure the upcoming Soybean harvest under PMFBY. Current estimated premium: ₹1250 / acre.', <Umbrella size={64} />)}
            {viewState === 'consultationBooking' && renderServiceStub('Expert Consultation', 'Schedule a digital video evaluation or on-home agronomist dispatch.', <CalendarDays size={64} />)}
            {viewState === 'chatSupport' && renderServiceStub('Chat Support', 'Our care team is currently online and ready to assist you in multiple regional languages.', <MessageSquare size={64} />)}
            {viewState === 'faq' && renderServiceStub('Frequently Asked Questions', 'Browse through guides relating to smart AI scans, order dispute resolutions, and payment settings.', <HelpCircle size={64} />)}
        </div>
    );
};
