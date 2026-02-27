import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { TopBar } from '../components/TopBar';
import {
    Camera, Bug, TestTube, Leaf, TrendingUp, MessageCircle,
    Mic, Image as ImageIcon, Globe, ArrowLeft, Send, BarChart2,
    ScanLine, X, AlertCircle, FileText, ChevronRight, Info, CheckCircle2,
    Zap, ZapOff, Aperture, RefreshCw, Download
} from 'lucide-react';
import './ScanScreen.css';

type ViewState = 'main' | 'chat' | 'camera' | 'soilForm' | 'fertilizerAI';
type Language = 'English' | 'Hindi' | 'Telugu' | 'Tamil' | 'Kannada' | 'Marathi';

interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    isRich?: boolean;
    problem?: string;
    cause?: string;
    actions?: string[];
    prevention?: string[];
    warningLevel?: 'low' | 'medium' | 'high';
    timestamp: string;
    smartAction?: { label: string; route: string };
}

interface ScanResult {
    cropName: string;
    status: 'Healthy' | 'Risk Detected';
    diseaseName?: string;
    confidence: number;
    severity?: 'Low' | 'Medium' | 'High';
    cause?: string;
    treatment?: string[];
    prevention?: string[];
    fertilizer?: string;
    imageSrc?: string;
}

