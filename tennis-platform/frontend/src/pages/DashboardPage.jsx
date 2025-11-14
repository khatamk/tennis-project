import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🎾</span>
              <h1 className="text-2xl font-bold text-gray-900">Tennis Platform</h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h2>
          <p className="text-green-100 text-lg">
            Ready to play some tennis today?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm font-medium">ELO Rating</h3>
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{user?.eloRating || 1000}</p>
            <p className="text-xs text-gray-500 mt-1">
              NTRP: {user?.ntrpInitial || '3.5'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm font-medium">Matches</h3>
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{user?.totalMatches || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Total played</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm font-medium">Win Rate</h3>
              <span className="text-2xl">🏆</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {user?.totalMatches ? 
                Math.round((user.wins / user.totalMatches) * 100) : 0}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {user?.wins || 0}W - {user?.losses || 0}L
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm font-medium">Streak</h3>
              <span className="text-2xl">🔥</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {user?.currentStreak || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {user?.currentStreak >= 0 ? 'Win' : 'Loss'} streak
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
            <div className="text-4xl mb-4">🎾</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Find Players</h3>
            <p className="text-gray-600 text-sm mb-4">
              Search for players at your skill level
            </p>
            <button className="text-green-600 font-medium text-sm hover:underline">
              Coming Soon →
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Schedule Match</h3>
            <p className="text-gray-600 text-sm mb-4">
              Book a court and invite players
            </p>
            <button className="text-green-600 font-medium text-sm hover:underline">
              Coming Soon →
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
            <div className="text-4xl mb-4">🏟️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Find Courts</h3>
            <p className="text-gray-600 text-sm mb-4">
              Discover tennis courts in Baku
            </p>
            <button className="text-green-600 font-medium text-sm hover:underline">
              Coming Soon →
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tournaments</h3>
            <p className="text-gray-600 text-sm mb-4">
              Join competitive tournaments
            </p>
            <button className="text-green-600 font-medium text-sm hover:underline">
              Coming Soon →
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Messages</h3>
            <p className="text-gray-600 text-sm mb-4">
              Chat with other players
            </p>
            <button className="text-green-600 font-medium text-sm hover:underline">
              Coming Soon →
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">My Profile</h3>
            <p className="text-gray-600 text-sm mb-4">
              View and edit your profile
            </p>
            <button className="text-green-600 font-medium text-sm hover:underline">
              Coming Soon →
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <span className="text-3xl mr-4">ℹ️</span>
            <div>
              <h4 className="font-bold text-blue-900 mb-2">
                🎉 Welcome to Tennis Platform!
              </h4>
              <p className="text-blue-800 text-sm">
                You've successfully completed <strong>Feature #1: Player Profiles</strong>. 
                More features like Match Scheduling, Court Finder, and Tournaments are coming soon!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
