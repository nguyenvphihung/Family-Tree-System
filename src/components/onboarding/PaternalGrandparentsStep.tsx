import React, { useState } from "react";

interface PaternalGrandparentsStepProps {
  onDone: (data: any) => void;
  onSkip: () => void;
}

const PaternalGrandparentsStep: React.FC<PaternalGrandparentsStepProps> = ({ onDone, onSkip }) => {
  const [paternalGrandmother, setPaternalGrandmother] = useState({
    firstName: "",
    maidenName: "",
    yearOfBirth: "",
    countryOfBirth: "",
    isAlive: true,
  });

  const [paternalGrandfather, setPaternalGrandfather] = useState({
    firstName: "vo", // Pre-filled as shown in the image
    yearOfBirth: "",
    countryOfBirth: "",
    isAlive: true,
  });

  const handleDone = () => {
    onDone({ 
      paternalGrandmother, 
      paternalGrandfather 
    });
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            🌳
          </div>
          <span className="ml-2 text-xl font-semibold text-gray-900">MyHeritage</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
              ✓
            </div>
            <span className="ml-2 text-sm text-gray-600">P</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
              ✓
            </div>
            <span className="ml-2 text-sm text-gray-600">Mom</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
              ✓
            </div>
            <span className="ml-2 text-sm text-gray-600">Dad</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
              ✓
            </div>
            <span className="ml-2 text-sm text-gray-600">Grandma</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
              ✓
            </div>
            <span className="ml-2 text-sm text-gray-600">Grandpa</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-orange-500">
              G
            </div>
            <span className="ml-2 text-sm text-gray-900 font-medium">Grandma</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-orange-500">
              G
            </div>
            <span className="ml-2 text-sm text-gray-900 font-medium">Grandpa</span>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
              🌳
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Please tell us what you know about your grandparents, and we'll help you explore your roots.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Paternal Grandmother Section */}
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-pink-600 text-xl">👵</span>
              </div>
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Your Father's Mother (Grandma)</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  value={paternalGrandmother.firstName}
                  onChange={(e) => setPaternalGrandmother({ ...paternalGrandmother, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maiden name
                </label>
                <input
                  type="text"
                  value={paternalGrandmother.maidenName}
                  onChange={(e) => setPaternalGrandmother({ ...paternalGrandmother, maidenName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter maiden name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year of birth
                </label>
                <input
                  type="text"
                  value={paternalGrandmother.yearOfBirth}
                  onChange={(e) => setPaternalGrandmother({ ...paternalGrandmother, yearOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter year of birth"
                />
                <p className="text-xs text-gray-500 mt-1">Or the full date if known</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country of birth
                </label>
                <input
                  type="text"
                  value={paternalGrandmother.countryOfBirth}
                  onChange={(e) => setPaternalGrandmother({ ...paternalGrandmother, countryOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter country of birth"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={paternalGrandmother.isAlive}
                  onChange={(e) => setPaternalGrandmother({ ...paternalGrandmother, isAlive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Is alive</label>
              </div>
            </div>
          </div>

          {/* Paternal Grandfather Section */}
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">👴</span>
              </div>
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Your Father's Father (Grandpa)</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  value={paternalGrandfather.firstName}
                  onChange={(e) => setPaternalGrandfather({ ...paternalGrandfather, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year of birth
                </label>
                <input
                  type="text"
                  value={paternalGrandfather.yearOfBirth}
                  onChange={(e) => setPaternalGrandfather({ ...paternalGrandfather, yearOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter year of birth"
                />
                <p className="text-xs text-gray-500 mt-1">Or the full date if known</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country of birth
                </label>
                <input
                  type="text"
                  value={paternalGrandfather.countryOfBirth}
                  onChange={(e) => setPaternalGrandfather({ ...paternalGrandfather, countryOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter country of birth"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={paternalGrandfather.isAlive}
                  onChange={(e) => setPaternalGrandfather({ ...paternalGrandfather, isAlive: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Is alive</label>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">Step 4 of 4</div>
          <div className="flex space-x-4">
            <button
              onClick={handleSkip}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Skip
            </button>
            <button
              onClick={handleDone}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaternalGrandparentsStep; 