// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.15.1/firebase-app.js');
importScripts(
    'https://www.gstatic.com/firebasejs/7.15.1/firebase-messaging.js'
);

var firebaseConfig = {
    apiKey: 'AIzaSyCjEj1Kw2ioTIG-W1h7wh9ebSWRKK7WXj8',
    authDomain: 'tasty-tongue-official.firebaseapp.com',
    databaseURL: 'https://tasty-tongue-official.firebaseio.com',
    projectId: 'tasty-tongue-official',
    storageBucket: 'tasty-tongue-official.appspot.com',
    messagingSenderId: '117601217249',
    appId: '1:117601217249:web:c35e24684a5ce5df98a5a0',
    measurementId: 'G-H627DE2WPP',
};
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.usePublicVapidKey(
    'BF4LZg-4xng3mFhazZ9vZik86L1MGKLn-kuKC5xhhM6p0-6LFWw-FmEsc88_KUMAYFrc8-7KzqF5VZy5ZJypR8w'
);