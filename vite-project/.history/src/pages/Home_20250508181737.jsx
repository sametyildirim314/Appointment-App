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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:scale-[1.01]">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-900">Randevu Al</h1>
        {message && (
          <div className="text-center mb-4 text-sm font-semibold text-green-600">{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">İsim</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Telefon</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Tarih</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Saat</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Hizmetler</label>
            {services.map(service => (
              <div key={service.id} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={formData.selectedServices.includes(service.id)}
                  onChange={() => handleServiceChange(service)}
                  className="accent-indigo-500 w-4 h-4 rounded"
                />
                <span className="text-gray-800">{service.name} - {service.price} TL</span>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Notlar</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
            />
          </div>
          <div className="text-right">
            <strong className="text-xl text-indigo-700 font-semibold">
              Toplam Fiyat: {totalPrice} TL
            </strong>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition duration-200 font-semibold shadow-md"
          >
            Randevu Al
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
