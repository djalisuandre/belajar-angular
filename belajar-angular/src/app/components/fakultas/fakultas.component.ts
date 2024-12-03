import { CommonModule } from '@angular/common'; // Mengimpor CommonModule agar dapat menggunakan fitur-fitur dasar Angular seperti *ngIf dan *ngFor
import { Component, OnInit, inject } from '@angular/core'; // Mengimpor dekorator Component, lifecycle hook OnInit, dan inject untuk injeksi HttpClient pada komponen standalone
import { HttpClient } from '@angular/common/http'; // Mengimpor HttpClient untuk melakukan HTTP request

@Component({
  selector: 'app-fakultas', // Nama selector untuk komponen ini. Komponen akan digunakan di template dengan tag <app-fakultas></app-fakultas>
  standalone: true, // Menyatakan bahwa komponen ini adalah komponen standalone dan tidak membutuhkan module tambahan
  imports: [CommonModule], // Mengimpor CommonModule untuk memungkinkan penggunaan direktif Angular standar seperti *ngIf dan *ngFor di template
  templateUrl: './fakultas.component.html', // Path ke file template HTML untuk komponen ini
  styleUrl: './fakultas.component.css', // Path ke file CSS untuk komponen ini
})
export class FakultasComponent implements OnInit {
  // Deklarasi komponen dengan mengimplementasikan lifecycle hook OnInit
  fakultas: any[] = []; // Mendeklarasikan properti fakultas yang akan menyimpan data yang diterima dari API
  apiUrl = 'https://crud-express-seven.vercel.app/api/fakultas'; // URL API yang digunakan untuk mendapatkan data fakultas
  isLoading = true; // Properti untuk status loading, digunakan untuk menunjukkan loader saat data sedang diambil

  private http = inject(HttpClient); // Menggunakan inject untuk mendapatkan instance HttpClient di dalam komponen standalone (untuk Angular versi terbaru yang mendukung pendekatan ini)

  ngOnInit(): void {
    // Lifecycle hook ngOnInit dipanggil saat komponen diinisialisasi
    // Mengambil data dari API menggunakan HttpClient
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        // Callback untuk menangani data yang diterima dari API
        this.fakultas = data; // Menyimpan data yang diterima ke dalam properti fakultas
        console.log('Data Fakultas:', this.fakultas); // Mencetak data fakultas di console untuk debugging
        this.isLoading = false; // Mengubah status loading menjadi false, yang akan menghentikan tampilan loader
      },
      error: (err) => {
        // Callback untuk menangani jika terjadi error saat mengambil data
        console.error('Error fetching fakultas data:', err); // Mencetak error di console untuk debugging
        this.isLoading = false; // Tetap mengubah status loading menjadi false meskipun terjadi error, untuk menghentikan loader
      },
    });
  }
}
