import { ReactNode } from 'react';

export type TimeFilterType = 'Daily' | 'Monthly' | 'Yearly';

export interface ProfitData {
    totalProfit: number;
    growthPercentage: number;
    revenue: number;
    expenses: number;
}

export interface ChartDataPoint {
    label: string;
    revenue: number;
    expense: number;
}

export interface ExpenseCategory {
    id: string;
    icon: ReactNode;
    name: string;
    amount: number;
    percentage: number;
    color: string;
}
