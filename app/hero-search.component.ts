import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './hero';

@Component({
    selector: 'hero-search',
    templateUrl: 'app/hero-search.component.html',
    providers: [HeroSearchService]
})
export class HeroSearchComponent implements OnInit {
    heroes: Observable<Hero[]>;
    searchSubject = new Subject<string>();

    constructor(
        private _heroSearchService: HeroSearchService,
        private _router: Router) { }

    // Push search term into the observable stream
    search(term: string) { this.searchSubject.next(term); }

    ngOnInit() {
        this.heroes = this.searchSubject
                .asObservable()
                .debounceTime(300)
                .distinctUntilChanged()
                .switchMap(term => term
                    // return the http search observable
                    ? this._heroSearchService.search(term)
                    // or the observable of empty heroes if no search term
                    : Observable.of<Hero[]>([]))
                .catch(error => {
                    // TODO: real error handling
                    console.log(error);
                    return Observable.of<Hero[]>([]);
                })
    }

    gotoDetail(hero: Hero) {
        let link = ['/detail/', hero.id];
        this._router.navigate(link);
    }

}