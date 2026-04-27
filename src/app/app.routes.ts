import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'aufnahme',
    loadComponent: () => 
      import('./features/photo-capture/ui/camera-view/camera-view.component')
        .then(m => m.CameraViewComponent)
  },
  {
    path: '',
    redirectTo: 'aufnahme',
    pathMatch: 'full'
  }
];