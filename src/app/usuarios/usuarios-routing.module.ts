import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosCadastroComponent } from './components/usuarios-cadastro/usuarios-cadastro.component';
import { UsuariosListaComponent } from './components/usuarios-lista/usuarios-lista.component';

const routes: Routes = [
  {
    path: '',
    component: UsuariosListaComponent
  },
  {
    path: 'cadastro',
    component: UsuariosCadastroComponent
  },
  {
    path: 'edicao/:id',
    component: UsuariosCadastroComponent
  },
  // Caso contrário, redirecione para a lista de usuários se a rota não for encontrada
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
