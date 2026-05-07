import React, { useState, useCallback, useMemo } from 'react';
import { Game } from '../types';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
    allGames: Game[];
    onGameSelect: (game: Game) => void;
    onSearchChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ allGames, onGameSelect, onSearchChange }) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debouncedInputValue = useDebounce(inputValue, 300);

    const suggestions = useMemo(() => {
        if (!debouncedInputValue) return [];
        return allGames
            .filter(game => game.title.toLowerCase().includes(debouncedInputValue.toLowerCase()))
            .slice(0, 5);
    }, [debouncedInputValue, allGames]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onSearchChange(e.target.value);
        setShowSuggestions(true);
    }, [onSearchChange]);

    const handleSuggestionClick = useCallback((game: Game) => {
        setInputValue(game.title);
        setShowSuggestions(false);
        onGameSelect(game);
        onSearchChange('');
        setInputValue('');
    }, [onGameSelect, onSearchChange]);

    return (
        <div className="relative w-full">
            <label htmlFor="game-search" className="block text-sm font-medium text-gray-400 mb-1">
                Search by Game Title
            </label>
            <input
                id="game-search"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="e.g., The Witcher 3..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map(game => (
                        <li
                            key={game.id}
                            className="px-4 py-2 cursor-pointer hover:bg-purple-700 flex items-center gap-3"
                            onClick={() => handleSuggestionClick(game)}
                        >
                            <img src={game.imageUrl} alt={game.title} className="w-12 h-8 object-cover rounded"/>
                            <span>{game.title}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;