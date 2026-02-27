import React, { useState, useEffect, useMemo } from 'react';
import { TopBar } from '../components/TopBar';
import { TrendingUp, ArrowLeft, TrendingDown, Leaf, Droplets, PenTool, Wind, Tractor } from 'lucide-react';
import './InsightsScreen.css';
import { TimeFilterType, ProfitData, ChartDataPoint, ExpenseCategory } from '../types/insights';

export const InsightsScreen: React.FC = () => {
    const [viewState, setViewState] = useState<'main' | 'expenseDetail' | 'financialBreakdown'>('main');
    const [timeFilter, setTimeFilter] = useState<TimeFilterType>('Monthly');

    // MOCK DATA GENERATORS based on filter
    const getProfitData = (filter: TimeFilterType): ProfitData => {
        if (filter === 'Daily') return { totalProfit: 2500, growthPercentage: 4.2, revenue: 3800, expenses: 1300 };
        if (filter === 'Monthly') return { totalProfit: 85000, growthPercentage: 12.5, revenue: 120000, expenses: 35000 };
        return { totalProfit: 850000, growthPercentage: 22.1, revenue: 1200000, expenses: 350000 };
    };

    const getChartData = (filter: TimeFilterType): ChartDataPoint[] => {
        if (filter === 'Daily') return [
            { label: 'Mon', revenue: 60, expense: 30 },
            { label: 'Tue', revenue: 80, expense: 40 },
            { label: 'Wed', revenue: 50, expense: 20 },
            { label: 'Thu', revenue: 90, expense: 45 },
            { label: 'Fri', revenue: 70, expense: 35 },
            { label: 'Sat', revenue: 85, expense: 30 },
            { label: 'Sun', revenue: 100, expense: 40 },
        ];
        if (filter === 'Monthly') return [
            { label: 'Jan', revenue: 60, expense: 30 },
            { label: 'Feb', revenue: 85, expense: 45 },
            { label: 'Mar', revenue: 50, expense: 25 },
            { label: 'Apr', revenue: 95, expense: 50 },
            { label: 'May', revenue: 80, expense: 40 },
        ];
        return [
            { label: '2020', revenue: 50, expense: 30 },
            { label: '2021', revenue: 65, expense: 35 },
            { label: '2022', revenue: 80, expense: 40 },
            { label: '2023', revenue: 100, expense: 45 },
        ];
    };

    const expenseCategories: ExpenseCategory[] = useMemo(() => [
        { id: '1', icon: <Leaf size={20} />, name: 'Seeds & Plants', amount: 12000, percentage: 34, color: '#4CAF50' },   // Green
        { id: '2', icon: <Droplets size={20} />, name: 'Fertilizers', amount: 15000, percentage: 43, color: '#2196F3' }, // Blue
        { id: '3', icon: <PenTool size={20} />, name: 'Labor', amount: 5000, percentage: 14, color: '#F44336' },         // Red
        { id: '4', icon: <Wind size={20} />, name: 'Irrigation', amount: 2000, percentage: 6, color: '#00BCD4' },        // Cyan
        { id: '5', icon: <Tractor size={20} />, name: 'Equipment', amount: 1000, percentage: 3, color: '#9C27B0' }       // Purple
    ], []);

    const [profitData, setProfitData] = useState<ProfitData>(getProfitData(timeFilter));
    const [chartData, setChartData] = useState<ChartDataPoint[]>(getChartData(timeFilter));
    const [selectedExpense, setSelectedExpense] = useState<ExpenseCategory | null>(null);

    // Update data when filter changes
    useEffect(() => {
        setProfitData(getProfitData(timeFilter));
        setChartData(getChartData(timeFilter));
    }, [timeFilter]);


    // Handlers
    const openFinancialBreakdown = () => setViewState('financialBreakdown');
    const openExpenseDetail = (category: ExpenseCategory) => {
        setSelectedExpense(category);
        setViewState('expenseDetail');
    };
    const handleBack = () => {
        setViewState('main');
        setSelectedExpense(null);
    };

    // Renderers
    const renderMainScreen = () => (
        <div className="content-padding animate-entrance">
            <div className="segmented-control">
                {(['Daily', 'Monthly', 'Yearly'] as TimeFilterType[]).map((filter) => (
                    <button
                        key={filter}
                        className={`segment-btn ${timeFilter === filter ? 'active' : ''}`}
                        onClick={() => setTimeFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="analytics-card clickable-card" onClick={openFinancialBreakdown}>
                <div className="profit-header">
                    <h3>Total Profit</h3>
                    <h2 className="profit-main-val">₹{profitData.totalProfit.toLocaleString('en-IN')}</h2>
                    <span className={`trend-indicator ${profitData.growthPercentage >= 0 ? 'up' : 'down'}`}>
                        {profitData.growthPercentage >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {profitData.growthPercentage >= 0 ? '+' : ''}{profitData.growthPercentage}% vs last period
                    </span>
                </div>
                <div className="profit-split">
                    <div className="split-stat">
                        <span className="lbl">Revenue</span>
                        <span className="val revenue">₹{profitData.revenue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="split-stat" style={{ textAlign: 'right' }}>
                        <span className="lbl">Expenses</span>
                        <span className="val expense">₹{profitData.expenses.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>

            <h3 className="analytics-section-title">Profit vs Expense</h3>
            <div className="analytics-card">
                <div className="custom-bar-chart">
                    <div className="chart-y-axis-line"></div>
                    {chartData.map((data, index) => (
                        <div key={index} className="chart-group">
                            <div className="chart-bar revenue" style={{ height: `${data.revenue}%` }}></div>
                            <div className="chart-bar expense" style={{ height: `${data.expense}%` }}></div>
                            <span className="chart-label">{data.label}</span>
                        </div>
                    ))}
                </div>
                <div className="chart-legend">
                    <div className="legend-item"><div className="legend-swatch revenue"></div>Revenue</div>
                    <div className="legend-item"><div className="legend-swatch expense"></div>Expense</div>
                </div>
            </div>

            <h3 className="analytics-section-title">Expense Tracker</h3>
            <div className="analytics-card" style={{ padding: '0 20px' }}>
                <div className="expense-list">
                    {expenseCategories.map((category) => (
                        <div key={category.id} className="expense-item" onClick={() => openExpenseDetail(category)}>
                            <div className="expense-detail-left">
                                <div className="expense-icon-box" style={{ backgroundColor: category.color }}>
                                    {category.icon}
                                </div>
                                <span className="expense-name">{category.name}</span>
                            </div>
                            <div className="expense-detail-right">
                                <span className="expense-amount">₹{category.amount.toLocaleString('en-IN')}</span>
                                <span className="expense-percent">({category.percentage}%)</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderFinancialBreakdown = () => (
        <div className="content-padding animate-entrance">
            <div className="subview-header">
                <button className="back-btn" onClick={handleBack}><ArrowLeft size={24} /></button>
                <h2>Financial Breakdown</h2>
            </div>
            <p className="text-secondary mb-6">Detailed ledger for {timeFilter} period.</p>

            <div className="analytics-card">
                <h3 className="analytics-section-title">Income Sources</h3>
                <div className="expense-list">
                    <div className="expense-item">
                        <div className="expense-detail-left"><span className="expense-name">Crop Sales</span></div>
                        <div className="expense-detail-right"><span className="expense-amount" style={{ color: '#10B981' }}>₹{(profitData.revenue * 0.8).toLocaleString('en-IN')}</span></div>
                    </div>
                    <div className="expense-item">
                        <div className="expense-detail-left"><span className="expense-name">Govt Subsidies</span></div>
                        <div className="expense-detail-right"><span className="expense-amount" style={{ color: '#10B981' }}>₹{(profitData.revenue * 0.2).toLocaleString('en-IN')}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderExpenseDetail = () => {
        if (!selectedExpense) return null;
        return (
            <div className="content-padding animate-entrance">
                <div className="subview-header">
                    <button className="back-btn" onClick={handleBack}><ArrowLeft size={24} /></button>
                    <h2>{selectedExpense.name} Detail</h2>
                </div>

                <div className="analytics-card" style={{ textAlign: 'center', padding: '30px 20px' }}>
                    <div className="expense-icon-box mx-auto mb-4" style={{ backgroundColor: selectedExpense.color, width: 64, height: 64 }}>
                        {React.cloneElement(selectedExpense.icon as React.ReactElement, { size: 32 })}
                    </div>
                    <h2 className="text-3xl font-extrabold text-[#111827] mb-2">₹{selectedExpense.amount.toLocaleString('en-IN')}</h2>
                    <p className="text-secondary font-medium">{selectedExpense.percentage}% of total {timeFilter.toLowerCase()} expenses.</p>
                </div>

                <h3 className="analytics-section-title">Recent Transactions</h3>
                <div className="analytics-card">
                    <div className="expense-list">
                        <div className="expense-item">
                            <div className="expense-detail-left">
                                <div>
                                    <span className="expense-name block">Pesticide Refill</span>
                                    <span className="text-xs text-secondary">Oct 12, 2023</span>
                                </div>
                            </div>
                            <div className="expense-detail-right"><span className="expense-amount text-red-600">-₹{(selectedExpense.amount * 0.4).toLocaleString('en-IN')}</span></div>
                        </div>
                        <div className="expense-item">
                            <div className="expense-detail-left">
                                <div>
                                    <span className="expense-name block">Urea Bags (10x)</span>
                                    <span className="text-xs text-secondary">Oct 05, 2023</span>
                                </div>
                            </div>
                            <div className="expense-detail-right"><span className="expense-amount text-red-600">-₹{(selectedExpense.amount * 0.6).toLocaleString('en-IN')}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="insights-container">
            {viewState === 'main' && <TopBar title="Farm Analytics" />}

            {viewState === 'main' && renderMainScreen()}
            {viewState === 'financialBreakdown' && renderFinancialBreakdown()}
            {viewState === 'expenseDetail' && renderExpenseDetail()}
        </div>
    );
};
