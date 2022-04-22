import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AriziPersonel } from 'src/app/models/ariziModels/ariziPersonel';
import { AriziPersonelDto } from 'src/app/models/ariziModels/ariziPersonelDto';
import { AriziPersonelTur } from 'src/app/models/ariziModels/ariziPersonelTur';
import { UetdsSonuc } from 'src/app/models/uetdsSonuc';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AriziPersonelService {
  private ariziUrl = environment.localUrl + '/arizipersoneller';

  constructor(private httpClient: HttpClient) {}

  ariziPersonelEkle(
    ariziSeferNo: number,
    ariziPersonel: AriziPersonel
  ): Observable<UetdsSonuc> {
    let newUrl =
      this.ariziUrl + '/arizipersonelekle?' + 'ariziSeferNo=' + ariziSeferNo;
    return this.httpClient.post<UetdsSonuc>(newUrl, ariziPersonel);
  }

  ariziPersonelIptal(
    ariziTcPasaportNo: string,
    ariziIptalAciklama: string
  ): Observable<UetdsSonuc> {
    let newUrl =
      this.ariziUrl +
      '/arizipersoneliptal?' +
      'ariziTcPasaportNo=' +
      ariziTcPasaportNo +
      '&ariziIptalAciklama=' +
      ariziIptalAciklama;
    return this.httpClient.get<UetdsSonuc>(newUrl);
  }

  getAll(): Observable<AriziPersonel[]> {
    let newUrl = this.ariziUrl + '/getall';
    return this.httpClient.get<AriziPersonel[]>(newUrl);
  }

  ariziPersonelTurleri(): Observable<AriziPersonelTur[]> {
    let newUrl = this.ariziUrl + '/arizipersonelturleri';
    return this.httpClient.get<AriziPersonelTur[]>(newUrl);
  }

  ariziPersonelDetay(): Observable<AriziPersonelDto[]> {
    let newUrl = this.ariziUrl + '/arizipersoneldetay';
    return this.httpClient.get<AriziPersonelDto[]>(newUrl);
  }

  ariziPersonelDetayBySeferNo(
    ariziSeferNo: number
  ): Observable<AriziPersonelDto[]> {
    let newUrl =
      this.ariziUrl +
      '/arizipersoneldetaybyseferno?' +
      'ariziSeferNo=' +
      ariziSeferNo;

    return this.httpClient.get<AriziPersonelDto[]>(newUrl);
  }
}
