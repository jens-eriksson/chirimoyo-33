# Chirimoyo 33 - Vacation Rental Website

A beautiful vacation rental website for Chirimoyo 33, built with Angular and Firebase.

## 🌟 Features

- **Property Gallery**: Stunning image gallery showcasing the property
- **Availability Calendar**: Real-time booking calendar
- **Online Booking**: Easy reservation system with user authentication
- **Google Authentication**: Sign in with Google for customers and admin
- **Admin Dashboard**: Manage bookings and update availability
- **Responsive Design**: Optimized for desktop and mobile devices
- **Spanish Theme**: Sunny Yellow, Soft Sand, and Terra Cotta color palette

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. Clone the repository:
```bash
cd chirimoyo-web
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:

Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

#### Enable Firebase Services:
- **Authentication**: Enable Google Sign-In provider
- **Firestore Database**: Create a database in production mode
- **Storage**: Enable Firebase Storage
- **Hosting**: Enable Firebase Hosting

#### Update Firebase Configuration:

Edit `src/environments/environment.ts` and `src/environments/environment.prod.ts` with your Firebase project credentials:

```typescript
export const environment = {
  production: false, // true for prod
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

#### Set up Firestore Security Rules:

In Firebase Console > Firestore Database > Rules, add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow delete: if request.auth != null && 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

#### Create First Admin User:

1. Sign in to the website with Google
2. Go to Firebase Console > Firestore Database
3. Find your user document in the `users` collection
4. Edit the document and change `role` from `customer` to `admin`

## 🛠️ Development

Run the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## 📦 Build

Build the project for production:

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## 🚢 Deployment to Firebase

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase (if not already done):
```bash
firebase init
```
- Select "Hosting"
- Choose your Firebase project
- Set public directory to: `dist/chirimoyo-web/browser`
- Configure as single-page app: Yes
- Set up automatic builds: No

4. Build and deploy:
```bash
ng build --configuration production
firebase deploy
```

Your website will be live at: `https://YOUR_PROJECT_ID.web.app`

## 📂 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/          # Home page with property showcase
│   │   ├── calendar/      # Availability calendar
│   │   ├── booking/       # Booking form
│   │   ├── login/         # Google authentication
│   │   ├── admin/         # Admin dashboard
│   │   ├── navbar/        # Navigation bar
│   │   └── property-gallery/  # Image gallery
│   ├── services/
│   │   ├── auth.ts        # Authentication service
│   │   └── booking.ts     # Booking management service
│   ├── models/
│   │   └── models.ts      # TypeScript interfaces
│   └── app.config.ts      # Firebase configuration
├── environments/
│   ├── environment.ts     # Development environment
│   └── environment.prod.ts # Production environment
├── styles.scss            # Global styles
└── public/
    └── images/            # Property images
```

## 🎨 Theme Colors

- **Primary (Sunny Yellow)**: #FFC107
- **Background (Soft Sand)**: #F5F5DC
- **Accent (Terra Cotta)**: #E07A5F
- **Font**: Alegreya (Google Fonts)

## 👤 User Roles

### Customer
- View property and availability
- Create booking requests
- View own bookings

### Admin
- All customer permissions
- Approve/reject booking requests
- Manage all bookings
- Update booking status

## 🔒 Security

- Authentication required for booking
- Role-based access control
- Firestore security rules
- Environment variables for sensitive data

## 📱 Contact

For inquiries about the property, contact:
- Email: info@chirimoyo33.com
- Phone: +34 123 456 789

## 📄 License

This project is private and proprietary.

## 🤝 Support

For technical issues or questions, please contact the development team.

---

Built with ❤️ using Angular and Firebase
