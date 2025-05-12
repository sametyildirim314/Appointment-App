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
      const response = await axios.post('http://localhost:5001/api/appointments', formData);
      setMessage('Randevunuz başarıyla oluşturuldu!');
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
      setMessage('Randevu oluşturulurken bir hata oluştu.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Randevu Al</h1>
      {message && <div className="text-center text-green-500 mb-4">{message}</div>}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">İsim</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Telefon</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Tarih</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Saat</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
      <h1 className="text-2xl font-bold mb-4 text-center">Randevu Listesi</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Tarih</th>
              <th className="px-4 py-2 border">Saat</th>
              <th className="px-4 py-2 border">İsim</th>
              <th className="px-4 py-2 border">Telefon</th>
              <th className="px-4 py-2 border">Hizmetler</th>
              <th className="px-4 py-2 border">Toplam Fiyat</th>
              <th className="px-4 py-2 border">Notlar</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{appointment.date}</td>
                <td className="px-4 py-2 border">{appointment.time}</td>
                <td className="px-4 py-2 border">{appointment.name}</td>
                <td className="px-4 py-2 border">{appointment.phone}</td>
                <td className="px-4 py-2 border">
                  {Array.isArray(appointment.selectedServices)
                    ? appointment.selectedServices.join(', ')
                    : appointment.selectedServices}
                </td>
                <td className="px-4 py-2 border">{appointment.totalPrice} TL</td>
                <td className="px-4 py-2 border">{appointment.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home; 