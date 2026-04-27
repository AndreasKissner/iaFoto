import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CameraService {
  stream = signal<MediaStream | null>(null);
  fehler = signal<string | null>(null);

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
      this.handleKameraFehler(err, null);
    }
  }

  async fotoAufnehmen(video: HTMLVideoElement): Promise<Blob> {
    const canvas = document.createElement('canvas');
    this.konfiguriereCanvas(canvas, video);
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else this.handleKameraFehler('Blob-Fehler', reject);
      }, 'image/jpeg', 0.9);
    });
  }

  private konfiguriereCanvas(canvas: HTMLCanvasElement, video: HTMLVideoElement): void {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
  }

  private handleKameraFehler(err: any, reject: any): void {
    const msg = 'Kamera-Fehler oder Zugriff verweigert.';
    this.fehler.set(msg);
    if (reject) reject(msg);
  }

  stoppeKamera(): void {
    this.stream()?.getTracks().forEach(track => track.stop());
    this.stream.set(null);
  }
}