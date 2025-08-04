import React, { useState } from "react";

interface FinishAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (data: { yearOfBirth: string; gender: string }) => void;
}

const FinishAccountModal: React.FC<FinishAccountModalProps> = ({
  isOpen,
  onClose,
  onContinue,
}) => {
  const [yearOfBirth, setYearOfBirth] = useState("2003");
  const [gender, setGender] = useState("male");

  const handleContinue = () => {
    onContinue({ yearOfBirth, gender });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Finish creating your account
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Please fill in the missing details to complete your registration:
        </p>

        <div className="space-y-4">
          {/* Year of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Year of birth
            </label>
            <select
              value={yearOfBirth}
              onChange={(e) => setYearOfBirth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {Array.from({ length: 100 }, (_, i) => 2024 - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Gender
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-900">Male</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-900">Female</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleContinue}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishAccountModal; 