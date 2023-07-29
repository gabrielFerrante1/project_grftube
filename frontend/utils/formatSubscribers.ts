export function formatSubscribers(n: number): string {
    if (n < 1) {
        return 'Nenhum inscrito'
    }

    if (n == 1) {
        return '1 inscrito'
    }

    if (n <= 999) {
        return `${n} inscritos`
    }

    if (n >= 1000 && n < 1000000) {
        return `${n.toFixed(2)} mil inscritos`
    }

    if (n >= 1000000) {
        return `${n.toFixed(2)} mi inscritos`
    }

    return ''
}