import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AriziYolcu } from 'src/app/models/ariziModels/ariziYolcu';
import { Cinsiyet } from 'src/app/models/cinsiyet';
import { AriziYolcuService } from 'src/app/services/ariziServices/arizi-yolcu.service';

@Component({
  selector: 'app-arizi-yolcu',
  templateUrl: './arizi-yolcu.component.html',
  styleUrls: ['./arizi-yolcu.component.css'],
})
export class AriziYolcuComponent implements OnInit {
  //response
  ariziYolcular: AriziYolcu[];
  selectedAriziYolcu: AriziYolcu;
  ariziSeferNo: number;
  ariziGrupNo: number;

  //dropdowns
  cinsiyetler: Cinsiyet[];
  selectCinsiyet: Cinsiyet;

  //dialogs
  ariziYolcuDialog: boolean;
  ariziYolcu: AriziYolcu;
  iptalAciklama: string;

  //table
  first = 0;
  rows = 5;
  totalRecords: number;
  loading: boolean = true;
  selectionMode = 'single';

  constructor(
    private ariziYolcuService: AriziYolcuService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      if (params.get('ariziGrupNo')) {
        this.ariziSeferNo = parseInt(
          this.activatedRoute.snapshot.queryParamMap.get('ariziSeferNo')
        );

        this.ariziGrupNo = parseInt(
          this.activatedRoute.snapshot.queryParamMap.get('ariziGrupNo')
        );

        this.getAllByAriziGrupNo(this.ariziGrupNo);
      }
    });

    this.cinsiyetler = [
      { Id: 1, Cinsiyet: 'Erkek', Kod: 'E' },
      { Id: 2, Cinsiyet: 'Kadın', Kod: 'K' },
    ];
  }

  dialogYolcuAdd() {
    this.ariziYolcuDialog = true;
    this.ariziYolcu = <AriziYolcu>{};
  }

  dialogYolcuSave(ariziYolcu: AriziYolcu) {
    if (ariziYolcu.TcKimlikPasaportNo && ariziYolcu.Adi && ariziYolcu.Soyadi) {
      ariziYolcu.UetdsGrupRefNo = this.ariziGrupNo.toString();
      ariziYolcu.Cinsiyet = this.selectCinsiyet
        ? this.selectCinsiyet.Kod
        : null;
      ariziYolcu.UyrukUlke = 'TR';

      this.ariziYolcuEkle(this.ariziSeferNo, ariziYolcu);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Hata!',
        detail: 'Zorunlu Alanları Doldurunuz!',
      });
    }
  }

  ariziYolcuEkle(ariziSeferNo: number, ariziYolcu: AriziYolcu) {
    this.ariziYolcuService
      .ariziYolcuEkle(ariziSeferNo, ariziYolcu)
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

          this.getAllByAriziGrupNo(this.ariziGrupNo);
          this.ariziYolcu = null;
          this.ariziYolcuDialog = false;
          this.selectCinsiyet = null;
        }
      });
  }

  dialogYolcuCancel() {
    this.ariziYolcu = null;
    this.ariziYolcuDialog = false;
    this.selectCinsiyet = null;
  }

  confirmYolcu(selectedAriziYolcu: AriziYolcu) {
    this.selectionMode = '';

    this.confirmationService.confirm({
      message: 'Yolcu IPTAL edilecektir. Onaylıyor musunuz?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ariziYolcuIptal(
          selectedAriziYolcu.UetdsSeferReferansNo,
          parseInt(selectedAriziYolcu.UetdsYolcuRefNo),
          this.iptalAciklama
        );
      },
      reject: () => {
        this.selectionMode = 'single';
      },
    });
  }

  ariziYolcuIptal(
    ariziSeferNo: number,
    ariziYolcuNo: number,
    ariziIptalAciklama: string
  ) {
    this.ariziYolcuService
      .ariziYolcuIptal(ariziSeferNo, ariziYolcuNo, ariziIptalAciklama)
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
          this.selectedAriziYolcu = null;
          this.getAllByAriziGrupNo(this.ariziGrupNo);
          this.selectionMode = 'single';
        }
      });
  }

  getAll() {
    this.loading = true;

    setTimeout(() => {
      this.ariziYolcuService.getAll().subscribe((response) => {
        this.ariziYolcular = response;
        this.loading = false;
      });
    }, 1000);
  }

  getAllByAriziGrupNo(ariziGrupNo: number) {
    this.loading = true;

    setTimeout(() => {
      this.ariziYolcuService
        .getAllByAriziGrupNo(ariziGrupNo)
        .subscribe((response) => {
          this.ariziYolcular = response;

          this.loading = false;
        });
    }, 1000);
  }
}
