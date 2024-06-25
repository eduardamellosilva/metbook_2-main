import { Component, OnDestroy, OnInit } from "@angular/core";
import { UsuariosService } from "../../services/usuarios.service";
import { Subscription } from "rxjs";
import { Usuario } from "../../types/usuarios.class";
import { AlertService } from "@services";
import { AlertController, ToastController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: 'app-usuarios-lista',
  templateUrl: './usuarios-lista.component.html',
  styleUrls: ['./usuarios-lista.component.scss']
})
export class UsuariosListaComponent implements OnInit, OnDestroy {

  public usuarios: Usuario[] = [];
  private subscription: Subscription = new Subscription();
  public termoBusca: string = ''; // Termo de busca para o nome dos usuários
  public loadingUsuarios: boolean = false; // Indicador de carregamento de usuários
  public errorUsuarios: boolean = false; // Indicador de erro ao carregar usuários

  constructor(
    private usuariosService: UsuariosService,
    private alertService: AlertService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  carregarUsuarios() {
    this.loadingUsuarios = true; // Inicia o indicador de carregamento

    this.subscription.add(
      this.usuariosService.getUsuarios().subscribe(
        (response: Usuario[]) => {
          console.log('Response: ', response);
          this.usuarios = response;
          this.loadingUsuarios = false; // Finaliza o indicador de carregamento
          this.errorUsuarios = false; // Resetar o status de erro
        },
        (error) => {
          console.error(error);
          this.loadingUsuarios = false; // Finaliza o indicador de carregamento
          this.errorUsuarios = true; // Define o status de erro
          this.alertService.error('Erro ao carregar listagem de usuários');
          this.exibirToastErro();
        }
      )
    );
  }

  excluir(usuario: Usuario) {
    if (usuario.id) {
      this.confirmarExclusao(usuario);
    } else {
      console.error('ID do usuário é indefinido.');
      this.alertService.error('Não foi possível excluir o usuário!');
    }
  }

  async confirmarExclusao(usuario: Usuario) {
    const alert = await this.alertController.create({
      header: 'Confirmação de exclusão',
      message: `Deseja excluir o usuário ${usuario.nome}?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.subscription.add(
              this.usuariosService.delete(usuario.id!).subscribe({
                next: () => {
                  // Atualizar a lista após a exclusão
                  this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
                },
                error: (error) => {
                  console.error(error);
                  this.alertService.error('Não foi possível excluir o usuário!');
                  this.exibirToastErro();
                }
              })
            );
          }
        },
        {
          text: 'Não'
        }
      ]
    });
    await alert.present();
  }

  navegarParaCadastro() {
    this.router.navigate(['/usuarios', 'cadastro']).then(() => {
      this.carregarUsuarios(); // Após a navegação, recarrega a lista de usuários
    });
  }

  // Método para buscar usuários por nome
  buscarUsuariosPorNome() {
    if (this.termoBusca.trim() !== '') {
      this.loadingUsuarios = true; // Inicia o indicador de carregamento

      this.subscription.add(
        this.usuariosService.buscarPorNome(this.termoBusca).subscribe(
          (response: Usuario[]) => {
            this.usuarios = response;
            this.loadingUsuarios = false; // Finaliza o indicador de carregamento
            this.errorUsuarios = false; // Resetar o status de erro
          },
          (error) => {
            console.error(error);
            this.loadingUsuarios = false; // Finaliza o indicador de carregamento
            this.errorUsuarios = true; // Define o status de erro
            this.alertService.error('Erro ao buscar usuários por nome');
            this.exibirToastErro();
          }
        )
      );
    } else {
      this.carregarUsuarios();
    }
  }

  // Método para exibir um toast de erro
    async exibirToastErro() {
      const toast = await this.toastController.create({
      message: 'Ocorreu um erro. Por favor, tente novamente.',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
