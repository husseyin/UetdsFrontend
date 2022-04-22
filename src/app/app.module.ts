import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AriziSeferComponent } from './components/ariziComponents/arizi-sefer/arizi-sefer.component';
import { AriziGrupComponent } from './components/ariziComponents/arizi-grup/arizi-grup.component';
import { AriziPersonelComponent } from './components/ariziComponents/arizi-personel/arizi-personel.component';
import { AriziYolcuComponent } from './components/ariziComponents/arizi-yolcu/arizi-yolcu.component';
import { EsyaSeferComponent } from './components/esyaComponents/esya-sefer/esya-sefer.component';
import { EsyaYukComponent } from './components/esyaComponents/esya-yuk/esya-yuk.component';

@NgModule({
  declarations: [
    AppComponent,
    AriziSeferComponent,
    AriziGrupComponent,
    AriziPersonelComponent,
    AriziYolcuComponent,
    EsyaSeferComponent,
    EsyaYukComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    InputTextareaModule,
    InputMaskModule,
    RadioButtonModule,
    CheckboxModule,
    CalendarModule,
    DropdownModule,
  ],
  providers: [MessageService, ConfirmationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
