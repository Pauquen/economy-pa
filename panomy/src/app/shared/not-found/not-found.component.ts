import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1>404</h1>
        <p>Page not found</p>
        <button (click)="goHome()">Go Home</button>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: var(--bg-app);
      color: var(--text-primary);
    }
    .not-found-content {
      text-align: center;
    }
    h1 { font-size: 4rem; margin: 0; }
    p { font-size: 1.2rem; margin: 1rem 0; }
    button {
      padding: 1rem 2rem;
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
  `]
})
export class NotFoundComponent {
  constructor(private router: Router) {}
  
  goHome(): void {
    this.router.navigate(['/home']);
  }
}