'use client';

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from 'react';
import { getBrokersList } from '@/app/[lang]/(user)/copytrade/services/getBrokersList';
import { getTopPublishers } from '@/app/[lang]/(user)/leaderboard/services/getTopPublishers';
import { transformPublishersData } from '@/libs/dataTransformers';

interface Broker {
    id: number | string;
}

interface Publisher {
    id: number;
    name: string;
    copiable: any;
    copied_by_user: any;
}

interface ContextProps {
    broker: Broker | null;
    setBroker: Dispatch<SetStateAction<Broker | null>>;
    openBrokerConnect: boolean;
    setOpenBrokerConnect: Dispatch<SetStateAction<boolean>>;
    openCopytrade: boolean;
    setOpenCopytrade: Dispatch<SetStateAction<boolean>>;
    getUserBrokers: () => Promise<void>;
    publishers: Publisher[];
    getPublishers: () => Promise<void>;
    isPublisherLoading: boolean;
}

const CopytradeContext = createContext<ContextProps | undefined>(undefined);

interface ProviderProps {
    children: ReactNode;
}

export const CopytradeContextProvider = ({ children }: ProviderProps) => {
    const [isPublisherLoading, setIsPublisherLoading] = useState<boolean>(true);
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [broker, setBroker] = useState<Broker | null>(null);
    const [openBrokerConnect, setOpenBrokerConnect] = useState<boolean>(false);
    const [openCopytrade, setOpenCopytrade] = useState<boolean>(false);

    useEffect(() => {
        getPublishers();
        getUserBrokers();
    }, []);

    const getUserBrokers = async () => {
        try {
            const [broker] = await getBrokersList();
            setBroker(broker);
        } catch (e) {
            console.error('Failed to fetch brokers', e);
            setBroker(null);
        }
    };
    const getPublishers = async () => {
        setIsPublisherLoading(true);
        try {
            const publishers = await getTopPublishers({
                just_copiables: true,
            });
            setPublishers(transformPublishersData(publishers));
        } catch (e) {
            console.error('Failed to fetch publishers', e);
            setPublishers([]);
        }
        setIsPublisherLoading(false);
    };

    return (
        <CopytradeContext.Provider
            value={{
                broker,
                setBroker,
                openBrokerConnect,
                setOpenBrokerConnect,
                openCopytrade,
                setOpenCopytrade,
                getUserBrokers,
                publishers,
                getPublishers,
                isPublisherLoading,
            }}
        >
            {children}
        </CopytradeContext.Provider>
    );
};

export const useCopytradeContext = () => {
    const context = useContext(CopytradeContext);
    if (context === undefined) {
        throw new Error(
            'useCopytradeContext must be used within a CopytradeContextProvider'
        );
    }
    return context;
};
