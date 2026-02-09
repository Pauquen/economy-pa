import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bot-logs',
  standalone: true,
  template: `
    <div class="logs-container">
      <h1>Bot Logs</h1>
      <button (click)="goBack()">Back</button>
    </div>
  `,
  styles: [`
    .logs-container { padding: 2rem; }
  `]
})
export class BotLogsComponent {
  constructor(private router: Router) {}
  
  goBack(): void {
    this.router.navigate(['/rpabots']);
  }
}