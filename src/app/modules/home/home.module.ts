import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeroBannerComponent } from './components/hero-banner/hero-banner.component';
import { CategoryShowcaseComponent } from './components/category-showcase/category-showcase.component';
import { FeaturedSectionComponent } from './components/featured-section/featured-section.component';
import { NewArrivalsSectionComponent } from './components/new-arrivals-section/new-arrivals-section.component';
import { BrandsStripComponent } from './components/brands-strip/brands-strip.component';


@NgModule({
  declarations: [
    HomePageComponent,
    HeroBannerComponent,
    CategoryShowcaseComponent,
    FeaturedSectionComponent,
    NewArrivalsSectionComponent,
    BrandsStripComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule { }
