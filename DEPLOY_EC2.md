# Panduan Deployment XyloAPI ke AWS EC2 (Ubuntu)

Dokumen ini berisi panduan lengkap untuk melakukan deploy XyloAPI ke server AWS EC2 Ubuntu dengan menggunakan **Nginx** sebagai reverse proxy (menggantikan Vercel Gateway) dan **PM2** untuk menjaga backend (Express & Python Scrapers) tetap berjalan di background.

---

## 1. Persiapan Server EC2 (Security Group)
Pastikan Security Group pada instance EC2 Anda mengizinkan lalu lintas masuk (*Inbound Rules*) untuk port berikut:
* **Port 80 (HTTP)**: Untuk akses public website.
* **Port 443 (HTTPS)**: Untuk SSL/HTTPS di kemudian hari.
* **Port 22 (SSH)**: Untuk masuk ke server.

---

## 2. Instalasi Dependency System
Lakukan SSH ke instance EC2 Anda, lalu jalankan perintah berikut untuk mengupdate sistem dan menginstal Node.js, Python 3, Git, Nginx, dan PM2:

```bash
# Update package list & system
sudo apt update && sudo apt upgrade -y

# Instal Nginx & Git
sudo apt install nginx git -y

# Instal Node.js (Version 20) & npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instal PM2 secara global
sudo npm install -g pm2

# Instal Python3, pip, dan virtualenv
sudo apt install python3 python3-pip python3-venv -y
```

---

## 3. Clone Repository & Setup Environment

```bash
# Pindah ke direktori web root
cd /var/www

# Clone repository Anda (sesuaikan URL repo)
sudo git clone <URL_REPOSITORY_ANDA> xyloapi
sudo chown -R $USER:$USER /var/www/xyloapi

cd /var/www/xyloapi
```

### Buat file `.env` untuk Backend
Buat file `/var/www/xyloapi/backend/.env` dan sesuaikan nilainya:

```bash
nano backend/.env
```

Isi file dengan:
```env
PORT=5000
DATABASE_URL=postgresql://neondb_owner:npg_mRy4P6sqXazB@ep-aged-cloud-aoicx4hw-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
IMGUR_CLIENT_ID=d70305e7c3ac5c6
IMGBB_API_KEY=8244b57e606a4d851484a6d011a979b8
PYTHON_PATH=/var/www/xyloapi/backend/scrapers/.venv/bin/python
```

---

## 4. Build & Install Dependencies

### A. Frontend (React / Vite)
```bash
cd /var/www/xyloapi/frontend
npm install
npm run build
```
*Hasil build static HTML/JS/CSS akan berada di `/var/www/xyloapi/frontend/dist`.*

### B. Backend (Express Node.js)
```bash
cd /var/www/xyloapi/backend
npm install
npm run build
```
*Ini akan mengompilasi TypeScript menjadi production JavaScript di `/var/www/xyloapi/backend/dist/index.js`.*

### C. Scrapers (Python)
```bash
cd /var/www/xyloapi/backend/scrapers
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
deactivate
```

---

## 5. Setup PM2 Process Manager
Untuk menjalankan backend Node.js dan Python WSGI secara bersamaan di background, buat file konfigurasi PM2:

```bash
cd /var/www/xyloapi
nano ecosystem.config.js
```

Isi dengan konfigurasi berikut:
```javascript
module.exports = {
  apps: [
    {
      name: "xyloapi-backend",
      script: "./backend/dist/index.js",
      cwd: "./backend",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    },
    {
      name: "xyloapi-scrapers",
      script: "./backend/scrapers/main.py",
      interpreter: "./backend/scrapers/.venv/bin/python",
      cwd: "./backend/scrapers",
      env: {
        PORT: 8000
      }
    }
  ]
};
```

Jalankan semua aplikasi menggunakan PM2 dan atur agar startup otomatis saat server reboot:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```
*(Jalankan perintah yang dihasilkan oleh `pm2 startup` di terminal Anda untuk menyelesaikan konfigurasi).*

---

## 6. Konfigurasi Nginx (Gateway Proxy)
Nginx akan bertindak seperti Gateway Vercel: mengarahkan port HTTP `80` untuk menyajikan Static Frontend, `/api/*` ke Express backend (port `5000`), dan `/_/scrapers/*` ke Python WSGI (port `8000`).

Buka file konfigurasi default Nginx:
```bash
sudo nano /etc/nginx/sites-available/default
```

Ganti seluruh isinya dengan konfigurasi berikut:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _; # Masukkan domain Anda di sini jika ada (contoh: api.xylo.com)

    # 1. Frontend Static files
    root /var/www/xyloapi/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 2. Proxy ke Express Backend (Port 5000)
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Supaya payload upload file besar tidak di-block oleh Nginx
        client_max_body_size 50M;
    }

    # 3. Proxy ke Python Scrapers (Port 8000)
    location /_/scrapers/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        client_max_body_size 50M;
    }
}
```

Uji konfigurasi Nginx dan restart servisnya:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 7. Verifikasi
Buka IP EC2 Publik Anda di browser (contoh: `http://54.255.xx.xx`). 
* Halaman utama website React Anda akan langsung muncul.
* Semua request API ke `/api/...` dan scraper di `/api/downloader/...` akan ter-route dengan benar dan berfungsi sempurna secara offline/online!
