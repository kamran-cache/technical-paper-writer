const admin = require("firebase-admin");

var serviceAccount = require("./paper-writer-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "paper-writer-ee745.appspot.com",
});

const bucket = admin.storage().bucket();
module.exports = { bucket };
