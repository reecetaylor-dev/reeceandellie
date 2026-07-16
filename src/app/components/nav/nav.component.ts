import { Component, HostListener, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [NgClass, RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  scrolled = signal(false);
  menuOpen = signal(false);

  links = [
    { id: 'countdown', label: 'The Date' },
    { id: 'story', label: 'Our Story' },
    { id: 'venue', label: 'Venue' },
    { id: 'accommodation', label: 'Stay' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'registry', label: 'Honeymoon' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 60);
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen.set(false);
  }
}
