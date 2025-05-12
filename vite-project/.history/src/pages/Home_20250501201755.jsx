import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

function Home() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5001/api/appointments', formData);
      if (response.status === 201) {
        setFormData({
          name: '',
          phone: '',
          service: '',
          date: '',
          time: '',
          notes: ''
        });
        setSuccessMessage('Randevunuz başarıyla oluşturuldu!');
        setError('');
        // 3 saniye sonra başarı mesajını kaldır
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Randevu oluşturulurken hata oluştu:', error);
      setError('Randevu oluşturulurken bir hata oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Kuaför Randevu Sistemi</h1>
        <Link to="/admin" className="admin-link">Admin Paneli</Link>
      </div>
      
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label>Ad Soyad:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Adınız ve soyadınız"
            required
          />
        </div>

        <div className="form-group">
          <label>Telefon:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Telefon numaranız"
            required
          />
        </div>

        <div className="form-group">
          <label>Hizmet:</label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
          >
            <option value="">Hizmet seçiniz</option>
            <option value="Saç Kesimi">Saç Kesimi</option>
            <option value="Saç Boyama">Saç Boyama</option>
            <option value="Saç Bakımı">Saç Bakımı</option>
            <option value="Sakal Tıraşı">Sakal Tıraşı</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tarih:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Saat:</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Notlar:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Eklemek istediğiniz notlar (opsiyonel)"
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span> İşleniyor...
            </>
          ) : (
            'Randevu Oluştur'
          )}
        </button>
      </form>

      <div className="info-section">
        <h2>Randevu Bilgileri</h2>
        <p>Randevunuzu oluşturduktan sonra, randevu bilgileriniz sadece admin tarafından görüntülenebilir.</p>
        <p>Randevunuzu iptal etmek veya değiştirmek için lütfen bizimle iletişime geçin.</p>
        <div className="contact-info">
          <p><strong>Telefon:</strong> 0212 123 45 67</p>
          <p><strong>E-posta:</strong> info@kuaforsalonu.com</p>
        </div>
      </div>
    </div>
  );
}

export default Home; 