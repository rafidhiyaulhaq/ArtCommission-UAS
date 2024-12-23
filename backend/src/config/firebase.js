const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.appspot.com`
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

console.log('Firebase Admin berhasil diinisialisasi');

module.exports = {
  db,
  auth,
  storage
};