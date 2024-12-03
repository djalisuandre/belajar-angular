import { CommonModule } from '@angular/common'; // Mengimpor CommonModule agar dapat menggunakan fitur-fitur dasar Angular seperti *ngIf dan *ngFor
import { Component, OnInit, inject } from '@angular/core'; // Mengimpor dekorator Component, lifecycle hook OnInit, dan inject untuk injeksi HttpClient pada komponen standalone
import { HttpClient } from '@angular/common/http'; // Mengimpor HttpClient untuk melakukan HTTP request

@Component({
  selector: 'app-mahasiswa', // Nama selector untuk komponen ini. Komponen akan digunakan di template dengan tag <app-mahasiswa></app-mahasiswa>
  standalone: true, // Menyatakan bahwa komponen ini adalah komponen standalone dan tidak membutuhkan module tambahan
  imports: [CommonModule], // Mengimpor CommonModule untuk memungkinkan penggunaan direktif Angular standar seperti *ngIf dan *ngFor di template
  templateUrl: './mahasiswa.component.html', // Path ke file template HTML untuk komponen ini
  styleUrl: './mahasiswa.component.css', // Path ke file CSS untuk komponen ini
})
export class MahasiswaComponent implements OnInit {
  // Deklarasi komponen dengan mengimplementasikan lifecycle hook OnInit
  mahasiswa: any[] = []; // Mendeklarasikan properti mahasiswa yang akan menyimpan data yang diterima dari API
  apiUrl = 'https://crud-express-seven.vercel.app/api/mahasiswa'; // URL API yang digunakan untuk mendapatkan data mahasiswa
  isLoading = true; // Properti untuk status loading, digunakan untuk menunjukkan loader saat data sedang diambil

  private http = inject(HttpClient); // Menggunakan inject untuk mendapatkan instance HttpClient di dalam komponen standalone (untuk Angular versi terbaru yang mendukung pendekatan ini)

  ngOnInit(): void {
    // Lifecycle hook ngOnInit dipanggil saat komponen diinisialisasi
    // Mengambil data dari API menggunakan HttpClient
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        // Callback untuk menangani data yang diterima dari API
        this.mahasiswa = data; // Menyimpan data yang diterima ke dalam properti mahasiswa
        console.log('Data mahasiswa:', this.mahasiswa); // Mencetak data mahasiswa di console untuk debugging
        this.isLoading = false; // Mengubah status loading menjadi false, yang akan menghentikan tampilan loader
      },
      error: (err) => {
        // Callback untuk menangani jika terjadi error saat mengambil data
        console.error('Error fetching mahasiswa data:', err); // Mencetak error di console untuk debugging
        this.isLoading = false; // Tetap mengubah status loading menjadi false meskipun terjadi error, untuk menghentikan loader
      },
    });
  }
}
