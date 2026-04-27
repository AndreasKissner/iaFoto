import { Injectable, signal } from '@angular/core';

export interface FotoEintrag {
  id?: number;
  blob: Blob;
  zeitstempel: number;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly dbName = 'SecondHandManagerDB';
  private readonly storeName = 'temporaere_fotos';
  private db: IDBDatabase | null = null;

  istBereit = signal(false);
  istInArbeit = signal(false);
  fehlerMeldung = signal<string | null>(null);

  async initialisieren(): Promise<void> {
    return new Promise((resolve, reject) => {
      const anfrage = indexedDB.open(this.dbName, 1);
      anfrage.onupgradeneeded = () => this.erstelleSchema(anfrage.result);
      anfrage.onsuccess = () => {
        this.db = anfrage.result;
        this.istBereit.set(true);
        resolve();
      };
      anfrage.onerror = () => this.handleFehler('Datenbank-Start fehlgeschlagen', reject);
    });
  }

  private erstelleSchema(db: IDBDatabase): void {
    if (!db.objectStoreNames.contains(this.storeName)) {
      db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
    }
  }

  async speichereFoto(foto: Blob): Promise<number> {
    if (!this.db) return Promise.reject('Datenbank nicht bereit');
    this.istInArbeit.set(true);
    return new Promise((resolve, reject) => {
      const store = this.getStore('readwrite');
      const anfrage = store.add({ blob: foto, zeitstempel: Date.now() });
      anfrage.onsuccess = () => {
        this.istInArbeit.set(false);
        resolve(anfrage.result as number);
      };
      anfrage.onerror = () => this.handleFehler('Speichern fehlgeschlagen', reject);
    });
  }

  private getStore(modus: IDBTransactionMode): IDBObjectStore {
    const transaktion = this.db!.transaction(this.storeName, modus);
    return transaktion.objectStore(this.storeName);
  }

  private handleFehler(nachricht: string, reject: (reason?: any) => void): void {
    this.istInArbeit.set(false);
    this.fehlerMeldung.set(nachricht);
    reject(nachricht);
  }

  async loescheAlleFotos(): Promise<void> {
    if (!this.db) return;
    const store = this.getStore('readwrite');
    return new Promise((resolve) => {
      const anfrage = store.clear();
      anfrage.onsuccess = () => resolve();
    });
  }
}