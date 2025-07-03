# Wallet PWA

A simple Progressive Web App for managing verifiable credentials (VCs) built with React, Parcel, and Tailwind CSS.

## Features

- 🔐 **Authentication**: OTP-based login and signup
- 👤 **User Profile**: Edit and manage user information
- 📋 **VC Management**: View all verifiable credentials
- 🔍 **VC Details**: Detailed view of individual credentials
- 📱 **QR Scanner**: Add new VCs by scanning QR codes
- 📱 **PWA**: Installable progressive web app with service worker
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A running instance of the wallet middleware API (see API_DOCUMENTATION.md)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wallet-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the API endpoint**
   
   Update the API base URL in `src/services/api.js` if your backend is running on a different port:
   ```javascript
   export const api = axios.create({
     baseURL: 'http://localhost:3000', // Change this to your API URL
     headers: {
       'Content-Type': 'application/json',
     },
   });
   ```

## Development

1. **Start the development server**
   ```bash
   npm start
   ```

2. **Open your browser**
   
   Navigate to `http://localhost:1234` to view the application.

## Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Serve the built files**
   
   The built files will be in the `dist` directory. You can serve them using any static file server:
   ```bash
   npx serve dist
   ```

## PWA Features

### Service Worker
- Caches static assets for offline access
- Provides basic offline functionality
- Automatically updates when new versions are deployed

### Installation
- Users can install the app on their devices
- Works on desktop and mobile browsers
- Provides app-like experience

### Manifest
- Configures app appearance and behavior
- Defines icons and theme colors
- Enables standalone mode

## API Integration

The app integrates with the wallet middleware API as documented in `API_DOCUMENTATION.md`. Key endpoints used:

- `POST /api/wallet/login` - Initiate login with email
- `POST /api/wallet/login/verify` - Verify OTP
- `POST /api/wallet/onboard` - User signup
- `GET /api/wallet/{user_id}/vcs` - Get all VCs
- `GET /api/wallet/{user_id}/vcs/{vcId}` - Get specific VC
- `POST /api/wallet/{user_id}/vcs/upload-qr` - Upload VC from QR

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.js       # Main layout with navigation
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication state management
├── pages/              # Page components
│   ├── Login.js        # Login page
│   ├── Signup.js       # Signup page
│   ├── OtpVerification.js # OTP verification
│   ├── Profile.js      # User profile
│   ├── VcList.js       # VC list page
│   ├── VcDetails.js    # VC details page
│   └── QrScanner.js    # QR code scanner
├── services/           # API services
│   └── api.js          # API configuration and calls
├── App.js              # Main app component with routing
├── index.js            # App entry point
└── index.css           # Global styles with Tailwind
```

## Usage Flow

1. **Authentication**
   - Users can sign up with name, phone, and user ID
   - Login requires email and OTP verification
   - Session is maintained using JWT tokens

2. **VC Management**
   - View all VCs in a grid layout
   - Click on any VC to see detailed information
   - Add new VCs by scanning QR codes

3. **Profile Management**
   - View and edit user profile information
   - Update personal details

## QR Code Scanning

The app uses the `html5-qrcode` library for QR code scanning:

- Automatically requests camera permissions
- Supports both front and back cameras
- Handles various QR code formats
- Provides real-time feedback

## Styling

The app uses Tailwind CSS for styling:

- Responsive design that works on all devices
- Consistent color scheme with primary blue theme
- Modern UI components with hover effects
- Accessible design with proper contrast

## Browser Support

- Chrome/Edge (recommended for PWA features)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Service Worker Issues
- Clear browser cache and reload
- Check browser console for errors
- Ensure HTTPS in production

### QR Scanner Issues
- Ensure camera permissions are granted
- Check if device has camera access
- Try refreshing the page

### API Connection Issues
- Verify the API server is running
- Check the base URL configuration
- Ensure CORS is properly configured on the backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details 