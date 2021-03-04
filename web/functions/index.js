const functions = require("firebase-functions");

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gca-eventos-default-rtdb.firebaseio.com"
});


exports.onCreateEvent = functions.firestore
    .document('eventos/{eventoId')
    .onCreate(async (snap, context) => {
        const evento = snap.data;

        try {
            var user = await admin.auth()
                .createUser({
                    email: evento.organizador,
                    password: 'secret' + Math.floor(Math.random() * 999)
                });
            console.log(user);
        } catch (err) {
            console.log("Error", err.message);
        }

        return 0;

    });