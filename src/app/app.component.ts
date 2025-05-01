import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AuthService } from './services/auth.service';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    SidebarComponent,
    ToolbarComponent,
  ],
})
export class AppComponent {
  title = 'leave-app';
  isLogout = false;

  constructor(
    private authService: AuthService,
    private router: Router, 
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        map(() => this.activatedRoute.firstChild?.snapshot.data['isLogout'] || false)
      )
      .subscribe(logout => {
        this.isLogout = logout;
      });
  }

  ngOnInit() {
    this.authService.checkLocalStorage();
  }
}
