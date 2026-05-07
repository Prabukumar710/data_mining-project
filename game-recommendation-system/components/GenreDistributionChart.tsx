import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Game } from '../types';

interface GenreDistributionChartProps {
    games: Game[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f', '#ffbb28'];

const GenreDistributionChart: React.FC<GenreDistributionChartProps> = ({ games }) => {
    const genreData = useMemo(() => {
        const genreCount: { [key: string]: number } = {};
        games.forEach(game => {
            game.genre.forEach(g => {
                genreCount[g] = (genreCount[g] || 0) + 1;
            });
        });
        return Object.entries(genreCount)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [games]);
    
    if (genreData.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No data to display</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={genreData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" stroke="#A0AEC0" tick={{ fontSize: 12 }} />
                <YAxis stroke="#A0AEC0" allowDecimals={false} />
                <Tooltip
                    contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568', borderRadius: '0.5rem' }}
                    labelStyle={{ color: '#E2E8F0' }}
                    itemStyle={{ color: '#A0AEC0' }}
                />
                <Bar dataKey="value">
                    {genreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default GenreDistributionChart;