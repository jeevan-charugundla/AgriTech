export type ProfileViewState =
    | 'main'
    | 'farmDetails'
    | 'notifications'
    | 'govSchemes'
    | 'financialAssist'
    | 'insuranceOptions'
    | 'expertContact'
    | 'consultationBooking'
    | 'faq'
    | 'chatSupport'
    | 'appGuide';

export type SupportedLanguage = 'English' | 'Hindi' | 'Telugu' | 'Tamil' | 'Kannada' | 'Marathi';

export interface FarmDetails {
    size: string;
    soilType: string;
    irrigationType: string;
    equipment: string[];
    cropTypes: string[];
}

export interface NotificationPrefs {
    diseaseAlerts: boolean;
    marketAlerts: boolean;
    orderAlerts: boolean;
    weatherAlerts: boolean;
    govSchemes: boolean;
}
