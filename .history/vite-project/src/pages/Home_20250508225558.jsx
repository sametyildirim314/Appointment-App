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
    { id: 1, name: 'Saç Kesimi', price: 400 },
    { id: 2, name: 'Saç Boyama', price: 500 },
    { id: 3, name: 'Sakal Traşı', price: 100 },
    { id: 4, name: 'Saç Yıkama', price: 100 },
    { id: 5, name: 'Saç Bakımı', price: 300 }
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
      const appointmentData = {
        ...formData,
        totalPrice: totalPrice
      };
      await axios.post('http://localhost:5001/api/appointments', appointmentData);
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
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center py-10 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 flex flex-col relative z-10 overflow-hidden">
        {/* Window Header */}
        <div className="bg-white/5 border-b border-white/10 p-4 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 md:p-12 lg:p-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-gradient">
              Randevu Al
            </h1>
          </div>

          {message && (
            <div className={`text-center mb-8 text-lg font-semibold ${
              message.startsWith('✅') 
                ? 'text-emerald-400 bg-emerald-900/30 border border-emerald-500/50' 
                : 'text-rose-400 bg-rose-900/30 border border-rose-500/50'
            } p-4 rounded-2xl w-full transform transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm`}>
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
              <div className="services-table-container">
                <table className="services-table">
                  <thead>
                    <tr>
                      <th className="th-checkbox">Seçim</th>
                      <th className="th-service">Hizmet</th>
                      <th className="th-price">Fiyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map(service => (
                      <tr key={service.id} className={`service-row ${
                        formData.selectedServices.includes(service.id)
                          ? 'service-row-selected'
                          : 'service-row-default'
                      }`}>
                        <td className="td-checkbox">
                          <div className="service-checkbox-wrapper">
                            <input
                              type="checkbox"
                              checked={formData.selectedServices.includes(service.id)}
                              onChange={() => handleServiceChange(service)}
                              className="service-checkbox"
                            />
                            <div className="service-checkbox-indicator"></div>
                          </div>
                        </td>
                        <td className="td-service">
                          <span className="service-text">
                            {service.name}
                          </span>
                        </td>
                        <td className="td-price">
                          <span className="service-price">
                            {service.price} TL
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="total-price-container">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                  Toplam Fiyat: {totalPrice} TL
                </span>
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

            <div className="flex justify-center mt-8 pt-6 border-t border-white/10">
              <button
                type="submit"
                className="submit-button"
              >
                Randevu Al
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .form-group {
          @apply group;
        }
        
        .form-label {
          @apply block text-white/90 font-semibold mb-2 text-lg group-hover:text-white transition-colors;
        }
        
        .form-input {
          @apply w-full px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-lg bg-white/5 text-white placeholder-white/50 shadow-lg hover:shadow-xl transition-all duration-300;
        }
        
        .services-table-container {
          @apply overflow-hidden rounded-2xl border border-white/10 backdrop-blur-sm bg-white/5 shadow-xl;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .services-table {
          @apply w-full border-collapse;
        }
        
        .services-table thead {
          @apply bg-gradient-to-r from-purple-500/10 to-blue-500/10;
        }
        
        .services-table th {
          @apply px-8 py-5 text-left text-sm font-semibold text-white/80 uppercase tracking-wider;
          letter-spacing: 0.05em;
        }
        
        .th-checkbox {
          @apply w-20 text-center;
        }
        
        .th-service {
          @apply w-1/2;
        }
        
        .th-price {
          @apply w-1/4 text-right;
        }
        
        .services-table td {
          @apply px-8 py-5 text-sm;
        }
        
        .td-checkbox {
          @apply text-center;
        }
        
        .td-price {
          @apply text-right;
        }
        
        .service-row {
          @apply transition-all duration-300 border-b border-white/5 hover:bg-white/5;
          position: relative;
        }
        
        .service-row::after {
          content: '';
          @apply absolute inset-0 bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-pink-500/0 opacity-0 transition-opacity duration-300;
        }
        
        .service-row:hover::after {
          @apply opacity-5;
        }
        
        .service-row:last-child {
          @apply border-b-0;
        }
        
        .service-row-default {
          @apply hover:bg-white/5;
        }
        
        .service-row-selected {
          @apply bg-gradient-to-r from-purple-500/10 to-blue-500/10;
        }
        
        .service-row-selected .service-text {
          @apply text-purple-400 font-semibold;
        }
        
        .service-text {
          @apply text-white/90 text-base font-medium transition-colors duration-300;
        }
        
        .service-price {
          @apply text-purple-400 font-semibold inline-flex items-center gap-1;
        }
        
        .service-checkbox-wrapper {
          @apply relative w-6 h-6 mx-auto;
        }
        
        .service-checkbox {
          @apply absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10;
        }
        
        .service-checkbox-indicator {
          @apply absolute inset-0 border-2 border-white/30 rounded-lg transition-all duration-300;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .service-checkbox:checked + .service-checkbox-indicator {
          @apply border-purple-500 bg-purple-500/20;
          transform: scale(1.1);
        }
        
        .service-checkbox:checked + .service-checkbox-indicator::after {
          content: '✓';
          @apply absolute inset-0 flex items-center justify-center text-purple-400 text-sm font-bold;
          animation: checkmark 0.2s ease-in-out;
        }
        
        @keyframes checkmark {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .submit-button {
          @apply w-full md:w-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-12 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-bold transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden;
        }

        .submit-button::before {
          content: '';
          @apply absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 transition-opacity duration-300;
        }

        .submit-button:hover::before {
          @apply opacity-100;
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .total-price-container {
          @apply mt-6 text-center;
        }
      `}</style>
    </div>
  );
};

export default Home;
