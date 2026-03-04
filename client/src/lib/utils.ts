export function formatPrice(value: number): string {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

export function getGameLabel(game: 'mtg' | 'yugioh'): string {
    return game === 'yugioh' ? 'Yu-Gi-Oh!' : 'Magic: The Gathering';
}

export function formatOrderDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    if (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    ) {
        return 'Hoje';
    }

    const months = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
