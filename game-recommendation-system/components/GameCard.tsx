import React from 'react';
import { Game } from '../types';

// --- SVG Icon Components (defined at top level for performance and clarity) ---

const HeartFill: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="m11.645 20.91-8.58-8.58c-2.343-2.343-2.343-6.142 0-8.485 2.343-2.343 6.142-2.343 8.485 0l.551.551.551-.551c2.343-2.343 6.142-2.343 8.485 0 2.343 2.343 2.343 6.142 0 8.485L12.2 20.91a.75.75 0 0 1-1.06 0Z" />
    </svg>
);

const HeartOutline: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

const WishlistIcon: React.FC<{isWishlisted: boolean}> = ({ isWishlisted }) => {
    return isWishlisted ? <HeartFill /> : <HeartOutline />;
};

// --- GameCard Component ---

interface GameCardProps {
    game: Game;
    onClick: () => void;
    isWishlisted: boolean;
    onToggleWishlist: (gameId: number) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick, isWishlisted, onToggleWishlist }) => {
    
    const handleWishlistClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent modal from opening when clicking the heart
        onToggleWishlist(game.id);
    };

    return (
        <div 
            onClick={onClick} 
            className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700/50 group cursor-pointer transition-all duration-300 ease-in-out hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-800/30 transform hover:-translate-y-2"
        >
            {/* Image container with fixed 3:4 aspect ratio for consistency */}
            <div className="relative aspect-[3/4] overflow-hidden">
                <img 
                    src={game.imageUrl} 
                    alt={game.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                
                {/* Platform Badge */}
                <div className="absolute bottom-2 left-2">
                    <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow">{game.platform}</span>
                </div>

                {/* Wishlist Button - has a higher z-index to appear over the tooltip */}
                <button 
                    onClick={handleWishlistClick} 
                    className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 z-20 ${
                        isWishlisted 
                            ? 'text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-500' 
                            : 'text-white bg-black/40 hover:bg-black/60'
                    }`}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <WishlistIcon isWishlisted={isWishlisted} />
                </button>
            </div>
            {/* Content Area */}
            <div className="p-4">
                <h3 className="text-lg font-bold truncate text-gray-100 group-hover:text-purple-300 transition-colors duration-200">{game.title}</h3>
                <p className="text-sm text-gray-400 truncate">{game.genre.join(', ')}</p>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-white font-bold">{game.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-500">{game.releaseYear}</span>
                </div>
            </div>
            
            {/* Tooltip Overlay */}
            <div className="absolute inset-0 p-4 bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-10">
                <p className="text-center text-sm text-gray-200">{game.description}</p>
            </div>
        </div>
    );
};

export default GameCard;