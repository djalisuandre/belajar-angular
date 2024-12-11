import { CommonModule } from '@angular/common'; // Mengimpor CommonModule agar dapat menggunakan fitur-fitur dasar Angular seperti *ngIf dan *ngFor
import { Component, OnInit, inject } from '@angular/core'; // Mengimpor dekorator Component, lifecycle hook OnInit, dan inject untuk injeksi HttpClient pada komponen standalone
import { HttpClient } from '@angular/common/http'; // Mengimpor HttpClient untuk melakukan HTTP request
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'; // Mengimpor modul dan class untuk membuat formulir reaktif.
import * as bootstrap from 'bootstrap'; // Mengimpor Bootstrap untuk manipulasi modal dan elemen lainnya.

@Component({
  selector: 'app-mahasiswa', // Nama selector untuk komponen ini. Komponen akan digunakan di template dengan tag <app-mahasiswa></app-mahasiswa>
  standalone: true, // Menyatakan bahwa komponen ini adalah komponen standalone dan tidak membutuhkan module tambahan
  imports: [CommonModule, ReactiveFormsModule], // Mengimpor CommonModule untuk memungkinkan penggunaan direktif Angular standar seperti *ngIf dan *ngFor di template
  templateUrl: './mahasiswa.component.html', // Path ke file template HTML untuk komponen ini
  styleUrl: './mahasiswa.component.css', // Path ke file CSS untuk komponen ini
})
export class MahasiswaComponent implements OnInit {
  // Deklarasi komponen dengan mengimplementasikan lifecycle hook OnInit
  mahasiswa: any[] = []; // Mendeklarasikan properti mahasiswa yang akan menyimpan data yang diterima dari API
  apiUrl = 'https://crud-express-seven.vercel.app/api/mahasiswa'; // URL API yang digunakan untuk mendapatkan data mahasiswa
  isLoading = true; // Properti untuk status loading, digunakan untuk menunjukkan loader saat data sedang diambil
  mahasiswaForm: FormGroup; // Form group untuk formulir reaktif mahasiswa.
  isSubmitting = false; // Indikator proses pengiriman data.

  private http = inject(HttpClient); // Menggunakan inject untuk mendapatkan instance HttpClient di dalam komponen standalone (untuk Angular versi terbaru yang mendukung pendekatan ini)
  private fb = inject(FormBuilder); // Menyuntikkan FormBuilder untuk membangun form reaktif.

  constructor() {
    this.mahasiswaForm = this.fb.group({
      // Membuat grup form dengan FormBuilder.
      nama: [''], // Field nama mahasiswa.
      npm: [''],
      jenis_kelamin: [''], // Field jenis kelamin mahasiswa.
      asal_sekolah: [''], //Field asal sekolah mahasiswa
    });
  }

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

  getMahasiswa(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      // Melakukan HTTP GET ke API Mahasiswa.
      next: (data) => {
        // Callback jika request berhasil.
        this.mahasiswa = data;
        this.isLoading = false;
      },
      error: (err) => {
        // Callback jika request gagal.
        console.error('Error fetching mahasiswa data:', err);
        this.isLoading = false;
      },
    });
  }

  // Method untuk menambahkan mahasiswa
  addMahasiswa(): void {
    if (this.mahasiswaForm.valid) {
      // Memastikan form valid sebelum mengirim data.
      this.isSubmitting = true; // Mengaktifkan indikator pengiriman data.
      this.http.post(this.apiUrl, this.mahasiswaForm.value).subscribe({
        // Malukan HTTP POST ke API mahasiswa.
        next: (response) => {
          // Callback jika request berhasil
          console.log('Mahasiswa berhasil ditambahkan:', response);
          this.getMahasiswa();
          this.mahasiswaForm.reset();
          this.isSubmitting = false;

          // Tutup modal setelah data berhasil ditambahkan
          const modalElement = document.getElementById(
            'tambahMahasiswaModal'
          ) as HTMLElement;
          if (modalElement) {
            // Periksa jika elemen modal ada
            const modalInstance =
              bootstrap.Modal.getInstance(modalElement) ||
              new bootstrap.Modal(modalElement);
            modalInstance.hide();

            modalElement.addEventListener(
              'hidden.bs.modal',
              () => {
                // Tambahkan event listener untuk modal yang ditutup.
                const backdrop = document.querySelector('.modal-backdrop'); // Cari elemen backdrop modal.
                if (backdrop) {
                  backdrop.remove(); // Hapus backdrop jika ada.
                }

                // Pulihkan scroll pada body
                document.body.classList.remove('modal-open'); // Hapus class 'modal-open' dari body.
                document.body.style.overflow = ''; // Pulihkan properti overflow pada body.
                document.body.style.paddingRight = ''; // Pulihkan padding body.
              },
              { once: true }
            );
          }
        },
        error: (err) => {
          // Callback jika request gagal.
          console.error('Error menambahkan mahasiswa:', err); // Log error ke konsol.
          this.isSubmitting = false; // Menonaktifkan indikator pengiriman.
        },
      });
    }
  }

  // Method untuk menampilkan modal edit mahasiswa
  editMahasiswaId: string | null = null;

  // Method untuk mendapatkan data mahasiswa berdasarkan ID
  getMahasiswaById(_id: string): void {
    this.editMahasiswaId = _id; // Menyimpan ID mahasiswa yang dipilih
    this.http.get(`${this.apiUrl}/${_id}`).subscribe({
      next: (data: any) => {
        // Isi form dengan data yang diterima dari API
        this.mahasiswaForm.patchValue({
          nama: data.nama,
          npm: data.npm,
          jenis_kelamin: data.jenis_kelamin,
          asal_sekolah: data.asal_sekolah,
        });

        // Buka modal edit
        const modalElement = document.getElementById(
          'editMahasiswaModal'
        ) as HTMLElement;
        if (modalElement) {
          const modalInstance =
            bootstrap.Modal.getInstance(modalElement) ||
            new bootstrap.Modal(modalElement);
          modalInstance.show();
        }
      },
      error: (err) => {
        console.error('Error fetching mahasiswa data by ID:', err);
      },
    });
  }

  // Method untuk mengupdate data mahasiswa
  updateMahasiswa(): void {
    if (this.mahasiswaForm.valid) {
      this.isSubmitting = true;
      this.http
        .put(`${this.apiUrl}/${this.editMahasiswaId}`, this.mahasiswaForm.value)
        .subscribe({
          next: (response) => {
            console.log('mahasiswa berhasil diperbarui:', response);
            this.getMahasiswa(); // Refresh data mahasiswa
            this.isSubmitting = false;

            // Tutup modal edit setelah data berhasil diupdate
            const modalElement = document.getElementById(
              'editmahasiswaModal'
            ) as HTMLElement;
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance?.hide();
            }
          },
          error: (err) => {
            console.error('Error updating mahasiswa:', err);
            this.isSubmitting = false;
          },
        });
    }
  }

  // Method untuk menghapus mahasiswa
  deleteMahasiswa(_id: string): void {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      // Konfirmasi penghapusan
      this.http.delete(`${this.apiUrl}/${_id}`).subscribe({
        next: () => {
          console.log(`Mahasiswa dengan ID ${_id} dan berhasil dihapus`);
          this.getMahasiswa(); // Refresh data mahasiswa setelah penghapusan
        },
        error: (err) => {
          console.error('Error menghapus mahasiswa:', err); // Log error jika penghapusan gagal
        },
      });
    }
  }
}
