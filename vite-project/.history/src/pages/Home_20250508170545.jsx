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
  const [phone, setPhone] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  // Oturum kontrolü
  useEffect(() => {
    const savedPhone = localStorage.getItem('userPhone');
    if (savedPhone) {
      setPhone(savedPhone);
      setIsLoggedIn(true);
      fetchUserAppointments(savedPhone);
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (phone.length === 10) {
      setIsLoggedIn(true);
      localStorage.setItem('userPhone', phone);
      fetchUserAppointments(phone);
    } else {
      setError('Lütfen geçerli bir telefon numarası girin (10 haneli)');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('userPhone');
    setAppointments([]);
    setPhone('');
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

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="user-login">
          <h1>Randevu Sistemi</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Telefon Numaranız:</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="5XX XXX XX XX"
                maxLength="10"
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
            <h3>Randevuyu İptal Et</h3>
            <p>Bu randevuyu iptal etmek istediğinizden emin misiniz?</p>
            <div className="modal-content">
              <p><strong>Tarih:</strong> {new Date(appointmentToDelete?.date).toLocaleDateString('tr-TR')}</p>
              <p><strong>Saat:</strong> {appointmentToDelete?.time}</p>
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    services: [],
    date: '',
    time: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleServiceChange = (serviceId) => {
    setFormData(prev => {
      const services = prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services };
    });
  };

  const calculateTotal = () => {
    return formData.services.reduce((total, serviceId) => {
      const service = SERVICES.find(s => s.id === serviceId);
      return total + (service ? service.price : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.services.length === 0) {
      setError('Lütfen en az bir hizmet seçiniz.');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5001/api/appointments', {
        ...formData,
        totalPrice: calculateTotal(),
        selectedServices: formData.services.map(id => {
          const service = SERVICES.find(s => s.id === id);
          return { id: service.id, name: service.name, price: service.price };
        })
      });
      if (response.status === 201) {
        setFormData({
          name: '',
          phone: '',
          services: [],
          date: '',
          time: '',
          notes: ''
        });
        setSuccessMessage('Randevunuz başarıyla oluşturuldu!');
        setError('');
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
          <label>Hizmetler:</label>
          <div className="services-grid">
            {SERVICES.map(service => (
              <div key={service.id} className="service-item">
                <input
                  type="checkbox"
                  id={`service-${service.id}`}
                  checked={formData.services.includes(service.id)}
                  onChange={() => handleServiceChange(service.id)}
                />
                <label htmlFor={`service-${service.id}`}>
                  {service.name} - {service.price} TL
                </label>
              </div>
            ))}
          </div>
          {formData.services.length > 0 && (
            <div className="total-price-section">
              <h3>Toplam Fiyat</h3>
              <div className="total-price-amount">
                {calculateTotal()} TL
              </div>
            </div>
          )}
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