# ArtVista

ArtVista is a cross-platform mobile application that allows users to explore
artworks, interact with artists, and discover exhibitions. This project was
created as part of our final exam, focusing on frontend and mobile development
using React Native and Firebase.

---

## Table of Contents

1. [Project Description](#project-description)
2. [Features](#features)
3. [How to Use](#how-to-use)
4. [Firebase Configuration](#firebase-configuration)
5. [Testing](#testing)

---

## Project Description

ArtVista enables users to browse artworks uploaded by artists, interact with
their profiles, and explore exhibitions via geolocation. Users can also engage
with the app by commenting on artworks, creating new artworks, and deleting
their own uploads. The app is designed to provide seamless navigation between
screens.

---

## Features

- **Artwork Gallery**: View and like artworks.
- **Artist Profiles**: Explore artists and their uploaded artworks.
- **Geolocation**: Discover exhibitions location on a map.
- **Authentication**: Login and signup for users.
- **User Interactions**: Comment on artworks
- **Content Management**: Create new artworks and delete your own uploads

---

### How to use

- Install all dependencies with <code>npm install</code>
- To run, <code>npm start</code>, or run on ios <code>npm run ios</code>

---

### Firebase Configuration

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBRXc4SXaRCHbbJKNGBl_8KtDdQjODmWeA",
  authDomain: "kryss-exam.firebaseapp.com",
  projectId: "kryss-exam",
  storageBucket: "kryss-exam.firebasestorage.app",
  messagingSenderId: "804001097958",
  appId: "1:804001097958:web:287cd47a9d6ce3cf5eb327",
};
```

The configuration in <code>firebaseConfig.js</code> ensures you can connect to
the database.

You can sign in with a provided test user:

- Email: testuser@gmail.com
- Password: abc123

---

### Testing

- The app has been primarily tested on iOS simulator (iPhone 15 Pro).
- It should also work using android simulator and the web browser.
