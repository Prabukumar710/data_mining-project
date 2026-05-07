import React from 'react';
import { Game } from '../types';
import GameCard from './GameCard';

interface GameGridProps {
    games: Game[];
    onGameClick: (game: Game) => void;
    wishlist: number[];
    onToggleWishlist: (gameId: number) => void;
}

const GameGrid: React.FC<GameGridProps> = ({ games, onGameClick, wishlist, onToggleWishlist }) => {
    if (games.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-xl text-gray-500">No games found that match your criteria.</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters or search query.</p>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {games.map(game => (
                <GameCard 
                    key={game.id} 
                    game={game} 
                    onClick={() => onGameClick(game)}
                    isWishlisted={wishlist.includes(game.id)}
                    onToggleWishlist={onToggleWishlist}
                />
            ))}
        </div>
    );
};

export default GameGrid;