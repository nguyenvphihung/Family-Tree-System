import React, { useState } from "react";

interface AddParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  parentType: "father" | "mother";
  childName: string;
}

const AddParentModal: React.FC<AddParentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  parentType,
  childName,
}) => {
  const [formData, setFormData] = useState({
    gender: parentType === "father" ? "male" : "female",
    firstName: "",
    lastName: "",
    prefix: "",
    suffix: "",
    birthDate: {
      precision: "Exactly",
      month: "",
      day: "",
      year: "",
    },
    birthPlace: "",
    isAlive: true,
    email: "",
  });

  const datePrecisionOptions = [
    "Exactly",
    "Before", 
    "After",
    "Circa",
    "Unsure date",
    "Between ... and ...",
    "From ... to ...",
    "From",
    "To",
    "Free text"
  ];

  const months = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  const days = Array.from({length: 31}, (_, i) => (i + 1).toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Add {parentType} of {childName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quick Guide */}
        <div className="px-4 py-2">
          <button className="text-orange-500 text-xs flex items-center hover:text-orange-600">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Quick guide
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <div className="space-y-2">
              {[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "unknown", label: "Unknown" },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={formData.gender === option.value}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First (and middle) name:
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last name:
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

                     {/* Prefix/Suffix */}
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Prefix:</label>
               <div className="relative">
                 <select
                   value={formData.prefix}
                   onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none"
                 >
                   <option value="">Chọn prefix</option>
                   <option value="Dr.">Dr.</option>
                   <option value="Prof.">Prof.</option>
                   <option value="Rev.">Rev.</option>
                   <option value="Sir">Sir</option>
                   <option value="Mr.">Mr.</option>
                   <option value="Mrs.">Mrs.</option>
                   <option value="Ms.">Ms.</option>
                 </select>
                 <svg className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </div>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Suffix:</label>
               <div className="relative">
                 <select
                   value={formData.suffix}
                   onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none"
                 >
                   <option value="">Chọn suffix</option>
                   <option value="Esq.">Esq.</option>
                   <option value="I">I</option>
                   <option value="II">II</option>
                   <option value="III">III</option>
                   <option value="Jr.">Jr.</option>
                   <option value="Sr.">Sr.</option>
                 </select>
                 <svg className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </div>
             </div>
           </div>

                     {/* Birth Information */}
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Birth date:</label>
               <div className="grid grid-cols-4 gap-2">
                 <div className="col-span-1">
                   <select 
                     value={formData.birthDate.precision}
                     onChange={(e) => setFormData({ 
                       ...formData, 
                       birthDate: { ...formData.birthDate, precision: e.target.value } 
                     })}
                     className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                   >
                     {datePrecisionOptions.map((option) => (
                       <option key={option} value={option}>{option}</option>
                     ))}
                   </select>
                 </div>
                 <div className="col-span-1">
                   <select 
                     value={formData.birthDate.month}
                     onChange={(e) => setFormData({ 
                       ...formData, 
                       birthDate: { ...formData.birthDate, month: e.target.value } 
                     })}
                     className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                   >
                     <option value="">Tháng</option>
                     {months.map((month, index) => (
                       <option key={month} value={month}>{month}</option>
                     ))}
                   </select>
                 </div>
                 <div className="col-span-1">
                   <select 
                     value={formData.birthDate.day}
                     onChange={(e) => setFormData({ 
                       ...formData, 
                       birthDate: { ...formData.birthDate, day: e.target.value } 
                     })}
                     className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                   >
                     <option value="">Ngày</option>
                     {days.map((day) => (
                       <option key={day} value={day}>{day}</option>
                     ))}
                   </select>
                 </div>
                 <div className="col-span-1">
                   <input
                     type="text"
                     placeholder="Năm"
                     value={formData.birthDate.year}
                     onChange={(e) => setFormData({ 
                       ...formData, 
                       birthDate: { ...formData.birthDate, year: e.target.value } 
                     })}
                     className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                   />
                 </div>
               </div>
             </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Birth place:</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <svg className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Status and Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="space-y-2">
                {[
                  { value: true, label: "Living" },
                  { value: false, label: "Deceased" },
                ].map((option) => (
                  <label key={option.value.toString()} className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.isAlive === option.value}
                      onChange={() => setFormData({ ...formData, isAlive: option.value })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address:
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3">
            <button
              type="button"
              className="text-orange-500 text-xs hover:text-orange-600"
            >
              Edit more (bio, more facts...)
            </button>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm"
              >
                OK
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddParentModal;
