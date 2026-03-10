# Todo App Deployment Guides

## 1. Menjalankan di Lokal (Development Mode)

1. Pastikan Anda punya **Node.js** (v18+) terinstall di komputer.
2. Install semua dependency (npm, pnpm, atau yarn):
   ```bash
   npm install
   ```
3. Setup PostgreSQL lokal. Jika menggunakan Docker untuk DB lokal:
   ```bash
   docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
   ```
4. Copy `.env.example` ke `.env` (atau edit file `.env` yang sudah ada) dan set `DATABASE_URL`:
   ```bash
   DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres?schema=public"
   ```
5. Sinkronisasi skema database ke PostgreSQL:
   ```bash
   npx prisma db push
   ```
   *(Untuk project production, sangat disarankan menggunakan `npx prisma migrate dev` alih-alih `db push`)*
6. Jalankan development server:
   ```bash
   npm run dev
   ```
7. Buka browser di [http://localhost:3000](http://localhost:3000)


## 2. Deploy Manual ke VPS (Memakai PM2 & Nginx)

Cara ini adalah cara paling umum digunakan untuk men-deploy aplikasi Node.js di server Linux Ubuntu.

### A. Persiapan VPS
1. SSH ke VPS Anda: `ssh root@ip-vps`
2. Update OS dan install Node.js, Nginx, PostgreSQL
   ```bash
   sudo apt update
   sudo apt install -y curl dirmngr apt-transport-https lsb-release ca-certificates
   curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs nginx postgresql postgresql-contrib
   ```
3. Install **PM2** (Process Manager) secara global
   ```bash
   sudo npm install -g pm2
   ```

### B. Setup Database PostgreSQL
1. Masuk ke prompt Postgres:
   ```bash
   sudo -u postgres psql
   ```
2. Buat database dan user baru:
   ```sql
   CREATE DATABASE todo_db;
   CREATE USER todo_user WITH ENCRYPTED PASSWORD 'rahasia123';
   GRANT ALL PRIVILEGES ON DATABASE todo_db TO todo_user;
   ALTER DATABASE todo_db OWNER TO todo_user;
   \q
   ```

### C. Setup Aplikasi
1. Clone / Copy file project ini ke VPS, misalnya ke `/var/www/to-do-list`.
2. Masuk ke folder tersebut dan install dependency:
   ```bash
   cd /var/www/to-do-list
   npm install
   ```
3. Setup file `.env`:
   ```bash
   nano .env
   ```
   Isi dengan: `DATABASE_URL="postgresql://todo_user:rahasia123@localhost:5432/todo_db?schema=public"`
4. Lakukan migrasi database dan build project:
   ```bash
   npx prisma db push
   npx prisma generate
   npm run build
   ```
5. Jalankan aplikasi dengan PM2:
   ```bash
   pm2 start npm --name "todo-app" -- start
   pm2 startup
   pm2 save
   ```
   *Aplikasi Next.js sekarang berjalan di localhost:3000 pada mesin VPS.*

### D. Setup Reverse Proxy Nginx
1. Buat file konfigurasi Nginx baru:
   ```bash
   sudo nano /etc/nginx/sites-available/todo-app
   ```
2. Isikan konfigurasi reverse proxy:
   ```nginx
   server {
       listen 80;
       server_name domain-anda.com www.domain-anda.com; # Ganti dengan Domain atau IP Web Anda

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
3. Aktifkan konfigurasi Nginx dan restart:
   ```bash
   sudo ln -s /etc/nginx/sites-available/todo-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```
4. (Opsional) Install SSL / HTTPS menggunakan Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d domain-anda.com -d www.domain-anda.com
   ```


## 3. Deploy Menggunakan Docker

Bagi yang lebih suka environment yang terisolasi, Deploy via Docker Compose adalah cara moderen.

1. SSH ke VPS dan pastikan Docker & Docker Compose sudah ter-install.
2. Clone repository ini.
3. Edit credentials di dalam `docker-compose.yml` (seperti environment db password) atau masukkan ke variabel `.env`.
4. Jalankan perintah docker compose:
   ```bash
   docker compose up -d --build
   ```
5. Lakukan migrasi DB ke container yang sedang berjalan:
   ```bash
   docker compose exec app npx prisma db push
   ```
6. Setup Nginx Reverse Proxy (seperti panduan Nginx di atas) mengarah ke port bebas pada host, misalnya port 3000 (sesuai setting `"3000:3000"` di `docker-compose.yml`).
