import { Component, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { AutorInterface, AutorService } from "@autor";
import { AlertService } from "@services";
import { Subscription, of } from "rxjs";
import { LivroService } from "../../services/livro.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LivroInterface } from "../../types/livro.interface";
import { map, catchError } from 'rxjs/operators';

@Component({
    selector: 'app-livro-cadastro',
    templateUrl: './livro-cadastro.component.html'
})
export class LivroCadastroComponent implements OnInit, OnDestroy {
    
    private anoLancamentoAtualValidator: ValidatorFn = (control: AbstractControl<any>): ValidationErrors | null => {
        const anoLancamentoAtual = new Date().getFullYear();
        if (control.value && control.value > anoLancamentoAtual) {
            return { anoLancamentoInvalido: true };
        }
        return null;
    };

    private autoresValidator: ValidatorFn = (control: AbstractControl<any>): ValidationErrors | null => {
        if (control.value?.length < 1) {
            return { autoresInvalido: true };
        }
        return null;
    };

    // Lista simulada de ISBNs já existentes
    private existingIsbns: string[] = ['1234567890', '0987654321'];

    private isbnUnicoValidator: ValidatorFn = (control: AbstractControl<any>): ValidationErrors | null => {
        if (control.value && this.existingIsbns.includes(control.value)) {
            return { isbnDuplicado: true };
        }
        return null;
    };

    id: string | null = null;
    autores: AutorInterface[] = [];
    livroForm = new FormGroup({
        titulo: new FormControl('', [
            Validators.required,
            Validators.minLength(3)
        ]),
        subtitulo: new FormControl(''),
        numeroPaginas: new FormControl(0, Validators.min(5)),
        isbn: new FormControl('', [
            Validators.minLength(10),
            Validators.maxLength(10),
            this.isbnUnicoValidator
        ]),
        editora: new FormControl('', Validators.required),
        anoLancamento: new FormControl(2000, [
            Validators.required,
            this.anoLancamentoAtualValidator
        ]),
        preco: new FormControl(0, Validators.min(0)),
        autores: new FormControl<AutorInterface[]>([], this.autoresValidator)
    });

    private subscriptions = new Subscription();
    loading = false; // Variável para controlar o estado de carregamento

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private autorService: AutorService,
        private alertService: AlertService,
        private livroService: LivroService,
    ) {}
    
    ngOnInit(): void {
        this.carregaAutores();
      
        const id = this.activatedRoute.snapshot.params['id'];
        if (id) {
            this.id = id;
             
            this.loading = true; // Ativar o loader durante o carregamento do livro
            this.subscriptions.add(
                this.livroService.getLivro(id).subscribe(
                    (livro) => {
                        this.loading = false; // Desativar o loader ao concluir o carregamento
                        if (livro) {
                            this.populateForm(livro as LivroInterface);
                        } else {
                            this.alertService.error('Livro não encontrado para edição!');
                        }
                    },
                    (error) => {
                        this.loading = false; // Desativar o loader em caso de erro
                        this.alertService.error('Não foi possível carregar os dados do livro!');
                        console.error(error);
                    }
                )
            );
        
        }
    
        const savedLivro = localStorage.getItem('novoLivro');
        if (savedLivro) {
            const livro = JSON.parse(savedLivro);
            this.livroForm.patchValue(livro);
            localStorage.removeItem('novoLivro');
            console.log('Dados recuperados do localStorage:', livro);
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    carregaAutores() {
        const subscription = this.autorService.getAutores().subscribe(
            (autores) => {
                this.autores = autores;
            },
            (error) => {
                console.error(error);
                this.alertService.error('Não foi possível carregar os autores. Tente novamente mais tarde');
            }
        );
        this.subscriptions.add(subscription);
    }

    compareWith(o1: AutorInterface, o2: AutorInterface) {
        return o1 && o2 ? o1.id === o2.id : o1 === o2;
    }

    onSubmit() {
        if (this.livroForm.invalid || this.loading) {
            this.alertService.error('Formulário inválido ou operação em andamento. Verifique os campos e tente novamente.');
            return;
        }
    
        this.loading = true; // Ativar o loader durante o envio do formulário
    
        const livro: LivroInterface = {
            titulo: this.livroForm.value.titulo || '',
            subtitulo: this.livroForm.value.subtitulo || '',
            numeroPaginas: this.livroForm.value.numeroPaginas || 0,
            isbn: this.livroForm.value.isbn || '',
            editora: this.livroForm.value.editora || '',
            anoLancamento: this.livroForm.value.anoLancamento || 0,
            preco: this.livroForm.value.preco || 0,
            autores: this.livroForm.value.autores || []
        };
    
        console.log('Dados do livro a serem enviados:', livro);
    
        localStorage.setItem('novoLivro', JSON.stringify(livro));
    
        let observable;
        if (this.id) {
            observable = this.livroService.update(this.id, livro);
        } else {
            observable = this.livroService.save(livro);
        }
    
        this.subscriptions.add(
            observable.subscribe({
                next: () => {
                    this.router.navigate(['/livros']);
                    this.alertService.success('Livro salvo com sucesso.');
                    localStorage.removeItem('novoLivro');
                    this.loading = false; // Desativar o loader após o sucesso
                },
                error: (error) => {
                    console.error('Erro ao enviar dados:', error);
                    this.alertService.error('Não foi possível salvar o livro.');
                    this.loading = false; // Desativar o loader em caso de erro
                }
            })
        );
    }

    private populateForm(livro: LivroInterface) {
        this.livroForm.patchValue(livro);
    }
}