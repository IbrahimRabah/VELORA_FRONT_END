import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './core/services/theme.service';

interface TableItem {
  id: number;
  name: string;
  status: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {  constructor(
    private translate: TranslateService,
    public themeService: ThemeService
  ) {
    // Default language is already set by the LanguageToggleComponent
  }

  data: TableItem[] = [
    { id: 1, name: 'Item 1', status: 'Success' },
    { id: 2, name: 'Item 2', status: 'Warning' },
    { id: 3, name: 'Item 3', status: 'Danger' },
    { id: 4, name: 'Item 4', status: 'Info' },
    { id: 5, name: 'Item 5', status: 'Success' },
    { id: 6, name: 'Item 6', status: 'Warning' }
  ];
}
