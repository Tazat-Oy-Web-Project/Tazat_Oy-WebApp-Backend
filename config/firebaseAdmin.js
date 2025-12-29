const admin = require('firebase-admin');

require("dotenv").config();

function initFirebase() {

    if (admin.apps.length > 0) return admin;

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
            `Missing Firebase Admin SDK environment variables. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your .env file.` +
            ` Current values: FIREBASE_PROJECT_ID=${projectId}, FIREBASE_CLIENT_EMAIL=${clientEmail}, FIREBASE_PRIVATE_KEY=${privateKey ? '[REDACTED]' : 'undefined'}`
        )
    }

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: projectId,
            clientEmail: clientEmail,
            privateKey: privateKey,
        }),
    });

    return admin;
}

module.exports = { initFirebase };