import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params } from '@angular/router';

export interface BreadcrumbItem {
  // Exactly one of label/labelKey is set: labelKey for the two static crumbs
  // ("Home", "All Products"), label for API-provided category names, which
  // are already server-translated and must not go through the translate pipe.
  label?: string;
  labelKey?: string;
  link?: string;
  queryParams?: Params;
}

@Component({
  selector: 'app-vl-breadcrumb',
  templateUrl: './vl-breadcrumb.component.html',
  styleUrl: './vl-breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VlBreadcrumbComponent {
  @Input({ required: true }) items: BreadcrumbItem[] = [];
}
