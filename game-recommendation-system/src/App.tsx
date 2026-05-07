import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Game } from './types';
import { games as allGames } from './data/games';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import GameGrid from './components/GameGrid';
import GameDetailModal from './components/GameDetailModal';
import GenreDistributionChart from './components/GenreDistributionChart';
import AuthPage from './components/AuthPage';
import CategoryExplorer from './components/CategoryExplorer';
import TopRatedGames from './components/TopRatedGames';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    // FIX: Changed state types to string[] to match the values returned from the filter component.
    const [selectedPlaystyles, setSelectedPlaystyles] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [showOnlyWishlist, setShowOnlyWishlist] = useState(false);
    const [sortBy, setSortBy] = useState('rating-desc');

    useEffect(() => {
        const loggedInUserStr = localStorage.getItem('loggedInUser');
        if (loggedInUserStr) {
            const user = JSON.parse(loggedInUserStr);
            setIsAuthenticated(true);
            setCurrentUserEmail(user.email);
            const userWishlist = localStorage.getItem(`wishlist_${user.email}`);
            if (userWishlist) {
                setWishlist(JSON.parse(userWishlist));
            }
        }
    }, []);

    useEffect(() => {
        if (currentUserEmail) {
            localStorage.setItem(`wishlist_${currentUserEmail}`, JSON.stringify(wishlist));
        }
    }, [wishlist, currentUserEmail]);

    const handleLoginSuccess = () => {
        const loggedInUserStr = localStorage.getItem('loggedInUser');
        if (loggedInUserStr) {
            const user = JSON.parse(loggedInUserStr);
            setIsAuthenticated(true);
            setCurrentUserEmail(user.email);
            const userWishlist = localStorage.getItem(`wishlist_${user.email}`);
            setWishlist(userWishlist ? JSON.parse(userWishlist) : []);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        setIsAuthenticated(false);
        setCurrentUserEmail(null);
        setWishlist([]);
    };

    const handleToggleWishlist = useCallback((gameId: number) => {
        setWishlist(prevWishlist => {
            if (prevWishlist.includes(gameId)) {
                return prevWishlist.filter(id => id !== gameId);
            } else {
                return [...prevWishlist, gameId];
            }
        });
    }, []);

    const uniqueGenres = useMemo(() => Array.from(new Set(allGames.flatMap(g => g.genre))).sort(), []);
    const uniquePlatforms = useMemo(() => Array.from(new Set(allGames.map(g => g.platform))).sort(), []);
    const uniquePlaystyles = useMemo(() => Array.from(new Set(allGames.flatMap(g => g.playstyle))).sort(), []);
    const uniqueTags = useMemo(() => Array.from(new Set(allGames.flatMap(g => g.tags))).sort(), []);
    
    const resetAllFilters = () => {
        setSearchQuery('');
        setSelectedGenres([]);
        setSelectedPlatforms([]);
        setSelectedPlaystyles([]);
        setSelectedTags([]);
        setShowOnlyWishlist(false);
        setSortBy('rating-desc');
    }

    const filteredAndSortedGames = useMemo(() => {
        let gamesToFilter = allGames;
        if (showOnlyWishlist) {
            gamesToFilter = allGames.filter(game => wishlist.includes(game.id));
        }

        const filtered = gamesToFilter.filter(game => {
            const matchesQuery = game.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGenre = selectedGenres.length === 0 || selectedGenres.every(g => game.genre.includes(g));
            const matchesPlatform = selectedPlatforms.length === 0 || selectedPlatforms.includes(game.platform);
            const matchesPlaystyle = selectedPlaystyles.length === 0 || selectedPlaystyles.every(p => game.playstyle.includes(p));
            const matchesTag = selectedTags.length === 0 || selectedTags.every(t => game.tags.includes(t));
            return matchesQuery && matchesGenre && matchesPlatform && matchesPlaystyle && matchesTag;
        });
        
        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'year-desc':
                    return b.releaseYear - a.releaseYear;
                case 'year-asc':
                    return a.releaseYear - b.releaseYear;
                case 'popularity-desc':
                    return b.popularity - a.popularity;
                case 'rating-desc':
                default:
                    return b.rating - a.rating;
            }
        });

    }, [searchQuery, selectedGenres, selectedPlatforms, selectedPlaystyles, selectedTags, wishlist, showOnlyWishlist, sortBy]);

    const handleGameSelect = useCallback((game: Game) => setSelectedGame(game), []);
    const handleCloseModal = useCallback(() => setSelectedGame(null), []);

    if (!isAuthenticated) {
        return <AuthPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
            <Header onLogout={handleLogout} />
            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 bg-gray-800 shadow-lg rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">Find Your Next Favorite Game</h2>
                        <div className="mb-6">
                            <SearchBar allGames={allGames} onGameSelect={handleGameSelect} onSearchChange={setSearchQuery} />
                        </div>
                        <CategoryExplorer 
                            genres={uniqueGenres} platforms={uniquePlatforms} playstyles={uniquePlaystyles} tags={uniqueTags}
                            selectedGenres={selectedGenres} onSelectedGenresChange={setSelectedGenres}
                            selectedPlatforms={selectedPlatforms} onSelectedPlatformsChange={setSelectedPlatforms}
                            selectedPlaystyles={selectedPlaystyles} onSelectedPlaystylesChange={setSelectedPlaystyles}
                            selectedTags={selectedTags} onSelectedTagsChange={setSelectedTags}
                            onClearFilters={resetAllFilters}
                            showOnlyWishlist={showOnlyWishlist}
                            onShowOnlyWishlistChange={setShowOnlyWishlist}
                            sortBy={sortBy}
                            onSortByChange={setSortBy}
                        />
                    </div>
                    <div className="space-y-8">
                         <TopRatedGames games={allGames} onGameClick={handleGameSelect} />
                         {filteredAndSortedGames.length > 0 && (
                            <div className="bg-gray-800 shadow-lg rounded-xl p-6">
                                <h2 className="text-2xl font-bold mb-4 text-purple-400">Genre Distribution</h2>
                                <div className="h-64">
                                    <GenreDistributionChart games={filteredAndSortedGames} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <h2 className="text-3xl font-bold mb-6 text-center">{showOnlyWishlist ? 'My Wishlist' : 'Recommended For You'}</h2>
                <GameGrid 
                    games={filteredAndSortedGames} 
                    onGameClick={handleGameSelect}
                    wishlist={wishlist}
                    onToggleWishlist={handleToggleWishlist} 
                />

                {selectedGame && (
                    <GameDetailModal
                        game={selectedGame}
                        allGames={allGames}
                        onClose={handleCloseModal}
                        onGameSelect={handleGameSelect}
                        wishlist={wishlist}
                        onToggleWishlist={handleToggleWishlist}
                    />
                )}
            </main>
            <footer className="text-center py-4 text-gray-500 text-sm">
                <p>Game Recommendation System &copy; 2024</p>
            </footer>
        </div>
    );
};

export default App;
