---
name: angular-20
description: >
  Modern Angular patterns (v18/v19+).
  Trigger: When writing Angular components, services, or directives. Focus on Signals, Standalone components, and New Control Flow.
license: Apache-2.0
metadata:
  scope: [root, ui]
  auto_invoke: "Writing Angular components"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

## Signals over Zone.js (REQUIRED)

Prefer Signals for local state and derived values. This prepares the app for Zoneless execution and improves performance.

```typescript
// ✅ Angular Modern: Signals & Computed
import { Component, signal, computed } from '@angular/core';

@Component({ ... })
export class ProductListComponent {
  items = signal<Item[]>([]);
  showActive = signal(true);

  // Derived state updates automatically; memoized by default
  filteredItems = computed(() => {
    return this.items().filter(i => 
      this.showActive() ? i.active : true
    );
  });

  toggle() {
    this.showActive.update(v => !v);
  }
}

// ❌ Legacy: Manual Change Detection or Getters
get filteredItems() { // Runs on every CD cycle (expensive)
  return this.items.filter(...);
}
// ❌ Legacy: BehaviorSubject for synchronous local state
items$ = new BehaviorSubject([]);

```

## Standalone Components (REQUIRED)

Modules (`NgModules`) are obsolete for component declaration. Every component must be standalone.

```typescript
// ✅ ALWAYS: Standalone Component
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
// Note: CommonModule is rarely needed with New Control Flow

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatButtonModule], // Explicit imports
  templateUrl: './user.component.html'
})
export class UserComponent {}

// ❌ NEVER: Declaring in NgModule
@NgModule({
  declarations: [UserComponent],
  ...
})

```

## New Control Flow (REQUIRED)

Do not use `*ngIf`, `*ngFor` or `*ngSwitch` structural directives. Use the built-in control flow syntax.

```html
@if (user(); as u) {
  <div class="profile">Hello {{ u.name }}</div>
} @else {
  <button (click)="login()">Login</button>
}

@for (item of items(); track item.id) {
  <div class="card">{{ item.title }}</div>
} @empty {
  <p>No items found.</p>
}

<div *ngIf="user$ | async as u; else loginTpl">...</div>
<div *ngFor="let item of items; trackBy: trackById">...</div>

```

## Inputs & Outputs as Signals

Replace decorators with signal-based inputs/outputs for better type safety and reactivity.

```typescript
// ✅ Signal Inputs/Outputs
import { Component, input, output } from '@angular/core';

@Component({...})
export class ChildComponent {
  // Read-only signal, automatically reactive
  data = input.required<UserData>(); 
  
  // Optional with default value
  config = input<Config>({ darkMode: false });

  // Modern Output (no EventEmitter required)
  save = output<void>();

  emitSave() {
    this.save.emit();
  }
}

// ❌ Legacy Decorators
@Input() data: UserData;
@Output() save = new EventEmitter<void>();

```

## Signal Queries

Interact with the DOM using signal-based queries instead of `static` configuration.

```typescript
// ✅ Signal Queries
import { Component, viewChild, contentChildren, ElementRef } from '@angular/core';

@Component({...})
export class LayoutComponent {
  // Returns a Signal<ElementRef | undefined>
  header = viewChild<ElementRef>('headerRef'); 
  
  // Returns a Signal<readonly Tile[]>
  tiles = contentChildren(TileComponent); 

  ngAfterViewInit() {
    // Access value safely
    const el = this.header()?.nativeElement;
    if (el) console.log(el);
  }
}

// ❌ Legacy ViewChild
@ViewChild('headerRef') header: ElementRef;

```

## Resource API (Async Data)

Use `resource` (or `rxResource` for RxJS interop) to link Signals to asynchronous data loaders.

```typescript
// ✅ Resource API (v19+)
import { Component, input, resource } from '@angular/core';

@Component({...})
export class ProfileComponent {
  userId = input.required<string>();

  // Automatically fetches/cancels when userId signal changes
  userResource = resource({
    request: () => ({ id: this.userId() }),
    loader: ({ request }) => fetch(`/api/users/${request.id}`).then(r => r.json())
  });

  // Usage in template: 
  // {{ userResource.value()?.name }}
  // @if (userResource.isLoading()) { ... }
}

// ❌ Manual subscription management for simple fetching
ngOnInit() {
  this.sub = this.service.getData().subscribe(data => this.data = data);
}
