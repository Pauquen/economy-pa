import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { BusinessComponent } from './features/business/business.component';
import { RpabotsComponent } from './features/rpabots/rpabots.component';

/**
 * Routes Configuration - EconomyRPA
 * 
 * Sistema de rutas con lazy loading y guards
 * Layout principal con sidebar para authenticated users
 */
export const routes: Routes = [
  // Auth Routes - Sin layout
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login - EconomyRPA'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register - EconomyRPA'
  },

  // Main App Routes - Con layout
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'Dashboard - EconomyRPA'
      },
      {
        path: 'business',
        component: BusinessComponent,
        title: 'Business Units - EconomyRPA'
      },
      {
        path: 'business/:id',
        loadComponent: () => import('./features/business/business-detail/business-detail.component').then(m => m.BusinessDetailComponent),
        title: 'Business Unit Details - EconomyRPA'
      },
      {
        path: 'rpabots',
        component: RpabotsComponent,
        title: 'RPA Bots - EconomyRPA'
      },
      {
        path: 'rpabots/:id',
        loadComponent: () => import('./features/rpabots/rpabot-detail/rpabot-detail.component').then(m => m.RpabotDetailComponent),
        title: 'RPA Bot Details - EconomyRPA'
      },
      {
        path: 'rpabots/:id/logs',
        loadComponent: () => import('./features/rpabots/bot-logs/bot-logs.component').then(m => m.BotLogsComponent),
        title: 'RPA Bot Logs - EconomyRPA'
      },
      {
        path: 'businessprocess',
        loadComponent: () => import('./features/businessprocess/businessprocess.component').then(m => m.BusinessprocessComponent),
        title: 'Business Processes - EconomyRPA'
      },
      {
        path: 'businessprocess/:id',
        loadComponent: () => import('./features/businessprocess/process-detail/process-detail.component').then(m => m.ProcessDetailComponent),
        title: 'Process Details - EconomyRPA'
      },
      {
        path: 'config',
        loadComponent: () => import('./features/config/config.component').then(m => m.ConfigComponent),
        title: 'Configuration - EconomyRPA'
      },
      // Catch-all - 404 page
      {
        path: '**',
        loadComponent: () => import('./shared/not-found/not-found.component').then(m => m.NotFoundComponent),
        title: 'Page Not Found - EconomyRPA'
      }
    ]
  },

  // Fallback - Redirect to login
  {
    path: '**',
    redirectTo: 'login'
  }
];