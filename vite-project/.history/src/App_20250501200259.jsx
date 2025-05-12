import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [appointments, setAppointments] = useState([]);
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/appointments');
      setAppointments(response.data);
      setError('');
    } catch (error) {
      console.error('Randevular yüklenirken hata oluştu:', error);
      setError('Randevular yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

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
        fetchAppointments();
        setError('');
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

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // Basit bir admin kontrolü (gerçek uygulamada daha güvenli bir yöntem kullanılmalı)
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      setError('Yanlış şifre!');
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm('Bu randevuyu silmek istediğinizden emin misiniz?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5001/api/appointments/${id}`);
        fetchAppointments();
      } catch (error) {
        console.error('Randevu silinirken hata oluştu:', error);
        setError('Randevu silinirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container">
      <h1>Kuaför Randevu Sistemi</h1>
      
      {!isAdmin && (
        <button 
          onClick={() => setShowAdminLogin(true)}
          style={{ marginBottom: '2rem', width: 'auto' }}
        >
          Admin Girişi
        </button>
      )}

      {showAdminLogin && !isAdmin && (
        <div className="admin-panel">
          <h2>Admin Girişi</h2>
          <form onSubmit={handleAdminLogin}>
            <div className="form-group">
              <label>Şifre:</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Giriş Yap</button>
          </form>
        </div>
      )}

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

        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

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

      <div className="appointments-list">
        <h2>Randevular</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <span className="loading-spinner"></span> Yükleniyor...
          </div>
        ) : appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Henüz randevu bulunmamaktadır.</div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="admin-header">
                <div>
                  <p><strong>Müşteri:</strong> {appointment.name}</p>
                  <p><strong>Telefon:</strong> {appointment.phone}</p>
                  <p><strong>Hizmet:</strong> {appointment.service}</p>
                  <p><strong>Tarih:</strong> {new Date(appointment.date).toLocaleDateString('tr-TR')}</p>
                  <p><strong>Saat:</strong> {appointment.time}</p>
                  {appointment.notes && <p><strong>Notlar:</strong> {appointment.notes}</p>}
                </div>
                {isAdmin && (
                  <div className="admin-actions">
                    <button 
                      className="admin-button delete-button"
                      onClick={() => handleDeleteAppointment(appointment._id)}
                    >
                      Sil
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
