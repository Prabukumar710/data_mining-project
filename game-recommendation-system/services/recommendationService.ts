import { Game } from '../types';

/**
 * Calculates a similarity score between two games based on shared genres and platform.
 * @param gameA - The first game.
 * @param gameB - The second game.
 * @returns A numeric similarity score.
 */
const calculateSimilarity = (gameA: Game, gameB: Game): number => {
    if (gameA.id === gameB.id) {
        return 0; // Don't compare a game to itself
    }

    let score = 0;

    // Award points for each shared genre
    const commonGenres = gameA.genre.filter(genre => gameB.genre.includes(genre));
    score += commonGenres.length * 2;

    // Award points for same platform
    if (gameA.platform === gameB.platform) {
        score += 1;
    }

    return score;
};

/**
 * Finds a specified number of similar games based on a content-based filtering approach.
 * @param selectedGame - The game to find recommendations for.
 * @param allGames - The list of all available games.
 * @param count - The number of similar games to return.
 * @returns An array of similar games.
 */
export const getSimilarGames = (selectedGame: Game, allGames: Game[], count: number): Game[] => {
    const scoredGames = allGames.map(game => ({
        game,
        score: calculateSimilarity(selectedGame, game)
    }));
    
    // Sort games by score in descending order
    scoredGames.sort((a, b) => b.score - a.score);

    // Return the top `count` games, filtering out any with a score of 0
    return scoredGames
        .filter(scoredGame => scoredGame.score > 0)
        .slice(0, count)
        .map(scoredGame => scoredGame.game);
};