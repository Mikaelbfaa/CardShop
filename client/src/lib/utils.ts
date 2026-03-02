export function formatPrice(value: number): string {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

export function getGameLabel(game: 'mtg' | 'yugioh'): string {
    return game === 'yugioh' ? 'Yu-Gi-Oh!' : 'Magic: The Gathering';
}
