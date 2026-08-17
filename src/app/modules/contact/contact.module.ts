import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { ContactHeroComponent } from './components/contact-hero/contact-hero.component';
import { ContactCardsComponent } from './components/contact-cards/contact-cards.component';
import { ContactLuxuryComponent } from './components/contact-luxury/contact-luxury.component';
import { ContactHelpComponent } from './components/contact-help/contact-help.component';

@NgModule({
  declarations: [
    ContactPageComponent,
    ContactHeroComponent,
    ContactCardsComponent,
    ContactLuxuryComponent,
    ContactHelpComponent
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    SharedModule
  ]
})
export class ContactModule { }
