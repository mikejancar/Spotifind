import { Component, OnInit } from '@angular/core';

import { CommonDataService } from '../common/common-data.service';

@Component({
    selector: 'spf-login',
    templateUrl: 'app/login/login.component.html',
    styleUrls: ['app/login/login.component.css']
})
export class LoginComponent implements OnInit {
    
    private _redirectUri: string;
    
    constructor(
        private _commonData: CommonDataService
    ) { }

    ngOnInit() {
        this._redirectUri = 'http://localhost:8888/callback';    
    }

}