import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

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
    const { selectedServices } = formData;
    const updatedServices = selectedServices.includes(service.id)
      ? selectedServices.filter(id => id !== service.id)
      : [...selectedServices, service.id];
    setFormData({ ...formData, selectedServices: updatedServices });
    calculateTotalPrice(updatedServices);
  };

  const calculateTotalPrice = (selectedServices) => {
    const total = selectedServices.reduce((sum, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return sum + (service ? service.price : 0);
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
    } catch (error) {
      setMessage('❌ Randevu oluşturulurken bir hata oluştu.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center py-10 px-2">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 tracking-tight">Randevu Al</h1>
        {message && (
          <div className={`text-center mb-6 text-base font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">İsim</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Telefon</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Tarih</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Saat</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Hizmetler</label>
            <div className="grid grid-cols-2 gap-2">
              {services.map(service => (
                <label key={service.id} className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 cursor-pointer hover:bg-blue-50 transition">
                  <input
                    type="checkbox"
                    checked={formData.selectedServices.includes(service.id)}
                    onChange={() => handleServiceChange(service)}
                    className="accent-blue-500 w-5 h-5 rounded"
                  />
                  <span className="text-gray-800 text-base">{service.name} <span className="text-gray-400">- {service.price} TL</span></span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Notlar</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg min-h-[60px]"
              rows="3"
              placeholder="Eklemek istediğiniz bir not var mı?"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-semibold text-blue-700">Toplam Fiyat: {totalPrice} TL</span>
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition font-bold text-lg shadow-md"
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
