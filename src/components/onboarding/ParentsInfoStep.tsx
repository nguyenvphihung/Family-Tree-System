import React, { useState } from "react";

interface ParentsInfoStepProps {
  onNext: (data: any) => void;
  onSkip: () => void;
}

const ParentsInfoStep: React.FC<ParentsInfoStepProps> = ({ onNext, onSkip }) => {
  const [motherData, setMotherData] = useState({
    firstName: "",
    maidenName: "",
    yearOfBirth: "",
    countryOfBirth: "",
    isAlive: true,
  });

  const [fatherData, setFatherData] = useState({
    firstName: "xuan", // Pre-filled as shown in the image
    maidenName: "",
    yearOfBirth: "",
    countryOfBirth: "",
    isAlive: true,
  });

  const handleNext = () => {
    onNext({ mother: motherData, father: fatherData });
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
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-orange-500">
              M
            </div>
            <span className="ml-2 text-sm text-gray-900 font-medium">Mom</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-orange-500">
              D
            </div>
            <span className="ml-2 text-sm text-gray-900 font-medium">Dad</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs">
              G
            </div>
            <span className="ml-2 text-sm text-gray-400">Grandma</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs">
              G
            </div>
            <span className="ml-2 text-sm text-gray-400">Grandpa</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs">
              G
            </div>
            <span className="ml-2 text-sm text-gray-400">Grandma</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs">
              G
            </div>
            <span className="ml-2 text-sm text-gray-400">Grandpa</span>
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
          Please tell us about your parents, and we'll help you explore your roots.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Mother Section */}
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-pink-600 text-xl">👩</span>
              </div>
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Your Mother</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  value={motherData.firstName}
                  onChange={(e) => setMotherData({ ...motherData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="First name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maiden name
                </label>
                <input
                  type="text"
                  value={motherData.maidenName}
                  onChange={(e) => setMotherData({ ...motherData, maidenName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Maiden name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year of birth
                </label>
                <input
                  type="text"
                  value={motherData.yearOfBirth}
                  onChange={(e) => setMotherData({ ...motherData, yearOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Year of birth"
                />
                <p className="text-xs text-gray-500 mt-1">Or the full date if known</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country of birth
                </label>
                <input
                  type="text"
                  value={motherData.countryOfBirth}
                  onChange={(e) => setMotherData({ ...motherData, countryOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Country of birth"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={motherData.isAlive}
                  onChange={(e) => setMotherData({ ...motherData, isAlive: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Is alive</label>
              </div>
            </div>
          </div>

          {/* Father Section */}
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">👨</span>
              </div>
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Your Father</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  value={fatherData.firstName}
                  onChange={(e) => setFatherData({ ...fatherData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="First name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maiden name
                </label>
                <input
                  type="text"
                  value={fatherData.maidenName}
                  onChange={(e) => setFatherData({ ...fatherData, maidenName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Maiden name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year of birth
                </label>
                <input
                  type="text"
                  value={fatherData.yearOfBirth}
                  onChange={(e) => setFatherData({ ...fatherData, yearOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Year of birth"
                />
                <p className="text-xs text-gray-500 mt-1">Or the full date if known</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country of birth
                </label>
                <input
                  type="text"
                  value={fatherData.countryOfBirth}
                  onChange={(e) => setFatherData({ ...fatherData, countryOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Country of birth"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={fatherData.isAlive}
                  onChange={(e) => setFatherData({ ...fatherData, isAlive: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Is alive</label>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">Step 2 of 4</div>
          <div className="flex space-x-4">
            <button
              onClick={handleSkip}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentsInfoStep; 