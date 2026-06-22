export class DateHelper {
    static format(fecha: string | Date | null | undefined): string {
        if (!fecha) { return '-'; }
        const date = fecha instanceof Date ? fecha : new Date(fecha.replace(/\.(\d{3})\d+/, '.$1'));
        if (isNaN(date.getTime())) { return '-'; }
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const anio = date.getFullYear();
        const horas = String(date.getHours()).padStart(2, '0');
        const minutos = String(date.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
    }
}