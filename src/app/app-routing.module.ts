import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AriziGrupComponent } from './components/ariziComponents/arizi-grup/arizi-grup.component';
import { AriziPersonelComponent } from './components/ariziComponents/arizi-personel/arizi-personel.component';
import { AriziSeferComponent } from './components/ariziComponents/arizi-sefer/arizi-sefer.component';
import { AriziYolcuComponent } from './components/ariziComponents/arizi-yolcu/arizi-yolcu.component';
import { EsyaSeferComponent } from './components/esyaComponents/esya-sefer/esya-sefer.component';
import { EsyaYukComponent } from './components/esyaComponents/esya-yuk/esya-yuk.component';

const routes: Routes = [
  //arizi
  // { path: '', pathMatch: 'full', component: DashboardComponent },
  { path: 'ariziSeferler', component: AriziSeferComponent },
  { path: 'ariziGruplar', component: AriziGrupComponent },
  { path: 'ariziPersoneller', component: AriziPersonelComponent },
  { path: 'ariziYolcular', component: AriziYolcuComponent },

  //esya
  { path: 'esyaSeferler', component: EsyaSeferComponent },
  { path: 'esyaYukler', component: EsyaYukComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
