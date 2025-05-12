import { useState } from 'react';
import axios from 'axios';
import '../App.css';

const SERVICES = [
  { id: 1, name: 'Saç Kesimi', price: 100 },
  { id: 2, name: 'Saç Boyama', price: 200 },
  { id: 3, name: 'Saç Bakımı', price: 150 },
  { id: 4, name: 'Manikür', price: 80 },
  { id: 5, name: 'Pedikür', price: 80 },
  { id: 6, name: 'Cilt Bakımı', price: 250 },
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
  const [success, setSuccess] = useState('');

  const handleServiceChange = (serviceId) => {
    setAppointmentData(prevData => {
      const currentServices = [...prevData.selectedServices];
      const serviceIndex = currentServices.indexOf(serviceId);
      
      if (serviceIndex === -1) {
        currentServices.push(serviceId);
      } else {
        currentServices.splice(serviceIndex, 1);
      }
      
      return {
        ...prevData,
        selectedServices: currentServices
      };
    });
  };

  const calculateTotalPrice = () => {
    return appointmentData.selectedServices.reduce((total, serviceId) => {
      const service = SERVICES.find(s => s.id === serviceId);
      return total + (service ? service.price : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3001/api/appointments', {
        ...appointmentData,
        totalPrice: calculateTotalPrice()
      });

      setSuccess('Randevunuz başarıyla oluşturuldu!');
      setAppointmentData({
        date: '',
        time: '',
        selectedServices: [],
        notes: '',
        name: '',
        phone: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Randevu oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Randevu Oluştur</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label htmlFor="name">Ad Soyad:</label>
          <input
            type="text"
            id="name"
            value={appointmentData.name}
            onChange={(e) => setAppointmentData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Telefon:</label>
          <input
            type="tel"
            id="phone"
            value={appointmentData.phone}
            onChange={(e) => setAppointmentData(prev => ({ ...prev, phone: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Tarih:</label>
          <input
            type="date"
            id="date"
            value={appointmentData.date}
            onChange={(e) => setAppointmentData(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Saat:</label>
          <select
            id="time"
            value={appointmentData.time}
            onChange={(e) => setAppointmentData(prev => ({ ...prev, time: e.target.value }))}
            required
          >
            <option value="">Saat Seçin</option>
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
                  checked={appointmentData.selectedServices.includes(service.id)}
                  onChange={() => handleServiceChange(service.id)}
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  htmlFor={`service-${service.id}`}
                  style={{ cursor: 'pointer' }}
                >
                  {service.name} - {service.price} TL
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notlar:</label>
          <textarea
            id="notes"
            value={appointmentData.notes}
            onChange={(e) => setAppointmentData(prev => ({ ...prev, notes: e.target.value }))}
          />
        </div>

        {appointmentData.selectedServices.length > 0 && (
          <div className="total-price">
            Toplam Tutar: {calculateTotalPrice()} TL
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Gönderiliyor...' : 'Randevu Oluştur'}
        </button>
      </form>
    </div>
  );
}

export default Home; 