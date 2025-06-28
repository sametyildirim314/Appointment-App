# 💇‍♀️ Appointment App

## 📌 Proje Özeti

Bu proje, kuaför salonlarının **çevrim içi randevu süreçlerini kolayca yönetebilmesi** için tasarlanmış, güvenli ve ölçeklenebilir bir web tabanlı randevu sistemidir.  
Müşteriler kolayca randevu oluşturabilir, işletme ise **admin paneli** üzerinden randevuları görüntüleyebilir, silebilir ve güncelleyebilir.

Veri saklama ve erişim işlemleri için **AWS DynamoDB** kullanılmakta olup sistem, yüksek performanslı bir RESTful mimariye sahiptir.

---

## 🧪 Kullanılan Teknolojiler ve Araçlar

| Katman         | Teknoloji / Araçlar                                 |
|----------------|------------------------------------------------------|
| Frontend       | React.js (Hooks, React Router, Axios)               |
| Backend        | Node.js, Express.js                                 |
| Veritabanı     | AWS DynamoDB (NoSQL)                                |
| Kimlik Doğrulama | Basit şifre tabanlı admin girişi                   |
| Diğer          | CORS, dotenv, bcrypt (şifre hashleme)               |

---

## 🧱 Mimari ve Sistem Tasarımı

### 🔄 3.1 Genel Mimari

- **Frontend**: Kullanıcı arayüzü ve admin paneli sağlar.
- **Backend**: RESTful API ile veri işleme, kullanıcı işlemleri ve kimlik doğrulama sağlar.
- **DynamoDB**: Randevu ve kullanıcı verilerini saklar.
- **Admin Paneli**: Randevu listeleme, filtreleme, silme ve güncelleme işlemleri sunar.

### 📋 3.2 Veri Yapısı

#### Randevu Nesnesi (`Appointment`)

| Alan             | Tip       | Açıklama                             |
|------------------|-----------|--------------------------------------|
| `id`             | string    | Timestamp tabanlı benzersiz ID       |
| `name`           | string    | Müşteri adı                          |
| `phone`          | string    | Telefon numarası                     |
| `selectedServices` | array   | Seçilen hizmetlerin ID listesi       |
| `totalPrice`     | number    | Toplam ücret                         |
| `date`           | string    | Randevu tarihi (ISO 8601)            |
| `time`           | string    | Randevu saati                        |
| `notes`          | string    | Opsiyonel müşteri notları            |

---

## 🌐 API Detayları

### 👤 4.1 Kullanıcı API'leri

#### POST `/api/register`
- Yeni kullanıcı kaydı oluşturur.
- **Body**:
```json
{ "username": "ali", "password": "123456", "phone": "5551234567" }

