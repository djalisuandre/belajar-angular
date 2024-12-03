import { CommonModule } from '@angular/common'; // Mengimpor CommonModule agar dapat menggunakan fitur-fitur dasar Angular seperti *ngIf dan *ngFor
import { Component, OnInit, inject } from '@angular/core'; // Mengimpor dekorator Component, lifecycle hook OnInit, dan inject untuk injeksi HttpClient pada komponen standalone
import { HttpClient } from '@angular/common/http'; // Mengimpor HttpClient untuk melakukan HTTP request

@Component({
  selector: 'app-prodi', // Nama selector untuk komponen ini. Komponen akan digunakan di template dengan tag <app-prodi></app-prodi>
  standalone: true, // Menyatakan bahwa komponen ini adalah komponen standalone dan tidak membutuhkan module tambahan
  imports: [CommonModule], // Mengimpor CommonModule untuk memungkinkan penggunaan direktif Angular standar seperti *ngIf dan *ngFor di template
  templateUrl: './prodi.component.html', // Path ke file template HTML untuk komponen ini
  styleUrl: './prodi.component.css', // Path ke file CSS untuk komponen ini
})
export class ProdiComponent implements OnInit {
  // Deklarasi komponen dengan mengimplementasikan lifecycle hook OnInit
  prodi: any[] = []; // Mendeklarasikan properti prodi yang akan menyimpan data yang diterima dari API
  apiUrl = 'https://crud-express-seven.vercel.app/api/prodi'; // URL API yang digunakan untuk mendapatkan data prodi
  isLoading = true; // Properti untuk status loading, digunakan untuk menunjukkan loader saat data sedang diambil

  private http = inject(HttpClient); // Menggunakan inject untuk mendapatkan instance HttpClient di dalam komponen standalone (untuk Angular versi terbaru yang mendukung pendekatan ini)

  ngOnInit(): void {
    // Lifecycle hook ngOnInit dipanggil saat komponen diinisialisasi
    // Mengambil data dari API menggunakan HttpClient
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        // Callback untuk menangani data yang diterima dari API
        this.prodi = data; // Menyimpan data yang diterima ke dalam properti prodi
        console.log('Data prodi:', this.prodi); // Mencetak data prodi di console untuk debugging
        this.isLoading = false; // Mengubah status loading menjadi false, yang akan menghentikan tampilan loader
      },
      error: (err) => {
        // Callback untuk menangani jika terjadi error saat mengambil data
        console.error('Error fetching prodi data:', err); // Mencetak error di console untuk debugging
        this.isLoading = false; // Tetap mengubah status loading menjadi false meskipun terjadi error, untuk menghentikan loader
      },
    });
  }
}
