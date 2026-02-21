import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from '../assets/preloader.json';

const Preloader = () => {
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-950'>
            <Player
                autoplay
                loop
                src={animationData}
                style={{ height: '300px', width: '300px' }}
            />
        </div>
    );
};

export default Preloader;
