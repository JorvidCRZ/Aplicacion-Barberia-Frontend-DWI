import { FormGroup } from '@angular/forms';

export function campoInvalido(form: FormGroup, campo: string, submitted: boolean): boolean {
    const control = form.get(campo);
    return !!(control && control.invalid && (control.touched || control.dirty || submitted));
}

export function marcarFormulario(form: FormGroup): void {
    form.markAllAsTouched();
}