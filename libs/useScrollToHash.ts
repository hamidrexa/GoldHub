import { useEffect } from 'react';

const useScrollToHash = () => {
    useEffect(() => {
        // Get the current URL hash (excluding the # character)
        const hash = window.location.hash.substring(1);

        // Check if there's a hash in the URL
        if (hash) {
            // Try to find the element with the ID equal to the hash
            const element = document.getElementById(hash);

            // If the element exists, scroll to it
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, []); // Empty dependency array means this effect runs once on mount
};

export default useScrollToHash;
