import { Component, computed, input, output, EventEmitter } from '@angular/core';

/**
 * Button Variants - Opciones de estilo
 */
const BUTTON_VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger'
} as const;

type ButtonVariant = keyof typeof BUTTON_VARIANTS;

const BUTTON_SIZES = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg'
} as const;

type ButtonSize = keyof typeof BUTTON_SIZES;

/**
 * ButtonComponent - Componente de Botón Reutilizable
 *
 * Standalone component con Signals para estado reactivo
 * Soporta variantes, tamaños, loading states y accesibilidad
 */
@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type()"
      [class]="buttonClasses()"
      [disabled]="disabled() || isLoading()"
      [attr.aria-label]="ariaLabelValue()"
      [attr.aria-busy]="isLoading()"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
      (click)="onClick.emit($event)"
      class="btn-base"
    >
      @if (isLoading()) {
        <span class="btn-loading-spinner" aria-hidden="true"></span>
        <span class="btn-loading-text">{{ loadingText() }}</span>
      } @else {
        <span class="btn-content">
          @if (iconLeft()) {
            <span class="btn-icon btn-icon-left" aria-hidden="true">
              {{ iconLeft() }}
            </span>
          }

          @if (text()) {
            <span class="btn-text">{{ text() }}</span>
          } @else {
            <span class="btn-text">
              <ng-content />
            </span>
          }

          @if (iconRight()) {
            <span class="btn-icon btn-icon-right" aria-hidden="true">
              {{ iconRight() }}
            </span>
          }
        </span>
      }
    </button>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  // INPUT DE BOTONES DENTRO DEL app-button
  type = input<'button' | 'submit' | 'reset'>('button');

  /** Variant del botón (primary, secondary, outline, ghost, danger) */
  variant = input<ButtonVariant>('primary');

  /** Tamaño del botón (sm, md, lg) */
  size = input<ButtonSize>('md');

  /** Texto del botón (alternativa a ng-content) */
  text = input<string>('');

  /** Icono izquierdo */
  iconLeft = input<string>('');

  /** Icono derecho */
  iconRight = input<string>('');

  /** Estado de deshabilitado */
  disabled = input<boolean>(false);

  /** Estado de carga con spinner */
  isLoading = input<boolean>(false);

  /** Texto durante carga */
  loadingText = input<string>('Loading...');

  /** ARIA label personalizado */
  ariaLabel = input<string>('');

  /** Event output */
  onClick = output<Event>();

  /** Computed signal para generar clases CSS */
  readonly buttonClasses = computed(() => {
    const classes = [
      'btn-base',
      BUTTON_VARIANTS[this.variant()],
      BUTTON_SIZES[this.size()]
    ];

    if (this.isLoading()) {
      classes.push('btn-loading');
    }

    if (this.disabled()) {
      classes.push('btn-disabled');
    }

    return classes.join(' ');
  });

  /** Computed signal para ARIA label */
  readonly ariaLabelValue = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();

    const baseText = this.text() || 'Button';
    if (this.isLoading()) return `${baseText} - loading`;

    return baseText;
  });
}
