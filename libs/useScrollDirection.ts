import { useEffect, useState } from 'react';

const useScrollDirection = () => {
    const [scrollDirection, setScrollDirection] = useState(null);
    const [prevScrollY, setPrevScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > prevScrollY) {
                // Scrolling down
                setScrollDirection('down');
            } else {
                // Scrolling up
                setScrollDirection('up');
            }

            setPrevScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            // Clean up the event listener when the component unmounts
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollY]);

    return scrollDirection;
};

export default useScrollDirection;
