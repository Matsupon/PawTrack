# 🐾 PawTrack

> A robust offline pet adoption management system for shelters and adoption centers

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)
![React Native](https://img.shields.io/badge/React%20Native-latest-61dafb.svg)

## 📱 Overview

PawTrack is a comprehensive mobile application designed to streamline pet adoption management for shelters and adoption centers. Operating completely offline, it enables staff to efficiently track, update, and manage pet adoptions without requiring internet connectivity.

## ✨ Key Features

### 🐈 Pet Management
- **Complete CRUD Operations**
  - Add new pets to the system
  - View detailed pet profiles
  - Update pet information
  - Remove pet listings
- **Pet Profile Details**
  - Name
  - Breed
  - Gender
  - Age
  - Current adoption status

### 👥 Adopter Management
- **Comprehensive adopter records**
  - Adopter's full name
  - Contact information
  - Adoption history
- **Adoption tracking system**
  - Links pets with their adopters
  - Maintains historical adoption records

### 🔍 Search Capabilities
- Quick pet lookup by name
- Efficient record management
- Instant search results

## 📱 Application Structure

### Screens and Navigation

1. **Splash Screen**
   - Branded loading experience
   - PawTrack logo display
   - Smooth transition to home screen

2. **Home Screen**
   - Pet listing overview
   - Search functionality
   - Quick action buttons
   - Status indicators

3. **Pet Management**
   - Intuitive form interface
   - Real-time validation
   - Status updates
   - Image handling

4. **Adoption Processing**
   - Status change workflow
   - Adopter information collection
   - Confirmation system

## 💾 Technical Details

### Technology Stack
- **Frontend Framework**: React Native
- **Data Persistence**: AsyncStorage
- **Navigation**: React Navigation
- **State Management**: React Hooks
- **AI Processing**: DeepSeek
- **UI Framework**: React Native Paper

### Offline Capabilities
- Local data storage
- Persistent across sessions
- No internet dependency
- Reliable data management

### 📊 Database Schema

#### Pet
```javascript
{
  id: string;              // Unique identifier
  name: string;            // Pet's name
  species: 'Cat' | 'Dog';         // Dog and Cat
  breed: string;          // Breed information
  gender: 'Male' | 'Female';
  age: number;            // Age in months
  weight: number;         // Weight in kg
  healthStatus: string;   // Current health condition
  vaccinated: boolean;    // Vaccination status
  neutered: boolean;      // Neutering status
  description: string;    // Detailed description
  imageUri: string;       // Local image path
  adoptionStatus: 'Available' | 'Reserved' | 'Adopted'; 
}
```

#### Adopter
```javascript
{
  id: string;              // Unique identifier
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string // full address 
}
```

#### Adoption
```javascript
{
  id: string;              // Unique identifier
  petId: string;          // Reference to Pet
  adopterId: string;      // Reference to Adopter
  adoptionDate: Date;
  status: 'Pending' | 'Completed' | 'Cancelled'; 
  notes: string; 
}
```

### 📁 Folder Structure
```
pawtrack/
├── src/
│   ├── assets/            # Images, fonts, and other static files
│   │   ├── images/
│   │   └── fonts/
│   ├── components/        # Reusable UI components
│   │   ├── common/       # Shared components
│   │   ├── pets/        # Pet-related components
│   │   └── adopters/    # Adopter-related components
│   ├── screens/          # Screen components
│   │   ├── Home/
│   │   ├── PetDetails/
│   │   ├── AddPet/
│   │   ├── Adopters/
│   │   └── Settings/
│   ├── navigation/       # Navigation configuration
│   │   ├── AppNavigator.jsx
│   │   └── NavigationService.js
│   ├── services/         # Business logic and API calls
│   │   ├── database/    # Local database operations
│   │   └── utils/       # Utility functions
│   ├── models/          # Data models and types
│   │   ├── Pet.js
│   │   ├── Adopter.js
│   │   └── Adoption.js
│   ├── hooks/           # Custom React hooks
│   ├── context/         # React Context providers
│   ├── constants/       # App-wide constants
│   └── theme/           # UI theme configuration
├── android/             # Android specific files
├── ios/                # iOS specific files
├── docs/               # Documentation
├── __tests__/          # Test files
├── .env               # Environment variables
├── package.json       # Dependencies and scripts
└── README.md         # Project documentation
```

## 🚀 Getting Started

### Prerequisites
```bash
node >= 14.0.0
npm >= 6.0.0
```

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/pawtrack.git
```

2. Install dependencies
```bash
cd pawtrack
npm install
```

3. Start the application
```bash
npm start
```

## 📖 Usage

1. **Launch the app**
2. **Add new pets** using the '+' button
3. **Update records** by tapping on existing entries
4. **Process adoptions** through the pet details screen
5. **Search** for specific pets using the search bar

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ for animal shelters and adoption centers worldwide.
