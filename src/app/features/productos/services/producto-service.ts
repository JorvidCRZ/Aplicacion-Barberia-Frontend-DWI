import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoResponse } from '../models/response/ProductoResponse';
import { Page } from '../models/response/Page';
import { ApiResponse } from '../models/response/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {

  private API_URL = environment.apiUrl + '/productos';
  private http = inject(HttpClient);

  getProductos(): Observable<ApiResponse<Page<ProductoResponse>>> {
    return this.http.get<ApiResponse<Page<ProductoResponse>>>(
      `${this.API_URL}`
    );
  }

}
