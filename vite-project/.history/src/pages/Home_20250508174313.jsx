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
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    selectedServices: [],
    notes: '',
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      await axios.post('http://localhost:5001/api/appointments', appointmentData);
      
      setSuccessMessage('Randevunuz başarıyla oluşturuldu!');
      setAppointmentData({
        date: '',
        time: '',
        selectedServices: [],
        notes: '',
        name: '',
        phone: ''
      });
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Randevu oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="appointment-form">
        <h2>Randevu Oluştur</h2>
        <form onSubmit={handleAppointmentSubmit}>
          <div className="form-group">
            <label>Ad Soyad:</label>
            <input
              type="text"
              value={appointmentData.name}
              onChange={(e) => setAppointmentData({ ...appointmentData, name: e.target.value })}
              required
              placeholder="Adınızı ve soyadınızı giriniz"
            />
          </div>
          <div className="form-group">
            <label>Telefon:</label>
            <input
              type="tel"
              value={appointmentData.phone}
              onChange={(e) => setAppointmentData({ ...appointmentData, phone: e.target.value })}
              required
              placeholder="5XX XXX XX XX"
              pattern="[0-9]{10}"
              title="Lütfen 10 haneli telefon numaranızı giriniz"
            />
          </div>
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
    </div>
  );
}

export default Home; 