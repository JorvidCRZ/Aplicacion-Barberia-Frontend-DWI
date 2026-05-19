import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messageService = inject(MessageService);

  showWarn(detail: string, summary: string = 'Advertencia') {
    this.messageService.add({ severity: 'warn', summary, detail, life: 4000 });
  }

  showSuccess(detail: string, summary: string = 'Éxito') {
    this.messageService.add({ severity: 'success', summary, detail, life: 3000 });
  }

  showError(detail: string, summary: string = 'Error') {
    this.messageService.add({ severity: 'error', summary, detail, life: 5000 });
  }

  showHttpError(err: any, summary: string = 'Error') {
    const detail = err?.error?.message || err?.message || 'Ocurrió un error inesperado';
    this.showError(detail, summary);
  }

  // showInfo(detail: string, summary: string = 'Info', life: number = 0) {
  //   this.messageService.add({ severity: 'info', summary, detail, life });
  // }

  // clearAll() {
  //   this.messageService.clear();
  // }
}
