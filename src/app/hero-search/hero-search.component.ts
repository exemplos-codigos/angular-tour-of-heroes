import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  
  heroes$!: Observable<Hero[]>;

  /**
   * A Subject é uma fonte de valores observáveis ​​e 
   * Observable ele próprio.
   */
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  /**
   * Push a search term into the observable stream.
   * 
   * @param term 
   */
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      /**
       * Aguarda até que o fluxo de novos eventos de string 
       * pause por 300 milissegundos antes de passar a 
       * última string. Você nunca fará solicitações com 
       * mais de 300 ms.
       */
      debounceTime(300),

      /**
       * garante que uma solicitação seja enviada apenas 
       * se o texto do filtro for alterado.
       */
      distinctUntilChanged(),

      /**
       * Chama o serviço de pesquisa para cada termo de 
       * pesquisa que passa por debounce() e distinctUntilChanged(). 
       * Ele cancela e descarta os observáveis ​​de pesquisa 
       * anteriores, retornando apenas o último serviço de 
       * pesquisa observável.
       */
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }
}