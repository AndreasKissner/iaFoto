import { ApplicationConfig, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { StorageService } from './core/storage/storage.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Moderner Angular 21 Weg:
    provideAppInitializer(() => {
      const storage = inject(StorageService);
      return storage.initialisieren();
    })
  ]
};