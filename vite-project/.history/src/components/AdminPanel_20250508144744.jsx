import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/appointments');
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Randevular yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Yükleniyor...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Randevu Listesi</h1>
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

export default AdminPanel; 