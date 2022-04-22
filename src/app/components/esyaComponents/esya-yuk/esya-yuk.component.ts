import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { EsyaYukService } from 'src/app/services/esyaServices/esya-yuk.service';

@Component({
  selector: 'app-esya-yuk',
  templateUrl: './esya-yuk.component.html',
  styleUrls: ['./esya-yuk.component.css'],
})
export class EsyaYukComponent implements OnInit {
  //response
  esyaYukler: EsyaYuk[];
  esyaYukDetaylar: EsyaYukDto[];
  selectedEsyaYukDetay: EsyaYukDto;
  clonedEsyaYukDetay: EsyaYukDto;
  esyaSeferId: number;

  //dropdowns
  yuklemeIller: Il[];
  selectYuklemeIl: Il;
  yuklemeIlceler: Ilce[];
  selectYuklemeIlce: Ilce;
  bosaltmaIller: Il[];
  selectBosaltmaIl: Il;
  bosaltmaIlceler: Ilce[];
  selectBosaltmaIlce: Ilce;

  iptalTurleri: EsyaIptalTur[];
  selectIptalTur: EsyaIptalTur;
  tasimaTurleri: EsyaTasimaTur[];
  selectTasimaTur: EsyaTasimaTur;
  yukTurleri: EsyaYukTur[];
  selectYukTur: EsyaYukTur;
  tehlikeSekilleri: EsyaTehlikeliSekil[];
  selectTehlikeSekil: EsyaTehlikeliSekil;
  yukBirimleri: EsyaYukBirim[];
  selectYukBirim: EsyaYukBirim;
  unDetaylar: EsyaUnDto[];
  selectUnDetay: EsyaUnDto;

  //dialogs
  esyaYukDialog: boolean;
  esyaYuk: EsyaYuk;
  aktifIptalMode: boolean = true;

  //table
  first = 0;
  rows = 5;
  totalRecords: number;
  loading: boolean = true;
  selectionMode = 'single';

