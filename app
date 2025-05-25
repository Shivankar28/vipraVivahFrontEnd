import React from 'react';
import { Heart } from 'lucide-react';

export default function ViprVivahHomepage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation bar */}
      <nav className="bg-red-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Heart className="mr-2" size={20} />
          <span className="text-xl font-semibold">विप्रVivah</span>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="flex items-center">
            <span className="mr-2">🏠</span> Home
          </a>
          <a href="#" className="flex items-center">
            <span className="mr-2">✉️</span> Contact
          </a>
        </div>
      </nav>

      {/* Hero section with background image */}
      <div className="flex-grow flex flex-col items-center justify-center text-center bg-red-500 relative overflow-hidden py-16">
        {/* Semi-transparent overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400 opacity-50"></div>
        
        {/* Content */}
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-shadow">
            अखंड एवं विराट विप्र समाज को समर्पित
          </h1>
          
          <button className="bg-white text-red-500 px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-red-100 transition duration-300">
            → Let's Begin
          </button>
        </div>
      </div>
    </div>
  );
}







import React from 'react';
import { Heart } from 'lucide-react';

export default function ViprVivahHomepage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation bar */}
      <nav className="bg-red-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Heart className="mr-2" size={20} />
          <span className="text-xl font-semibold">विप्रVivah</span>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="flex items-center">
            <span className="mr-2">🏠</span> Home
          </a>
          <a href="#" className="flex items-center">
            <span className="mr-2">✉️</span> Contact
          </a>
        </div>
      </nav>

      {/* Hero section with background image */}
      <div className="flex-grow flex flex-col items-center justify-center text-center bg-red-500 relative overflow-hidden py-16">
        {/* Semi-transparent overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400 opacity-50"></div>
        
        {/* Content */}
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-shadow">
            अखंड एवं विराट विप्र समाज को समर्पित
          </h1>
          
          <button className="bg-white text-red-500 px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-red-100 transition duration-300">
            → Let's Begin
          </button>
        </div>
      </div>
    </div>
  );
}