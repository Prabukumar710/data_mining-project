export interface Game {
    id: number;
    title: string;
    genre: string[];
    platform: string;
    rating: number;
    imageUrl: string;
    description: string;
    playstyle: ('Online Multiplayer' | 'Offline Single Player' | 'VR Ready')[];
    tags: ('Competitive' | 'Relaxing' | 'Story-Rich' | 'Family Friendly' | 'Indie' | 'VR Ready')[];
    releaseYear: number;
    popularity: number; // A simulated metric, e.g., 1-100
}