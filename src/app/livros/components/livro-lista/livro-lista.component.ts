import { Component, OnDestroy, OnInit } from '@angular/core';
import { LivroService } from '../../services/livro.service';
import { Subscription } from 'rxjs';
import { Livro } from '../../types/livro.class';
import { AlertService } from '@services';
import { AlertController } from '@ionic/angular';

@Component({
    templateUrl: './livro-lista.component.html',
    styleUrls: ['./livro-lista.component.scss']
})
export class LivroListaComponent implements OnInit, OnDestroy {

    public livros: Livro[] = [];
    private subscription: Subscription = new Subscription();
    public termoBusca: string = ''; // Termo de busca para o título dos livros
    public loadingLivros: boolean = false; // Indicador de carregamento de livros
    public errorLivros: boolean = false; // Indicador de erro ao carregar livros

    constructor(
        private livroService: LivroService,
        private alertService: AlertService,
        private alertController: AlertController,
    ) { }

    ngOnInit(): void {
        this.carregarLivros();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ionViewDidEnter() {
        this.carregarLivros(); // Carregar a lista de livros ao entrar na página
    }

    carregarLivros() {
        this.loadingLivros = true; // Inicia o indicador de carregamento

        this.subscription.add(
            this.livroService.getLivros().subscribe(
                (response: Livro[]) => {
                    console.log('Response: ', response);
                    this.livros = response;
                    this.loadingLivros = false; // Finaliza o indicador de carregamento
                    this.errorLivros = false; // Resetar o status de erro
                },
                (error) => {
                    console.error(error);
                    this.loadingLivros = false; // Finaliza o indicador de carregamento
                    this.errorLivros = true; // Define o status de erro
                    this.alertService.error('Erro ao carregar listagem de livros');
                }
            )
        );
    }

    async excluir(livro: Livro) {
        console.log('Excluindo livro:', livro);
        const alert = await this.alertController.create({
            header: 'Confirmação de exclusão',
            message: `Deseja excluir o livro ${livro.titulo}?`,
            buttons: [
                {
                    text: 'Sim',
                    handler: () => {
                        this.subscription.add(
                            this.livroService.remove(livro).subscribe({
                                next: () => {
                                    this.livros = this.livros.filter(l => l.id !== livro.id);
                                    this.alertService.success('Livro excluído com sucesso!');
                                },
                                error: (error) => {
                                    console.error(error);
                                    this.alertService.error('Não foi possível excluir o livro!');
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

    buscarLivrosPorTitulo() { // BUSCA AVANÇADA
        if (this.termoBusca.trim() !== '') {
            this.loadingLivros = true; // Inicia o indicador de carregamento

            this.subscription.add(
                this.livroService.buscarPorTitulo(this.termoBusca).subscribe(
                    (response: Livro[]) => {
                        this.livros = response;
                        this.loadingLivros = false; // Finaliza o indicador de carregamento
                        this.errorLivros = false; // Resetar o status de erro
                    },
                    (error) => {
                        console.error(error);
                        this.loadingLivros = false; // Finaliza o indicador de carregamento
                        this.errorLivros = true; // Define o status de erro
                        this.alertService.error('Erro ao buscar livros por título');
                    }
                )
            );
        } else {
            // Caso o campo de busca esteja vazio, recarrega a listagem completa
            this.carregarLivros();
        }
    }
}
