import { Component, computed, input } from '@angular/core';

const CARD_VARIANTS = {
  default: 'card-default',
  elevated: 'card-elevated',
  outlined: 'card-outlined',
  interactive: 'card-interactive'
} as const;

type CardVariant = keyof typeof CARD_VARIANTS;

const CARD_SIZES = {
  sm: 'card-sm',
  md: 'card-md',
  lg: 'card-lg',
  xl: 'card-xl'
} as const;

type CardSize = keyof typeof CARD_SIZES;

/**
 * CardComponent - Contenedor de contenido reutilizable
 * 
 * Standalone component con efectos smooth y variantes visuales
 * Ideal para dashboards, formularios, y contenido destacado
 */
@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div 
      [class]="cardClasses()"
      [attr.aria-labelledby]="titleId()"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
      class="card-base"
    >
      @if (headerContent() || title() || subtitle()) {
        <header class="card-header">
          <div class="card-header-content">
            @if (title()) {
              <h3 
                [id]="titleId()" 
                class="card-title"
              >
                {{ title() }}
              </h3>
            }
            
            @if (subtitle()) {
              <p class="card-subtitle">{{ subtitle() }}</p>
            }
          </div>
          
          @if (headerContent()) {
            <div class="card-header-actions">
              <ng-content select="[slot=&quot;header-actions&quot;]" />
            </div>
          }
        </header>
      }
      
      @if (imageUrl() || imageAlt()) {
        <div class="card-media">
          @if (imageUrl()) {
            <img 
              [src]="imageUrl()" 
              [alt]="imageAlt() || ''"
              [class]="imageClasses()"
              loading="lazy"
            />
          }
        </div>
      }
      
      <main class="card-content">
        <ng-content />
      </main>
      
      @if (footerContent()) {
        <footer class="card-footer">
          <ng-content select="[slot=&quot;footer&quot;]" />
        </footer>
      }
    </div>
  `,
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  /** Variant visual de la card */
  variant = input<CardVariant>('default');

  /** Tamaño de la card */
  size = input<CardSize>('md');

  /** Título principal */
  title = input<string>('');

  /** Subtítulo secundario */
  subtitle = input<string>('');

  /** URL de imagen */
  imageUrl = input<string>('');

  /** Alt text para imagen */
  imageAlt = input<string>('');

  /** Si la imagen debe cubrir toda la card */
  fullWidthImage = input<boolean>(false);

  /** Si la card es clickable (interactive variant) */
  clickable = input<boolean>(false);

  /** IDs para accesibilidad */
  private readonly _componentId = computed(() => 
    `card-${Math.random().toString(36).substr(2, 9)}`
  );
  
  readonly titleId = computed(() => 
    this.title() ? `${this._componentId()}-title` : undefined
  );

  /** Computed signals */
  readonly cardClasses = computed(() => {
    const classes = [
      'card-base',
      CARD_VARIANTS[this.variant()],
      CARD_SIZES[this.size()]
    ];

    if (this.clickable()) {
      classes.push('card-clickable');
    }

    return classes;
  });

  readonly imageClasses = computed(() => {
    const classes = ['card-image'];
    
    if (this.fullWidthImage()) {
      classes.push('card-image-full');
    }

    return classes.join(' ');
  });

  readonly hasHeaderContent = computed(() => 
    this.title() || this.subtitle()
  );

  readonly hasMedia = computed(() => 
    this.imageUrl() || this.imageAlt()
  );

  readonly headerContent = computed(() => false); // ng-content no se puede detectar
  
  readonly footerContent = computed(() => false); // ng-content no se puede detectar
}