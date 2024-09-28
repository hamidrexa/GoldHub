import { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

const useShare = () => {
    const [isSupported, setIsSupported] = useState(false);
    const [state, copyToClipboard] = useCopyToClipboard();

    useEffect(() => {
        if ('share' in navigator) setIsSupported(true);
    }, []);

    const shareContent = async (options) => {
        try {
            await navigator.share(options);
        } catch (error) {
            copyToClipboard(options.url);
        }
    };

    return [isSupported, shareContent];
};

export default useShare;