  constructor(
    private esyaYukService: EsyaYukService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      if (params.get('esyaSeferId')) {
        this.esyaSeferId = parseInt(
          this.activatedRoute.snapshot.queryParamMap.get('esyaSeferId')
        );

        this.esyaYukDetayBySeferId(this.esyaSeferId);
        this.esyaIl();
        this.esyaYukIptalTurleri();
        this.esyaTasimaTurleri();
      }
    });
  }

  dialogYukAdd() {
    this.esyaYukDialog = true;
    this.esyaYuk = <EsyaYuk>{};
  }

  dialogYukSave(esyaYuk: EsyaYuk) {
    if (
      esyaYuk.GonderenVergiNo &&
      esyaYuk.GonderenUnvan &&
      esyaYuk.AliciVergiNo &&
      esyaYuk.AliciUnvan &&
      this.selectTasimaTur &&
      this.selectYukTur &&
      this.selectYukBirim &&
      esyaYuk.YukMiktari &&
      this.selectYuklemeIl &&
      this.selectYuklemeIlce &&
      this.selectBosaltmaIl &&
      this.selectBosaltmaIlce &&
      esyaYuk.YuklemeTarihi &&
      esyaYuk.YuklemeSaati &&
      esyaYuk.BosaltmaTarihi &&
      esyaYuk.BosaltmaSaati
    ) {
      esyaYuk.TasimaTuruKodu = this.selectTasimaTur.Kodu;
      esyaYuk.TehlikeliMaddeTasimaKodu = this.selectTehlikeSekil
        ? this.selectTehlikeSekil.Kodu
        : null;
      esyaYuk.UnId = this.selectUnDetay
        ? this.selectUnDetay.BakanlikNo.toString()
        : null;
      esyaYuk.YukCinsId = this.selectYukTur.TipId;
      esyaYuk.YukMiktariBirimi = this.selectYukBirim.Kodu;
      esyaYuk.YuklemeIlMernisKodu = this.selectYuklemeIl.IlKodu;
      esyaYuk.YuklemeIlceMernisKodu = this.selectYuklemeIlce.IlceKodu;
      esyaYuk.BosaltmaIlMernisKodu = this.selectBosaltmaIl.IlKodu;
      esyaYuk.BosaltmaIlceMernisKodu = this.selectBosaltmaIlce.IlceKodu;
      esyaYuk.YuklemeUlkeKodu = esyaYuk.BosaltmaUlkeKodu = 'TR';

      this.esyaYukEkle(this.esyaSeferId, esyaYuk);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Hata!',
        detail: 'Zorunlu Alanları Doldurunuz!',
      });
    }
  }

  esyaYukEkle(esyaSeferId: number, esyaYuk: EsyaYuk) {
    this.esyaYukService
      .esyaYukEkle(esyaSeferId, esyaYuk)
      .subscribe((response) => {
        if (response.sonucKoduField != 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Hata!',
            detail: response.uetdsEsyaSonucField[0].sonucMesajiField,
            life: 3000,
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Onaylandı',
            detail: response.uetdsEsyaSonucField[0].sonucMesajiField,
            life: 3000,
          });

          this.esyaYukDetayBySeferId(this.esyaSeferId);
          this.esyaYuk = null;
          this.esyaYukDialog = false;
          this.selectYuklemeIl =
            this.selectYuklemeIlce =
            this.selectBosaltmaIl =
            this.selectBosaltmaIlce =
              null;
        }
      });
  }

  dialogYukCancel() {
    this.esyaYuk = null;
    this.esyaYukDialog = false;
    this.selectYuklemeIl =
      this.selectYuklemeIlce =
      this.selectBosaltmaIl =
      this.selectBosaltmaIlce =
      this.selectTasimaTur =
      this.selectTehlikeSekil =
      this.tehlikeSekilleri =
      this.selectUnDetay =
      this.unDetaylar =
      this.selectYukTur =
      this.selectYukBirim =
        null;
  }

  editYuk(selectedEsyaYukDetay: EsyaYukDto) {
    this.selectionMode = '';
    this.clonedEsyaYukDetay = { ...selectedEsyaYukDetay };
  }

  editYukCancel(rowIndex: number) {
    this.esyaYukDetaylar[rowIndex] = this.clonedEsyaYukDetay;
    delete this.clonedEsyaYukDetay;
    this.selectedEsyaYukDetay = null;
    this.selectYuklemeIl =
      this.selectYuklemeIlce =
      this.selectBosaltmaIl =
      this.selectBosaltmaIlce =
      this.selectTasimaTur =
      this.selectTehlikeSekil =
      this.tehlikeSekilleri =
      this.selectUnDetay =
      this.unDetaylar =
      this.selectYukTur =
      this.selectYukBirim =
        null;
    this.selectionMode = 'single';
  }

  editYukSave(selectedEsyaYukDetay: EsyaYukDto) {
    var newEsyaYuk = new EsyaYuk();
    newEsyaYuk.Id = selectedEsyaYukDetay.Id;
    newEsyaYuk.SeferId = selectedEsyaYukDetay.SeferId;
    newEsyaYuk.YukId = selectedEsyaYukDetay.YukId;
    newEsyaYuk.FirmaYukNo = selectedEsyaYukDetay.FirmaYukNo;
    newEsyaYuk.GonderenVergiNo = selectedEsyaYukDetay.GonderenVergiNo;
    newEsyaYuk.GonderenUnvan = selectedEsyaYukDetay.GonderenUnvan;
    newEsyaYuk.AliciVergiNo = selectedEsyaYukDetay.AliciVergiNo;
    newEsyaYuk.AliciUnvan = selectedEsyaYukDetay.AliciUnvan;
    newEsyaYuk.TasimaTuruKodu = this.selectTasimaTur
      ? this.selectTasimaTur.Kodu
      : selectedEsyaYukDetay.TasimaTuruKodu;
    if (newEsyaYuk.TasimaTuruKodu != 1) {
      newEsyaYuk.TehlikeliMaddeTasimaKodu = null;
      newEsyaYuk.UnId = null;
    } else {
      newEsyaYuk.TehlikeliMaddeTasimaKodu = this.selectTehlikeSekil
        ? this.selectTehlikeSekil.Kodu
        : selectedEsyaYukDetay.TehlikeliMaddeTasimaKodu;
      newEsyaYuk.UnId = this.selectUnDetay
        ? this.selectUnDetay.BakanlikNo
        : selectedEsyaYukDetay.UnId;
    }
    newEsyaYuk.YukCinsId = this.selectYukTur
      ? this.selectYukTur.TipId
      : selectedEsyaYukDetay.YukCinsId;
    newEsyaYuk.YukMiktariBirimi = this.selectYukBirim
      ? this.selectYukBirim.Kodu
      : selectedEsyaYukDetay.YukMiktariBirimi;
    newEsyaYuk.YukMiktari = selectedEsyaYukDetay.YukMiktari;
    newEsyaYuk.YuklemeUlkeKodu = selectedEsyaYukDetay.YuklemeUlkeKodu;
    newEsyaYuk.YuklemeIlMernisKodu = this.selectYuklemeIl
      ? this.selectYuklemeIl.IlKodu
      : selectedEsyaYukDetay.YuklemeIlMernisKodu;
    newEsyaYuk.YuklemeIlceMernisKodu = this.selectYuklemeIlce
      ? this.selectYuklemeIlce.IlceKodu
      : selectedEsyaYukDetay.YuklemeIlceMernisKodu;
    newEsyaYuk.BosaltmaUlkeKodu = selectedEsyaYukDetay.BosaltmaUlkeKodu;
    newEsyaYuk.BosaltmaIlMernisKodu = this.selectBosaltmaIl
      ? this.selectBosaltmaIl.IlKodu
      : selectedEsyaYukDetay.BosaltmaIlMernisKodu;
    newEsyaYuk.BosaltmaIlceMernisKodu = this.selectBosaltmaIlce
      ? this.selectBosaltmaIlce.IlceKodu
      : selectedEsyaYukDetay.BosaltmaIlceMernisKodu;
    newEsyaYuk.YuklemeTarihi = selectedEsyaYukDetay.YuklemeTarihi;
    newEsyaYuk.YuklemeSaati = selectedEsyaYukDetay.YuklemeSaati;
    newEsyaYuk.BosaltmaTarihi = selectedEsyaYukDetay.BosaltmaTarihi;
    newEsyaYuk.BosaltmaSaati = selectedEsyaYukDetay.BosaltmaSaati;
    newEsyaYuk.AktifIptal = selectedEsyaYukDetay.AktifIptal;

    this.esyaYukDuzenle(newEsyaYuk.YukId, newEsyaYuk);
    this.selectionMode = '';
  }

  esyaYukDuzenle(esyaYukId: number, esyaYuk: EsyaYuk) {
    this.esyaYukService
      .esyaYukDuzenle(esyaYukId, esyaYuk)
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

          this.esyaYukDetayBySeferId(this.esyaSeferId);
          this.selectedEsyaYukDetay = null;
          this.selectYuklemeIl =
            this.selectYuklemeIlce =
            this.selectBosaltmaIl =
            this.selectBosaltmaIlce =
            this.selectTasimaTur =
            this.selectTehlikeSekil =
            this.tehlikeSekilleri =
            this.selectUnDetay =
            this.unDetaylar =
            this.selectYukTur =
            this.selectYukBirim =
              null;
        }
        this.selectionMode = 'single';
      });
  }

  confirmYuk(selectedEsyaYukDetay: EsyaYukDto) {
    this.selectionMode = '';

    if (selectedEsyaYukDetay.AktifIptal == 'IPTAL') {
      this.aktifIptalMode = false;

      this.confirmationService.confirm({
        message: 'Yük AKTIF edilecektir. Onaylıyor musunuz?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.esyaYukAktif(selectedEsyaYukDetay.YukId);
        },
        reject: () => {
          this.selectionMode = 'single';
        },
      });
    } else {
      this.aktifIptalMode = true;

      this.confirmationService.confirm({
        message: 'Yük IPTAL edilecektir. Onaylıyor musunuz?',
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
            this.esyaYukIptal(
              selectedEsyaYukDetay.YukId,
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

  esyaYukAktif(esyaYukId: number) {
    this.esyaYukService.esyaYukAktif(esyaYukId).subscribe((response) => {
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
        this.selectedEsyaYukDetay = null;
        this.esyaYukDetayBySeferId(this.esyaSeferId);
      }

      this.selectionMode = 'single';
    });
  }

  esyaYukIptalTurleri() {
    this.esyaYukService.esyaYukIptalTurleri().subscribe((response) => {
      this.iptalTurleri = response;
    });
  }

  esyaYukIptal(
    esyaYukId: number,
    esyaIptalKodu: string,
    esyaIptalAciklama: string
  ) {
    this.esyaYukService
      .esyaYukIptal(esyaYukId, esyaIptalKodu, esyaIptalAciklama)
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
          this.selectedEsyaYukDetay = null;
          this.esyaYukDetayBySeferId(this.esyaSeferId);
          this.selectionMode = 'single';
        }
      });
  }

  getAll() {
    this.loading = true;

    setTimeout(() => {
      this.esyaYukService.getAll().subscribe((response) => {
        this.esyaYukler = response.reverse();
        this.loading = false;
      });
    }, 1000);
  }

  getAllByEsyaSeferId(esyaSeferId: number) {
    this.loading = true;

    setTimeout(() => {
      this.esyaYukService
        .getAllByEsyaSeferId(esyaSeferId)
        .subscribe((response) => {
          this.esyaYukler = response.reverse();
          this.loading = false;
        });
    }, 1000);
  }

  esyaYukDetay() {
    this.loading = true;

    setTimeout(() => {
      this.esyaYukService.esyaYukDetay().subscribe((response) => {
        this.esyaYukDetaylar = response.reverse();
        this.loading = false;
      });
    }, 1000);
  }

  esyaYukDetayBySeferId(esyaSeferId: number) {
    this.loading = true;

    setTimeout(() => {
      this.esyaYukService
        .esyaYukDetayBySeferId(esyaSeferId)
        .subscribe((response) => {
          this.esyaYukDetaylar = response.reverse();
          this.loading = false;
        });
    }, 1000);
  }

  esyaTasimaTurleri() {
    this.esyaYukService.esyaTasimaTurleri().subscribe((response) => {
      this.tasimaTurleri = response;
    });
  }

  esyaYukTurleri() {
    this.esyaYukService.esyaYukTurleri().subscribe((response) => {
      this.yukTurleri = response;
    });
  }

  esyaTehlikeliTasimaSekilleri() {
    if (this.selectTasimaTur.Kodu != 1) {
      this.tehlikeSekilleri = null;
      this.selectTehlikeSekil = null;
    } else {
      this.esyaYukService
        .esyaTehlikeliTasimaSekilleri()
        .subscribe((response) => {
          this.tehlikeSekilleri = response;
        });
    }
  }

  esyaYukBirimleri() {
    this.selectYukBirim = null;
    this.esyaYukService.esyaYukBirimleri().subscribe((response) => {
      this.yukBirimleri = response;
    });
  }

  esyaUnDetay() {
    if (this.selectTasimaTur.Kodu != 1) {
      this.unDetaylar = null;
      this.selectUnDetay = null;
    } else {
      this.esyaYukService.esyaUnDetay().subscribe((response) => {
        this.unDetaylar = response;
      });
    }
  }

  esyaIl() {
    this.esyaYukService.iller().subscribe((response) => {
      this.yuklemeIller = response;
      this.bosaltmaIller = response;
    });
  }

  esyaYuklemeIlce(ilKodu: number) {
    this.selectYuklemeIlce = null;

    this.esyaYukService.ilcelerByIlKodu(ilKodu).subscribe((response) => {
      this.yuklemeIlceler = response;
    });
  }

  esyaBosaltmaIlce(ilKodu: number) {
    this.selectBosaltmaIlce = null;

    this.esyaYukService.ilcelerByIlKodu(ilKodu).subscribe((response) => {
      this.bosaltmaIlceler = response;
    });
  }
}
