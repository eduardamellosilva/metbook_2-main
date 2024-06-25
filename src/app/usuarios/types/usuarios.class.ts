import { SexoEnum } from "./genero.enum";

export class Usuario {
    id?: string;
    nome: string;
    email: string;
    dataNascimento?: Date;
    genero?: SexoEnum;
    pais?: string;

    constructor(data: any) {
        this.id = data.id;
        this.nome = data.nome || '';
        this.email = data.email || '';
        this.dataNascimento = data.dataNascimento || undefined;
        this.genero = data.genero || SexoEnum.FEMININO;
        this.pais = data.pais || '';
    }
}
