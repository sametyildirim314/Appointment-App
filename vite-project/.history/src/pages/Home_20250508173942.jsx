import { useState } from 'react';
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
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone: ''
  });
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    selectedServices: [],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        username: formData.username,
        password: formData.password
      });
      setUser(response.data);
      setError('');
      // Fetch appointments after successful login
      const appointmentsResponse = await axios.get(`http://localhost:5001/api/appointments/user/${response.data.id}`);
      setAppointments(appointmentsResponse.data);
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
      const response = await axios.post('http://localhost:5001/api/auth/register', formData);
      setUser(response.data);
      setError('');
      setIsLogin(true);
    } catch (error) {
      setError(error.response?.data?.error || 'Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAppointments([]);
    setFormData({ username: '', password: '', phone: '' });
  };

  const handleServiceChange = (service) => {
    setAppointmentData(prev => {
      const isSelected = prev.selectedServices.some(s => s.id === service.id);
      const updatedServices = isSelected
        ? prev.selectedServices.filter(s => s.id !== service.id)
        : [...prev.selectedServices, service];
      
      const totalPrice = updatedServices.reduce((sum, s) => sum + s.price, 0);
      
      return {
        ...prev,
        selectedServices: updatedServices,
        totalPrice
      };
    });
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5001/api/appointments', {
        ...appointmentData,
        userId: user.id
      });
      
      setAppointments([...appointments, response.data]);
      setSuccessMessage('Randevunuz başarıyla oluşturuldu!');
      setAppointmentData({
        date: '',
        time: '',
        selectedServices: [],
        notes: ''
      });
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Randevu oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5001/api/appointments/${selectedAppointment.id}`);
      setAppointments(appointments.filter(apt => apt.id !== selectedAppointment.id));
      setShowCancelModal(false);
      setSelectedAppointment(null);
      setSuccessMessage('Randevu başarıyla iptal edildi!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Randevu iptal edilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="user-login">
          <h2>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            <div className="form-group">
              <label>Kullanıcı Adı:</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                minLength={3}
                maxLength={20}
                placeholder="Kullanıcı adınızı giriniz"
              />
            </div>
            <div className="form-group">
              <label>Şifre:</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                placeholder="Şifrenizi giriniz"
              />
            </div>
            {!isLogin && (
              <div className="form-group">
                <label>Telefon:</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  pattern="[0-9]{10}"
                  title="Lütfen 10 haneli telefon numaranızı giriniz"
                  placeholder="5XX XXX XX XX"
                />
              </div>
            )}
            <button type="submit" disabled={loading}>
              {loading ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
            </button>
          </form>
          <button 
            className="switch-form-button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ username: '', password: '', phone: '' });
            }}
          >
            {isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {showCancelModal && selectedAppointment && (
        <div className="modal">
          <div className="modal-content">
            <h3>Randevu İptali</h3>
            <p>Bu randevuyu iptal etmek istediğinizden emin misiniz?</p>
            <p>Tarih: {selectedAppointment.date}</p>
            <p>Saat: {selectedAppointment.time}</p>
            <div className="modal-buttons">
              <button onClick={handleCancelAppointment} disabled={loading}>
                {loading ? 'İptal Ediliyor...' : 'Evet, İptal Et'}
              </button>
              <button onClick={() => {
                setShowCancelModal(false);
                setSelectedAppointment(null);
              }}>
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="user-header">
        <h2>Hoş geldiniz, {user.username}!</h2>
        <button className="logout-button" onClick={handleLogout}>Çıkış Yap</button>
      </div>

      <div className="appointment-form">
        <h2>Randevu Oluştur</h2>
        <form onSubmit={handleAppointmentSubmit}>
          <div className="form-group">
            <label>Tarih:</label>
            <input
              type="date"
              value={appointmentData.date}
              onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group">
            <label>Saat:</label>
            <select
              value={appointmentData.time}
              onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
              required
            >
              <option value="">Saat seçiniz</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
            </select>
          </div>
          <div className="form-group">
            <label>Hizmetler:</label>
            <div className="services-grid">
              {SERVICES.map((service) => (
                <div key={service.id} className="service-item">
                  <input
                    type="checkbox"
                    id={`service-${service.id}`}
                    checked={appointmentData.selectedServices.some(s => s.id === service.id)}
                    onChange={() => handleServiceChange(service)}
                  />
                  <label htmlFor={`service-${service.id}`}>
                    {service.name} - {service.price} TL
                  </label>
                </div>
              ))}
            </div>
            {appointmentData.totalPrice > 0 && (
              <div className="total-price">
                Toplam: {appointmentData.totalPrice} TL
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Notlar:</label>
            <textarea
              value={appointmentData.notes}
              onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
              placeholder="Eklemek istediğiniz notlar..."
            />
          </div>
          <button type="submit" disabled={loading || appointmentData.selectedServices.length === 0}>
            {loading ? 'İşleniyor...' : 'Randevu Oluştur'}
          </button>
        </form>
      </div>

      <div className="appointments-list">
        <h2>Randevularım</h2>
        {appointments.length === 0 ? (
          <p>Randevu bulunmamaktadır.</p>
        ) : (
          <div className="appointments-grid">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <h3>{new Date(appointment.date).toLocaleDateString('tr-TR')}</h3>
                  <span className="appointment-time">{appointment.time}</span>
                </div>
                <div className="appointment-services">
                  <h4>Seçilen Hizmetler:</h4>
                  <ul>
                    {appointment.selectedServices.map((service) => (
                      <li key={service.id}>
                        {service.name} - {service.price} TL
                      </li>
                    ))}
                  </ul>
                </div>
                {appointment.notes && (
                  <div className="appointment-notes">
                    <h4>Notlar:</h4>
                    <p>{appointment.notes}</p>
                  </div>
                )}
                <div className="appointment-total">
                  Toplam: {appointment.selectedServices.reduce((sum, s) => sum + s.price, 0)} TL
                </div>
                {new Date(appointment.date) > new Date() && (
                  <button
                    className="cancel-button"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setShowCancelModal(true);
                    }}
                  >
                    İptal Et
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home; 