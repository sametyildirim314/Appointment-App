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
  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    services: [],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (id) => {
    setForm(prev => {
      const selected = prev.services.includes(id)
        ? prev.services.filter(sid => sid !== id)
        : [...prev.services, id];
      return { ...prev, services: selected };
    });
  };

  const totalPrice = form.services.reduce((sum, id) => {
    const s = SERVICES.find(s => s.id === id);
    return sum + (s ? s.price : 0);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:3001/api/appointments', {
        ...form,
        totalPrice
      });
      setSuccess('Randevunuz başarıyla oluşturuldu!');
      setForm({ name: '', phone: '', date: '', time: '', services: [], notes: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Randevu Oluştur</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form className="appointment-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Ad Soyad:</label>
          <input name="name" id="name" type="text" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Telefon:</label>
          <input name="phone" id="phone" type="tel" value={form.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="date">Tarih:</label>
          <input name="date" id="date" type="date" value={form.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="time">Saat:</label>
          <select name="time" id="time" value={form.time} onChange={handleChange} required>
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
            {SERVICES.map(service => (
              <div key={service.id} className="service-item">
                <input
                  type="checkbox"
                  id={`service-${service.id}`}
                  checked={form.services.includes(service.id)}
                  onChange={() => handleServiceToggle(service.id)}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor={`service-${service.id}`} style={{ cursor: 'pointer' }}>
                  {service.name} - {service.price} TL
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notlar:</label>
          <textarea name="notes" id="notes" value={form.notes} onChange={handleChange} />
        </div>
        {form.services.length > 0 && (
          <div className="total-price">Toplam Tutar: {totalPrice} TL</div>
        )}
        <button type="submit" disabled={loading}>{loading ? 'Gönderiliyor...' : 'Randevu Oluştur'}</button>
      </form>
    </div>
  );
}

export default Home; 