import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from '../../shared/shared.module';

import { AboutRoutingModule } from './about-routing.module';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { AboutHeroComponent } from './components/about-hero/about-hero.component';
import { AboutStoryComponent } from './components/about-story/about-story.component';
import { AboutCollectionComponent } from './components/about-collection/about-collection.component';
import { AboutValuesComponent } from './components/about-values/about-values.component';
import { AboutGenderPanelsComponent } from './components/about-gender-panels/about-gender-panels.component';
import { AboutPromiseComponent } from './components/about-promise/about-promise.component';
import { AboutClosingComponent } from './components/about-closing/about-closing.component';

@NgModule({
  declarations: [
    AboutPageComponent,
    AboutHeroComponent,
    AboutStoryComponent,
    AboutCollectionComponent,
    AboutValuesComponent,
    AboutGenderPanelsComponent,
    AboutPromiseComponent,
    AboutClosingComponent
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    SharedModule,
    ButtonModule
  ]
})
export class AboutModule { }
