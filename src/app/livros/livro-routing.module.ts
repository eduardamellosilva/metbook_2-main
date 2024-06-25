import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LivroListaComponent } from "./components/livro-lista/livro-lista.component";
import { LivroCadastroComponent } from "./components/livro-cadastro/livro-cadastro.component";

const routes: Routes = [
    {
        path: '',
        component: LivroListaComponent
    },
    {
        path: 'novo',
        component: LivroCadastroComponent
    },
    {
        path: 'edicao/:id',
        component: LivroCadastroComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LivroRoutingModule { }



/*
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LivroListaComponent } from "./components/livro-lista/livro-lista.component";
import { LivroCadastroComponent } from "./components/livro-cadastro/livro-cadastro.component";

const routes: Routes = [
    {
        path: '',
        component: LivroListaComponent
    },
    {
        path: 'novo',
        component: LivroCadastroComponent
    },
    {
        path: 'edicao/:id',
        component: LivroCadastroComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LivroRoutingModule { }
*/