import React from 'react';

interface HeaderProps {
    onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    return (
        <header className="bg-gray-800 shadow-lg">
            <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                <div className="text-center flex-grow">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            Game Recommendation System
                        </span>
                    </h1>
                    <p className="mt-2 text-lg text-gray-400">Discover your next adventure</p>
                </div>
                {onLogout && (
                    <button
                        onClick={onLogout}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;