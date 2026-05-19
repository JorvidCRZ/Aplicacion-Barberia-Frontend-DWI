import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Pipe({
    name: 'safeImageUrl',
    pure: false
})
export class SafeImageUrlPipe implements PipeTransform {
    apiBaseUrl = environment.apiBaseUrl;
    transform(url: string | null | undefined): string | undefined {
        if (!url || url === 'null' || url === 'undefined' || url.trim() === '') {return undefined;}
        if (/^https?:\/\//i.test(url)) {return url;}
        if (url.startsWith('/uploads') || url.startsWith('uploads')) {return this.apiBaseUrl.replace(/\/$/, '') + '/' + url.replace(/^\//, '');}
        return this.apiBaseUrl.replace(/\/$/, '') + '/uploads/' + url.replace(/^\//, '');
    }
}