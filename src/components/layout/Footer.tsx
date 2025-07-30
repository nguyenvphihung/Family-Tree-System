import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Family Tree System</h3>
            <p className="text-gray-300 text-sm">
              Connect with your family, preserve memories, and build your family legacy.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/login" className="hover:text-white">Login</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/family-tree" className="hover:text-white">Family Tree</a></li>
              <li><a href="/members" className="hover:text-white">Members</a></li>
              <li><a href="/photos" className="hover:text-white">Photos</a></li>
              <li><a href="/events" className="hover:text-white">Events</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Email: support@familytreesystem.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Family St, Tree City</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-300">
            © 2024 Family Tree System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 