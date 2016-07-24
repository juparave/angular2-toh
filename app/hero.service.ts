import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Hero } from './hero';


@Injectable()
export class HeroService {
    private heroesUrl = 'app/heroes';

    constructor(private _http: Http) { }

    getHero(id: number) {
        return this.getHeroes()
            .then(heroes => heroes.find(hero => hero.id === id));
    }

    getHeroes() {
        // return Promise.resolve(HEROES);
        return this._http.get(this.heroesUrl)
            .toPromise()
            .then(response => response.json().data as Hero[])
            .catch(this.handleError);
    }

    // new hero
    private post(hero: Hero): Promise<Hero> {
        let headers = new Headers({
            'Content-Type': 'application/json'});
        
        return this._http
                    .post(this.heroesUrl, JSON.stringify(hero), {headers: headers})
                    .toPromise()
                    .then(res => res.json().data)
                    .catch(this.handleError);
    }

    // update hero
    private put(hero: Hero) {
        let headers = new Headers({
            'Content-Type': 'application/json'});
        
        let url = `${this.heroesUrl}/${hero.id}`;

        return this._http
                    .put(url, JSON.stringify(hero), {headers: headers})
                    .toPromise()
                    .then(() => hero)
                    .catch(this.handleError);
    }

    // delete hero
    delete(hero: Hero) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.heroesUrl}/${hero.id}`;

        return this._http
                    .delete(url, {headers: headers})
                    .toPromise()
                    .catch(this.handleError);
    }

    // save
    save(hero:Hero): Promise<Hero> {
        if (hero.id) {
            return this.put(hero);
        }
        return this.post(hero);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}