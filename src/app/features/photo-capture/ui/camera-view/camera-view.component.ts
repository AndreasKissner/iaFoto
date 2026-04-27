import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CameraService } from '../../data-access/services/camera.service';
import { StorageService } from '../../../../core/storage/storage.service';

@Component({
  selector: 'app-camera-view',
  standalone: true,
  templateUrl: './camera-view.component.html',
  styleUrls: ['./camera-view.component.scss']
})
export class CameraViewComponent implements OnInit {
  protected cameraService = inject(CameraService);
  private storageService = inject(StorageService);

  @ViewChild('videoPlayer') videoElement!: ElementRef<HTMLVideoElement>;

  ngOnInit(): void {
    this.cameraService.starteKamera();
  }

  async aufnahmeMachen(): Promise<void> {
    if (!this.videoElement) return;
    
    const video = this.videoElement.nativeElement;
    const fotoBlob = await this.cameraService.fotoAufnehmen(video);
    await this.storageService.speichereFoto(fotoBlob);
  }
}