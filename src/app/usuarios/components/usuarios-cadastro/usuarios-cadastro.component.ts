import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { AlertService } from '@services';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../types/usuarios.class';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios-cadastro',
  templateUrl: './usuarios-cadastro.component.html',
  styleUrls: ['./usuarios-cadastro.component.scss']
})
export class UsuariosCadastroComponent implements OnInit {
  usuariosForm: FormGroup;
  isEditMode: boolean = false;
  usuarioId: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.usuariosForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.emailExisteValidator.bind(this)], // Validator assíncrono diretamente aqui
        updateOn: 'blur' // Validar após desfocar do campo
      }],
      dataNascimento: [''],
      genero: ['F'], // Valor padrão para gênero feminino
      pais: ['', Validators.required]
    });

    // Verificar se há dados salvos no localStorage ao inicializar o componente
    const savedUsuario = localStorage.getItem('novoUsuario');
    if (savedUsuario) {
      const usuario = JSON.parse(savedUsuario);
      this.usuariosForm.patchValue(usuario);
      localStorage.removeItem('novoUsuario'); // Remover os dados salvos após usar
      console.log('Dados recuperados do localStorage:', usuario);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.usuarioId = id;
        this.carregarUsuario(this.usuarioId);
      }
    });
  }

  carregarUsuario(id: string) {
    this.usuariosService.getUsuario(id).subscribe(
      (data: Usuario) => {
        this.usuariosForm.patchValue(data);
      },
      (error: any) => {
        console.error(`Erro ao carregar usuário com id ${id}:`, error);
        if (error.status === 404) {
          this.alertService.error('Usuário não encontrado. Verifique o id e tente novamente.');
        } else {
          this.alertService.error('Erro ao carregar usuário. Tente novamente mais tarde.');
        }
      }
    );
  }

  salvar() {
    if (this.usuariosForm.valid) {
      const usuario = this.usuariosForm.value;

      if (this.isEditMode && this.usuarioId) {
        usuario.id = this.usuarioId;

        this.usuariosService.update(this.usuarioId, usuario).subscribe(
          (response: Usuario) => {
            console.log('Usuário atualizado com sucesso!', response);
            this.alertService.success('Usuário atualizado com sucesso!');
            this.router.navigate(['/usuarios']); // Navega de volta à página de lista de usuários
          },
          (error: any) => {
            if (error.status === 404) {
              console.error('Usuário não encontrado para atualização:', error);
              this.alertService.error('Usuário não encontrado para atualização. Verifique os dados e tente novamente.');
            } else {
              console.error('Erro ao atualizar usuário:', error);
              this.alertService.error('Erro ao atualizar usuário. Tente novamente mais tarde.');
            }
          }
        );
      } else {
        this.usuariosService.save(usuario).subscribe(
          (response: Usuario) => {
            console.log('Usuário cadastrado com sucesso!', response);
            this.alertService.success('Usuário cadastrado com sucesso!');
            this.router.navigate(['/usuarios']); // Navega de volta à página de lista de usuários
          },
          (error: any) => {
            console.error('Erro ao cadastrar usuário:', error);
            this.alertService.error('Erro ao cadastrar usuário. Tente novamente mais tarde.');
          }
        );
      }
    } else {
      Object.values(this.usuariosForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  // Validador assíncrono para verificar se o e-mail já existe
  emailExisteValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = control.value;
    return this.usuariosService.verificarEmailExiste(email).pipe(
      map(existe => (existe ? { emailExiste: true } : null)),
      catchError(() => of(null))
    );
  }
}
