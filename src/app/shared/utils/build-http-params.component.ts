import { HttpParams } from '@angular/common/http';

export function buildHttpParamsComponent<T extends Record<string, any>>(filter?: T): HttpParams {
    if (!filter) return new HttpParams();
    return Object.entries(filter).filter(([_, value]) =>value !== undefined &&value !== null &&value !== '')
    .reduce((params, [key, value]) => {return params.set(key, String(value));}, new HttpParams());
}