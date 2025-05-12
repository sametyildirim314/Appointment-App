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
    <div className="min-h-screen bg-[#1a1c23] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#232530] p-6 hidden md:block">
        <div className="mb-8">
          <h2 className="text-white text-2xl font-bold">Salon Admin</h2>
          <p className="text-gray-400 text-sm">Randevu Yönetimi</p>
        </div>
        <nav className="space-y-2">
          <a href="#" className="flex items-center text-white bg-[#2d2f3d] p-3 rounded-lg">
            <span className="mr-3">📅</span>
            Randevular
          </a>
          <a href="#" className="flex items-center text-gray-400 hover:text-white hover:bg-[#2d2f3d] p-3 rounded-lg transition-colors">
            <span className="mr-3">👥</span>
            Müşteriler
          </a>
          <a href="#" className="flex items-center text-gray-400 hover:text-white hover:bg-[#2d2f3d] p-3 rounded-lg transition-colors">
            <span className="mr-3">💰</span>
            Gelirler
          </a>
          <a href="#" className="flex items-center text-gray-400 hover:text-white hover:bg-[#2d2f3d] p-3 rounded-lg transition-colors">
            <span className="mr-3">⚙️</span>
            Ayarlar
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Yeni Randevu Oluştur</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Hoş geldiniz,</span>
              <span className="text-white font-medium">Admin</span>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.startsWith('✅') 
                ? 'bg-green-900/50 border border-green-500 text-green-400' 
                : 'bg-red-900/50 border border-red-500 text-red-400'
            }`}>
              {message}
            </div>
          )}

          <div className="bg-[#232530] rounded-xl p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">İsim</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-[#1a1c23] border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Telefon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-[#1a1c23] border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Tarih</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-[#1a1c23] border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Saat</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-[#1a1c23] border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-4">Hizmetler</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map(service => (
                    <label 
                      key={service.id} 
                      className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all ${
                        formData.selectedServices.includes(service.id)
                          ? 'bg-blue-900/50 border border-blue-500'
                          : 'bg-[#1a1c23] border border-gray-700 hover:border-blue-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedServices.includes(service.id)}
                        onChange={() => handleServiceChange(service)}
                        className="accent-blue-500 w-4 h-4"
                      />
                      <span className="text-white">
                        {service.name} 
                        <span className="text-blue-400 ml-2">
                          {service.price} TL
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2">Notlar</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg bg-[#1a1c23] border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Eklemek istediğiniz bir not var mı?"
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-gray-700">
                <span className="text-xl font-bold text-blue-400 mb-4 md:mb-0">
                  Toplam Fiyat: {totalPrice} TL
                </span>
                <button
                  type="submit"
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
                >
                  Randevu Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
