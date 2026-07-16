import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

const BUCKET = 'wedding-photos';
const LIMIT = 20;

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private client: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);

  async getUsedCount(guestId: string): Promise<number> {
    const { data } = await this.client.storage.from(BUCKET).list(guestId);
    return data?.length ?? 0;
  }

  async getUploadedUrls(guestId: string): Promise<string[]> {
    const { data } = await this.client.storage.from(BUCKET).list(guestId);
    if (!data) return [];
    return data.map(file => {
      const { data: url } = this.client.storage.from(BUCKET).getPublicUrl(`${guestId}/${file.name}`);
      return url.publicUrl;
    });
  }

  async uploadPhoto(guestId: string, guestName: string, file: File, index: number): Promise<string> {
    const ext = file.name.split('.').pop() ?? 'jpg';
    const safeName = guestName.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const path = `${guestId}/${safeName}-${index}.${ext}`;
    const { error } = await this.client.storage.from(BUCKET).upload(path, file);
    if (error) throw error;
    const { data } = this.client.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async listAllPhotos(): Promise<string[]> {
    const { data: folders } = await this.client.storage.from(BUCKET).list('');
    if (!folders) return [];

    const urls: string[] = [];
    for (const folder of folders) {
      const { data: files } = await this.client.storage.from(BUCKET).list(folder.name);
      if (!files) continue;
      for (const file of files) {
        const { data } = this.client.storage.from(BUCKET).getPublicUrl(`${folder.name}/${file.name}`);
        urls.push(data.publicUrl);
      }
    }
    return urls;
  }

  async submitMenuChoice(id: string, data: {
    name: string;
    starter: string;
    main: string;
    dessert: string;
    dietary_notes: string;
    is_child: boolean;
  }): Promise<void> {
    const { error } = await this.client.from('menu_choices').insert({ id, ...data });
    if (error) throw error;
  }

  async updateMenuChoice(id: string, data: {
    name: string;
    starter: string;
    main: string;
    dessert: string;
    dietary_notes: string;
    is_child: boolean;
  }): Promise<void> {
    const { error } = await this.client.from('menu_choices').update(data).eq('id', id);
    if (error) throw error;
  }

  get limit() { return LIMIT; }
}
