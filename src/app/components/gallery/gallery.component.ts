import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gallery',
  imports: [RouterLink],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit, OnDestroy {
  steps = [
    { number: '1', heading: 'Scan or tap', body: 'Find the QR code on your table or in the order of service, or tap the button below.' },
    { number: '2', heading: 'Take your shots', body: 'Use the camera to capture up to 20 moments from the day — each photo is saved as you go.' },
    { number: '3', heading: 'That\'s it', body: 'Your photos come straight to us. We\'ll add the best ones to this gallery for everyone to enjoy.' },
  ];

  photos = signal<string[]>([]);
  currentIndex = signal(0);
  lightboxOpen = signal(false);
  private timer?: ReturnType<typeof setInterval>;

  current = computed(() => this.photos()[this.currentIndex()] ?? null);
  hasPhotos = computed(() => this.photos().length > 0);

  async ngOnInit() {
    const found: string[] = [];
    for (let i = 1; i <= 100; i++) {
      const url = `assets/gallery/photo-${i}.jpg`;
      const loaded = await this.tryLoad(url);
      if (loaded) {
        found.push(url);
      } else {
        break;
      }
    }
    this.photos.set(found);
    if (found.length > 1) {
      this.timer = setInterval(() => this.next(), 5000);
    }
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  private tryLoad(url: string): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  next() {
    this.currentIndex.update(i => (i + 1) % this.photos().length);
  }

  prev() {
    this.currentIndex.update(i => (i - 1 + this.photos().length) % this.photos().length);
  }

  goTo(i: number) {
    this.currentIndex.set(i);
  }

  openLightbox() {
    this.lightboxOpen.set(true);
  }

  closeLightbox() {
    this.lightboxOpen.set(false);
  }
}
