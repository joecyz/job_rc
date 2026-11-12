# BSU Recruitment Website

**Sistem Informasi Rekrutmen PT Bintang Sayap Utama**

## 1. Deskripsi Proyek

BSU Recruitment Website merupakan aplikasi berbasis web yang dikembangkan untuk mendukung dan mempermudah proses rekrutmen karyawan di PT Bintang Sayap Utama.

Aplikasi ini menyediakan platform terintegrasi bagi pelamar kerja dan tim Human Resources (HR) untuk mengelola informasi lowongan pekerjaan, proses lamaran, informasi acara rekrutmen, serta informasi pendukung lainnya.

Sistem memiliki antarmuka dan hak akses yang disesuaikan dengan peran masing-masing pengguna.

## 2. Fitur Utama

### A. Applicant (Pelamar)
- Registrasi dan login akun pelamar.
- Pengelolaan profil pelamar.
- Melihat daftar lowongan pekerjaan.
- Melihat detail informasi lowongan.
- Mengirim lamaran pekerjaan.
- Melihat riwayat lamaran.

### B. Human Resources (HR)
- Login untuk pengguna internal.
- Dashboard pengelolaan rekrutmen.
- Pengelolaan informasi lowongan pekerjaan.
- Pengelolaan data dan lamaran pelamar.
- Melihat detail informasi pelamar.
- Pengelolaan informasi acara rekrutmen.
- Pengelolaan Frequently Asked Questions (FAQ).

### C. Fitur Pendukung
- Autentikasi menggunakan JSON Web Token (JWT).
- Pengaturan hak akses berdasarkan role pengguna.
- Tampilan informasi acara rekrutmen.
- Halaman FAQ.
- Integrasi frontend dan backend melalui REST API.

## 3. Teknologi yang Digunakan

| Komponen | Teknologi |
|---|---|
| Backend | Python |
| Backend Framework | Django |
| REST API | Django REST Framework |
| Authentication | Simple JWT |
| Frontend | React.js |
| Build Tool | Vite |
| HTTP Client | Axios |
| Database | MySQL |

## 4. Struktur Direktori

```text
job_rc/
│
├── accounts/           # Autentikasi dan pengelolaan akun
├── applications/       # Pengelolaan lamaran pekerjaan
├── config/             # Konfigurasi utama Django
├── contacts/           # Pengelolaan informasi kontak
├── events/             # Pengelolaan acara rekrutmen
├── faq/                # Pengelolaan FAQ
├── jobs/               # Pengelolaan lowongan pekerjaan
│
├── frontend/           # Aplikasi frontend React
│   ├── public/
│   └── src/
│       ├── api/
│       ├── assets/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       └── services/
│
├── manage.py
├── requirements.txt
├── .env.example
└── README.md
```

## 5. Persyaratan Instalasi

Sebelum menjalankan aplikasi, pastikan perangkat telah memiliki:

- Python dan pip.
- Node.js dan npm.
- MySQL Server.
- Git.

## 6. Instalasi dan Konfigurasi Backend

### Langkah 1. Clone Repository

```bash
git clone https://github.com/joecyz/job_rc.git
cd job_rc
```

### Langkah 2. Membuat Virtual Environment

```bash
python -m venv venv
```

Aktifkan virtual environment.

**Windows:**

```bash
venv\Scripts\activate
```

**Linux / macOS:**

```bash
source venv/bin/activate
```

### Langkah 3. Instalasi Dependency

```bash
pip install -r requirements.txt
```

### Langkah 4. Konfigurasi Environment Variable

Salin file `.env.example` menjadi `.env`.

**Windows:**

```cmd
copy .env.example .env
```

**Linux / macOS:**

```bash
cp .env.example .env
```

Selanjutnya, sesuaikan konfigurasi pada file `.env`:

```env
DJANGO_SECRET_KEY=generate-your-own-secret-key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=job_application
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=3306
```

Sesuaikan seluruh nilai konfigurasi dengan lingkungan server yang digunakan.

**Catatan:** Buat Django Secret Key baru dan gunakan kredensial database milik lingkungan masing-masing. Jangan mengunggah file `.env` ke repository GitHub.

### Langkah 5. Membuat Database MySQL

Buat database melalui MySQL:

```sql
CREATE DATABASE job_application;
```

Pastikan user MySQL yang digunakan memiliki hak akses terhadap database tersebut.

### Langkah 6. Menjalankan Database Migration

```bash
python manage.py migrate
```

Perintah ini digunakan untuk membuat tabel database berdasarkan migration yang tersedia.

### Langkah 7. Membuat Superuser

Jika diperlukan, buat akun administrator Django:

```bash
python manage.py createsuperuser
```

Ikuti instruksi yang muncul pada terminal.

### Langkah 8. Menjalankan Backend

```bash
python manage.py runserver
```

Backend Django secara default dapat diakses melalui:

```text
http://127.0.0.1:8000/
```

## 7. Instalasi dan Konfigurasi Frontend

Frontend dijalankan secara terpisah dari backend.

### Langkah 1. Masuk ke Direktori Frontend

Buka terminal baru, kemudian jalankan:

```bash
cd frontend
```

### Langkah 2. Instalasi Dependency

```bash
npm install
```

### Langkah 3. Menjalankan Frontend

```bash
npm run dev
```

Setelah berhasil dijalankan, Vite akan menampilkan alamat lokal frontend pada terminal.

Buka alamat tersebut melalui browser untuk mengakses aplikasi.

## 8. Konfigurasi Database dan Environment

Berikut adalah daftar environment variable yang digunakan oleh backend:

| Variabel | Keterangan |
|---|---|
| `DJANGO_SECRET_KEY` | Secret key aplikasi Django |
| `DJANGO_DEBUG` | Mengatur mode debug Django |
| `DJANGO_ALLOWED_HOSTS` | Daftar host yang diizinkan |
| `DB_NAME` | Nama database MySQL |
| `DB_USER` | Username database |
| `DB_PASSWORD` | Password database |
| `DB_HOST` | Host server database |
| `DB_PORT` | Port server database |

## 9. Catatan Penggunaan

1. Backend Django dan frontend React harus dijalankan secara terpisah.
2. Pastikan MySQL Server aktif sebelum menjalankan backend.
3. File `.env` harus dibuat dan dikonfigurasi secara lokal.
4. Folder `node_modules`, virtual environment, hasil build, dan file media tidak disertakan dalam repository.
5. Sesuaikan konfigurasi koneksi API frontend dengan alamat backend yang digunakan.
6. Untuk penggunaan pada server produksi, sesuaikan konfigurasi keamanan dan deployment dengan lingkungan perusahaan.

## 10. Repository

Source code aplikasi dapat diakses melalui repository GitHub berikut:

https://github.com/joecyz/job_rc

---

**Dikembangkan untuk:**

**PT Bintang Sayap Utama**

BSU Recruitment Website  
Sistem Informasi Rekrutmen Karyawan
