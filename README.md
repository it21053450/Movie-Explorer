# Movie-Explorer

# Movie Explorer Pro

A dynamic movie exploration platform built with React and powered by TMDb API, offering users an interactive and engaging way to discover, search, and interact with movie content.

![Movie Explorer Screenshot](screenshot.png)

## Features

- **User Authentication**: Secure login and registration system
- **Movie Discovery**: Browse trending and popular movies
- **Advanced Search**: Find movies by title, genre, or keywords
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Movie Details**: View comprehensive information about movies including cast, trailers, and similar films
- **Favorites System**: Save and manage your favorite movies
- **Dark/Light Mode**: Switch between light and dark themes

## Technologies Used

- **Frontend**: React, Material UI, GSAP animations
- **Backend**: Node.js, Express
- **State Management**: Context API, React Query
- **Authentication**: Passport.js
- **API Integration**: TMDb (The Movie Database)

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- TMDb API key (get one at [themoviedb.org](https://www.themoviedb.org/documentation/api))

### Installation for Windows

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/movie-explorer-pro.git
   cd movie-explorer-pro

   Install dependencies:

2. npm install
Create a .env file in the root directory and add your TMDb API key:

3. TMDB_API_KEY=your_api_key_here
Install cross-env for Windows compatibility:

4. npm install --save-dev cross-env
Start the development server:

5. npm run dev
Note for Windows users: If you encounter binding issues with 0.0.0.0:5000, modify server/index.ts to use 'localhost' instead of '0.0.0.0'

6. Mac/Linux Installation
Follow steps 1-3 above, then:

7. npm run dev
Usage
Navigate to the homepage to see trending movies
Use the search bar to find specific movies
Click on a movie card to view detailed information
Toggle between light and dark mode using the theme switch
Login to save your favorite movies

8. Acknowledgments
Data provided by The Movie Database (TMDb)
This product uses the TMDb API but is not endorsed or certified by TMDb
