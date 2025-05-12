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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated]);

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

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.phone.includes(searchTerm) ||
                         appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || new Date(appointment.date).toDateString() === new Date(selectedDate).toDateString();
    return matchesSearch && matchesDate;
  });

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
                placeholder="Admin şifresini giriniz"
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
        <div className="admin-actions">
          <button onClick={() => navigate('/')} className="back-button">
            Ana Sayfaya Dön
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="logout-button">
            Çıkış Yap
          </button>
        </div>
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
        <div className="stat-card">
          <h3>Yarınki Randevular</h3>
          <p>{appointments.filter(apt => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return new Date(apt.date).toDateString() === tomorrow.toDateString();
          }).length}</p>
        </div>
      </div>

      <div className="admin-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Müşteri adı, telefon veya hizmet ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="date-filter">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {selectedDate && (
            <button onClick={() => setSelectedDate('')} className="clear-filter">
              Filtreyi Temizle
            </button>
          )}
        </div>
      </div>

      <div className="appointments-list">
        <h2>Randevular</h2>
        {loading ? (
          <div className="loading-container">
            <span className="loading-spinner"></span> Yükleniyor...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            {searchTerm || selectedDate ? 'Filtrelere uygun randevu bulunamadı.' : 'Henüz randevu bulunmamaktadır.'}
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-info">
                <div className="appointment-header">
                  <h3>{appointment.name}</h3>
                  <span className={`status-badge ${new Date(appointment.date) < new Date() ? 'past' : 'upcoming'}`}>
                    {new Date(appointment.date) < new Date() ? 'Geçmiş' : 'Yaklaşan'}
                  </span>
                </div>
                <div className="appointment-details">
                  <p><strong>Telefon:</strong> {appointment.phone}</p>
                  <p><strong>Hizmet:</strong> {appointment.service}</p>
                  <p><strong>Tarih:</strong> {new Date(appointment.date).toLocaleDateString('tr-TR')}</p>
                  <p><strong>Saat:</strong> {appointment.time}</p>
                  {appointment.notes && <p><strong>Notlar:</strong> {appointment.notes}</p>}
                </div>
              </div>
              <div className="appointment-actions">
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