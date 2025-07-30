import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Family Tree Dashboard</h1>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Family Members Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Family Members</h3>
            <div className="text-3xl font-bold text-blue-800 mb-2">24</div>
            <p className="text-gray-600">Total family members</p>
          </div>

          {/* Recent Activities Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-600">Recent Activities</h3>
            <div className="text-3xl font-bold text-green-800 mb-2">12</div>
            <p className="text-gray-600">Activities this month</p>
          </div>

          {/* Photos Shared Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">Photos Shared</h3>
            <div className="text-3xl font-bold text-purple-800 mb-2">156</div>
            <p className="text-gray-600">Total photos shared</p>
          </div>

          {/* Family Events Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-orange-600">Upcoming Events</h3>
            <div className="text-3xl font-bold text-orange-800 mb-2">3</div>
            <p className="text-gray-600">Events this month</p>
          </div>

          {/* Family Tree Status Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-red-600">Tree Completeness</h3>
            <div className="text-3xl font-bold text-red-800 mb-2">85%</div>
            <p className="text-gray-600">Family tree completion</p>
          </div>

          {/* Stories Shared Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Family Stories</h3>
            <div className="text-3xl font-bold text-indigo-800 mb-2">28</div>
            <p className="text-gray-600">Stories shared</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Add Family Member
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Share Photo
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Create Event
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              View Tree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 