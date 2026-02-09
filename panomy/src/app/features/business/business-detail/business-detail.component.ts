import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-business-detail',
  standalone: true,
  template: `
    <div class="detail-container">
      <h1>Business Unit Details</h1>
      <p>ID: {{ id }}</p>
      <button (click)="goBack()">Back</button>
    </div>
  `,
  styles: [`
    .detail-container { padding: 2rem; }
  `]
})
export class BusinessDetailComponent {
  id: string = '';
  
  constructor(private route: ActivatedRoute, private router: Router) {
    this.id = this.route.snapshot.paramMap.get('id') || '';
  }
  
  goBack(): void {
    this.router.navigate(['/business']);
  }
}