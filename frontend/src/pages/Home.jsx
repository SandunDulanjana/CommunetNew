import React from 'react';
import Footer from '../componenets/Footer';
import HomeHeder from '../componenets/HomeHeder';

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header Section */}
      <HomeHeder />

      {/* Description Section */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 text-lg leading-relaxed">
        <p className="text-center text-2xl font-bold text-gray-900 mb-6">
          Welcome to Our Homeowners Association Community
        </p>

        <p className="text-gray-700">
          Our community is designed to provide homeowners with seamless access to essential services, updates, and engagement opportunities. 
          We are committed to creating a well-managed, connected, and thriving neighborhood through our key functions:
        </p>

        <ul className="mt-6 space-y-4">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✔</span>
            <span>
              <strong>Event Management</strong> – Stay updated on upcoming community events, social gatherings, and important meetings. Easily RSVP and participate in activities that bring neighbors together.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✔</span>
            <span>
              <strong>Maintenance Management</strong> – Report maintenance issues, track service requests, and ensure timely repairs to keep our community in top condition.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✔</span>
            <span>
              <strong>Communication Management</strong> – Receive real-time announcements, important updates, and direct messages from the HOA. Stay connected with your neighbors and board members.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✔</span>
            <span>
              <strong>Election Management</strong> – Participate in fair and transparent HOA elections, vote on community matters, and stay informed about leadership decisions.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✔</span>
            <span>
              <strong>Finance Management</strong> – Manage HOA dues, track expenses, and access financial reports for full transparency on community funds.
            </span>
          </li>
        </ul>

        <p className="mt-6 text-gray-700">
          Join us in building a stronger, more organized, and engaging community where every homeowner has a voice. 
          Stay informed, get involved, and enjoy the benefits of being part of a well-managed neighborhood!
        </p>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default Home;
