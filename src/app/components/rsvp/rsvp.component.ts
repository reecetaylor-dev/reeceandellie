import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface RsvpForm {
  name: string;
  email: string;
  attending: 'yes' | 'no' | '';
  guests: string;
  dietary: string;
  message: string;
}

@Component({
  selector: 'app-rsvp',
  imports: [FormsModule],
  templateUrl: './rsvp.component.html',
  styleUrl: './rsvp.component.css'
})
export class RsvpComponent {
  submitted = signal(false);

  attendingOptions = [
    { value: 'yes', label: 'Joyfully Accepts' },
    { value: 'no', label: 'Regretfully Declines' },
  ];

  form: RsvpForm = this.blank();

  private blank(): RsvpForm {
    return { name: '', email: '', attending: '', guests: '1', dietary: '', message: '' };
  }

  submit() {
    const existing = JSON.parse(localStorage.getItem('rsvps') ?? '[]');
    existing.push({ ...this.form, submittedAt: new Date().toISOString() });
    localStorage.setItem('rsvps', JSON.stringify(existing));
    this.submitted.set(true);
  }

  reset() {
    this.form = this.blank();
    this.submitted.set(false);
  }
}
