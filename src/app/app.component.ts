import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {APP_ROUTES} from "./app-routing.module";
import {Router} from "@angular/router";
import {AuthenticationService} from "./services";


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [
    'app.component.scss'
  ],
  // standalone: true,
  // imports: [MatToolbarModule, MatButtonModule, MatIconModule],
})



export class AppComponent {
  public activeTab: string = 'test';
  constructor(private router: Router, protected authService: AuthenticationService) {}

  async change(activeTab: string) {
    this.activeTab =  activeTab;
    this.router.navigate([activeTab]);
  }

  protected readonly APP_ROUTES = APP_ROUTES;
}
