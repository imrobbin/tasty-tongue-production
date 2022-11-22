import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

exports.createProfile = functions.auth.user().onCreate((snap: any, context: any) => {
    console.log('snap ', snap);
    console.log('context ', context);

    const userData: any = {
        owner: snap.uid,
        email: snap.email,
        displayName: snap.displayName,
        photoURL: snap.photoURL,
        emailVerified: snap.emailVerified,
        isAdmin: false
    };

    if (userData.email === 'tastytongue.res@gmail.com') {
        userData.isAdmin = true;
    }

    return admin.firestore().doc(`users/${snap.uid}`).set(userData, { merge: true });
});

exports.newOrderNotification = functions.firestore.document('orders/{id}').onCreate(async (snap: any, context: any) => {
    console.log('snap ', JSON.stringify(snap));

    const orderData = snap.data();

    const displayName = orderData.orderedBy.displayName || orderData.orderedBy.email;

    // Notification content
    const payload = {
        notification: {
            title: 'New Order Request',
            body: `Received a new order request from ${displayName}`,
            sound: 'default'
            // click_action: 'FCM_PLUGIN_ACTIVITY',
            // icon: 'fcm_push_icon',
        }
    };

    // ref to the device collection for the user
    const db = admin.firestore();
    const deviceTokensRef = db.collection('deviceTokens').where('isAdmin', '==', true);

    // get the user's tokens and send notifications
    const devices = await deviceTokensRef.get();

    const tokens: any[] = [];

    console.log('devices ', JSON.stringify(devices));
    // send a notification to each device token
    devices.forEach((device) => {
        const token = device.data().token;
        tokens.push(token);
    });

    console.log('tokens ', JSON.stringify(tokens));

    if (tokens.length === 0) {
        return;
    }

    return admin.messaging().sendToDevice(tokens, payload);
});

exports.notifyOnOrderUpdate = functions.firestore.document('orders/{id}').onUpdate(async (snap: any, context: any) => {
    console.log('snap ', snap);
    console.log('context ', context);

    // Get an object representing the current document
    const orderData = snap.after.data();

    // Notification content
    const payload = {
        notification: {
            title: 'Your Order Status',
            body: `Tasty Tongue has ${orderData.orderStatus} your order #${orderData.orderToken}`,
            sound: 'default'
        }
    };

    const tokens: any = [];
    tokens.push(orderData.notify.deviceToken);

    console.log('tokens ', JSON.stringify(tokens));

    return admin.messaging().sendToDevice(tokens, payload);
});
