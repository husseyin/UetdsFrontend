import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AriziGrup } from 'src/app/models/ariziModels/ariziGrup';
import { Ilce } from 'src/app/models/ilce';
import { Il } from 'src/app/models/il';
import { AriziGrupService } from 'src/app/services/ariziServices/arizi-grup.service';
import { AriziGrupDto } from 'src/app/models/ariziModels/ariziGrupDto';

@Component({
  selector: 'app-arizi-grup',
  templateUrl: './arizi-grup.component.html',
  styleUrls: ['./arizi-grup.component.css'],
})
export class AriziGrupComponent implements OnInit {
  //response
  ariziGruplar: AriziGrup[];
  ariziGrupDetaylar: AriziGrupDto[];
  selectedAriziGrupDetay: AriziGrupDto;
  clonedAriziGrupDetay: AriziGrupDto;
  ariziSeferNo: number;

  //dropdowns
  baslangicIller: Il[];
  baslangicIlceler: Ilce[];
  selectBaslangicIl: Il;
  selectBaslangicIlce: Ilce;

  bitisIller: Il[];
  bitisIlceler: Ilce[];
  selectBitisIl: Il;
  selectBitisIlce: Ilce;

  //dialogs
  ariziGrupDialog: boolean;
  ariziGrup: AriziGrup;
  iptalAciklama: string;

  //table
  first = 0;
  rows = 5;
  totalRecords: number;
  loading: boolean = true;
  selectionMode = 'single';

