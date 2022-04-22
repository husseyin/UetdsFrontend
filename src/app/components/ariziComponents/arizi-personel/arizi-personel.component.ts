import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AriziPersonel } from 'src/app/models/ariziModels/ariziPersonel';
import { AriziPersonelDto } from 'src/app/models/ariziModels/ariziPersonelDto';
import { AriziPersonelTur } from 'src/app/models/ariziModels/ariziPersonelTur';
import { Cinsiyet } from 'src/app/models/cinsiyet';
import { Personel } from 'src/app/models/personel';
import { AriziPersonelService } from 'src/app/services/ariziServices/arizi-personel.service';

@Component({
  selector: 'app-arizi-personel',
  templateUrl: './arizi-personel.component.html',
  styleUrls: ['./arizi-personel.component.css'],
})
export class AriziPersonelComponent implements OnInit {
  //response
  ariziPersoneller: AriziPersonel[];
  ariziPersonelDetaylar: AriziPersonelDto[];
  selectedAriziPersonelDetay: AriziPersonelDto;
  ariziSeferNo: number;

  //dropdowns
  personeller: Personel[];
  selectPersonel: Personel;
  cinsiyetler: Cinsiyet[];
  selectCinsiyet: Cinsiyet;
  personelTurleri: AriziPersonelTur[];
  selectPersonelTur: AriziPersonelTur;

  //dialogs
  ariziPersonelDialog: boolean;
  ariziPersonel: AriziPersonel;
  iptalAciklama: string;

  //table
  first = 0;
  rows = 5;
  totalRecords: number;
  loading: boolean = true;
  selectionMode = 'single';

  constructor(
    private ariziPersonelService: AriziPersonelService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      if (params.get('ariziSeferNo')) {
        this.ariziSeferNo = parseInt(
          this.activatedRoute.snapshot.queryParamMap.get('ariziSeferNo')
        );

        this.ariziPersonelDetayBySeferNo(this.ariziSeferNo);
      }
    });

    this.personeller = [
      {
        Id: 1,
        TcKimlikPasaportNo: '11111111111',
        Adi: 'hüseyin',
        Soyadi: 'çalışkan',
      },
      {
        Id: 2,
        TcKimlikPasaportNo: '22222222222',
        Adi: 'halil',
        Soyadi: 'çalışkan',
      },
      {
        Id: 3,
        TcKimlikPasaportNo: '33333333333',
        Adi: 'yasemin',
        Soyadi: 'çalışkan',
      },
    ];

    this.cinsiyetler = [
      { Id: 1, Cinsiyet: 'Erkek', Kod: 'E' },
      { Id: 2, Cinsiyet: 'Kadın', Kod: 'K' },
    ];

    this.ariziPersonelTurleri();
  }

  dialogPersonelAdd() {
    this.ariziPersonelDialog = true;
    this.ariziPersonel = <AriziPersonel>{};
  }

  dialogPersonelSave(ariziPersonel: AriziPersonel) {
    if (this.selectPersonel && this.selectPersonelTur) {
      ariziPersonel.TcKimlikPasaportNo = this.selectPersonel.TcKimlikPasaportNo;
      ariziPersonel.Adi = this.selectPersonel.Adi;
      ariziPersonel.Soyadi = this.selectPersonel.Soyadi;
      ariziPersonel.Cinsiyet = this.selectCinsiyet
        ? this.selectCinsiyet.Kod
        : null;
      ariziPersonel.TurKodu = this.selectPersonelTur.TurKodu;
      ariziPersonel.UyrukUlke = 'TR';

      this.ariziPersonelEkle(this.ariziSeferNo, ariziPersonel);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Hata!',
        detail: 'Zorunlu Alanları Doldurunuz!',
      });
    }
  }

  ariziPersonelEkle(ariziSeferNo: number, ariziPersonel: AriziPersonel) {
    this.ariziPersonelService
      .ariziPersonelEkle(ariziSeferNo, ariziPersonel)
      .subscribe((response) => {
        if (response.sonucKoduField != 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Hata!',
            detail: response.sonucMesajiField,
            life: 3000,
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Onaylandı',
            detail: response.sonucMesajiField,
            life: 3000,
          });

          this.ariziPersonelDetayBySeferNo(this.ariziSeferNo);
          this.ariziPersonel = null;
          this.ariziPersonelDialog = false;
          this.selectPersonel =
            this.selectPersonelTur =
            this.selectCinsiyet =
              null;
        }
      });
  }

  dialogPersonelCancel() {
    this.ariziPersonel = null;
    this.ariziPersonelDialog = false;
    this.selectPersonel = this.selectPersonelTur = this.selectCinsiyet = null;
  }

  confirmPersonel(selectedAriziPersonelDetay: AriziPersonelDto) {
    this.selectionMode = '';

    this.confirmationService.confirm({
      message: 'Personel IPTAL edilecektir. Onaylıyor musunuz?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ariziPersonelIptal(
          selectedAriziPersonelDetay.TcKimlikPasaportNo,
          this.iptalAciklama
        );
      },
      reject: () => {
        this.selectionMode = 'single';
      },
    });
  }

  ariziPersonelIptal(ariziTcPasaportNo: string, ariziIptalAciklama: string) {
    this.ariziPersonelService
      .ariziPersonelIptal(ariziTcPasaportNo, ariziIptalAciklama)
      .subscribe((response) => {
        if (response.sonucKoduField != 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Hata!',
            detail: response.sonucMesajiField,
            life: 3000,
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Onaylandı',
            detail: response.sonucMesajiField,
            life: 3000,
          });

          this.iptalAciklama = null;
          this.selectedAriziPersonelDetay = null;
          this.ariziPersonelDetayBySeferNo(this.ariziSeferNo);
          this.selectionMode = 'single';
        }
      });
  }

  getAll() {
    this.loading = true;

    this.ariziPersonelService.getAll().subscribe((response) => {
      this.ariziPersoneller = response.reverse();
      this.loading = false;
    });
  }

  ariziPersonelTurleri() {
    this.ariziPersonelService.ariziPersonelTurleri().subscribe((response) => {
      this.personelTurleri = response;
    });
  }

  ariziPersonelDetay() {
    this.loading = true;

    setTimeout(() => {
      this.ariziPersonelService.ariziPersonelDetay().subscribe((response) => {
        this.ariziPersonelDetaylar = response.reverse();
        this.loading = false;
      });
    }, 1000);
  }

  ariziPersonelDetayBySeferNo(ariziSeferNo: number) {
    this.loading = true;

    setTimeout(() => {
      this.ariziPersonelService
        .ariziPersonelDetayBySeferNo(ariziSeferNo)
        .subscribe((response) => {
          this.ariziPersonelDetaylar = response.reverse();
          this.loading = false;
        });
    }, 1000);
  }
}
