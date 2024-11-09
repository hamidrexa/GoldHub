'use client';

import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useState,
} from 'react';

interface ContextProps {
    user: {
        id: number | string;
        trader: {
            id: number | string;
            primary_username: string;
            publisher_type: string;
        };
        trader_page_request: {
            id: string | number;
            primary_username: string;
        };
        bookmark_count: number;
        phone_number: string;
        phone_number_confirmed: boolean;
        username: string;
        national_code: string;
        national_code_confirmed:boolean;
        pushe_notification_id: string;
        unread_message_count: number;
        email_confirmed: boolean;
        trader_page_status: string;
        first_name: string;
        last_name: string;
        email: string;
        has_password: boolean;
        signup_type: string;
        notification_channel: {
            email: boolean;
            sms: boolean;
            push: boolean;
            telegram: boolean;
        };
        is_superuser: boolean;
        active_plan: {
            plan: {
                name: string;
            };
            is_active: boolean;
        };
        telegram_bot_url: string;
        telegram_chat_id: number;
    };
    setUser: Dispatch<SetStateAction<object>>;
    isUserLoading: boolean;
    setIsUserLoading: Dispatch<SetStateAction<boolean>>;
    isReadingMode: boolean;
    setIsReadingMode: Dispatch<SetStateAction<boolean>>;
    breadcrumbTitle: string;
    setBreadcrumbTitle: Dispatch<SetStateAction<string>>;
}

const GlobalContext = createContext<ContextProps>({
    user: null,
    setUser: (): string => null,
    isUserLoading: true,
    setIsUserLoading: (): boolean => null,
    isReadingMode: false,
    setIsReadingMode: (): boolean => false,
    breadcrumbTitle: null,
    setBreadcrumbTitle: () => null,
});

export const GlobalContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [isReadingMode, setIsReadingMode] = useState(false);
    const [breadcrumbTitle, setBreadcrumbTitle] = useState(null);

    return (
        <GlobalContext.Provider
            value={{
                user,
                setUser,
                isUserLoading,
                setIsUserLoading,
                isReadingMode,
                setIsReadingMode,
                breadcrumbTitle,
                setBreadcrumbTitle,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
