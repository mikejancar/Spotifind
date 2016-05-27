import { Component } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router';
import 'rxjs/Rx';

import { CommonDataService } from './common/common-data.service';
import { LoginComponent } from './login/login.component';

@Component({
    selector: 'spf-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    directives: [
        ROUTER_DIRECTIVES,
        LoginComponent
    ],
    providers: [
      HTTP_PROVIDERS,
      ROUTER_PROVIDERS,
      CommonDataService
    ]
})
@Routes([
    
])
export class AppComponent {}