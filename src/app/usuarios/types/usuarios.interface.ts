import { SexoEnum } from "./genero.enum";
import { PaisEnum
  
 } from "./pais.enum";
export interface UsuariosInterface {
    id?: string;
    nome: string;
    email: string;
    dataNascimento?: Date;
    genero?: SexoEnum;
    pais?: PaisEnum;
}
