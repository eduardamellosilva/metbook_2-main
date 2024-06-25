import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { AutoresPageRoutingModule } from './autores-routing.module';

import { AutoresListaComponent } from './components/autores-lista/autores-lista.page';
import { AutoresCadastroComponent } from './components/autores-cadastro/autores-cadastro.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AutoresPageRoutingModule,
    HttpClientModule,
  ],
  declarations: [AutoresListaComponent, AutoresCadastroComponent]
})
export class AutoresPageModule {}


/*
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { AutoresPageRoutingModule } from './autores-routing.module';

import { AutoresListaComponent } from './components/autores-lista/autores-lista.page';
import { AutoresCadastroComponent } from './components/autores-cadastro/autores-cadastro.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IonicModule,
    AutoresPageRoutingModule,
    HttpClientModule,
  ],
  declarations: [AutoresListaComponent, AutoresCadastroComponent]
})
export class AutoresPageModule {}
*/