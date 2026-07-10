import { Component } from '@angular/core';

@Component({
  selector: 'app-venue',
  imports: [],
  templateUrl: './venue.component.html',
  styleUrl: './venue.component.css'
})
export class VenueComponent {
  imgError = false;

  details = [
    { icon: '◎', label: 'Address', value: 'Bawtry Hall, Bawtry, Doncaster, DN10 6JH' },
    { icon: '◷', label: 'Date', value: 'Saturday, 6th June 2027' },
    { icon: '☎', label: 'Dress Code', value: 'Suits & occasionwear — come looking your best!' },
    { icon: '⌂', label: 'Accommodation', value: 'The Crown & Anchor Hotel, a 2-minute walk away — see below for booking details' },
  ];

  // ── UPDATE TIMES TO MATCH YOUR ACTUAL SCHEDULE ───────────────────────────
  schedule = [
    { time: '1:00 pm', label: 'Guests Arrive' },
    { time: '2:00 pm', label: 'Ceremony' },
    { time: '3:00 pm', label: 'Drinks Reception' },
    { time: '6:00 pm', label: 'Wedding Breakfast' },
    { time: '8:00 pm', label: 'Evening Reception' },
  ];
  // ─────────────────────────────────────────────────────────────────────────
}
