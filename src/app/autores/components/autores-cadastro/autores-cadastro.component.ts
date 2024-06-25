import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '@services';
import { AutorService } from '../../services/autor.service';
import { AutorInterface } from '../../types/autor.interface';
import { GeneroEnum } from '../../types/genero.enum';
import { NacionalidadeEnum } from '../../types/nacionalidade.enum';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-autores-cadastro',
  templateUrl: './autores-cadastro.component.html',
  styleUrls: ['./autores-cadastro.component.scss']
})
export class AutoresCadastroComponent implements OnInit {

  private URL_PATTERN: RegExp = /^(https?):\/\/(.*)/;

  autoresForm: FormGroup;
  isEditMode: boolean = false;
  autorId: string | null = null;
  generoEnum = GeneroEnum;
  nacionalidadeEnum = NacionalidadeEnum;

  constructor(
    private formBuilder: FormBuilder,
    private autoresService: AutorService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {
    this.autoresForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      dataNascimento: ['', [Validators.required], [this.maiorIdadeValidator()]],
      genero: [GeneroEnum.FEMININO, Validators.required],
      nacionalidade: [NacionalidadeEnum.OUTRO, Validators.required],
      linkInstagram: new FormControl('https://', [Validators.pattern(this.URL_PATTERN), Validators.required]),
      biografia: ['', [Validators.required, Validators.maxLength(500)]]
    });

    const savedAutor = localStorage.getItem('novoAutor');
    if (savedAutor) {
      const autor = JSON.parse(savedAutor);
      this.autoresForm.patchValue(autor);
      localStorage.removeItem('novoAutor');
      console.log('Dados recuperados do localStorage:', autor);
    }
  }

  ngOnInit(): void {
    this.autorId = this.route.snapshot.paramMap.get('id');
    if (this.autorId) {
      this.isEditMode = true;
      this.carregarAutor(this.autorId);
    }
  }

  carregarAutor(id: string) {
    this.autoresService.getAutor(id).subscribe(
      (data: AutorInterface) => {
        this.autoresForm.patchValue(data);
      },
      (error: any) => {
        console.error('Erro ao carregar autor', error);
      }
    );
  }

  salvar() {
    if (this.autoresForm.valid) {
      const autor: AutorInterface = this.autoresForm.value;

      if (!this.validarNacionalidade(autor.nacionalidade)) {
        this.alertService.error('Selecione uma nacionalidade válida.');
        return;
      }

      if (this.isEditMode) {
        autor.id = this.autorId;
        this.autoresService.atualizar(autor).subscribe(
          (response: AutorInterface) => {
            console.log('Autor atualizado com sucesso!', response);
            this.alertService.success('Autor atualizado com sucesso!');
            this.navCtrl.back();
          },
          (error: any) => {
            this.alertService.error('Erro ao atualizar autor. Tente novamente mais tarde.');
          }
        );
      } else {
        this.autoresService.adicionar(autor).subscribe(
          (response: AutorInterface) => {
            console.log('Autor cadastrado com sucesso!', response);
            this.alertService.success('Autor cadastrado com sucesso!');
            this.navCtrl.back();
          },
          (error: any) => {
            console.error('Erro ao cadastrar autor:', error);
            this.alertService.error('Erro ao cadastrar autor. Tente novamente mais tarde.');
          }
        );
      }
    } else {
      this.alertService.error('Por favor, preencha todos os campos corretamente.');
      Object.values(this.autoresForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  validarNacionalidade(nacionalidade: string): boolean {
    const nacionalidadesPermitidas = [
      'Brasileiro',
      'Americano',
      'Canadense',
      'Australiano',
      'Coreano',
      'Italiano',
      'Outro'
    ];
    return nacionalidadesPermitidas.includes(nacionalidade);
  }

  // Validador assíncrono para verificar se o autor é maior de idade
  maiorIdadeValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      const dataNascimento = control.value;
      return new Promise(resolve => {
        if (!dataNascimento) {
          resolve(null);
        } else {
          const idadeMinima = 18;
          const hoje = moment();
          const nascimento = moment(dataNascimento, 'YYYY-MM-DD');
          const idade = hoje.diff(nascimento, 'years');
          if (idade >= idadeMinima) {
            resolve(null);
          } else {
            resolve({ menorIdade: true });
          }
        }
      });
    };
  }
}