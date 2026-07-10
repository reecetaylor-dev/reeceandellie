import { Component, AfterViewInit, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-our-story',
  imports: [],
  templateUrl: './our-story.component.html',
  styleUrl: './our-story.component.css'
})
export class OurStoryComponent implements AfterViewInit, OnDestroy {
  visible = signal<Set<number>>(new Set());
  private observer?: IntersectionObserver;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const i = Number((entry.target as HTMLElement).dataset['index']);
          this.visible.update(s => new Set([...s, i]));
          this.observer!.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.story-item').forEach(el => this.observer!.observe(el));
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  failedPhotos = new Set<string>();

  onPhotoError(photo: string) {
    this.failedPhotos.add(photo);
  }

  hasPhoto(photo: string) {
    return !this.failedPhotos.has(photo);
  }
  // Place photos in src/assets/story/ — filenames match the photo field below
  timeline: { year: string; title: string; description: string; photo: string; pos?: string }[] = [
    {
      year: '2017',
      title: 'We Met',
      description: 'Brought together through mutual friends, what started as a chance introduction quickly blossomed into something neither of us could have planned.',
      photo: 'assets/story/we-met.jpg',
    },
    {
      year: 'June 2017',
      title: 'The First Date',
      description: 'On the 16th of June we headed to The Junction, a local pub in Brampton. One drink turned into many, and the next morning I asked her to be my girlfriend — she said yes.',
      photo: 'assets/story/first-date.jpg',
      pos: '30% 45%',
    },
    {
      year: 'April 2018',
      title: 'Our First Home',
      description: 'We didn\'t waste any time. We moved in together into our two-bedroom apartment at Gateway Plaza, Barnsley — the place where our story really began.',
      photo: 'assets/story/first-home.jpg',
      pos: 'center 65%',
    },
    {
      year: 'April 2022',
      title: 'A Place to Call Our Own',
      description: 'We took the leap and bought our first house together, turning it into a proper home filled with laughter, love, and the occasional DIY disaster.',
      photo: 'assets/story/our-house.jpg',
      pos: 'center 60%',
    },
    {
      year: 'June 2022',
      title: 'Welcome, Archie',
      description: 'We decided every home needs a four-legged family member, and so our beloved Labrador, Archie, bounded into our lives and stole our hearts immediately.',
      photo: 'assets/story/archie.jpg',
      pos: 'center 25%',
    },
    {
      year: 'August 2023',
      title: 'Skylar May',
      description: 'Our family grew in the most wonderful way when our beautiful daughter Skylar May arrived. She changed everything — and made us fall even more in love.',
      photo: 'assets/story/skylar.jpg',
      pos: 'center 20%',
    },
    {
      year: 'June 2025',
      title: 'She Said Yes',
      description: 'Under the golden sun of the South of France. I got down on one knee and asked Ellie to be my wife. She said yes.',
      photo: 'assets/story/proposal.jpg',
      pos: 'center 30%',
    },
    {
      year: '2027',
      title: 'Forever Begins',
      description: 'Surrounded by everyone we love, we will celebrate the next chapter of our story at the beautiful Bawtry Hall.',
      photo: 'assets/taylor-lights.png',
    },
  ];
}
