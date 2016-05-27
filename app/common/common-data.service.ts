import { Injectable, OnInit } from '@angular/core';

@Injectable()
export class CommonDataService implements OnInit {
    
    public spotifindApiUrl: string;

    constructor() { }
    
    ngOnInit() {
        this.spotifindApiUrl = 'http://localhost:8888/callback';
    }

}