import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from '../assets/preloader.json';

const Preloader = () => {
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-950'>
            <div className='flex flex-col items-center gap-3 text-center'>
                <Player
                    autoplay
                    loop
                    src={animationData}
                    style={{ height: '280px', width: '280px' }}
                />
                <div
                    className='text-2xl sm:text-3xl font-bold tracking-wide animate-pulse bg-gradient-to-r from-green-500 via-lime-400 to-yellow-400 bg-clip-text text-transparent'
                    style={{ animationDuration: '8s' }}
                >
                    Welcome To KartMe
                </div>
                <div
                    className='text-xs sm:text-sm uppercase tracking-[0.35em] animate-bounce text-green-600/80'
                    style={{ animationDuration: '8s' }}
                >
                    Loading...
                </div>
            </div>
        </div>
    );
};

export default Preloader;
