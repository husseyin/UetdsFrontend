import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EsyaIptalTur } from 'src/app/models/esyaModels/esyaIptalTur';
import { EsyaTasimaTur } from 'src/app/models/esyaModels/esyaTasimaTur';
import { EsyaTehlikeliSekil } from 'src/app/models/esyaModels/esyaTehlikeliSekil';
import { EsyaUnDto } from 'src/app/models/esyaModels/esyaUnDto';
import { EsyaYuk } from 'src/app/models/esyaModels/esyaYuk';
import { EsyaYukBirim } from 'src/app/models/esyaModels/esyaYukBirim';
import { EsyaYukDto } from 'src/app/models/esyaModels/esyaYukDto';
import { EsyaYukTur } from 'src/app/models/esyaModels/esyaYukTur';
import { Il } from 'src/app/models/il';
import { Ilce } from 'src/app/models/ilce';
import { UetdsSonuc } from 'src/app/models/uetdsSonuc';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EsyaYukService {
  private esyaUrl = environment.localUrl + '/esyayukler';

  constructor(private httpClient: HttpClient) {}

  esyaYukEkle(esyaSeferId: number, esyaYuk: EsyaYuk): Observable<UetdsSonuc> {
    let newUrl = this.esyaUrl + '/esyayukekle?' + 'esyaSeferId=' + esyaSeferId;
    return this.httpClient.post<UetdsSonuc>(newUrl, esyaYuk);
  }

  esyaYukDuzenle(
    esyaYukId: number,
    esyaYukler: EsyaYuk
  ): Observable<UetdsSonuc> {
    let newUrl = this.esyaUrl + '/esyayukduzenle?' + 'esyaYukId=' + esyaYukId;
    return this.httpClient.post<UetdsSonuc>(newUrl, esyaYukler);
  }

  esyaYukIptalTurleri(): Observable<EsyaIptalTur[]> {
    let newUrl = this.esyaUrl + '/esyayukiptalturleri';
    return this.httpClient.get<EsyaIptalTur[]>(newUrl);
  }

  esyaYukIptal(
    esyaYukId: number,
    esyaIptalKodu: string,
    esyaIptalAciklama: string
  ): Observable<UetdsSonuc> {
    let newUrl =
      this.esyaUrl +
      '/esyayukiptal?' +
      'esyaYukId=' +
      esyaYukId +
      '&esyaIptalKodu=' +
      esyaIptalKodu +
      '&esyaIptalAciklama=' +
      esyaIptalAciklama;
    return this.httpClient.get<UetdsSonuc>(newUrl);
  }

  esyaYukAktif(esyaYukId: number): Observable<UetdsSonuc> {
    let newUrl = this.esyaUrl + '/esyayukaktif?' + 'esyaYukId=' + esyaYukId;
    return this.httpClient.get<UetdsSonuc>(newUrl);
  }

  getAll(): Observable<EsyaYuk[]> {
    let newUrl = this.esyaUrl + '/getall';
    return this.httpClient.get<EsyaYuk[]>(newUrl);
  }

  getAllByEsyaSeferId(esyaSeferId: number): Observable<EsyaYuk[]> {
    let newUrl =
      this.esyaUrl + '/getallbyesyaseferid?' + 'esyaSeferId=' + esyaSeferId;
    return this.httpClient.get<EsyaYuk[]>(newUrl);
  }

  esyaYukDetay(): Observable<EsyaYukDto[]> {
    let newUrl = this.esyaUrl + '/esyayukdetay';
    return this.httpClient.get<EsyaYukDto[]>(newUrl);
  }

  esyaYukDetayBySeferId(esyaSeferId: number): Observable<EsyaYukDto[]> {
    let newUrl =
      this.esyaUrl + '/esyayukdetaybyseferid?' + 'esyaSeferId=' + esyaSeferId;
    return this.httpClient.get<EsyaYukDto[]>(newUrl);
  }

  esyaTasimaTurleri(): Observable<EsyaTasimaTur[]> {
    let newUrl = this.esyaUrl + '/esyatasimaturleri';
    return this.httpClient.get<EsyaTasimaTur[]>(newUrl);
  }

  esyaYukTurleri(): Observable<EsyaYukTur[]> {
    let newUrl = this.esyaUrl + '/esyayukturleri';
    return this.httpClient.get<EsyaYukTur[]>(newUrl);
  }

  esyaTehlikeliTasimaSekilleri(): Observable<EsyaTehlikeliSekil[]> {
    let newUrl = this.esyaUrl + '/esyatehlikelitasimasekilleri';
    return this.httpClient.get<EsyaTehlikeliSekil[]>(newUrl);
  }

  esyaYukBirimleri(): Observable<EsyaYukBirim[]> {
    let newUrl = this.esyaUrl + '/esyayukbirimleri';
    return this.httpClient.get<EsyaYukBirim[]>(newUrl);
  }

  iller(): Observable<Il[]> {
    let newUrl = this.esyaUrl + '/iller';
    return this.httpClient.get<Il[]>(newUrl);
  }

  ilcelerByIlKodu(ilKodu: number): Observable<Ilce[]> {
    let newUrl = this.esyaUrl + '/ilcelerbyilkodu?' + 'ilKodu=' + ilKodu;
    return this.httpClient.get<Ilce[]>(newUrl);
  }

  esyaUnDetay(): Observable<EsyaUnDto[]> {
    let newUrl = this.esyaUrl + '/esyaundetay';
    return this.httpClient.get<EsyaUnDto[]>(newUrl);
  }
}
