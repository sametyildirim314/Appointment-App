import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

function Home() {
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
              <p><strong>Müşteri:</strong> {appointment.name}</p>
              <p><strong>Telefon:</strong> {appointment.phone}</p>
              <p><strong>Hizmet:</strong> {appointment.service}</p>
              <p><strong>Tarih:</strong> {new Date(appointment.date).toLocaleDateString('tr-TR')}</p>
              <p><strong>Saat:</strong> {appointment.time}</p>
              {appointment.notes && <p><strong>Notlar:</strong> {appointment.notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home; 