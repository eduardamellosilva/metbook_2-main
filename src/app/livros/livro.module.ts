import { NgModule } from "@angular/core";
import { LivroRoutingModule } from "./livro-routing.module";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { LivroListaComponent } from "./components/livro-lista/livro-lista.component";
import { LivroCadastroComponent } from "./components/livro-cadastro/livro-cadastro.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        LivroRoutingModule
    ],
    declarations: [
        LivroListaComponent,
        LivroCadastroComponent
    ]
})
export class LivroModule { }