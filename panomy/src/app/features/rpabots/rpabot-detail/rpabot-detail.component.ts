import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rpabot-detail',
  standalone: true,
  template: `
    <div class="detail-container">
      <h1>RPA Bot Details</h1>
      <button (click)="goBack()">Back</button>
    </div>
  `,
  styles: [`
    .detail-container { padding: 2rem; }
  `]
})
export class RpabotDetailComponent {
  constructor(private router: Router) {}
  
  goBack(): void {
    this.router.navigate(['/rpabots']);
  }
}