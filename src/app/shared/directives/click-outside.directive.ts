import { Directive, ElementRef, EventEmitter, HostListener, Output, inject } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @Output() readonly appClickOutside = new EventEmitter<void>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // composedPath(), not elementRef.nativeElement.contains(event.target): a click that
    // toggles a *ngIf off (e.g. a toggle button unrendering itself once open) can detach
    // that target from the tree via zone.js's synchronous CD before the event finishes
    // bubbling to document — contains() then sees a disconnected node and misreports
    // "outside" on the very click that opened it. composedPath() is fixed at dispatch
    // time, so it stays correct regardless of DOM mutations mid-bubble.
    const path = event.composedPath();
    if (!path.includes(this.elementRef.nativeElement)) {
      this.appClickOutside.emit();
    }
  }
}
