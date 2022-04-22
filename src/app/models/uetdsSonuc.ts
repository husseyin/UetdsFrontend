import { EsyaYukEkleSonuc } from './esyaModels/esyaYukEkleSonuc';

export interface UetdsSonuc {
  sonucKoduField: number;
  sonucMesajiField: string;
  uetdsEsyaSonucField: EsyaYukEkleSonuc[];
}
