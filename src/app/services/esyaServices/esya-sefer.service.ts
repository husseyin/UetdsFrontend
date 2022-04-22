import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EsyaIptalTur } from 'src/app/models/esyaModels/esyaIptalTur';
import { EsyaSefer } from 'src/app/models/esyaModels/esyaSefer';
import { EsyaSeferPdf } from 'src/app/models/esyaModels/esyaSeferPdf';
import { UetdsSonuc } from 'src/app/models/uetdsSonuc';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EsyaSeferService {
  private esyaUrl = environment.localUrl + '/esyaseferler';

  constructor(private httpClient: HttpClient) {}

  esyaSeferEkle(esyaSefer: EsyaSefer): Observable<UetdsSonuc> {
    let newUrl = this.esyaUrl + '/esyaseferekle';
    return this.httpClient.post<UetdsSonuc>(newUrl, esyaSefer);
  }

  esyaSeferDuzenle(
    esyaSeferId: number,
    esyaSeferler: EsyaSefer
  ): Observable<UetdsSonuc> {
    let newUrl =
      this.esyaUrl + '/esyaseferduzenle?' + 'esyaSeferId=' + esyaSeferId;
    return this.httpClient.post<UetdsSonuc>(newUrl, esyaSeferler);
  }

  esyaSeferIptalTurleri(): Observable<EsyaIptalTur[]> {
    let newUrl = this.esyaUrl + '/esyaseferiptalturleri';
    return this.httpClient.get<EsyaIptalTur[]>(newUrl);
  }

  esyaSeferIptal(
    esyaSeferId: number,
    esyaIptalKodu: string,
    esyaIptalAciklama: string
  ): Observable<UetdsSonuc> {
    let newUrl =
      this.esyaUrl +
      '/esyaseferiptal?' +
      'esyaSeferId=' +
      esyaSeferId +
      '&esyaIptalKodu=' +
      esyaIptalKodu +
      '&esyaIptalAciklama=' +
      esyaIptalAciklama;
    return this.httpClient.get<UetdsSonuc>(newUrl);
  }

  esyaSeferAktif(esyaSeferId: number): Observable<UetdsSonuc> {
    let newUrl =
      this.esyaUrl + '/esyaseferaktif?' + 'esyaSeferId=' + esyaSeferId;
    return this.httpClient.get<UetdsSonuc>(newUrl);
  }

  esyaMeslekiYeterlilik(tc: string): Observable<UetdsSonuc> {
    let newUrl =
      this.esyaUrl + '/esyameslekiyeterlilik?' + 'tc=' + tc;
    return this.httpClient.get<UetdsSonuc>(newUrl);
  }

  esyaYetkiBelgesi(plaka: string): Observable<UetdsSonuc> {
    let newUrl =
      this.esyaUrl + '/esyayetkibelgesi?' + 'plaka=' + plaka;
    return this.httpClient.get<UetdsSonuc>(newUrl);
  }

  esyaSeferPDF(esyaSeferId: number): Observable<EsyaSeferPdf> {
    let newUrl = this.esyaUrl + '/esyaseferpdf?' + 'esyaSeferId=' + esyaSeferId;
    return this.httpClient.get<EsyaSeferPdf>(newUrl);
  }

  getAll(): Observable<EsyaSefer[]> {
    let newUrl = this.esyaUrl + '/getall';
    return this.httpClient.get<EsyaSefer[]>(newUrl);
  }
}
