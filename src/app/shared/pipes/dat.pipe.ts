export class DateFormatHelper {
    static format(fecha: string | null | undefined): string {
        if (!fecha) { return '-'; }
        const date = new Date(fecha);
        return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
    }
}