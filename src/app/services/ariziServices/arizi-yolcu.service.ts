import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AriziYolcu } from 'src/app/models/ariziModels/ariziYolcu';
import { UetdsSonuc } from 'src/app/models/uetdsSonuc';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AriziYolcuService {
  private ariziUrl = environment.localUrl + '/ariziyolcular';

  constructor(private httpClient: HttpClient) {}

  ariziYolcuEkle(
    ariziSeferNo: number,
    ariziYolcu: AriziYolcu
  ): Observable<UetdsSonuc> {
    let newUrl =
      this.ariziUrl + '/ariziyolcuekle?' + 'ariziSeferNo=' + ariziSeferNo;
    return this.httpClient.post<UetdsSonuc>(newUrl, ariziYolcu);
  }

  ariziYolcuIptal(
    ariziSeferNo: number,
    ariziYolcuNo: number,
    ariziIptalAciklama: string
  ): Observable<UetdsSonuc> {
    let newUrl =
      this.ariziUrl +
      '/ariziyolcuiptal?' +
      'ariziSeferNo=' +
      ariziSeferNo +
      '&ariziYolcuNo=' +
      ariziYolcuNo +
      '&ariziIptalAciklama=' +
      ariziIptalAciklama;
    return this.httpClient.get<UetdsSonuc>(newUrl);
  }

  getAll(): Observable<AriziYolcu[]> {
    let newUrl = this.ariziUrl + '/getall';
    return this.httpClient.get<AriziYolcu[]>(newUrl);
  }

  getAllByAriziGrupNo(ariziGrupNo: number): Observable<AriziYolcu[]> {
    let newUrl =
      this.ariziUrl + '/getallbyarizigrupno?' + 'ariziGrupNo=' + ariziGrupNo;
    return this.httpClient.get<AriziYolcu[]>(newUrl);
  }
}
