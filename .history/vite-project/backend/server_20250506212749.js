const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// DynamoDB yapılandırması
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();

// Randevu API rotası
app.post('/api/appointments', async (req, res) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: new Date().getTime().toString(),  // Benzersiz bir ID oluşturuyoruz
      name: req.body.name,
      phone: req.body.phone,
      selectedServices: req.body.selectedServices,
      totalPrice: req.body.totalPrice,
      date: req.body.date,
      time: req.body.time,
      notes: req.body.notes,
    }
  };

  try {
    await docClient.put(params).promise();
    res.status(201).json(params.Item);
  } catch (error) {
    console.error('Randevu oluşturulurken hata oluştu:', error);
    res.status(500).json({ error: error.message });
  }
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
