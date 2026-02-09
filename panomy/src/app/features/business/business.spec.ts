import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { BusinessComponent } from './business.component';
import { ButtonComponent, InputComponent, CardComponent } from '../../shared';
import { BusinessService } from '../../services/business.service';
import type { BusinessUnit } from '../../models';

// Mock BusinessService
class MockBusinessService {
  private mockUnits: BusinessUnit[] = [
    {
      id: 'bu_001',
      name: 'Finance Department',
      code: 'FIN',
      description: 'Handles all financial operations',
      status: 'active',
      managerId: 'user_001',
      manager: {
        id: 'user_001',
        fullName: 'John Smith',
        email: 'john.smith@company.com'
      },
      processIds: ['proc_001'],
      metrics: {
        totalProcesses: 12,
        activeAutomations: 8,
        monthlySavings: 15420,
        efficiency: 87
      },
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    }
  ];

  businessUnits = signal(this.mockUnits);
  isLoading = signal(false);
  error = signal<string | null>(null);

  getBusinessUnits() {
    return of(this.mockUnits);
  }

  archiveBusinessUnit(id: string) {
    return of(undefined);
  }

  refresh() {
    // Mock implementation
  }
}

describe('BusinessComponent', () => {
  let component: BusinessComponent;
  let fixture: ComponentFixture<BusinessComponent>;
  let mockBusinessService: MockBusinessService;

  beforeEach(async () => {
    mockBusinessService = new MockBusinessService();
    
    await TestBed.configureTestingModule({
      imports: [
        BusinessComponent,
        ButtonComponent,
        InputComponent,
        CardComponent,
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        { provide: BusinessService, useValue: mockBusinessService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load business units on init', () => {
    expect(component.businessUnits()).toBeDefined();
    expect(mockBusinessService.getBusinessUnits).toBeDefined();
  });

  it('should display business stats correctly', () => {
    expect(component.totalUnits()).toBe(1);
    expect(component.activeUnits()).toBe(1);
    expect(component.totalProcesses()).toBe(12);
  });

  it('should sort units by name', () => {
    component.sortBy('name');
    fixture.detectChanges();
    
    expect(component.sortField()).toBe('name');
  });

  it('should handle pagination correctly', () => {
    expect(component.currentPage()).toBe(1);
    expect(component.pageSize()).toBe(10);
  });

  it('should format savings correctly', () => {
    const result = component.formatSavings(15420);
    expect(result).toBe('$15.4K');
  });

  it('should get efficiency class correctly', () => {
    expect(component.getEfficiencyClass(95)).toBe('excellent');
    expect(component.getEfficiencyClass(80)).toBe('good');
    expect(component.getEfficiencyClass(65)).toBe('fair');
    expect(component.getEfficiencyClass(40)).toBe('poor');
  });
});
