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
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Randevu Al</h1>
        {message && (
          <div className={`text-center mb-6 text-base font-medium ${message.startsWith('✅') ? 'text-green-600 bg-green-50 border border-green-200' : 'text-red-600 bg-red-50 border border-red-200'} p-3 rounded`}>{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <div>
              <label className="block text-gray-700 font-medium mb-1">İsim</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Telefon</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Tarih</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Saat</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Hizmetler</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map(service => (
                <label key={service.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 cursor-pointer hover:bg-indigo-50 transition border border-gray-200">
                  <input
                    type="checkbox"
                    checked={formData.selectedServices.includes(service.id)}
                    onChange={() => handleServiceChange(service)}
                    className="accent-indigo-600 w-5 h-5"
                  />
                  <span className="text-gray-800 text-base">{service.name} <span className="text-gray-400">- {service.price} TL</span></span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Notlar</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg bg-gray-50"
              placeholder="Eklemek istediğiniz bir not var mı?"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-semibold text-indigo-700">Toplam Fiyat: {totalPrice} TL</span>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-lg transition-all shadow-md text-lg font-bold"
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
