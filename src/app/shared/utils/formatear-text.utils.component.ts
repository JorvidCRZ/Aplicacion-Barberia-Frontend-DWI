export function formatearTexto(valor: string | null | undefined): string {
    if (!valor) return '-';

    return valor.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, letra => letra.toUpperCase());
}
