import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';

// ── UPDATE THIS DATE ──────────────────────────────────────────────────────────
const WEDDING_DATE = new Date('2027-06-06T13:00:00');
// ─────────────────────────────────────────────────────────────────────────────

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-countdown',
  imports: [],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.css'
})
export class CountdownComponent implements OnInit, OnDestroy {
  timeLeft = signal<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  private timer?: ReturnType<typeof setInterval>;

  units = computed(() => {
    const t = this.timeLeft();
    return [
      { label: 'Days', value: t.days },
      { label: 'Hours', value: t.hours },
      { label: 'Minutes', value: t.minutes },
      { label: 'Seconds', value: t.seconds },
    ];
  });

  ngOnInit() {
    this.tick();
    this.timer = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  private tick() {
    const diff = WEDDING_DATE.getTime() - Date.now();
    if (diff <= 0) {
      this.timeLeft.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    this.timeLeft.set({
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    });
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
