import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Appointments.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  // Sayfa yüklendiğinde localStorage'dan randevuları al
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/');
    }

    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, [navigate]);

  // Randevular değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleAddAppointment = (e) => {
    e.preventDefault();
    if (date && time) {
      const newAppointment = {
        id: Date.now(),
        date,
        time,
        description: description || 'Açıklama yok',
      };
      setAppointments([...appointments, newAppointment]);
      setDate('');
      setTime('');
      setDescription('');
    }
  };

  const handleCancelAppointment = (id) => {
    setAppointments(appointments.filter(appointment => appointment.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <h2>Randevu Yönetimi</h2>
        <button onClick={handleLogout} className="logout-button">Çıkış Yap</button>
      </div>

      <div className="appointments-content">
        <div className="appointment-form">
          <h3>Yeni Randevu Ekle</h3>
          <form onSubmit={handleAddAppointment}>
            <div className="form-group">
              <label htmlFor="date">Tarih <span className="required">*</span></label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="time">Saat <span className="required">*</span></label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Açıklama</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="İsteğe bağlı açıklama ekleyebilirsiniz"
              />
            </div>
            <button type="submit">Randevu Ekle</button>
          </form>
        </div>

        <div className="appointments-list">
          <h3>Randevularım</h3>
          {appointments.length === 0 ? (
            <p>Henüz randevunuz bulunmamaktadır.</p>
          ) : (
            <ul>
              {appointments.map((appointment) => (
                <li key={appointment.id} className="appointment-item">
                  <div className="appointment-details">
                    <p><strong>Tarih:</strong> {appointment.date}</p>
                    <p><strong>Saat:</strong> {appointment.time}</p>
                    <p><strong>Açıklama:</strong> {appointment.description}</p>
                  </div>
                  <button
                    onClick={() => handleCancelAppointment(appointment.id)}
                    className="cancel-button"
                  >
                    İptal Et
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments; 