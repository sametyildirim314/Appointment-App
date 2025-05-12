import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    selectedServices: [],
    notes: ''
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState('');

  const services = [
    { id: 1, name: 'Saç Kesimi', price: 50 },
    { id: 2, name: 'Saç Boyama', price: 100 },
    { id: 3, name: 'Manikür', price: 30 },
    { id: 4, name: 'Pedikür', price: 40 }
  ];

  const handleServiceChange = (service) => {
    const updated = formData.selectedServices.includes(service.id)
      ? formData.selectedServices.filter(id => id !== service.id)
      : [...formData.selectedServices, service.id];
    setFormData({ ...formData, selectedServices: updated });
    calculateTotalPrice(updated);
  };

  const calculateTotalPrice = (selected) => {
    const total = selected.reduce((sum, id) => {
      const service = services.find(s => s.id === id);
      return sum + (service?.price || 0);
    }, 0);
    setTotalPrice(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/appointments', formData);
      setMessage('✅ Randevunuz başarıyla oluşturuldu!');
      setFormData({
        name: '',
        phone: '',
        date: '',
        time: '',
        selectedServices: [],
        notes: ''
      });
      setTotalPrice(0);
    } catch {
      setMessage('❌ Randevu oluşturulamadı.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] p-8 md:p-12 lg:p-16 border border-slate-200 flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Randevu Al
          </h1>
        </div>

        {message && (
          <div className={`text-center mb-8 text-lg font-semibold ${
            message.startsWith('✅') 
              ? 'text-emerald-600 bg-emerald-50 border border-emerald-200' 
              : 'text-rose-600 bg-rose-50 border border-rose-200'
          } p-4 rounded-2xl w-full transform transition-all duration-300 hover:scale-[1.02]`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">İsim</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Telefon</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tarih</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Saat</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Hizmetler</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map(service => (
                <label 
                  key={service.id} 
                  className={`service-card ${
                    formData.selectedServices.includes(service.id)
                      ? 'service-card-selected'
                      : 'service-card-default'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedServices.includes(service.id)}
                    onChange={() => handleServiceChange(service)}
                    className="service-checkbox"
                  />
                  <span className="service-text">
                    {service.name} 
                    <span className="service-price">
                      {service.price} TL
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notlar</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              className="form-input"
              placeholder="Eklemek istediğiniz bir not var mı?"
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mt-8 gap-4 pt-6 border-t border-slate-200">
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Toplam Fiyat: {totalPrice} TL
            </span>
            <button
              type="submit"
              className="submit-button"
            >
              Randevu Al
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .form-group {
          @apply group;
        }
        
        .form-label {
          @apply block text-slate-700 font-semibold mb-2 text-lg group-hover:text-slate-800 transition-colors;
        }
        
        .form-input {
          @apply w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 text-lg bg-white/50 shadow-sm hover:shadow-md transition-all duration-300;
        }
        
        .service-card {
          @apply flex items-center gap-4 bg-white/50 rounded-xl px-5 py-4 cursor-pointer transition-all duration-300 border;
        }
        
        .service-card-default {
          @apply border-slate-200 hover:border-slate-300 hover:bg-slate-50/50;
        }
        
        .service-card-selected {
          @apply border-slate-500 bg-slate-50 shadow-md scale-[1.02];
        }
        
        .service-checkbox {
          @apply accent-slate-600 w-5 h-5;
        }
        
        .service-text {
          @apply text-slate-800 text-lg;
        }
        
        .service-price {
          @apply text-slate-600 font-semibold ml-2;
        }
        
        .submit-button {
          @apply w-full md:w-auto bg-gradient-to-r from-slate-800 to-slate-600 hover:from-slate-900 hover:to-slate-700 text-white px-12 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-bold transform hover:scale-[1.02] active:scale-[0.98];
        }
      `}</style>
    </div>
  );
};

export default Home;
