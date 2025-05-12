import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Admin() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

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
      setError('Randevular yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Yanlış şifre!');
    }
  };

  const handleDelete = async (id) => {
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

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="admin-login">
          <h1>Admin Girişi</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Şifre:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit">Giriş Yap</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="admin-header">
        <h1>Admin Paneli</h1>
        <button onClick={() => navigate('/')} className="back-button">
          Ana Sayfaya Dön
        </button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Toplam Randevu</h3>
          <p>{appointments.length}</p>
        </div>
        <div className="stat-card">
          <h3>Bugünkü Randevular</h3>
          <p>{appointments.filter(apt => new Date(apt.date).toDateString() === new Date().toDateString()).length}</p>
        </div>
      </div>

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
              <div className="admin-card-header">
                <div>
                  <p><strong>Müşteri:</strong> {appointment.name}</p>
                  <p><strong>Telefon:</strong> {appointment.phone}</p>
                  <p><strong>Hizmet:</strong> {appointment.service}</p>
                  <p><strong>Tarih:</strong> {new Date(appointment.date).toLocaleDateString('tr-TR')}</p>
                  <p><strong>Saat:</strong> {appointment.time}</p>
                  {appointment.notes && <p><strong>Notlar:</strong> {appointment.notes}</p>}
                </div>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(appointment._id)}
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin; 