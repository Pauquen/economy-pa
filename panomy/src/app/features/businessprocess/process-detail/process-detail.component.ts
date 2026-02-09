import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-process-detail',
  standalone: true,
  template: `
    <div class="process-detail-container">
      <h1>Process Details</h1>
      <button (click)="goBack()">Back</button>
    </div>
  `,
  styles: [`
    .process-detail-container { padding: 2rem; }
  `]
})
export class ProcessDetailComponent {
  constructor(private router: Router) {}
  
  goBack(): void {
    this.router.navigate(['/businessprocess']);
  }
}