import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

const LS_KEY = 'wedding_menu_entries';

export interface MenuEntry {
  id: string;
  name: string;
  starter: string;
  main: string;
  dessert: string;
  dietaryNotes: string;
}

@Component({
  selector: 'app-menu',
  imports: [FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  constructor(private supabase: SupabaseService) {}

  starters = [
    { value: 'Potted Chicken Liver Parfait', desc: 'toasted artisan bread & fig jam', tags: [] as string[] },
    { value: 'Creamed Leek & Crumbly Goats Cheese Tart', desc: 'baby leaves, balsamic', tags: ['V'] },
    { value: 'Sautéed Wild Mushrooms', desc: 'toasted ciabatta, pinot grigio cream', tags: ['V'] },
    { value: 'Roast Tomato & Red Pepper Soup', desc: 'chive crème fraîche, artisan bread', tags: ['V', 'VG'] },
    { value: 'Thai Fishcakes', desc: 'sweet chilli dressing, rocket', tags: [] as string[] },
  ];

  mains = [
    { value: 'Chicken Breast Stuffed with Wensleydale', desc: 'wrapped in Parma ham, cranberry compote, goose fat roast potatoes', tags: [] as string[] },
    { value: 'Individual Steak, Hendersons Relish & Guinness Pie', desc: 'buttery mash', tags: [] as string[] },
    { value: 'Slow Roasted Loin of Pork', desc: 'apple & apricot seasoning, pan gravy, goose fat roast potatoes', tags: [] as string[] },
    { value: 'Salmon Fillet', desc: 'crushed new potatoes, white wine, cream & chive sauce', tags: [] as string[] },
    { value: 'Stuffed Peppers', desc: 'couscous, red pepper coulis', tags: ['V', 'VG'] },
    { value: 'Roast Vegetable Wellington', desc: 'sweet potato, mushrooms, spinach, herb roasted potatoes, gravy', tags: ['V', 'VG'] },
  ];

  accompaniments = ['Thyme roasted carrots', 'Honey roasted parsnips', 'Tenderstem broccoli', 'Herb crumb'];

  desserts = [
    { value: 'Eton Mess', desc: 'crushed meringue, mixed berries, vanilla cream', tags: [] as string[] },
    { value: 'Bramley Apple Crumble', desc: 'crème anglaise', tags: [] as string[] },
    { value: 'Dark Chocolate Brownie', desc: 'clotted cream ice cream', tags: [] as string[] },
  ];

  entries = signal<MenuEntry[]>([]);
  editingId = signal<string | null>(null);

  name = '';
  starter = '';
  main = '';
  dessert = '';
  dietaryNotes = '';

  submitting = signal(false);
  error = signal('');
  showForm = signal(false);

  ngOnInit() {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      const parsed: MenuEntry[] = JSON.parse(saved);
      this.entries.set(parsed);
    }
    if (this.entries().length === 0) {
      this.showForm.set(true);
    }
  }

  startAdd() {
    this.editingId.set(null);
    this.name = '';
    this.starter = '';
    this.main = '';
    this.dessert = '';
    this.dietaryNotes = '';
    this.showForm.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  startEdit(entry: MenuEntry) {
    this.editingId.set(entry.id);
    this.name = entry.name;
    this.starter = entry.starter;
    this.main = entry.main;
    this.dessert = entry.dessert;
    this.dietaryNotes = entry.dietaryNotes;
    this.showForm.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancel() {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  private uuid(): string {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  get valid() {
    return this.name.trim() && this.starter && this.main && this.dessert;
  }

  async submit() {
    if (!this.valid) return;
    this.submitting.set(true);
    this.error.set('');
    const data = {
      name: this.name.trim(),
      starter: this.starter,
      main: this.main,
      dessert: this.dessert,
      dietary_notes: this.dietaryNotes.trim(),
    };
    try {
      const id = this.editingId();
      if (id) {
        await this.supabase.updateMenuChoice(id, data);
        this.entries.update(es => es.map(e => e.id === id
          ? { id, name: data.name, starter: data.starter, main: data.main, dessert: data.dessert, dietaryNotes: data.dietary_notes }
          : e
        ));
      } else {
        const newId = this.uuid();
        await this.supabase.submitMenuChoice(newId, data);
        this.entries.update(es => [...es, {
          id: newId, name: data.name, starter: data.starter,
          main: data.main, dessert: data.dessert, dietaryNotes: data.dietary_notes,
        }]);
      }
      localStorage.setItem(LS_KEY, JSON.stringify(this.entries()));
      this.showForm.set(false);
      this.editingId.set(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error('Menu submit error:', e);
      this.error.set('Something went wrong. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }
}
