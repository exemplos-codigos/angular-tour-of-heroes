import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

/* 
  E uma função decoradora que especifica os metadados 
  angulares para o componente.
*/
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})

export class HeroesComponent implements OnInit {
  /* heroes propriedade por uma declaração. */
  heroes: Hero[] = [];

  /* 
    heroService parâmetro privado do tipo 
    HeroService ao construtor.
    
    O parâmetro simultaneamente define uma 
    heroServicepropriedade privada e a 
    identifica como um HeroServicelocal de 
    injeção.
  */
  constructor(private heroService: HeroService) { }

  /* 
    getHeroes() chamado dentro do gancho do ciclo 
    de vida ngOnInit e deixe o Angular chamar 
    ngOnInit() no momento apropriado após 
    construir uma HeroesComponent instância.
  */
  ngOnInit() {
    this.getHeroes();
  }

  /* 
    Metodo para recuperar os heróis do serviço.

    O subscribe() método passa a matriz emitida 
    para o retorno de chamada, que define a 
    heroes propriedade do componente.
  */
  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }
}
