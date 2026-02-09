import { Component, computed, input, output, model, signal } from '@angular/core';
import type { FormField } from '../../../models';

const INPUT_TYPES = {
  text: 'text',
  email: 'email',
  password: 'password',
  number: 'number',
  tel: 'tel',
  url: 'url',
  search: 'search'
} as const;

type InputType = keyof typeof INPUT_TYPES;

const INPUT_SIZES = {
  sm: 'input-sm',
  md: 'input-md',
  lg: 'input-lg'
} as const;

type InputSize = keyof typeof INPUT_SIZES;

/**
 * InputComponent - Campo de formulario reutilizable
 *
 * Standalone component con validación y estados visuales
 * Soporta diferentes tipos, tamaños y configuraciones
 */
@Component({
  selector: 'app-input',
  standalone: true,
  template: `
    <div class="input-wrapper" [class]="wrapperClasses()">
      @if (label()) {
        <label
          [for]="inputId()"
          class="input-label"
          [class.required]="required()"
        >
          {{ label() }}
          @if (required()) {
            <span class="required-asterisk" aria-hidden="true">*</span>
          }
        </label>
      }

      @if (hint()) {
        <p class="input-hint" [id]="hintId()">{{ hint() }}</p>
      }

      <div class="input-container">
        @if (prefix()) {
          <span class="input-prefix" aria-hidden="true">{{ prefix() }}</span>
        }

        <input
          [id]="inputId()"
          [type]="effectiveInputType()"
          [class]="inputClasses()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [required]="required()"
          [attr.aria-invalid]="hasError()"
          [attr.aria-describedby]="describedBy()"
          [attr.maxlength]="maxLength()"
          [attr.min]="min()"
          [attr.max]="max()"
          [attr.step]="step()"
          [value]="modelValue()"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
        />

        @if (suffix() || showPasswordToggle()) {
          <div class="input-suffix">
            @if (suffix()) {
              <span class="suffix-text" aria-hidden="true">{{ suffix() }}</span>
            }

            @if (showPasswordToggle()) {
              <button
                type="button"
                class="password-toggle"
                [attr.aria-label]="isPasswordVisible() ? 'Hide password' : 'Show password'"
                (click)="togglePasswordVisibility()"
              >
                <span class="material-symbols-outlined">
                  {{ isPasswordVisible() ? 'visibility' : 'visibility_off' }}
                </span>
              </button>
            }
          </div>
        }
      </div>

      @if (hasError() && errorMessage()) {
        <p class="input-error" [id]="errorId()" role="alert">
          {{ errorMessage() }}
        </p>
      }

      @if (showCharacterCount() && maxLength()) {
        <div class="character-count">
          {{ currentLength() }}/{{ maxLength() }}
        </div>
      }
    </div>
  `,
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  /** Two-way binding del valor */
  modelValue = model<string>('');

  /** Tipo de input (text, email, password, etc.) */
  type = input<InputType>('text', { alias: 'type' });

  /** Tamaño del input (sm, md, lg) */
  size = input<InputSize>('md');

  /** Etiqueta del campo */
  label = input<string>('');

  /** Placeholder */
  placeholder = input<string>('');

  /** Texto de ayuda */
  hint = input<string>('');

  /** Texto de prefijo (ej: $, €, +) */
  prefix = input<string>('');

  /** Texto de sufijo (ej: kg, %, usuarios) */
  suffix = input<string>('');

  /** Si es requerido */
  required = input<boolean>(false);

  /** Si está deshabilitado */
  disabled = input<boolean>(false);

  /** Si es solo lectura */
  readonly = input<boolean>(false);

  /** Longitud máxima */
  maxLength = input<number>();

  /** Valor mínimo (para numbers) */
  min = input<number>();

  /** Valor máximo (para numbers) */
  max = input<number>();

  /** Step (para numbers) */
  step = input<number>();

  /** Mostrar contador de caracteres */
  showCharacterCount = input<boolean>(false);

  /** Estado de error manual */
  error = input<string>('');

  /** Event outputs */
  valueChange = output<string>();
  blur = output<FocusEvent>();
  focus = output<FocusEvent>();

  /** Estado interno para password visibility */
  private readonly _isPasswordVisible = signal<boolean>(false);
  readonly isPasswordVisible = this._isPasswordVisible.asReadonly();

  /** Estado de focus */
  private readonly _isFocused = signal<boolean>(false);
  readonly isFocused = this._isFocused.asReadonly();

  /** IDs generados para accesibilidad */
  private readonly _componentId = computed(() =>
    `input-${Math.random().toString(36).substr(2, 9)}`
  );

  readonly inputId = computed(() => `${this._componentId()}-field`);
  readonly hintId = computed(() => `${this._componentId()}-hint`);
  readonly errorId = computed(() => `${this._componentId()}-error`);

  /** Computed signals */
  readonly wrapperClasses = computed(() => {
    const classes = ['input-wrapper'];

    if (this.size()) classes.push(`input-wrapper-${this.size()}`);
    if (this.disabled()) classes.push('input-disabled');
    if (this.readonly()) classes.push('input-readonly');
    if (this.hasError()) classes.push('input-error');
    if (this.isFocused()) classes.push('input-focused');

    return classes;
  });

  readonly inputClasses = computed(() => {
    const classes = ['input-base'];

    if (this.size()) classes.push(INPUT_SIZES[this.size()]);
    if (this.hasError()) classes.push('input-error');

    return classes.join(' ');
  });

  readonly hasError = computed(() => !!this.error());
  readonly errorMessage = computed(() => this.error());

  readonly showPasswordToggle = computed(() =>
    this.type() === 'password'
  );

  readonly effectiveInputType = computed(() => {
    if (this.type() === 'password') {
      return this.isPasswordVisible() ? 'text' : 'password';
    }
    return this.type();
  });

  readonly currentLength = computed(() => this.modelValue().length);

  readonly describedBy = computed(() => {
    const ids = [];
    if (this.hint()) ids.push(this.hintId());
    if (this.hasError()) ids.push(this.errorId());
    return ids.length > 0 ? ids.join(' ') : undefined;
  });

  /** Event handlers */
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.modelValue.set(target.value);
    this.valueChange.emit(target.value);
  }

  onFocus(): void {
    this._isFocused.set(true);
    this.focus.emit(new FocusEvent('focus'));
  }

  onBlur(): void {
    this._isFocused.set(false);
    this.blur.emit(new FocusEvent('blur'));
  }

  togglePasswordVisibility(): void {
    this._isPasswordVisible.update(v => !v);
  }
}
