# Readly - Digital Library Application

A comprehensive digital library application that provides access to Project Gutenberg books through a modern mobile app and RESTful API backend.

## 🚀 Project Overview

Readly is a full-stack application consisting of:
- **Backend API**: Node.js/Express server that scrapes Project Gutenberg for book data
- **Mobile App**: React Native/Expo mobile application with a beautiful UI
- **Features**: Book search, categorization, reading progress tracking, and personal library management

## 🏗️ Architecture

### Backend Structure
```
backend/
├── src/
│   ├── app.js              # Main Express application
│   ├── config/             # Environment configuration
│   ├── controllers/        # Business logic handlers
│   ├── middleware/         # Express middleware
│   └── routes/            # API route definitions
```

### Mobile App Structure
```
mobile/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab-based navigation
│   ├── (book)/            # Book reading screen
│   └── (category)/        # Category books screen
├── components/             # Reusable UI components
│   ├── Book.tsx           # Book display component
│   ├── CategoryCard.tsx   # Category display component
│   └── ...                # Other UI components
├── hooks/                  # Custom React hooks
│   ├── useBooks.ts        # Book data management
│   ├── useCategories.ts   # Category data management
│   └── useTextToSpeech.tsx # Text-to-Speech functionality
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Axios** - HTTP client for API calls
- **Cheerio** - HTML parsing and web scraping
- **Express Rate Limit** - API rate limiting
- **Vercel** - Deployment platform

### Mobile App
- **React Native** - Mobile app framework
- **Expo** - Development platform
- **TypeScript** - Type-safe JavaScript
- **Expo Router** - File-based routing
- **React Query (TanStack Query)** - Data fetching and caching
- **AsyncStorage** - Local data persistence
- **Lottie** - Animation support
- **Ionicons** - Icon library
- **Expo Speech** - Text-to-Speech functionality

## 📱 Features

### Core Functionality
1. **Book Discovery**
   - Top-rated books from Project Gutenberg
   - Advanced search functionality
   - Category-based browsing

2. **Reading Experience**
   - Full-text book reading
   - Progress tracking and bookmarking
   - Responsive text layout with chunked loading
   - **Text-to-Speech support** with speed control, and pitch adjustment

3. **Personal Library**
   - Recently read books
   - Reading progress persistence
   - Book management (add/remove)

4. **User Interface**
   - Modern, intuitive design
   - Tab-based navigation
   - Smooth animations and transitions
   - Responsive layouts

## 🔌 API Endpoints

### Books
- `GET /books` - Get top-rated books
- `GET /books/search?query={search_term}` - Search books
- `GET /books/:id` - Get book content by ID

### Categories
- `GET /categories` - Get all book categories
- `GET /categories/:id` - Get books in specific category

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio / Xcode (for mobile development)

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Mobile App Setup
```bash
cd mobile
npm install
npx expo start
```

## 📖 Usage

### Backend API
The backend automatically scrapes Project Gutenberg for:
- Book metadata (title, author, cover image)
- Category information
- Full text content
- Search results

### Mobile App
1. **Home Tab**: Browse top-rated books
2. **Categories Tab**: Explore books by genre/category
3. **Search Tab**: Find specific books or authors
4. **Library Tab**: Access your reading history and progress

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=3000
TOP_URL=https://www.gutenberg.org/browse/scores/top
QUERY_URL=https://www.gutenberg.org/ebooks/search/?query
GET_BOOK_URI=https://www.gutenberg.org/files
GET_CATEGORIES_URI=https://www.gutenberg.org/ebooks/bookshelf
GET_CATEGORY_BOOKS=https://www.gutenberg.org/ebooks/bookshelf
```

### API Configuration
The mobile app uses the backend API URL from environment variables:
```env
EXPO_PUBLIC_API_URL=https://your-api-domain.com
```

## 🎯 Key Features Implementation

### Web Scraping
- Uses Cheerio for HTML parsing
- Extracts book information from Project Gutenberg
- Handles pagination for large datasets

### Data Caching
- React Query for efficient data management
- Configurable stale time (5 minutes default)
- Optimized API calls and state management

### Reading Progress
- AsyncStorage for local data persistence
- Scroll position tracking
- Automatic progress saving

### Performance Optimization
- Chunked text loading (3000 characters per chunk)
- Lazy loading of book content
- Efficient list rendering with FlatList

### Text-to-Speech (Sesli Kitap) Features
- **Speed Control**: Adjustable speech rate from 0.1x to 2.0x for comfortable listening
- **Pitch Control**: Adjustable pitch from 0.5x to 2.0x for voice customization
- **Playback Controls**: Play, pause, resume, and stop functionality
- **Sequential Reading**: Automatically reads entire book content in chunks
- **Progress Tracking**: Saves reading position and resumes from where left off
- **Collapsible Panel**: Toggle TTS controls on/off for distraction-free reading
- **Real-time Adjustments**: Change speed, and pitch during active reading

## 🚀 Deployment

### Backend
- Configured for Vercel deployment
- Automatic builds and deployments
- Environment variable management

### Mobile App
- Expo build system
- Cross-platform compatibility
- Easy distribution through Expo

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


## 🙏 Acknowledgments

- Project Gutenberg for providing free ebooks
- Expo team for the excellent development platform
- React Native community for continuous improvements

## 📞 Support

For questions or support, please open an issue in the repository or contact the development team.

---

**Note**: This application is designed for educational and personal use. Please respect Project Gutenberg's terms of service and copyright policies.
