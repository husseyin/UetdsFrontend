import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AriziSefer } from 'src/app/models/ariziModels/ariziSefer';
import { Plaka } from 'src/app/models/plaka';
import { AriziSeferService } from 'src/app/services/ariziServices/arizi-sefer.service';

@Component({
  selector: 'app-arizi-sefer',
  templateUrl: './arizi-sefer.component.html',
  styleUrls: ['./arizi-sefer.component.css'],
})
export class AriziSeferComponent implements OnInit {
  //response
  ariziSeferler: AriziSefer[];
  selectedAriziSefer: AriziSefer;
  clonedAriziSefer: AriziSefer;

  //dialogs
  ariziSeferDialog: boolean;
  ariziSefer: AriziSefer;
  aktifPasifAciklama: string;

  //dropdowns
  plakalar: Plaka[];
  selectPalaka: Plaka;

  //table
  first = 0;
  rows = 5;
  totalRecords: number;
  loading: boolean = true;
  selectionMode = 'single';

  constructor(
    private ariziSeferService: AriziSeferService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAll();

    this.plakalar = [
      { Id: 1, Plaka: '34TEST123', AracDurum: 1 },
      { Id: 2, Plaka: '06TEST123', AracDurum: 1 },
    ];
  }

  dialogSeferAdd() {
    this.ariziSeferDialog = true;
    this.ariziSefer = <AriziSefer>{};
  }

  dialogSeferSave(ariziSefer: AriziSefer) {
    if (
      this.selectPalaka &&
      ariziSefer.HareketTarihi &&
      ariziSefer.HareketSaati &&
      ariziSefer.SeferBitisTarihi &&
      ariziSefer.SeferBitisSaati
    ) {
      ariziSefer.AracPlaka = this.selectPalaka.Plaka;

      this.ariziSeferEkle(ariziSefer);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Hata!',
        detail: 'Zorunlu Alanları Doldurunuz!',
      });
    }
  }

  ariziSeferEkle(ariziSeferler: AriziSefer) {
    this.ariziSeferService
      .ariziSeferEkle(ariziSeferler)
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
          this.ariziSefer = null;
          this.selectPalaka = null;
          this.ariziSeferDialog = false;
        }
      });
  }

  dialogSeferCancel() {
    this.ariziSefer = null;
    this.selectPalaka = null;
    this.ariziSeferDialog = false;
  }

  tarihFormat(tarih: string) {
    return formatDate(tarih, 'yyyy-MM-dd', 'en_US');
  }

  editSefer(selectedAriziSefer: AriziSefer) {
    selectedAriziSefer.HareketTarihi = this.tarihFormat(
      selectedAriziSefer.HareketTarihi
    );

    selectedAriziSefer.SeferBitisTarihi = this.tarihFormat(
      selectedAriziSefer.SeferBitisTarihi
    );

    this.selectionMode = '';
    this.clonedAriziSefer = {
      ...selectedAriziSefer,
    };
  }

  editSeferCancel(rowIndex: number) {
    this.ariziSeferler[rowIndex] = this.clonedAriziSefer;
    delete this.clonedAriziSefer;
    this.selectedAriziSefer = null;
    this.selectPalaka = null;
    this.selectionMode = 'single';
  }

  editSeferSave(selectedAriziSefer: AriziSefer) {
    selectedAriziSefer.AracPlaka = this.selectPalaka
      ? this.selectPalaka.Plaka
      : selectedAriziSefer.AracPlaka;

    this.ariziSeferGuncelle(
      selectedAriziSefer.UetdsSeferReferansNo,
      selectedAriziSefer
    );

    this.selectionMode = '';
  }

  ariziSeferGuncelle(ariziSeferNo: number, selectedAriziSefer: AriziSefer) {
    this.ariziSeferService
      .ariziSeferGuncelle(ariziSeferNo, selectedAriziSefer)
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
          this.selectedAriziSefer = null;
          this.selectPalaka = null;
        }
        this.selectionMode = 'single';
      });
  }

  confirmSefer(selectedAriziSefer: AriziSefer) {
    this.selectionMode = '';

    if (selectedAriziSefer.AktifPasif == 'PASIF') {
      this.confirmationService.confirm({
        message: 'Sefer AKTIF edilecektir. Onaylıyor musunuz?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.ariziSeferAktif(
            selectedAriziSefer.UetdsSeferReferansNo,
            this.aktifPasifAciklama
          );
        },
        reject: () => {
          this.selectionMode = 'single';
        },
      });
    } else {
      this.confirmationService.confirm({
        message: 'Sefer PASIF edilecektir. Onaylıyor musunuz?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.ariziSeferPasif(
            selectedAriziSefer.UetdsSeferReferansNo,
            this.aktifPasifAciklama
          );
        },
        reject: () => {
          this.selectionMode = 'single';
        },
      });
    }
  }

  ariziSeferAktif(ariziSeferNo: number, ariziAktifAciklama: string) {
    this.ariziSeferService
      .ariziSeferAktif(ariziSeferNo, ariziAktifAciklama)
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

          this.aktifPasifAciklama = null;
          this.selectedAriziSefer = null;
          this.getAll();
        }

        this.selectionMode = 'single';
      });
  }

  ariziSeferPasif(ariziSeferNo: number, ariziPasifAciklama: string) {
    this.ariziSeferService
      .ariziSeferPasif(ariziSeferNo, ariziPasifAciklama)
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

          this.aktifPasifAciklama = null;
          this.selectedAriziSefer = null;
          this.getAll();
        }
        
        this.selectionMode = 'single';
      });
  }

  ariziSeferPDF(ariziSeferNo: number) {
    this.selectionMode = '';

    this.ariziSeferService.ariziSeferPDF(ariziSeferNo).subscribe((response) => {
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
            FileSaver.saveAs(blob, ariziSeferNo.toString() + '.pdf');
          });

        this.selectedAriziSefer = null;
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
      this.ariziSeferService.getAll().subscribe((response) => {
        this.ariziSeferler = response.reverse();
        this.loading = false;
      });
    }, 1000);
  }
}
