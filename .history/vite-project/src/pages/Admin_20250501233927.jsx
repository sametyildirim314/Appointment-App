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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');
  const navigate = useNavigate();

  // Oturum kontrolü
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem('isAdminAuthenticated') === 'true';
      setIsAuthenticated(isAuth);
      if (isAuth) {
        fetchAppointments();
      }
    };
    checkAuth();
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
      localStorage.setItem('isAdminAuthenticated', 'true');
      setError('');
      fetchAppointments();
    } else {
      setError('Yanlış şifre!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdminAuthenticated');
    setAppointments([]);
    setPassword('');
  };

  const handleDeleteClick = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5001/api/appointments/${appointmentToDelete._id}`);
      fetchAppointments();
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

  const handleUpdateOldAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.put('http://localhost:5001/api/appointments/update-old');
      setUpdateMessage(`Eski randevular güncellendi. ${response.data.updatedCount} randevu güncellendi.`);
      fetchAppointments();
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (error) {
      console.error('Randevuları güncelleme hatası:', error);
      setError('Randevuları güncellerken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment =>
    !searchTerm || searchTerm === 'Randevu ara' ||
    appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Randevuyu Sil</h3>
            <p>Bu randevuyu silmek istediğinizden emin misiniz?</p>
            <div className="modal-content">
              <p><strong>Müşteri:</strong> {appointmentToDelete?.name}</p>
              <p><strong>Tarih:</strong> {new Date(appointmentToDelete?.date).toLocaleDateString('tr-TR')}</p>
              <p><strong>Saat:</strong> {appointmentToDelete?.time}</p>
              <p><strong>Hizmet:</strong> {appointmentToDelete?.service}</p>
            </div>
            <div className="modal-actions">
              <button onClick={handleDeleteCancel} className="cancel-button">İptal</button>
              <button onClick={handleDeleteConfirm} className="confirm-button">Sil</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-header">
        <h1>Admin Paneli</h1><br>
        </br><p></p>

        <div className="admin-actions">
          <button onClick={handleLogout} className="logout-button">
            Çıkış Yap
          </button>
        </div>
      </div>

      {updateMessage && <div className="success-message">{updateMessage}</div>}
      {error && <div className="error-message">{error}</div>}

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

      <div className="search-container">
        <input
          type="text"
          placeholder="Randevu ara"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="appointments-list">
        <div>
           <h2>Randevular</h2>
        </div>
      
        {loading ? (
          <div className="loading-container">
            <span className="loading-spinner"></span> Yükleniyor...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            {searchTerm && searchTerm !== 'Randevu ara' ? 'Arama sonucu bulunamadı.' : 'Henüz randevu bulunmamaktadır.'}
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
              <div className="appointment-actions">
                <button
                  className="delete-button"
                  onClick={() => handleDeleteClick(appointment)}
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