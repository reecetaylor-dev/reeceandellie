import { Component } from '@angular/core';

@Component({
  selector: 'app-accommodation',
  imports: [],
  templateUrl: './accommodation.component.html',
  styleUrl: './accommodation.component.css'
})
export class AccommodationComponent {
  details = [
    { icon: '◎', label: 'Address', value: 'The Crown & Anchor Hotel, Market Place, Bawtry, Doncaster, DN10 6JA' },
    { icon: '◷', label: 'Distance', value: 'A short 2-minute walk from Bawtry Hall' },
    { icon: '☎', label: 'Phone', value: '01302 710341' },
    { icon: '✉', label: 'Email', value: 'reservations@crownandanchorbawtry.co.uk' },
  ];
}
