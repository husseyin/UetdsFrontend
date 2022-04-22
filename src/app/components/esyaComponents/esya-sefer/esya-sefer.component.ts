import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EsyaSefer } from 'src/app/models/esyaModels/esyaSefer';
import { EsyaIptalTur } from 'src/app/models/esyaModels/esyaIptalTur';
import { Personel } from 'src/app/models/personel';
import { Plaka } from 'src/app/models/plaka';
import { EsyaSeferService } from 'src/app/services/esyaServices/esya-sefer.service';

@Component({
  selector: 'app-esya-sefer',
  templateUrl: './esya-sefer.component.html',
  styleUrls: ['./esya-sefer.component.css'],
})
export class EsyaSeferComponent implements OnInit {
  //response
  esyaSeferler: EsyaSefer[];
  selectedEsyaSefer: EsyaSefer;
  clonedEsyaSefer: EsyaSefer;

  //dropdowns
  plakalar: Plaka[];
  selectPalaka1: Plaka;
  selectPalaka2: Plaka;
  iptalTurleri: EsyaIptalTur[];
  selectIptalTur: EsyaIptalTur;

  //dialogs
  esyaSeferDialog: boolean;
  esyaSefer: EsyaSefer;
  aktifIptalMode: boolean = true;

  //table
  first = 0;
  rows = 5;
  totalRecords: number;
  loading: boolean = true;
  selectionMode = 'single';

  constructor(
    private esyaSeferService: EsyaSeferService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAll();

    this.plakalar = [
      { Id: 1, Plaka: '34TEST123', AracDurum: 1 },
      { Id: 2, Plaka: '06TEST123', AracDurum: 1 },
      { Id: 3, Plaka: 'TT', AracDurum: 1 },
    ];

    this.esyaSeferIptalTurleri();
  }

  dialogSeferAdd() {
    this.esyaSeferDialog = true;
    this.esyaSefer = <EsyaSefer>{};
  }

