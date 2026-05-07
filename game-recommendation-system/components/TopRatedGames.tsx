import React from 'react';
import { Game } from '../types';

interface TopRatedGamesProps {
    games: Game[];
    onGameClick: (game: Game) => void;
}

const TopRatedGames: React.FC<TopRatedGamesProps> = ({ games, onGameClick }) => {
    const topGames = games
        .slice() // Create a copy to avoid mutating the original array
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

    return (
        <div className="bg-gray-800 shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Top Rated Games</h2>
            <ul className="space-y-4">
                {topGames.map((game, index) => (
                    <li
                        key={game.id}
                        onClick={() => onGameClick(game)}
                        className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                        <span className="text-xl font-bold text-gray-500 w-6 text-center">{index + 1}</span>
                        <img src={game.imageUrl} alt={game.title} className="w-16 h-10 object-cover rounded" />
                        <div className="flex-grow">
                            <p className="font-semibold text-white truncate">{game.title}</p>
                            <p className="text-sm text-gray-400">{game.genre.join(', ')}</p>
                        </div>
                        <span className="font-bold text-lg text-green-400">{game.rating.toFixed(1)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopRatedGames;