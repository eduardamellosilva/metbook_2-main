import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AutorInterface } from '../../types/autor.interface';
import { AutorService } from '../../services/autor.service';
import { AlertService } from '@services';
import { Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-autores',
  templateUrl: './autores-lista.page.html',
  styleUrls: ['./autores-lista.page.scss'],
})
export class AutoresListaComponent implements OnInit {
  autores: AutorInterface[] = [];
  termoBuscaControl: FormControl;
  private loading: HTMLIonLoadingElement | null = null;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private autorService: AutorService,
    private alertService: AlertService
  ) {
    // Inicialize o FormControl para termoBusca com Validators.required
    this.termoBuscaControl = new FormControl('', Validators.required);
  }

  ngOnInit() {
    this.listarAutores();
  }

  async listarAutores() {
    this.loading = await this.loadingController.create({
      message: 'Carregando autores...'
    });
    await this.loading.present();

    try {
      const dados = await this.autorService.getAutores().toPromise();
      if (dados) {
        this.autores = dados as AutorInterface[];
      } else {
        this.autores = [];
      }
    } catch (erro) {
      console.error(erro);
      this.alertService.error('Erro ao carregar listagem de autores');
    } finally {
      if (this.loading) {
        this.loading.dismiss();
        this.loading = null;
      }
    }
  }

  async confirmarExclusao(autor: AutorInterface) {
    const alerta = await this.alertController.create({
      header: 'Confirmação de exclusão',
      message: `Deseja excluir o autor ${autor.nome}?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => this.excluir(autor),
        },
        {
          text: 'Não',
        },
      ],
    });
    await alerta.present();
  }

  async excluir(autor: AutorInterface) {
    if (autor.id) {
      try {
        await this.autorService.excluir(autor.id).toPromise();
        this.autores = this.autores.filter(a => a.id !== autor.id);
      } catch (erro) {
        console.error(erro);
        this.alertService.error(`Não foi possível excluir o autor ${autor.nome}`);
      }
    }
  }

  async buscarAutores() { // BUSCA AVANÇADA
    // Verifique se o FormControl é válido
    if (this.termoBuscaControl.valid) {
      try {
        const autores = await this.autorService.buscarPorNome(this.termoBuscaControl.value).toPromise();
        if (autores) {
          this.autores = autores as AutorInterface[];
        } else {
          this.autores = [];
        }
      } catch (erro) {
        console.error(erro);
        this.alertService.error('Erro ao buscar autores por nome');
      }
    } else {
      this.listarAutores();
    }
  }
}