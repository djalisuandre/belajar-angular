import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FakultasComponent } from './components/fakultas/fakultas.component';
import { ProdiComponent } from './components/prodi/prodi.component';
import { MahasiswaComponent } from './components/mahasiswa/mahasiswa.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'fakultas', component: FakultasComponent },
  { path: 'prodi', component: ProdiComponent },
  { path: 'mahasiswa', component: MahasiswaComponent },
];
