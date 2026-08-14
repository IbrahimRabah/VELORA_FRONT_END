import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, inject, signal } from '@angular/core';

import { CategoryNode } from '../../../core/models';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrl: './main-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainNavComponent {
  @Input() categories: CategoryNode[] = [];

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  // Only one dropdown open at a time — a caret button (not the CSS :hover/:focus-within
  // used for mouse users) so keyboard/touch users have an explicit way to open a
  // dropdown whose links are visibility: hidden (and thus untabbable) while closed.
  private readonly openCategoryId = signal<number | null>(null);

  isOpen(categoryId: number): boolean {
    return this.openCategoryId() === categoryId;
  }

  toggle(categoryId: number): void {
    this.openCategoryId.set(this.isOpen(categoryId) ? null : categoryId);
  }

  closeAll(): void {
    this.openCategoryId.set(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeAll();
    }
  }
}
