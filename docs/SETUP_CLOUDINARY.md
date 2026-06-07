# Setup Cloudinary

## 1. Ambil Cloud Name, API Key, dan API Secret

1. Login ke Cloudinary.
2. Masuk ke **Dashboard**.
3. Cari bagian **Product Environment Credentials** atau **API Keys**.
4. Salin data berikut:

```env
CLOUDINARY_CLOUD_NAME= 
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Masukkan ke `.env.local`.

## 2. Folder upload

Default project ini memakai folder:

```env
CLOUDINARY_UPLOAD_FOLDER=untukmu
```

Kamu boleh ganti, misalnya:

```env
CLOUDINARY_UPLOAD_FOLDER=untuk-nona
```

## 3. Cara upload foto dari website

1. Jalankan website.
2. Buka `/admin`.
3. Login dengan `ADMIN_PASSWORD`.
4. Buka tab **Kenangan/Galeri**.
5. Pilih foto maksimal 5 MB.
6. Foto akan masuk ke Cloudinary.
7. URL foto otomatis tersimpan di form.
8. Klik **Simpan Kenangan**.

## Catatan foto

Website menampilkan foto Cloudinary dengan transformasi otomatis:

```text
f_auto,q_auto,w_1200
```

Artinya gambar akan lebih ringan saat tampil di halaman publik.
