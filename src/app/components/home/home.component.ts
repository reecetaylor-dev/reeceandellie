import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { HeroComponent } from '../hero/hero.component';
import { MessageComponent } from '../message/message.component';
import { CountdownComponent } from '../countdown/countdown.component';
import { OurStoryComponent } from '../our-story/our-story.component';
import { VenueComponent } from '../venue/venue.component';
import { AccommodationComponent } from '../accommodation/accommodation.component';
import { RegistryComponent } from '../registry/registry.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [
    NavComponent,
    HeroComponent,
    MessageComponent,
    CountdownComponent,
    OurStoryComponent,
    VenueComponent,
    AccommodationComponent,
    RegistryComponent,
    GalleryComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}
