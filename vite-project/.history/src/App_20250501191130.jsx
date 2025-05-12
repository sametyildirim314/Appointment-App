import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Randevular yüklenirken hata oluştu:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({
          name: '',
          phone: '',
          service: '',
          date: '',
          time: '',
          notes: ''
        });
        fetchAppointments();
      }
    } catch (error) {
      console.error('Randevu oluşturulurken hata oluştu:', error);
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
      <h1>Kuaför Randevu Sistemi</h1>
      
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label>Ad Soyad:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
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
            <option value="">Seçiniz</option>
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
          />
        </div>

        <button type="submit">Randevu Oluştur</button>
      </form>

      <div className="appointments-list">
        <h2>Randevular</h2>
        {appointments.map((appointment) => (
          <div key={appointment._id} className="appointment-card">
            <p><strong>Müşteri:</strong> {appointment.name}</p>
            <p><strong>Telefon:</strong> {appointment.phone}</p>
            <p><strong>Hizmet:</strong> {appointment.service}</p>
            <p><strong>Tarih:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>Saat:</strong> {appointment.time}</p>
            {appointment.notes && <p><strong>Notlar:</strong> {appointment.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
