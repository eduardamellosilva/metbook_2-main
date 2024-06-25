import { GeneroEnum } from './genero.enum';
import { NacionalidadeEnum } from './nacionalidade.enum';

export interface AutorInterface {
  id?: string | null;
  nome: string;
  dataNascimento: Date;
  genero: GeneroEnum;
  nacionalidade: NacionalidadeEnum;
  linkInstagram?: string;
  biografia: string;
}