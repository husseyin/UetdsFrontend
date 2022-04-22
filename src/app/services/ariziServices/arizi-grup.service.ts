import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AriziGrup } from 'src/app/models/ariziModels/ariziGrup';
import { Ilce } from 'src/app/models/ilce';
import { Il } from 'src/app/models/il';
import { UetdsSonuc } from 'src/app/models/uetdsSonuc';
import { environment } from 'src/environments/environment';
import { AriziGrupDto } from 'src/app/models/ariziModels/ariziGrupDto';

@Injectable({
  providedIn: 'root',
})
export class AriziGrupService {
  private ariziUrl = environment.localUrl + '/arizigruplar';

  constructor(private httpClient: HttpClient) {}

  ariziGrupEkle(
    ariziSeferNo: number,
    ariziGrup: AriziGrup
  ): Observable<UetdsSonuc> {
    let newUrl =
      this.ariziUrl + '/arizigrupekle?' + 'ariziSeferNo=' + ariziSeferNo;
    return this.httpClient.post<UetdsSonuc>(newUrl, ariziGrup);
  }

  ariziGrupGuncelle(
    ariziSeferNo: number,
    ariziGrupId: number,
    ariziGrup: AriziGrup
  ): Observable<UetdsSonuc> {
    let newUrl =
      this.ariziUrl +
      '/arizigrupguncelle?' +
      'ariziSeferNo=' +
      ariziSeferNo +
      '&ariziGrupId=' +
      ariziGrupId;
    return this.httpClient.post<UetdsSonuc>(newUrl, ariziGrup);
  }

  ariziGrupIptal(
    ariziSeferNo: number,
    ariziGrupId: number,
    ariziIptalAciklama: string
  ): Observable<UetdsSonuc> {
    let newUrl =
      this.ariziUrl +
      '/arizigrupiptal?' +
      'ariziSeferNo=' +
      ariziSeferNo +
      '&ariziGrupId=' +
      ariziGrupId +
      '&ariziIptalAciklama=' +
      ariziIptalAciklama;

    return this.httpClient.get<UetdsSonuc>(newUrl);
  }

  getAll(): Observable<AriziGrup[]> {
    let newUrl = this.ariziUrl + '/getall';
    return this.httpClient.get<AriziGrup[]>(newUrl);
  }

  getAllByAriziSeferNo(ariziSeferNo: number): Observable<AriziGrup[]> {
    let newUrl =
      this.ariziUrl + '/getallbyariziseferno?' + 'ariziSeferNo=' + ariziSeferNo;
    return this.httpClient.get<AriziGrup[]>(newUrl);
  }

  iller(): Observable<Il[]> {
    let newUrl = this.ariziUrl + '/iller';
    return this.httpClient.get<Il[]>(newUrl);
  }

  ilcelerByIlKodu(ilKodu: number): Observable<Ilce[]> {
    let newUrl = this.ariziUrl + '/ilcelerbyilkodu?' + 'ilKodu=' + ilKodu;
    return this.httpClient.get<Ilce[]>(newUrl);
  }

  ariziGrupDetay(): Observable<AriziGrupDto[]> {
    let newUrl = this.ariziUrl + '/arizigrupdetay';
    return this.httpClient.get<AriziGrupDto[]>(newUrl);
  }

  ariziGrupDetayBySeferNo(ariziSeferNo: number): Observable<AriziGrupDto[]> {
    let newUrl =
      this.ariziUrl +
      '/arizigrupdetaybyseferno?' +
      'ariziSeferNo=' +
      ariziSeferNo;
    return this.httpClient.get<AriziGrupDto[]>(newUrl);
  }
}
