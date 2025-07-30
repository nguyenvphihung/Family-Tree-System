import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to Family Tree System</h1>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">About Our Family Tree System</h2>
          <p className="text-gray-600 mb-4">
            Discover and explore your family history with our comprehensive family tree management system.
            Connect with relatives, share memories, and preserve your family legacy for future generations.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Family Connections</h3>
              <p className="text-blue-700">
                Build and visualize your family tree with an intuitive interface that makes it easy to add
                family members and their relationships.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Memory Sharing</h3>
              <p className="text-green-700">
                Share photos, stories, and important family events with your relatives in a secure
                and private environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 