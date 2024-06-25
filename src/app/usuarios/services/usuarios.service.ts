import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Usuario } from '../types/usuarios.class';
import { UsuariosInterface } from "../types/usuarios.interface";

@Injectable({
    providedIn: 'root'
})
export class UsuariosService {

    private API_URL = 'http://localhost:3000/usuarios/';

    constructor(private httpClient: HttpClient) { }

    save(usuario: Usuario): Observable<Usuario> {
        return this.httpClient.post<Usuario>(this.API_URL, usuario);
    }

    getUsuario(id: string): Observable<Usuario> {
        return this.httpClient.get<Usuario>(`${this.API_URL}${id}`);
    }

    getUsuarios(): Observable<Usuario[]> {
        return this.httpClient.get<Usuario[]>(this.API_URL);
    }

    update(id: string, usuario: Usuario): Observable<Usuario> {
        return this.httpClient.put<Usuario>(`${this.API_URL}${id}`, usuario);
    }

    delete(id: string): Observable<any> {
        return this.httpClient.delete(`${this.API_URL}${id}`);
    }

    // BUSCA DE USUARIOS AVANÇADA
    buscarPorNome(nome: string): Observable<Usuario[]> {
    const params = { q: nome };
    return this.httpClient.get<Usuario[]>(`${this.API_URL}search`, { params });
  }
    
    // Método para verificar se o e-mail já está cadastrado
    verificarEmailExiste(email: string): Observable<boolean> {
    const params = { email };
    return this.httpClient.get<boolean>(`${this.API_URL}exists`, { params });
  }
    
}
