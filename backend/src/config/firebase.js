const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
}

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  console.log('Konfigurasi Firebase dimuat:', {
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email
  });
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('Firebase Admin berhasil diinisialisasi');
} catch (error) {
  console.error('Error inisialisasi Firebase Admin:', error);
  throw error;
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };