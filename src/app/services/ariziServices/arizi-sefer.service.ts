import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AriziSefer } from 'src/app/models/ariziModels/ariziSefer';
import { AriziSeferPdf } from 'src/app/models/ariziModels/ariziSeferPdf';
import { UetdsSonuc } from 'src/app/models/uetdsSonuc';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AriziSeferService {
  private ariziUrl = environment.localUrl + '/ariziseferler';

  constructor(private httpClient: HttpClient) {}

  ariziSeferEkle(ariziSefer: AriziSefer): Observable<UetdsSonuc> {
    let newUrl = this.ariziUrl + '/ariziseferekle';
    return this.httpClient.post<UetdsSonuc>(newUrl, ariziSefer);
  }

  ariziSeferGuncelle(
    ariziSeferNo: number,
    ariziSefer: AriziSefer
  ): Observable<UetdsSonuc> {
    let newUrl =
      this.ariziUrl + '/ariziseferguncelle?' + 'ariziSeferNo=' + ariziSeferNo;
    return this.httpClient.post<UetdsSonuc>(newUrl, ariziSefer);
  }

  ariziSeferAktif(
    ariziSeferNo: number,
    ariziAktifAciklama: string
  ): Observable<UetdsSonuc> {
    let newUrl =
      this.ariziUrl +
      '/ariziseferaktif?' +
      'ariziSeferNo=' +
      ariziSeferNo +
      '&ariziAktifAciklama=' +
      ariziAktifAciklama;
    return this.httpClient.get<UetdsSonuc>(newUrl);
  }

  ariziSeferPasif(
    ariziSeferNo: number,
    ariziPasifAciklama: string
  ): Observable<UetdsSonuc> {
    let newUrl =
      this.ariziUrl +
      '/ariziseferpasif?' +
      'ariziSeferNo=' +
      ariziSeferNo +
      '&ariziPasifAciklama=' +
      ariziPasifAciklama;
    return this.httpClient.get<UetdsSonuc>(newUrl);
  }

  ariziSeferPDF(ariziSeferNo: number): Observable<AriziSeferPdf> {
    let newUrl =
      this.ariziUrl + '/ariziseferpdf?' + 'ariziSeferNo=' + ariziSeferNo;
    return this.httpClient.get<AriziSeferPdf>(newUrl);
  }

  getAll(): Observable<AriziSefer[]> {
    let newUrl = this.ariziUrl + '/getall';
    return this.httpClient.get<AriziSefer[]>(newUrl);
  }
}
