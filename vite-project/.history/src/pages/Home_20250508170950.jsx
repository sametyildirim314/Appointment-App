import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const SERVICES = [
  { id: 1, name: 'Saç Kesimi', price: 400 },
  { id: 2, name: 'Saç Boyama', price: 600 },
  { id: 3, name: 'Saç Bakımı', price: 350 },
  { id: 4, name: 'Sakal Tıraşı', price: 100 },
  { id: 5, name: 'Saç Yıkama', price: 50 },
  { id: 6, name: 'Fön Çekme', price: 40 }
];

function Home() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [user, setUser] = useState(null);

  // Oturum kontrolü
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsLoggedIn(true);
      fetchUserAppointments(userData.phone);
    }
  }, []);

  const fetchUserAppointments = async (userPhone) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5001/api/appointments/phone/${userPhone}`);
      setAppointments(response.data);
      setError('');
    } catch (error) {
      console.error('Randevular yüklenirken hata oluştu:', error);
      setError('Randevular yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5001/api/login', {
        username: formData.username,
        password: formData.password
      });
      
      setUser(response.data);
      setIsLoggedIn(true);
      localStorage.setItem('user', JSON.stringify(response.data));
      fetchUserAppointments(response.data.phone);
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:5001/api/register', formData);
      setError('');
      setIsRegistering(false);
      setFormData({ ...formData, password: '' });
    } catch (error) {
      setError(error.response?.data?.error || 'Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    setAppointments([]);
    setFormData({ username: '', password: '', phone: '' });
    setUser(null);
  };

  const handleDeleteClick = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5001/api/appointments/${appointmentToDelete.id}`);
      setAppointments(appointments.filter(apt => apt.id !== appointmentToDelete.id));
      setShowDeleteModal(false);
      setAppointmentToDelete(null);
    } catch (error) {
      console.error('Randevu silinirken hata oluştu:', error);
      setError('Randevu silinirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setAppointmentToDelete(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="user-login">
          <h1>Randevu Sistemi</h1>
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            <div className="form-group">
              <label>Kullanıcı Adı:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Kullanıcı adınız"
              />
            </div>
            <div className="form-group">
              <label>Şifre:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Şifreniz"
              />
            </div>
            {isRegistering && (
              <div className="form-group">
                <label>Telefon:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="5XX XXX XX XX"
                  maxLength="10"
                />
              </div>
            )}
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'İşleniyor...' : (isRegistering ? 'Kayıt Ol' : 'Giriş Yap')}
            </button>
            <button
              type="button"
              className="switch-form-button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setFormData({ username: '', password: '', phone: '' });
              }}
            >
              {isRegistering ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Randevuyu İptal Et</h3>
            <p>Bu randevuyu iptal etmek istediğinizden emin misiniz?</p>
            <div className="modal-content">
              <p><strong>Tarih:</strong> {new Date(appointmentToDelete?.date).toLocaleDateString('tr-TR')}</p>
              <p><strong>Saat:</strong> {appointmentToDelete?.time}</p>
              <p><strong>Hizmetler:</strong> {appointmentToDelete?.selectedServices.join(', ')}</p>
            </div>
            <div className="modal-actions">
              <button onClick={handleDeleteCancel} className="cancel-button">İptal</button>
              <button onClick={handleDeleteConfirm} className="confirm-button">Randevuyu İptal Et</button>
            </div>
          </div>
        </div>
      )}

      <div className="user-header">
        <h1>Hoş Geldiniz, {user?.username}</h1>
        <div className="user-actions">
          <button onClick={handleLogout} className="logout-button">
            Çıkış Yap
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="appointments-list">
        {loading ? (
          <div className="loading-container">
            <span className="loading-spinner"></span> Yükleniyor...
          </div>
        ) : appointments.length === 0 ? (
          <div className="no-appointments">
            Henüz randevunuz bulunmamaktadır.
          </div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-info">
                <div className="appointment-header">
                  <h3>Randevu #{appointment.id.slice(-4)}</h3>
                  <span className={`status-badge ${new Date(appointment.date) < new Date() ? 'past' : 'upcoming'}`}>
                    {new Date(appointment.date) > new Date() ? 'Yaklaşan' : 'Geçmiş'}
                  </span>
                </div>
                <div className="appointment-details">
                  <div className="services-list">
                    <p><strong>Hizmetler:</strong></p>
                    <ul>
                      {appointment.selectedServices && appointment.selectedServices.map((service, index) => (
                        <li key={index}>
                          {service.name} - {service.price} TL
                        </li>
                      ))}
                    </ul>
                    {appointment.totalPrice && (
                      <p className="total-price">
                        <strong>Toplam:</strong> {appointment.totalPrice} TL
                      </p>
                    )}
                  </div>
                  <p><strong>Tarih:</strong> {new Date(appointment.date).toLocaleDateString('tr-TR')}</p>
                  <p><strong>Saat:</strong> {appointment.time}</p>
                  {appointment.notes && <p><strong>Notlar:</strong> {appointment.notes}</p>}
                </div>
              </div>
              {new Date(appointment.date) > new Date() && (
                <div className="appointment-actions">
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteClick(appointment)}
                  >
                    İptal Et
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home; 