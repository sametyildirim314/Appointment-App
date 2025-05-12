// server.js

const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// AWS DynamoDB yapılandırması
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Appointments'; // DynamoDB'de oluşturduğun tablo adı

// Randevu ekleme
app.post('/api/appointments', async (req, res) => {
  const { name, phone, selectedServices, totalPrice, date, time, notes } = req.body;

  const item = {
    id: Date.now().toString(),
    name,
    phone,
    selectedServices,
    totalPrice,
    date,
    time,
    notes
  };

  const params = {
    TableName: TABLE_NAME,
    Item: item
  };

  try {
    await docClient.put(params).promise();
    res.status(201).json({ message: 'Randevu eklendi', item });
  } catch (err) {
    console.error('DynamoDB Hatası:', err);
    res.status(500).json({ error: 'Veri eklenemedi' });
  }
});

// Tüm randevuları listeleme
app.get('/api/appointments', async (req, res) => {
  const params = {
    TableName: TABLE_NAME
  };

  try {
    const data = await docClient.scan(params).promise();
    res.json(data.Items);
  } catch (err) {
    console.error('DynamoDB Okuma Hatası:', err);
    res.status(500).json({ error: 'Veriler alınamadı' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});











/*const express = require('express');

const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hair-salon';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1);
  });

// Randevu modeli
const Appointment = mongoose.model('Appointment', {
  name: String,
  phone: String,
  selectedServices: [{
    id: Number,
    name: String,
    price: Number
  }],
  totalPrice: Number,
  date: Date,
  time: String,
  notes: String
});

// API rotaları
app.post('/api/appointments', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Randevu oluşturma hatası:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    console.error('Randevuları getirme hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Randevu bulunamadı' });
    }
    res.json({ message: 'Randevu başarıyla silindi' });
  } catch (error) {
    console.error('Randevu silme hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// Eski randevuları güncelleme endpoint'i
app.put('/api/appointments/update-old', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    const updatedAppointments = await Promise.all(appointments.map(async (appointment) => {
      if (!appointment.selectedServices) {
        // Eski randevuları yeni modele dönüştür
        const service = {
          id: 1,
          name: appointment.service || 'Saç Kesimi',
          price: 100
        };
        
        appointment.selectedServices = [service];
        appointment.totalPrice = service.price;
        
        await appointment.save();
        return appointment;
      }
      return appointment;
    }));
    
    res.json({ message: 'Eski randevular güncellendi', updatedCount: updatedAppointments.length });
  } catch (error) {
    console.error('Randevuları güncelleme hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); */