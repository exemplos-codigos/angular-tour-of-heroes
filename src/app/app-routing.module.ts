import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroesComponent } from './heroes/heroes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

const routes: Routes = [
  /* 
    path: uma string que corresponde ao 
    URL na barra de endereço do navegador.

    component: o componente que o roteador 
    deve criar ao navegar para esta rota.
  */
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroesComponent }
];

@NgModule({
  /* 
    O método é chamado forRoot()porque você 
    configura o roteador no nível raiz do 
    aplicativo. O forRoot()método fornece os 
    provedores de serviço e as diretivas 
    necessárias para o roteamento e executa a 
    navegação inicial com base na URL do 
    navegador atual.
  */
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }