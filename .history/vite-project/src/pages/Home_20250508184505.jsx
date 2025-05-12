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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] p-8 md:p-12 lg:p-16 border border-indigo-100 flex flex-col items-center backdrop-blur-sm">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Randevu Al
        </h1>
        {message && (
          <div className={`text-center mb-8 text-lg font-semibold ${
            message.startsWith('✅') 
              ? 'text-green-600 bg-green-50 border border-green-200' 
              : 'text-red-600 bg-red-50 border border-red-200'
          } p-4 rounded-xl w-full transform transition-all duration-300 hover:scale-[1.02]`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-gray-700 font-semibold mb-2 text-lg group-hover:text-indigo-600 transition-colors">İsim</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg bg-white shadow-sm hover:shadow-md transition-all duration-300"
              />
            </div>
            <div className="group">
              <label className="block text-gray-700 font-semibold mb-2 text-lg group-hover:text-indigo-600 transition-colors">Telefon</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg bg-white shadow-sm hover:shadow-md transition-all duration-300"
              />
            </div>
            <div className="group">
              <label className="block text-gray-700 font-semibold mb-2 text-lg group-hover:text-indigo-600 transition-colors">Tarih</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg bg-white shadow-sm hover:shadow-md transition-all duration-300"
              />
            </div>
            <div className="group">
              <label className="block text-gray-700 font-semibold mb-2 text-lg group-hover:text-indigo-600 transition-colors">Saat</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg bg-white shadow-sm hover:shadow-md transition-all duration-300"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-4 text-lg">Hizmetler</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map(service => (
                <label 
                  key={service.id} 
                  className={`flex items-center gap-4 bg-white rounded-xl px-5 py-4 cursor-pointer transition-all duration-300 border ${
                    formData.selectedServices.includes(service.id)
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedServices.includes(service.id)}
                    onChange={() => handleServiceChange(service)}
                    className="accent-indigo-600 w-5 h-5"
                  />
                  <span className="text-gray-800 text-lg">
                    {service.name} 
                    <span className="text-indigo-600 font-semibold ml-2">
                      {service.price} TL
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="group">
            <label className="block text-gray-700 font-semibold mb-2 text-lg group-hover:text-indigo-600 transition-colors">Notlar</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg bg-white shadow-sm hover:shadow-md transition-all duration-300"
              placeholder="Eklemek istediğiniz bir not var mı?"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between mt-8 gap-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Toplam Fiyat: {totalPrice} TL
            </span>
            <button
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-bold transform hover:scale-[1.02]"
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
