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
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center py-10 px-2">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-16 border border-gray-100 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold mb-12 text-center text-gray-800">Randevu Al</h1>
        {message && (
          <div className={`text-center mb-8 text-xl font-semibold ${message.startsWith('✅') ? 'text-green-600 bg-green-50 border border-green-200' : 'text-red-600 bg-red-50 border border-red-200'} p-4 rounded-xl w-full`}>{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-xl">İsim</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-2xl bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-xl">Telefon</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-2xl bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-xl">Tarih</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-2xl bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-xl">Saat</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-2xl bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-4 text-xl">Hizmetler</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map(service => (
                <label key={service.id} className="flex items-center gap-4 bg-gray-50 rounded-xl px-5 py-4 cursor-pointer hover:bg-indigo-50 transition border border-gray-200 text-xl">
                  <input
                    type="checkbox"
                    checked={formData.selectedServices.includes(service.id)}
                    onChange={() => handleServiceChange(service)}
                    className="accent-indigo-600 w-7 h-7"
                  />
                  <span className="text-gray-800 text-xl">{service.name} <span className="text-gray-400">- {service.price} TL</span></span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-xl">Notlar</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-2xl bg-gray-50"
              placeholder="Eklemek istediğiniz bir not var mı?"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
            <span className="text-2xl font-bold text-indigo-700">Toplam Fiyat: {totalPrice} TL</span>
            <button
              type="submit"
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-16 py-5 rounded-2xl transition-all shadow-lg text-2xl font-extrabold"
            >
              Randevu Al
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
