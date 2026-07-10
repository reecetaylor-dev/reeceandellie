import { Component, signal, computed, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

type Stage = 'name' | 'camera' | 'done' | 'loading';

@Component({
  selector: 'app-upload',
  imports: [FormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  stage = signal<Stage>('loading');
  guestName = '';
  guestId = signal('');
  used = signal(0);
  uploading = signal(false);
  previews = signal<string[]>([]);
  error = signal('');

  remaining = computed(() => this.supabase.limit - this.used());
  pct = computed(() => (this.used() / this.supabase.limit) * 100);
  empties = computed(() => Array(this.supabase.limit - this.used()));

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    const deviceId = this.getOrCreateDeviceId();
    const savedName = localStorage.getItem('wedding_guest_name') ?? '';

    this.guestId.set(deviceId);
    this.guestName = savedName;

    const [count, urls] = await Promise.all([
      this.supabase.getUsedCount(deviceId),
      this.supabase.getUploadedUrls(deviceId),
    ]);
    this.used.set(count);
    this.previews.set(urls);

    if (count >= this.supabase.limit) {
      this.stage.set('done');
    } else if (savedName) {
      this.stage.set('camera');
    } else {
      this.stage.set('name');
    }
  }

  private getOrCreateDeviceId(): string {
    let id = localStorage.getItem('wedding_device_id');
    if (!id) {
      id = 'device-' + this.uuid();
      localStorage.setItem('wedding_device_id', id);
    }
    return id;
  }

  private uuid(): string {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  async begin() {
    if (!this.guestName.trim()) return;
    localStorage.setItem('wedding_guest_name', this.guestName.trim());
    this.stage.set('camera');
  }

  triggerCamera() {
    this.fileInput.nativeElement.click();
  }

  async onFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    input.value = '';
    if (this.used() >= this.supabase.limit) return;

    this.uploading.set(true);
    this.error.set('');
    try {
      const publicUrl = await this.supabase.uploadPhoto(this.guestId(), this.guestName, file, this.used() + 1);
      this.previews.update(p => [...p, publicUrl]);
      this.used.update(n => n + 1);
      if (this.used() >= this.supabase.limit) {
        this.stage.set('done');
      }
    } catch {
      this.error.set('Something went wrong uploading that photo. Please try again.');
    } finally {
      this.uploading.set(false);
    }
  }

  finish() {
    this.stage.set('done');
  }
}
