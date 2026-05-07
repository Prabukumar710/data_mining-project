import React from 'react';
import { Game } from '../types';

interface CategoryExplorerProps {
    genres: string[];
    platforms: string[];
    playstyles: string[];
    tags: string[];
    selectedGenres: string[];
    onSelectedGenresChange: (genres: string[]) => void;
    selectedPlatforms: string[];
    onSelectedPlatformsChange: (platforms: string[]) => void;
    // FIX: Changed prop types to string[] for consistency with App state and filter logic.
    selectedPlaystyles: string[];
    onSelectedPlaystylesChange: (playstyles: string[]) => void;
    selectedTags: string[];
    onSelectedTagsChange: (tags: string[]) => void;
    onClearFilters: () => void;
    showOnlyWishlist: boolean;
    onShowOnlyWishlistChange: (show: boolean) => void;
    sortBy: string;
    onSortByChange: (sort: string) => void;
}

interface CategorySectionProps {
    title: string;
    items: string[];
    selectedItems: string[];
    onItemToggle: (item: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, items, selectedItems, onItemToggle }) => (
    <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-300">{title}</h3>
        <div className="flex flex-wrap gap-2">
            {items.map(item => (
                <button
                    key={item}
                    onClick={() => onItemToggle(item)}
                    className={`px-4 py-2 text-sm rounded-full transition-colors duration-200 ${
                        selectedItems.includes(item)
                            ? 'bg-purple-600 text-white font-semibold shadow-lg'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    }`}
                >
                    {item}
                </button>
            ))}
        </div>
    </div>
);

const ToggleSwitch: React.FC<{ label: string, enabled: boolean, onChange: (enabled: boolean) => void }> = ({ label, enabled, onChange }) => (
    <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-300">{label}</span>
        <button
            type="button"
            className={`${
                enabled ? 'bg-purple-600' : 'bg-gray-600'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
        >
            <span
                aria-hidden="true"
                className={`${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    </div>
);


const CategoryExplorer: React.FC<CategoryExplorerProps> = ({
    genres, platforms, playstyles, tags,
    selectedGenres, onSelectedGenresChange,
    selectedPlatforms, onSelectedPlatformsChange,
    selectedPlaystyles, onSelectedPlaystylesChange,
    selectedTags, onSelectedTagsChange,
    onClearFilters,
    showOnlyWishlist, onShowOnlyWishlistChange,
    sortBy, onSortByChange
}) => {
    const createToggleHandler = <T extends string>(
        selectedItems: T[], 
        setter: (items: T[]) => void
    ) => (item: string) => {
        const typedItem = item as T;
        const newSelection = selectedItems.includes(typedItem)
            ? selectedItems.filter(i => i !== typedItem)
            : [...selectedItems, typedItem];
        setter(newSelection);
    };
    
    const hasActiveFilters = [selectedGenres, selectedPlatforms, selectedPlaystyles, selectedTags].some(arr => arr.length > 0) || showOnlyWishlist;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-700/50 rounded-lg">
                    <ToggleSwitch label="My Wishlist" enabled={showOnlyWishlist} onChange={onShowOnlyWishlistChange} />
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                     <label htmlFor="sort-by" className="block text-lg font-semibold text-gray-300 mb-2">Sort By</label>
                     <select
                        id="sort-by"
                        value={sortBy}
                        onChange={(e) => onSortByChange(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                        <option value="rating-desc">Rating: High to Low</option>
                        <option value="popularity-desc">Popularity</option>
                        <option value="year-desc">Release Year: Newest</option>
                        <option value="year-asc">Release Year: Oldest</option>
                        <option value="title-asc">Title: A-Z</option>
                    </select>
                </div>
            </div>

            <CategorySection 
                title="Platforms"
                items={platforms}
                selectedItems={selectedPlatforms}
                onItemToggle={createToggleHandler(selectedPlatforms, onSelectedPlatformsChange)}
            />
            <CategorySection 
                title="Playstyle"
                items={playstyles}
                selectedItems={selectedPlaystyles}
                onItemToggle={createToggleHandler(selectedPlaystyles, onSelectedPlaystylesChange)}
            />
            <CategorySection 
                title="Interests"
                items={tags}
                selectedItems={selectedTags}
                onItemToggle={createToggleHandler(selectedTags, onSelectedTagsChange)}
            />
             <CategorySection 
                title="Genres"
                items={genres}
                selectedItems={selectedGenres}
                onItemToggle={createToggleHandler(selectedGenres, onSelectedGenresChange)}
            />
            {hasActiveFilters && (
                 <div className="pt-4 border-t border-gray-700 flex justify-end">
                    <button
                        onClick={onClearFilters}
                        className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );
};

// FIX: Added default export for the CategoryExplorer component.
export default CategoryExplorer;
