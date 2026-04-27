import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CameraService {
  // Signals für den Hardware-Status
  stream = signal<MediaStream | null>(null);
  fehler = signal<string | null>(null);

  /**
   * Startet die Kamera mit optimalen Einstellungen für mobile Geräte.
   */
  async starteKamera(): Promise<void> {
    const constraints: MediaStreamConstraints = {
      video: { facingMode: 'environment', width: { ideal: 1920 } },
      audio: false
    };

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.stream.set(mediaStream);
      this.fehler.set(null);
    } catch (err) {
      this.handleKameraFehler(err);
    }
  }

  private handleKameraFehler(err: any): void {
    const nachricht = 'Zugriff auf Kamera verweigert oder nicht verfügbar.';
    this.fehler.set(nachricht);
  }

  /**
   * Stoppt alle aktiven Video-Tracks, um Energie zu sparen.
   */
  stoppeKamera(): void {
    const aktuellerStream = this.stream();
    if (aktuellerStream) {
      aktuellerStream.getTracks().forEach(track => track.stop());
      this.stream.set(null);
    }
  }
}
