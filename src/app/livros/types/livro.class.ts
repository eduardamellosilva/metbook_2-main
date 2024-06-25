import { AutorInterface } from "@autor";
import { LivroInterface } from "./livro.interface";
import { isNumber, isString } from '@functions';

export class Livro {
    id?: string;
    titulo: string;
    subtitulo?: string;
    numeroPaginas: number;
    isbn: string;
    autores: AutorInterface[];
    editora: string;
    anoLancamento: number;
    preco: number;

    constructor(data: LivroInterface) {
        this.id = isString(data.id); 
        this.titulo = isString(data.titulo) ? data.titulo : '';
        this.subtitulo = isString(data.subtitulo) ? data.subtitulo : undefined;
        this.numeroPaginas = isNumber(data.numeroPaginas) ? data.numeroPaginas : 0;
        this.isbn = isString(data.isbn) ? data.isbn : '';
        this.editora = isString(data.editora) ? data.editora : '';
        this.anoLancamento = isNumber(data.anoLancamento) ? data.anoLancamento : 0;
        this.preco = isNumber(data.preco) ? data.preco : 0;
        this.autores = Array.isArray(data.autores) ? data.autores : [];
    }
}
