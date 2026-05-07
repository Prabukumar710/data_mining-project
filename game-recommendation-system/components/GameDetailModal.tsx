import React, { useMemo } from 'react';
import { Game } from '../types';
import { getSimilarGames } from '../services/recommendationService';
import GameCard from './GameCard';

interface GameDetailModalProps {
    game: Game | null;
    allGames: Game[];
    onClose: () => void;
    onGameSelect: (game: Game) => void;
    wishlist: number[];
    onToggleWishlist: (gameId: number) => void;
}

const GameDetailModal: React.FC<GameDetailModalProps> = ({ game, allGames, onClose, onGameSelect, wishlist, onToggleWishlist }) => {
    const similarGames = useMemo(() => {
        if (!game) return [];
        return getSimilarGames(game, allGames, 5);
    }, [game, allGames]);

    if (!game) return null;

    const isWishlisted = wishlist.includes(game.id);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3 flex-shrink-0">
                            <img src={game.imageUrl} alt={game.title} className="w-full rounded-lg shadow-lg" />
                             <button 
                                onClick={() => onToggleWishlist(game.id)}
                                className={`w-full mt-4 py-3 px-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                                    isWishlisted 
                                    ? 'bg-pink-600 hover:bg-pink-700 text-white' 
                                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                                }`}
                            >
                                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            </button>
                        </div>
                        <div className="md:w-2/3">
                            <h2 className="text-3xl font-extrabold text-white mb-2">{game.title}</h2>
                            <div className="flex items-center gap-4 mb-4">
                               <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    <span className="text-white ml-1 font-bold text-lg">{game.rating.toFixed(1)}</span>
                                </div>
                                <span className="text-gray-400">•</span>
                                <span className="bg-gray-700 text-white text-sm font-bold px-3 py-1 rounded">{game.platform}</span>
                            </div>

                            <p className="text-gray-300 leading-relaxed mb-6">{game.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-2">
                                {game.genre.map(g => <span key={g} className="bg-blue-800 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow">{g}</span>)}
                                {game.playstyle.map(p => <span key={p} className="bg-green-800 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow">{p}</span>)}
                                {game.tags.map(t => <span key={t} className="bg-purple-800 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow">{t}</span>)}
                            </div>
                        </div>
                    </div>

                    {similarGames.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-700">
                            <h3 className="text-2xl font-bold text-white mb-4">You Might Also Like</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {similarGames.map(similarGame => (
                                    <GameCard 
                                        key={similarGame.id} 
                                        game={similarGame} 
                                        onClick={() => onGameSelect(similarGame)}
                                        isWishlisted={wishlist.includes(similarGame.id)}
                                        onToggleWishlist={onToggleWishlist}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameDetailModal;