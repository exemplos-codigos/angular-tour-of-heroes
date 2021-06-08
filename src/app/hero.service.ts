import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

/* 
  O Injectable símbolo Angular e anota a classe 
  com o decorador. Isso marca a classe como 
  aquela que participa do sistema de injeção 
  de dependência.

  Registra um provedor com o injetor raiz para 
  o seu serviço, incluindo metadados do provedor.
*/
@Injectable({
  providedIn: 'root'
})
export class HeroService {

  /**
   * Obtenção de dados do servidor com a of() função RxJS.
   * 
   * of(HEROES) retorna um Observable<Hero[]> que 
   * emite um único valor, a matriz de heróis fictícios.
   * 
   * GET heroes from the server
   * @returns 
   */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  /**
   * GET hero by id. Return `undefined` when id not found.
   * 
   * @param id 
   * @returns 
   */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /**
   * GET hero by id. Will 404 if id not found.
   * 
   * getHero() constrói um URL de solicitação 
   * com o id do herói desejado.
   * 
   * getHero() retorna um Observable<Hero>("um observável 
   * de objetos Hero") em vez de um observável de 
   * matrizes de herói.
   * 
   * @param id 
   * @returns 
   */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /* 
    O Angular injetará o singleton MessageService 
    nessa propriedade ao criar o HeroService.
  */
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /**
   * Log a HeroService message with the MessageService
   * 
   * @param message 
   */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private heroesUrl = 'api/heroes';  // URL to web api

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /**
   * PUT: update the hero on the server.
   * 
   * @param hero 
   * @returns 
   */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /**
   * POST: add a new hero to the server.
   * 
   * Ele chama em HttpClient.post() vez de put().
   * 
   * Ele espera que o servidor gere um id para o novo herói, 
   * que retorna Observable<Hero> ao chamador.
   * 
   * @param hero 
   * @returns 
   */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /**
   * DELETE: delete the hero from the server.
   * 
   * @param id 
   * @returns 
   */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /**
   * GET heroes whose name contains search term.
   * 
   * @param term 
   * @returns 
   */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
}
