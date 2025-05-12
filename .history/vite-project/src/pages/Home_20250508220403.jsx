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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-8 rounded-t-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Randevu Al
          </h1>
          <p className="text-indigo-100 text-center text-lg">
            Hizmetlerimizden birini seçin ve randevunuzu oluşturun
          </p>
        </div>

        {/* Main Content */}
        <div className="p-8 md:p-12">
          {message && (
            <div className={`text-center mb-8 text-lg font-semibold ${
              message.startsWith('✅') 
                ? 'text-green-600 bg-green-50 border border-green-200' 
                : 'text-red-600 bg-red-50 border border-red-200'
            } p-4 rounded-2xl w-full transform transition-all duration-300 hover:scale-[1.02]`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-2">İsim</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-700 bg-white"
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-2">Telefon</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-700 bg-white"
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-2">Tarih</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-700 bg-white"
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-2">Saat</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-700 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-4">Hizmetler</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map(service => (
                  <label 
                    key={service.id} 
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                      formData.selectedServices.includes(service.id)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.selectedServices.includes(service.id)}
                        onChange={() => handleServiceChange(service)}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="block text-gray-700 font-medium">
                        {service.name}
                      </span>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-indigo-600 font-semibold">
                          {service.price} TL
                        </span>
                        <span className="text-gray-500 text-sm">
                          30 dk
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="block text-gray-700 font-medium mb-2">Notlar</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-700 bg-white resize-none"
                placeholder="Eklemek istediğiniz bir not var mı?"
              />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
              <span className="text-2xl font-bold text-indigo-600">
                Toplam Fiyat: {totalPrice} TL
              </span>
              <button
                type="submit"
                className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-bold transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Randevu Al
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