export const ScanScreen: React.FC = () => {
    const navigate = useNavigate();
    const [viewState, setViewState] = useState<ViewState>('main');
    const [language, setLanguage] = useState<Language>('English');
    const [showLangModal, setShowLangModal] = useState(false);

    // Transitions
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Chat state
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            sender: 'ai',
            text: 'Namaste! I am your AI farming assistant. I can help you analyze crops, predict yields, and suggest actions.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);

    // Camera & Scan State
    const webcamRef = useRef<Webcam>(null);
    const reportRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const [flashOn, setFlashOn] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [showResultModal, setShowResultModal] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (viewState === 'chat') {
            scrollToBottom();
        }
    }, [messages, viewState, isTyping]);

    const handleLanguageSelect = (lang: Language) => {
        setLanguage(lang);
        setShowLangModal(false);
        setMessages(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                sender: 'ai',
                text: `Language switched to ${lang}. How can I assist you today?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
    };

    const handleSendMessage = (text: string = chatInput) => {
        if (!text.trim()) return;

        const newUserMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newUserMsg]);
        setChatInput('');
        setIsTyping(true);

        setTimeout(() => {
            let aiResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: '',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            const lowerText = text.toLowerCase();
            if (lowerText.includes('disease') || lowerText.includes('sick')) {
                aiResponse.isRich = true;
                aiResponse.problem = 'Leaf Blight Detected';
                aiResponse.cause = 'Fungal infection exacerbated by high humidity.';
                aiResponse.actions = ['Remove infected leaves safely', 'Apply copper-based fungicide'];
                aiResponse.prevention = ['Improve air circulation', 'Avoid overhead watering'];
                aiResponse.warningLevel = 'high';
            } else if (lowerText.includes('fertilizer') || lowerText.includes('soil')) {
                aiResponse.text = 'Based on your recent soil scan, you should apply NPK 10-20-10. Do you want to open the detailed Fertilizer Guide?';
                aiResponse.smartAction = { label: 'Apply Fertilizer Guide', route: 'fertilizerAI' };
            } else if (lowerText.includes('price') || lowerText.includes('market')) {
                aiResponse.text = 'The current market price for Wheat has gone up by 5% today in your local mandi.';
                aiResponse.smartAction = { label: 'View Market Prices', route: '/marketplace' };
            } else if (lowerText.includes('yield') || lowerText.includes('analytics')) {
                aiResponse.text = 'Your health reports are generated and ready to view.';
                aiResponse.smartAction = { label: 'Check Crop Analytics', route: '/insights' };
            } else {
                aiResponse.text = `I have received your query about "${text}". As an AI, I am processing this in ${language}.`;
            }

            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const handleQuickAction = (prompt: string) => {
        handleSendMessage(prompt);
    };

    const handleSmartAction = (route: string) => {
        if (route.startsWith('/')) {
            navigate(route);
        } else {
            setViewState(route as ViewState);
        }
    };

    // --- AI Scan Button Implementation ---

    const startAnalysis = (imageSrc: string) => {
        setIsAnalyzing(true);

        // Simulate AI Upload and Processing
        setTimeout(() => {
            setIsAnalyzing(false);

            // Generate mock result matching the prompt image
            const result: ScanResult = {
                cropName: 'Tomato Leaf',
                status: 'Risk Detected',
                diseaseName: 'Early Blight',
                confidence: 92,
                severity: 'High',
                cause: 'Alternaria solani fungus thrives in warm, humid conditions.',
                treatment: ['Apply Mancozeb or Chlorothalonil', 'Remove infected leaves from base'],
                prevention: ['Use drip irrigation', 'Space plants for air circulation'],
                fertilizer: 'Calcium-rich balanced NPK',
                imageSrc
            };

            setScanResult(result);
            setShowResultModal(true);
        }, 2000);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                startAnalysis(result);
            };
            reader.readAsDataURL(file);
        }
        if (e.target) e.target.value = '';
    };

    const captureAndAnalyze = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc) {
            alert("Unable to detect crop clearly. Please retake photo.");
            return;
        }

        startAnalysis(imageSrc);
    }, [webcamRef]);

    const resetCamera = () => {
        setScanResult(null);
        setShowResultModal(false);
        setIsAnalyzing(false);
        setViewState('main');
    };

    const scanAgain = () => {
        setScanResult(null);
        setShowResultModal(false);
        setIsAnalyzing(false);
    };

    const startScanTransition = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setViewState('camera');
            setIsTransitioning(false);
        }, 300);
    };

    const handleDownloadReport = async () => {
        if (!reportRef.current) return;

        try {
            const canvas = await html2canvas(reportRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/jpeg', 1.0);

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Crop_Health_Report.pdf');
        } catch (error) {
            console.error("Error generating PDF", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    const handleChatWithContext = () => {
        if (!scanResult) return;
        setShowResultModal(false);
        setViewState('chat');

        const contextMsg = scanResult.status === 'Healthy'
            ? `I just scanned my ${scanResult.cropName}, and it appears healthy (Confidence: ${scanResult.confidence}%). How should I maintain it?`
            : `My ${scanResult.cropName} was diagnosed with ${scanResult.diseaseName} (${scanResult.severity} severity). Please explain in detail and suggest immediate steps.`;

        handleSendMessage(contextMsg);
    };

    // --- Sub-views renderers ---

    const renderCameraView = () => (
        <div className="camera-view-container">
            {/* Header */}
            {!scanResult && (
                <div className="camera-header">
                    <button className="camera-header-btn" onClick={resetCamera}>
                        <ArrowLeft size={24} />
                    </button>
                    <span className="camera-title">AI Scanner</span>
                    <button className="camera-header-btn" onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}>
                        <RefreshCw size={20} />
                    </button>
                </div>
            )}

            {/* Webcam / Frozen Image */}
            <div className={`webcam-wrapper ${scanResult ? 'half-height' : ''}`}>
                {scanResult?.imageSrc ? (
                    <img src={scanResult.imageSrc} alt="Captured" />
                ) : (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode, advanced: flashOn && facingMode === 'environment' ? [{ torch: true } as any] : [] }}
                    />
                )}
            </div>

            {/* Overlay Elements (Only when active camera) */}
            {!scanResult && !isAnalyzing && (
                <>
                    <div className="camera-overlay-ui">
                        <div className="focus-frame">
                            <div className="focus-frame-tl"></div>
                            <div className="focus-frame-tr"></div>
                            <div className="focus-frame-bl"></div>
                            <div className="focus-frame-br"></div>
                            <div className="circular-scanner"></div>
                            <div className="scan-line-anim"></div>
                        </div>
                        <p className="scan-instruction">Align leaf inside frame</p>
                    </div>

                    <div className="camera-controls-bottom">
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden-file-input"
                            onChange={handleFileUpload}
                        />
                        <button className="camera-control-btn" onClick={() => setFlashOn(!flashOn)}>
                            {flashOn ? <Zap size={24} color="#FBBF24" /> : <ZapOff size={24} />}
                        </button>
                        <button className="capture-btn-outer" onClick={captureAndAnalyze}>
                            <div className="capture-btn-inner"></div>
                        </button>
                        <button className="camera-control-btn" onClick={() => fileInputRef.current?.click()}>
                            <ImageIcon size={24} />
                        </button>
                    </div>
                </>
            )}

            {/* Analyzing Overlay */}
            {isAnalyzing && (
                <div className="analyzing-overlay">
                    <div className="analyzing-spinner-container">
                        <div className="spinning-ring-1"></div>
                        <div className="spinning-ring-2"></div>
                        <ScanLine size={32} color="#4ade80" />
                    </div>
                    <div className="analyzing-text-card">
                        Analyzing with AI...
                    </div>
                </div>
            )}

            {/* Exact AI Result Card per Prompt Image */}
            {scanResult && showResultModal && !isAnalyzing && (
                <div className="result-modal-container">
                    <div className="result-modal-scroll">
                        <h1 className="result-hero-title">{scanResult.cropName}</h1>

                        <div className="result-risk-badge">
                            <Info size={14} style={{ marginRight: '4px' }} /> Risk Detected
                        </div>

                        <div className="result-disease-name">
                            <Bug size={24} style={{ marginRight: '8px', opacity: 0.8 }} /> {scanResult.diseaseName}
                        </div>

                        <div className="result-stat-line">
                            Severity: <span style={{ fontWeight: 600 }}>{scanResult.severity}</span>
                        </div>
                        <div className="result-stat-line">
                            Confidence: <span style={{ fontWeight: 800 }}>{scanResult.confidence}%</span>
                        </div>

                        <p className="result-cause-text">
                            {scanResult.cause}
                        </p>

                        <div>
                            <div className="result-section-title">
                                <span style={{ fontSize: '13px', color: '#6b7280' }}>Step 1</span>
                                <span>Recommended Treatment</span>
                            </div>
                            <ul className="result-list">
                                {scanResult.treatment?.map((t, idx) => (
                                    <li key={idx}>
                                        <CheckCircle2 size={16} color="#4b5563" style={{ marginRight: '8px', flexShrink: 0, marginTop: '2px' }} />
                                        <span>{t}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div className="result-section-title">
                                <span style={{ fontSize: '13px', color: '#6b7280' }}>Step 2</span>
                                <span>Prevention Tips</span>
                            </div>
                            <ul className="result-list">
                                {scanResult.prevention?.map((p, idx) => (
                                    <li key={idx}>
                                        <CheckCircle2 size={16} color="#4b5563" style={{ marginRight: '8px', flexShrink: 0, marginTop: '2px' }} />
                                        <span>{p}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="fert-box">
                            <Leaf size={48} color="#111827" style={{ marginBottom: '8px' }} strokeWidth={1.5} />
                            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                <Leaf size={16} style={{ marginRight: '8px' }} /> Recommended Fertilizer
                            </h2>
                            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: 500 }}>
                                {scanResult.fertilizer}
                            </p>
                        </div>

                        {/* Action Buttons precisely modeled after the image layout */}
                        <div className="action-buttons-row">
                            <button className="action-btn-main" onClick={handleChatWithContext}>
                                <MessageCircle size={22} style={{ flexShrink: 0 }} />
                                <span>Chat with AI about<br />this</span>
                            </button>

                            <div className="action-btn-col">
                                <button className="action-btn-secondary" onClick={handleDownloadReport}>
                                    <Download size={16} style={{ marginBottom: '4px', opacity: 0.8 }} strokeWidth={2.5} />
                                    <span>Save<br />PDF</span>
                                </button>
                                <button className="action-btn-secondary" onClick={scanAgain}>
                                    <Camera size={16} style={{ marginBottom: '4px', opacity: 0.8 }} strokeWidth={2.5} />
                                    <span>Scan<br />Again</span>
                                </button>
                            </div>

                            <button className="action-btn-neutral" onClick={() => setViewState('main')}>
                                <span>Return<br />Home</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden HTML Template for PDF Generation */}
            {
                scanResult && (
                    <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                        <div ref={reportRef} className="pdf-report-template" style={{ width: '800px', padding: '40px', backgroundColor: 'white', fontFamily: 'Arial, sans-serif', color: '#1f2937' }}>
                            <div style={{ borderBottom: '4px solid #16a34a', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '12px' }}>
                                <div>
                                    <h1 style={{ color: '#15803d', margin: '0 0 5px 0', fontSize: '32px' }}>Smart Agriculture AI Report</h1>
                                    <p style={{ margin: 0, color: '#166534', fontWeight: 'bold' }}>Agrismart Scan Diagnostic</p>
                                </div>
                                <p style={{ margin: 0, color: '#4b5563', fontSize: '14px', backgroundColor: 'white', padding: '8px 16px', borderRadius: '20px', border: '1px solid #dcfce7' }}>{new Date().toLocaleString()}</p>
                            </div>

                            <div style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
                                {scanResult.imageSrc && <img src={scanResult.imageSrc} alt="Crop" style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '16px', border: '4px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h1 style={{ fontSize: '42px', margin: '0 0 15px 0', color: '#111827' }}>{scanResult.cropName}</h1>

                                    <div style={{ display: 'inline-block', backgroundColor: scanResult.status === 'Healthy' ? '#dcfce7' : '#fee2e2', color: scanResult.status === 'Healthy' ? '#166534' : '#991b1b', padding: '12px 24px', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold', border: `2px solid ${scanResult.status === 'Healthy' ? '#bbf7d0' : '#fecaca'}` }}>
                                        Status: {scanResult.status}
                                    </div>

                                    {scanResult.diseaseName && (
                                        <div style={{ marginTop: '30px', backgroundColor: '#fff7ed', padding: '20px', borderRadius: '12px', border: '1px solid #ffedd5' }}>
                                            <h2 style={{ color: '#c2410c', margin: '0 0 10px 0', fontSize: '24px' }}>Diagnosis: {scanResult.diseaseName}</h2>
                                            <div style={{ display: 'flex', gap: '20px', fontSize: '16px' }}>
                                                <p style={{ margin: 0, backgroundColor: 'white', padding: '6px 12px', borderRadius: '6px', border: '1px solid #fed7aa' }}><strong>Severity:</strong> <span style={{ color: '#dc2626' }}>{scanResult.severity}</span></p>
                                                <p style={{ margin: 0, backgroundColor: 'white', padding: '6px 12px', borderRadius: '6px', border: '1px solid #fed7aa' }}><strong>AI Confidence:</strong> {scanResult.confidence}%</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {scanResult.cause && (
                                <div style={{ marginBottom: '30px', backgroundColor: '#f9fafb', padding: '24px', borderRadius: '12px', borderLeft: '6px solid #f97316' }}>
                                    <h3 style={{ margin: '0 0 12px 0', color: '#ea580c', fontSize: '20px' }}>Probable Cause</h3>
                                    <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.6', color: '#4b5563' }}>{scanResult.cause}</p>
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                                <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                                    <h3 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px', color: '#1d4ed8', fontSize: '20px', marginTop: 0 }}>Treatment Plan</h3>
                                    <ul style={{ lineHeight: '1.8', fontSize: '16px', paddingLeft: '20px', margin: '16px 0 0 0', color: '#374151' }}>
                                        {scanResult.treatment?.map((t, idx) => <li key={idx} style={{ marginBottom: '8px' }}>{t}</li>)}
                                    </ul>
                                </div>

                                <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                                    <h3 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px', color: '#15803d', fontSize: '20px', marginTop: 0 }}>Prevention Strategies</h3>
                                    <ul style={{ lineHeight: '1.8', fontSize: '16px', paddingLeft: '20px', margin: '16px 0 0 0', color: '#374151' }}>
                                        {scanResult.prevention?.map((p, idx) => <li key={idx} style={{ marginBottom: '8px' }}>{p}</li>)}
                                    </ul>
                                </div>
                            </div>

                            {scanResult.fertilizer && (
                                <div style={{ backgroundColor: '#f0fdfa', padding: '24px', borderRadius: '12px', border: '1px solid #ccfbf1', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ backgroundColor: '#14b8a6', color: 'white', padding: '12px', borderRadius: '50%', fontWeight: 'bold' }}>NPK</div>
                                    <div>
                                        <h3 style={{ margin: '0 0 8px 0', color: '#0f766e', fontSize: '20px' }}>Fertilizer Recommendation</h3>
                                        <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#115e59' }}>{scanResult.fertilizer}</p>
                                    </div>
                                </div>
                            )}

                            <div style={{ marginTop: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '14px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                                <p style={{ margin: '0 0 5px 0' }}>This report was generated automatically by the Agrismart AI Engine.</p>
                                <p style={{ margin: 0 }}>Please consult with a local agricultural expert to confirm findings before applying major chemical treatments.</p>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );

    const renderSoilForm = () => (
        <div className="screen-container bg-surface-light">
            <TopBar title="Soil Analysis Input" />
            <div className="content-padding pt-4">
                <button className="back-link" onClick={() => setViewState('main')}><ArrowLeft size={16} /> Back</button>
                <div className="form-card mt-4">
                    <h3 className="mb-4 text-primary-dark">Enter Soil Parameters</h3>
                    <div className="form-group">
                        <label>Nitrogen (N) Content</label>
                        <div className="input-with-icon">
                            <TestTube size={18} className="text-muted" />
                            <input type="number" className="input" placeholder="e.g. 120" />
                            <span className="unit-badge">kg/ha</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Phosphorus (P) Content</label>
                        <div className="input-with-icon">
                            <TestTube size={18} className="text-muted" />
                            <input type="number" className="input" placeholder="e.g. 45" />
                            <span className="unit-badge">kg/ha</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Potassium (K) Content</label>
                        <div className="input-with-icon">
                            <TestTube size={18} className="text-muted" />
                            <input type="number" className="input" placeholder="e.g. 200" />
                            <span className="unit-badge">kg/ha</span>
                        </div>
                    </div>
                    <div className="form-group mb-6">
                        <label>pH Level</label>
                        <div className="input-with-icon">
                            <Info size={18} className="text-muted" />
                            <input type="number" className="input" placeholder="e.g. 6.5" />
                            <span className="unit-badge">pH</span>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/insights')}>Analyze Soil Data <ChevronRight size={18} /></button>
                </div>
            </div>
        </div>
    );

    const renderFertilizerAI = () => (
        <div className="screen-container bg-surface-light">
            <TopBar title="Fertilizer Recommendation" />
            <div className="content-padding pt-4">
                <button className="back-link" onClick={() => setViewState('main')}><ArrowLeft size={16} /> Back</button>
                <div className="ai-module-card mt-4">
                    <div className="f-icon-large bg-teal mx-auto mb-4">
                        <Leaf size={32} color="white" />
                    </div>
                    <h3 className="text-center mb-2 text-primary-dark">Smart Fertilizer AI</h3>
                    <p className="text-center text-secondary mb-6 text-sm">Select your current crop for precise NPK ratio recommendations tailored to your region.</p>

                    <h4 className="section-subtitle mb-3">Select Crop</h4>
                    <div className="crop-select-grid mb-6">
                        <button className="crop-btn active"><CheckCircle2 size={16} className="inline-icon" /> Wheat</button>
                        <button className="crop-btn">Tomato</button>
                        <button className="crop-btn">Cotton</button>
                        <button className="crop-btn">Sugarcane</button>
                    </div>

                    <div className="farm-size-input mb-6">
                        <h4 className="section-subtitle mb-3">Farm Size</h4>
                        <div className="flex gap-2">
                            <input type="number" className="input flex-1" placeholder="e.g. 5" defaultValue="2" />
                            <select className="input w-auto border-gray-300">
                                <option>Acres</option>
                                <option>Hectares</option>
                            </select>
                        </div>
                    </div>

                    <button className="btn btn-primary w-full shadow-lg" onClick={() => {
                        handleSendMessage('I need a fertilizer recommendation for 2 acres of Wheat.');
                        setViewState('chat');
                    }}>Get AI Recommendation</button>
                </div>
            </div>
        </div>
    );

    const renderChatView = () => (
        <div className="screen-container chat-container">
            <div className="chat-header">
                <button className="icon-btn-light" onClick={() => setViewState('main')}>
                    <ArrowLeft size={20} />
                </button>
                <div className="chat-profile">
                    <div className="ai-avatar-animated">
                        <div className="glow-ring"></div>
                        <Leaf size={20} color="white" />
                    </div>
                    <div className="chat-header-text">
                        <h3>Kisan Sakhi AI</h3>
                        <p className="online-status"><span className="status-dot"></span> Online</p>
                    </div>
                </div>
                <button className="lang-toggle-btn" onClick={() => setShowLangModal(true)}>
                    <Globe size={16} /> {language.substring(0, 3)}
                </button>
            </div>

            <div className="chat-messages pt-4">
                {messages.map((msg, index) => (
                    <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                        {msg.sender === 'ai' && (
                            <div className="message-avatar">
                                <Leaf size={14} color="white" />
                            </div>
                        )}
                        <div className={`message ${msg.sender}`}>
                            {msg.isRich ? (
                                <div className={`rich-content warning-${msg.warningLevel}`}>
                                    <div className="rich-header">
                                        <AlertCircle size={18} />
                                        <h4>{msg.problem}</h4>
                                    </div>
                                    <p className="rich-cause"><strong>Cause:</strong> {msg.cause}</p>

                                    <div className="rich-section">
                                        <strong>Recommended Actions:</strong>
                                        <ul>
                                            {msg.actions?.map((act, i) => <li key={i}>{act}</li>)}
                                        </ul>
                                    </div>

                                    <div className="rich-section">
                                        <strong>Prevention Tips:</strong>
                                        <ul>
                                            {msg.prevention?.map((prev, i) => <li key={i}>{prev}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <p>{msg.text}</p>
                            )}

                            {msg.smartAction && (
                                <button
                                    className="chat-action-btn mt-3"
                                    onClick={() => handleSmartAction(msg.smartAction!.route)}
                                >
                                    {msg.smartAction.label} <ChevronRight size={16} />
                                </button>
                            )}
                            <span className="msg-time">{msg.timestamp}</span>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="message-wrapper ai">
                        <div className="message-avatar">
                            <Leaf size={14} color="white" />
                        </div>
                        <div className="message ai typing">
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-footer">
                <div className="quick-suggestions-chat scroll-x hidden-scrollbar">
                    <button onClick={() => handleQuickAction('Check Disease')}><Camera size={14} className="text-primary" /> Check Disease</button>
                    <button onClick={() => handleQuickAction('Fertilizer Help')}><TestTube size={14} className="text-teal" /> Fertilizer Help</button>
                    <button onClick={() => handleQuickAction('Market Price Today')}><TrendingUp size={14} className="text-blue" /> Market Price</button>
                    <button onClick={() => handleQuickAction('Weather Advice')}><Globe size={14} className="text-orange" /> Weather Advice</button>
                </div>

                <div className="chat-input-area">
                    <button className="chat-icon-btn"><ImageIcon size={22} /></button>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Message your AI..."
                            className="chat-input-field"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                    </div>
                    {chatInput.trim() ? (
                        <button className="send-btn" onClick={() => handleSendMessage()}>
                            <Send size={18} />
                        </button>
                    ) : (
                        <button className="chat-icon-btn mic-btn"><Mic size={22} /></button>
                    )}
                </div>
            </div>
        </div>
    );

    const renderLangModal = () => {
        if (!showLangModal) return null;
        const languages: Language[] = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Marathi'];

        return (
            <div className="modal-overlay" onClick={() => setShowLangModal(false)}>
                <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
                    <div className="sheet-handle"></div>
                    <h3 className="sheet-title mb-4">Select Language</h3>
                    <div className="lang-list">
                        {languages.map(lang => (
                            <button
                                key={lang}
                                className={`lang-option ${language === lang ? 'selected' : ''}`}
                                onClick={() => handleLanguageSelect(lang)}
                            >
                                <span className="lang-name">{lang}</span>
                                {language === lang && <CheckCircle2 size={20} className="text-primary" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (viewState === 'chat') return renderChatView();
    if (viewState === 'camera') return renderCameraView();
    if (viewState === 'soilForm') return renderSoilForm();
    if (viewState === 'fertilizerAI') return renderFertilizerAI();

    return (
        <div className="screen-container bg-earthy">
            <div className="ai-main-header">
                <div>
                    <h1 className="header-title">AI Smart Farming Assistant</h1>
                    <p className="header-subtitle">Scan • Analyze • Improve</p>
                </div>
                <button className="header-lang-btn" onClick={() => setShowLangModal(true)}>
                    <Globe size={18} />
                    <span>{language.substring(0, 3)}</span>
                </button>
            </div>

            <div className="content-padding pb-32 relative-wrap">

                <div className="center-scan-wrapper">
                    <button className="glowing-scan-btn" onClick={() => setViewState('camera')}>
                        <div className="scan-btn-inner">
                            <ScanLine size={36} className="mb-1" />
                            <span>SCAN<br />NOW</span>
                        </div>
                        <div className="scan-btn-glow"></div>
                        <div className="scan-btn-ripple"></div>
                    </button>
                </div>

                <h3 className="section-title mb-4">Core Modules</h3>
                <div className="ai-features-grid">
                    <div className="feature-card glass-card" onClick={() => setViewState('camera')}>
                        <div className="f-icon bg-primary"><Camera color="white" size={24} /></div>
                        <h4>Disease Scan</h4>
                        <p>Open Camera</p>
                    </div>
                    <div className="feature-card glass-card" onClick={() => setViewState('camera')}>
                        <div className="f-icon bg-orange"><Bug color="white" size={24} /></div>
                        <h4>Pest Detect</h4>
                        <p>Realtime AI</p>
                    </div>
                    <div className="feature-card glass-card" onClick={() => setViewState('soilForm')}>
                        <div className="f-icon bg-brown"><TestTube color="white" size={24} /></div>
                        <h4>Soil Analysis</h4>
                        <p>Input Form</p>
                    </div>
                    <div className="feature-card glass-card" onClick={() => setViewState('fertilizerAI')}>
                        <div className="f-icon bg-teal"><Leaf color="white" size={24} /></div>
                        <h4>Fertilizer &nbsp; AI</h4>
                        <p>Smart Recs</p>
                    </div>
                    <div className="feature-card w-full glass-card hover-lift" onClick={() => navigate('/insights')}>
                        <div className="feature-horizontal">
                            <div className="f-icon bg-blue"><TrendingUp color="white" size={24} /></div>
                            <div className="f-text">
                                <h4>Yield Prediction</h4>
                                <p>Crop selection & field size analytics</p>
                            </div>
                            <ChevronRight size={20} className="text-muted" />
                        </div>
                    </div>
                    <div className="feature-card w-full glass-card hover-lift" onClick={() => navigate('/insights')}>
                        <div className="feature-horizontal">
                            <div className="f-icon bg-purple"><BarChart2 color="white" size={24} /></div>
                            <div className="f-text">
                                <h4>Crop Health Report</h4>
                                <p>View comprehensive insights dashboard</p>
                            </div>
                            <ChevronRight size={20} className="text-muted" />
                        </div>
                    </div>
                </div>

            </div>

            {!showLangModal && viewState === 'main' && (
                <button className="floating-chat-btn" onClick={() => setViewState('chat')}>
                    <div className="float-icon-wrap">
                        <MessageCircle size={28} color="white" />
                        <span className="notification-dot"></span>
                    </div>
                    <span className="float-text">Chat with AI</span>
                </button>
            )}

            {renderLangModal()}
        </div>
    );
};
