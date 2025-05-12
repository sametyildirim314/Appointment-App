const express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const cors = require('cors');
const dotenv = require('dotenv');

require('dotenv').config(); // Bu satır, .env dosyasındaki değişkenleri yükler.

// Debug logging
console.log('Environment Variables:');
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not Set');
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not Set');
console.log('DYNAMODB_TABLE:', process.env.DYNAMODB_TABLE);

console.log('DynamoDB Table:', process.env.DYNAMODB_TABLE);  // Bu satır, doğru tablo adını yazdırır

const app = express();
app.use(cors());
app.use(express.json());

// DynamoDB yapılandırması
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: false,
  },
});

// Randevu API rotası
app.post('/api/appointments', async (req, res) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE, // Bu şekilde .env dosyasındaki tablo adını kullanabilirsiniz
    Item: {
      id: new Date().getTime().toString(),
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
    await docClient.send(new PutCommand(params));
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
