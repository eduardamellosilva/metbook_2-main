import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AutorInterface } from '../types/autor.interface';

@Injectable({
  providedIn: 'root'
})
export class AutorService {

  private url = 'http://localhost:3000/autores';

  constructor(
    private httpClient: HttpClient
  ) {}
  
  getAutores(): Observable<AutorInterface[]> {
    return this.httpClient.get<AutorInterface[]>(this.url);
  }

  excluir(id: string): Observable<Object> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }

  getAutor(id: string): Observable<AutorInterface> {
    return this.httpClient.get<AutorInterface>(`${this.url}/${id}`);
  }

  public adicionar(autor: AutorInterface): Observable<AutorInterface> {
    return this.httpClient.post<AutorInterface>(this.url, autor);
  }

  public atualizar(autor: AutorInterface): Observable<AutorInterface> {
    return this.httpClient.put<AutorInterface>(`${this.url}/${autor.id}`, autor);
  }

  salvar(autor: AutorInterface): Observable<AutorInterface> {
    if (autor.id) {
      return this.atualizar(autor);
    } else {
      return this.adicionar(autor);
    }
  }
  
  // Método para buscar autores por nome
  buscarPorNome(nome: string): Observable<AutorInterface[]> {
    const params = new HttpParams().set('q', nome);
    return this.httpClient.get<AutorInterface[]>(`${this.url}/search`, { params });
  }
}
