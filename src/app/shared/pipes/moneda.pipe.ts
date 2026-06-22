import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'soles'
})
export class SolesPipe implements PipeTransform {

    transform(value: number | string, decimales: number = 2): string {
        if (value === null || value === undefined || value === '') {
            return 'S/ 0.00';
        }

        const numero = typeof value === 'string' ? parseFloat(value) : value;

        if (isNaN(numero)) {
            return 'S/ 0.00';
        }

        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: decimales,
            maximumFractionDigits: decimales
        }).format(numero);
    }
}