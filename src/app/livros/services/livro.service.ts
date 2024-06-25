import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Livro } from '../types/livro.class';
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { LivroInterface } from "../types/livro.interface";

@Injectable({
    providedIn: 'root'
})
export class LivroService {

    private API_URL = 'http://localhost:3000/livros';

    constructor(private httpClient: HttpClient) { }

    save(livro: LivroInterface): Observable<LivroInterface> {
        return this.httpClient.post<LivroInterface>(this.API_URL, livro)
            .pipe(
                catchError(this.handleError)
            );
    }

    getLivro(id: string): Observable<LivroInterface> {
    return this.httpClient.get<LivroInterface>(`${this.API_URL}/${id}`);
    }

    getLivros(): Observable<Livro[]> {
        return this.httpClient.get<LivroInterface[]>(this.API_URL).pipe(
            map(data => data.map(item => new Livro(item))),
            catchError(this.handleError)
        );
    }

    update(id: string, livro: LivroInterface): Observable<any> {
        return this.httpClient.put(`${this.API_URL}/${id}`, livro)
            .pipe(
                catchError(this.handleError)
            );
    }

    remove(livro: Livro): Observable<any> {
        return this.httpClient.delete(`${this.API_URL}/${livro.id}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(error: any) {
        if (error.error instanceof ErrorEvent) {
            // Erro ocorreu no lado do cliente
            console.error('Erro ocorreu:', error.error.message);
        } else {
            // O backend retornou um código de erro
            console.error(
                `Código de retorno ${error.status}, ` +
                `Erro: ${error.error.message}`);
        }

        // Retorna um observable com uma mensagem de erro amigável
        return throwError(
            'Ocorreu um erro ao processar a sua requisição. Por favor, tente novamente mais tarde.');
    }

    // BUSCA DE USUARIOS AVANÇADA
    buscarPorTitulo(titulo: string): Observable<Livro[]> {
        return this.httpClient.get<Livro[]>(`${this.API_URL}/search?q=${titulo}`);
      }
}
