import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5">
      <h2 className="text-lg font-bold mb-5">Communication Dashboard</h2>
      <ul>
        <li className="mb-3">
          <Link to="/AddAnnouncementPage" className="hover:text-gray-300"> Add Announcements</Link>
        </li>
        <li className="mb-3">
          <Link to="/DisplayAllPage" className="hover:text-gray-300">All announcements</Link>
        </li>
        <li className="mb-3">
          <Link to="/selected-announcements" className="hover:text-gray-300">Selected Announcements</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;