  dialogSeferSave(esyaSefer: EsyaSefer) {
    if (
      this.selectPalaka1 &&
      esyaSefer.Sofor1TCNo &&
      esyaSefer.BaslangicTarihi &&
      esyaSefer.BaslangicSaati &&
      esyaSefer.BitisTarihi &&
      esyaSefer.BitisSaati
    ) {
      esyaSefer.Plaka1 = this.selectPalaka1.Plaka;
      esyaSefer.Plaka2 = this.selectPalaka2 ? this.selectPalaka2.Plaka : null;

      this.esyaSeferEkle(esyaSefer);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Hata!',
        detail: 'Zorunlu Alanları Doldurunuz!',
      });
    }
  }

  esyaSeferEkle(esyaSeferler: EsyaSefer) {
    this.esyaSeferService.esyaSeferEkle(esyaSeferler).subscribe((response) => {
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

        this.getAll();
        this.esyaSefer = null;
        this.selectPalaka1 = this.selectPalaka2 = null;
        this.esyaSeferDialog = false;
      }
    });
  }

  dialogSeferCancel() {
    this.esyaSefer = null;
    this.selectPalaka1 = this.selectPalaka2 = null;
    this.esyaSeferDialog = false;
  }

  editSefer(selectedEsyaSefer: EsyaSefer) {
    this.selectionMode = '';
    this.clonedEsyaSefer = {
      ...selectedEsyaSefer,
    };
  }

  editSeferCancel(rowIndex: number) {
    this.esyaSeferler[rowIndex] = this.clonedEsyaSefer;
    delete this.clonedEsyaSefer;
    this.selectedEsyaSefer = null;
    this.selectPalaka1 = this.selectPalaka2 = null;
    this.selectionMode = 'single';
  }

  editSeferSave(selectedEsyaSefer: EsyaSefer) {
    selectedEsyaSefer.Plaka1 = this.selectPalaka1
      ? this.selectPalaka1.Plaka
      : selectedEsyaSefer.Plaka1;
    selectedEsyaSefer.Plaka2 = this.selectPalaka2
      ? this.selectPalaka2.Plaka
      : selectedEsyaSefer.Plaka2;

    this.esyaSeferDuzenle(selectedEsyaSefer.SeferId, selectedEsyaSefer);

    this.selectionMode = '';
  }

  esyaSeferDuzenle(esyaSeferId: number, selectedEsyaSefer: EsyaSefer) {
    this.esyaSeferService
      .esyaSeferDuzenle(esyaSeferId, selectedEsyaSefer)
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

          this.getAll();
          this.selectedEsyaSefer = null;
          this.selectPalaka1 = this.selectPalaka2 = null;
        }
        this.selectionMode = 'single';
      });
  }

  confirmSefer(selectedEsyaSefer: EsyaSefer) {
    this.selectionMode = '';

    if (selectedEsyaSefer.AktifIptal == 'IPTAL') {
      this.aktifIptalMode = false;

      this.confirmationService.confirm({
        message: 'Sefer AKTIF edilecektir. Onaylıyor musunuz?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.esyaSeferAktif(selectedEsyaSefer.SeferId);
        },
        reject: () => {
          this.selectionMode = 'single';
        },
      });
    } else {
      this.aktifIptalMode = true;

      this.confirmationService.confirm({
        message: 'Sefer IPTAL edilecektir. Onaylıyor musunuz?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          if (!this.selectIptalTur) {
            this.messageService.add({
              severity: 'error',
              summary: 'Hata!',
              detail: 'Zorunlu Alanları Doldurunuz!',
              life: 3000,
            });
            this.selectionMode = 'single';
          } else {
            this.esyaSeferIptal(
              selectedEsyaSefer.SeferId,
              this.selectIptalTur.koduField,
              this.selectIptalTur.aciklamaField
            );
          }
        },
        reject: () => {
          this.selectionMode = 'single';
          this.selectIptalTur = null;
        },
      });
    }
  }

  esyaSeferAktif(esyaSeferId: number) {
    this.esyaSeferService.esyaSeferAktif(esyaSeferId).subscribe((response) => {
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

        this.aktifIptalMode = true;
        this.selectedEsyaSefer = null;
        this.getAll();
      }

      this.selectionMode = 'single';
    });
  }

  esyaSeferIptalTurleri() {
    this.esyaSeferService.esyaSeferIptalTurleri().subscribe((response) => {
      this.iptalTurleri = response;
    });
  }

  esyaSeferIptal(
    esyaSeferId: number,
    esyaIptalKodu: string,
    esyaIptalAciklama: string
  ) {
    this.esyaSeferService
      .esyaSeferIptal(esyaSeferId, esyaIptalKodu, esyaIptalAciklama)
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

          this.aktifIptalMode = false;
          this.selectedEsyaSefer = null;
          this.getAll();
          this.selectionMode = 'single';
        }
      });
  }

  esyaMeslekiYeterlilik(tc: string) {
    if (tc != null && tc.split('-')[0].length == 11) {
      this.esyaSeferService.esyaMeslekiYeterlilik(tc).subscribe((response) => {
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
            detail: 'Mesleki yeterlilik belgesi mevcut',
            life: 3000,
          });
        }
      });
    }
  }

  esyaYetkiBelgesi(plaka: string) {
    if (plaka != null) {
      this.esyaSeferService.esyaYetkiBelgesi(plaka).subscribe((response) => {
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
            detail: 'Eşya taşıma belgesi mevcut',
            life: 3000,
          });
        }
      });
    }
  }

  esyaSeferPDF(esyaSeferId: number) {
    this.selectionMode = '';

    this.esyaSeferService.esyaSeferPDF(esyaSeferId).subscribe((response) => {
      if (response.sonucKoduField == 0) {
        this.messageService.add({
          severity: 'success',
          summary: 'Onaylandı',
          detail: response.sonucMesajiField,
        });

        fetch('data:application/pdf;base64,' + response.sonucPdfField)
          .then(function (resp) {
            return resp.blob();
          })
          .then(function (blob) {
            FileSaver.saveAs(blob, esyaSeferId.toString() + '.pdf');
          });

        this.selectedEsyaSefer = null;
        this.getAll();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Hata!',
          detail: response.sonucMesajiField,
        });
      }

      this.selectionMode = 'single';
    });
  }

  getAll() {
    this.loading = true;

    setTimeout(() => {
      this.esyaSeferService.getAll().subscribe((response) => {
        this.esyaSeferler = response.reverse();
        this.loading = false;
      });
    }, 1000);
  }

  // getAllByEsyaSeferId(esyaSeferId: number) {
  //   this.loading = true;

  //   setTimeout(() => {
  //     this.esyaSeferService
  //       .getAllByEsyaSeferId(esyaSeferId)
  //       .subscribe((response) => {
  //         this.ariziGrupDetaylar = response.reverse();
  //         this.loading = false;
  //       });
  //   }, 1000);
  // }
}
