import { NgModule } from "@angular/core";
import { UsuariosRoutingModule } from "./usuarios-routing.module";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { UsuariosListaComponent } from "./components/usuarios-lista/usuarios-lista.component";
import { UsuariosCadastroComponent } from "./components/usuarios-cadastro/usuarios-cadastro.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        UsuariosRoutingModule
    ],
    declarations: [
        UsuariosListaComponent,
        UsuariosCadastroComponent
    ]
})
export class UsuariosModule { }