  constructor(
    private ariziGrupService: AriziGrupService,
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

        this.ariziGrupDetayBySeferNo(this.ariziSeferNo);
        this.ariziIl();
      }
    });
  }

  dialogGrupAdd() {
    this.ariziGrupDialog = true;
    this.ariziGrup = <AriziGrup>{};
  }

  dialogGrupSave(ariziGrup: AriziGrup) {
    if (
      ariziGrup.GrupAdi &&
      ariziGrup.GrupAciklama &&
      this.selectBaslangicIl &&
      this.selectBaslangicIlce &&
      this.selectBitisIl &&
      this.selectBitisIlce &&
      ariziGrup.GrupUcret
    ) {
      ariziGrup.BaslangicIl = this.selectBaslangicIl.IlKodu;
      ariziGrup.BaslangicIlce = this.selectBaslangicIlce.IlceKodu;
      ariziGrup.BitisIl = this.selectBitisIl.IlKodu;
      ariziGrup.BitisIlce = this.selectBitisIlce.IlceKodu;
      ariziGrup.BaslangicUlke = ariziGrup.BitisUlke = 'TR';

      this.ariziGrupEkle(this.ariziSeferNo, ariziGrup);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Hata!',
        detail: 'Zorunlu Alanları Doldurunuz!',
      });
    }
  }

  ariziGrupEkle(ariziSeferNo: number, ariziGrup: AriziGrup) {
    this.ariziGrupService
      .ariziGrupEkle(ariziSeferNo, ariziGrup)
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

          this.ariziGrupDetayBySeferNo(this.ariziSeferNo);
          this.ariziGrup = null;
          this.ariziGrupDialog = false;
          this.selectBaslangicIl =
            this.selectBaslangicIlce =
            this.selectBitisIl =
            this.selectBitisIlce =
              null;
        }
      });
  }

  dialogGrupCancel() {
    this.ariziGrup = null;
    this.ariziGrupDialog = false;
    this.selectBaslangicIl =
      this.selectBaslangicIlce =
      this.selectBitisIl =
      this.selectBitisIlce =
        null;
  }

  editGrup(selectedAriziGrupDetay: AriziGrupDto) {
    this.selectionMode = '';
    this.clonedAriziGrupDetay = { ...selectedAriziGrupDetay };
  }

  editGrupCancel(rowIndex: number) {
    this.ariziGrupDetaylar[rowIndex] = this.clonedAriziGrupDetay;
    delete this.clonedAriziGrupDetay;
    this.selectedAriziGrupDetay = null;
    this.selectBaslangicIl =
      this.selectBaslangicIlce =
      this.selectBitisIl =
      this.selectBitisIlce =
        null;
    this.selectionMode = 'single';
  }

  editGrupSave(selectedAriziGrupDetay: AriziGrupDto) {
    var newAriziGrup = new AriziGrup();
    newAriziGrup.Id = selectedAriziGrupDetay.Id;
    newAriziGrup.UetdsSeferReferansNo =
      selectedAriziGrupDetay.UetdsSeferReferansNo;
    newAriziGrup.UetdsGrupRefNo = selectedAriziGrupDetay.UetdsGrupRefNo;
    newAriziGrup.GrupAdi = selectedAriziGrupDetay.GrupAdi;
    newAriziGrup.GrupAciklama = selectedAriziGrupDetay.GrupAciklama;
    newAriziGrup.GrupUcret = selectedAriziGrupDetay.GrupUcret;
    newAriziGrup.BaslangicUlke = selectedAriziGrupDetay.BaslangicUlke;
    newAriziGrup.BaslangicIl = this.selectBaslangicIl
      ? this.selectBaslangicIl.IlKodu
      : selectedAriziGrupDetay.BaslangicIl;
    newAriziGrup.BaslangicIlce = this.selectBaslangicIlce
      ? this.selectBaslangicIlce.IlceKodu
      : selectedAriziGrupDetay.BaslangicIlce;
    newAriziGrup.BaslangicYer = selectedAriziGrupDetay.BaslangicYer;
    newAriziGrup.BitisUlke = selectedAriziGrupDetay.BitisUlke;
    newAriziGrup.BitisIl = this.selectBitisIl
      ? this.selectBitisIl.IlKodu
      : selectedAriziGrupDetay.BitisIl;
    newAriziGrup.BitisIlce = this.selectBitisIlce
      ? this.selectBitisIlce.IlceKodu
      : selectedAriziGrupDetay.BitisIlce;
    newAriziGrup.BitisYer = selectedAriziGrupDetay.BitisYer;
    newAriziGrup.AktifIptal = selectedAriziGrupDetay.AktifIptal;
    newAriziGrup.IptalAciklama = selectedAriziGrupDetay.IptalAciklama;

    this.ariziGrupGuncelle(
      newAriziGrup.UetdsSeferReferansNo,
      newAriziGrup.UetdsGrupRefNo,
      newAriziGrup
    );

    this.selectionMode = '';
  }

  ariziGrupGuncelle(
    ariziSeferNo: number,
    ariziGrupId: number,
    ariziGrup: AriziGrup
  ) {
    this.ariziGrupService
      .ariziGrupGuncelle(ariziSeferNo, ariziGrupId, ariziGrup)
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

          this.ariziGrupDetayBySeferNo(this.ariziSeferNo);
          this.selectedAriziGrupDetay = null;
          this.selectBaslangicIl =
            this.selectBaslangicIlce =
            this.selectBitisIl =
            this.selectBitisIlce =
              null;
        }
        this.selectionMode = 'single';
      });
  }

  confirmGrup(selectedAriziGrupDetay: AriziGrupDto) {
    this.selectionMode = '';

    this.confirmationService.confirm({
      message: 'Grup IPTAL edilecektir. Onaylıyor musunuz?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ariziGrupIptal(
          selectedAriziGrupDetay.UetdsSeferReferansNo,
          selectedAriziGrupDetay.UetdsGrupRefNo,
          this.iptalAciklama
        );
      },
      reject: () => {
        this.selectionMode = 'single';
      },
    });
  }

  ariziGrupIptal(
    ariziSeferNo: number,
    ariziGrupId: number,
    ariziIptalAciklama: string
  ) {
    this.ariziGrupService
      .ariziGrupIptal(ariziSeferNo, ariziGrupId, ariziIptalAciklama)
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
          this.selectedAriziGrupDetay = null;
          this.ariziGrupDetayBySeferNo(this.ariziSeferNo);
          this.selectionMode = 'single';
        }
      });
  }

  getAll() {
    this.loading = true;

    setTimeout(() => {
      this.ariziGrupService.getAll().subscribe((response) => {
        this.ariziGruplar = response.reverse();
        this.loading = false;
      });
    }, 1000);
  }

  getAllByAriziSeferNo(ariziSeferNo: number) {
    this.loading = true;

    setTimeout(() => {
      this.ariziGrupService
        .getAllByAriziSeferNo(ariziSeferNo)
        .subscribe((response) => {
          this.ariziGruplar = response.reverse();
          this.loading = false;
        });
    }, 1000);
  }

  ariziGrupDetay() {
    this.loading = true;

    setTimeout(() => {
      this.ariziGrupService.ariziGrupDetay().subscribe((response) => {
        this.ariziGrupDetaylar = response.reverse();
        this.loading = false;
      });
    }, 1000);
  }

  ariziGrupDetayBySeferNo(ariziSeferNo: number) {
    this.loading = true;

    setTimeout(() => {
      this.ariziGrupService
        .ariziGrupDetayBySeferNo(ariziSeferNo)
        .subscribe((response) => {
          this.ariziGrupDetaylar = response.reverse();
          this.loading = false;
        });
    }, 1000);
  }

  ariziIl() {
    this.ariziGrupService.iller().subscribe((response) => {
      this.baslangicIller = response;
      this.bitisIller = response;
    });
  }

  ariziBaslangicIlce(ilKodu: number) {
    this.selectBaslangicIlce = null;

    this.ariziGrupService.ilcelerByIlKodu(ilKodu).subscribe((response) => {
      this.baslangicIlceler = response;
    });
  }

  ariziBitisIlce(ilKodu: number) {
    this.selectBitisIlce = null;

    this.ariziGrupService.ilcelerByIlKodu(ilKodu).subscribe((response) => {
      this.bitisIlceler = response;
    });
  }
}
