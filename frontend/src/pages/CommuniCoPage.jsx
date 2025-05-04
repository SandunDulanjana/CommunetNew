import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CommuniCoPage() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    total: 0,
    emergency: 0,
    maintenance: 0,
    general: 0
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/announcement/countByType')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCounts(data.counts);
      });
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header and Tabs */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold mr-4">
            <span className="inline-flex items-center text-indigo-600">
              <span className="mr-2">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M4 4h16v12H5.17L4 17.17V4z" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              Communication Center
            </span>
          </span>
          <div className="ml-8 flex space-x-6 text-lg font-medium">
            <span className="border-b-2 border-indigo-600 pb-1 cursor-pointer">Dashboard</span>
            <span className="text-gray-500 hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/addannoucement')}>New Announcement</span>
            <span className="text-gray-500 hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/displayallannoucement')}>All Announcements</span>
            <span className="text-gray-500 hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/ticket')}>Ticket</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500 mb-2">Total Announcements</span>
          <span className="text-2xl font-bold">{counts.total}</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500 mb-2 flex items-center"><span className="text-red-500 mr-1">&#9888;</span>Emergency Notices</span>
          <span className="text-2xl font-bold">{counts.emergency}</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500 mb-2 flex items-center"><span className="text-yellow-500 mr-1">&#9889;</span>Maintenance Updates</span>
          <span className="text-2xl font-bold">{counts.maintenance}</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500 mb-2 flex items-center"><span className="text-blue-500 mr-1">&#128227;</span>General Announcements</span>
          <span className="text-2xl font-bold">{counts.general}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="text-lg font-semibold mb-4">Quick Actions</div>
        <div className="flex flex-wrap gap-4">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold" onClick={() => navigate('/addannoucement')}>New Announcement</button>
          <button className="bg-indigo-100 text-indigo-600 px-6 py-2 rounded font-semibold" onClick={() => navigate('/displayallannoucement')}>View All Announcements</button>
          <a href="https://chat.whatsapp.com/KoQxFlg0GcM1Y15167SnGf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition-colors duration-200" title="Join Staff WhatsApp Group">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32" fill="currentColor" className="mr-2">
              <path d="M16.003 3.2c-7.067 0-12.8 5.733-12.8 12.8 0 2.267.6 4.467 1.733 6.4l-1.867 6.8c-.133.533.4 1.067.933.933l6.8-1.867c1.867 1.067 4.133 1.733 6.267 1.733h.067c7.067 0 12.8-5.733 12.8-12.8s-5.733-12.8-12.8-12.8zm0 23.467c-2 0-4.067-.533-5.733-1.6-.267-.133-.533-.133-.8-.067l-5.067 1.4 1.4-5.067c.067-.267.067-.533-.067-.8-1.067-1.6-1.6-3.6-1.6-5.6 0-6.067 4.933-11 11-11s11 4.933 11 11-4.933 11-11 11zm6.267-8.267c-.333-.167-1.933-.933-2.233-1.033-.3-.1-.5-.167-.7.167-.2.333-.8 1.033-.983 1.233-.183.2-.367.217-.7.067-.333-.167-1.4-.517-2.667-1.65-.983-.883-1.65-1.967-1.85-2.3-.183-.333-.02-.5.133-.667.133-.133.3-.333.45-.5.15-.167.2-.283.3-.467.1-.183.05-.35-.017-.5-.067-.133-.7-1.7-.967-2.333-.25-.6-.5-.517-.7-.517-.183-.017-.4-.017-.617-.017-.217 0-.567.083-.867.4-.3.333-1.133 1.1-1.133 2.683 0 1.583 1.167 3.117 1.333 3.333.167.217 2.3 3.517 5.617 4.783.783.267 1.4.433 1.883.55.792.2 1.517.167 2.083.1.633-.067 1.933-.783 2.2-1.55.267-.767.267-1.433.183-1.55-.083-.117-.3-.183-.633-.333z"/>
            </svg>
            Staff
          </a>
          <a href="https://chat.whatsapp.com/LvWzIN3iY3SCCnUjpxobTQ" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition-colors duration-200" title="Join 1st Floor WhatsApp Group">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32" fill="currentColor" className="mr-2">
              <path d="M16.003 3.2c-7.067 0-12.8 5.733-12.8 12.8 0 2.267.6 4.467 1.733 6.4l-1.867 6.8c-.133.533.4 1.067.933.933l6.8-1.867c1.867 1.067 4.133 1.733 6.267 1.733h.067c7.067 0 12.8-5.733 12.8-12.8s-5.733-12.8-12.8-12.8zm0 23.467c-2 0-4.067-.533-5.733-1.6-.267-.133-.533-.133-.8-.067l-5.067 1.4 1.4-5.067c.067-.267.067-.533-.067-.8-1.067-1.6-1.6-3.6-1.6-5.6 0-6.067 4.933-11 11-11s11 4.933 11 11-4.933 11-11 11zm6.267-8.267c-.333-.167-1.933-.933-2.233-1.033-.3-.1-.5-.167-.7.167-.2.333-.8 1.033-.983 1.233-.183.2-.367.217-.7.067-.333-.167-1.4-.517-2.667-1.65-.983-.883-1.65-1.967-1.85-2.3-.183-.333-.02-.5.133-.667.133-.133.3-.333.45-.5.15-.167.2-.283.3-.467.1-.183.05-.35-.017-.5-.067-.133-.7-1.7-.967-2.333-.25-.6-.5-.517-.7-.517-.183-.017-.4-.017-.617-.017-.217 0-.567.083-.867.4-.3.333-1.133 1.1-1.133 2.683 0 1.583 1.167 3.117 1.333 3.333.167.217 2.3 3.517 5.617 4.783.783.267 1.4.433 1.883.55.792.2 1.517.167 2.083.1.633-.067 1.933-.783 2.2-1.55.267-.767.267-1.433.183-1.55-.083-.117-.3-.183-.633-.333z"/>
            </svg>
            A Block
          </a>
          <a href="https://chat.whatsapp.com/LNGmPMCJMDMJAilDDPOYfs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition-colors duration-200" title="Join 2nd Floor WhatsApp Group">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32" fill="currentColor" className="mr-2">
              <path d="M16.003 3.2c-7.067 0-12.8 5.733-12.8 12.8 0 2.267.6 4.467 1.733 6.4l-1.867 6.8c-.133.533.4 1.067.933.933l6.8-1.867c1.867 1.067 4.133 1.733 6.267 1.733h.067c7.067 0 12.8-5.733 12.8-12.8s-5.733-12.8-12.8-12.8zm0 23.467c-2 0-4.067-.533-5.733-1.6-.267-.133-.533-.133-.8-.067l-5.067 1.4 1.4-5.067c.067-.267.067-.533-.067-.8-1.067-1.6-1.6-3.6-1.6-5.6 0-6.067 4.933-11 11-11s11 4.933 11 11-4.933 11-11 11zm6.267-8.267c-.333-.167-1.933-.933-2.233-1.033-.3-.1-.5-.167-.7.167-.2.333-.8 1.033-.983 1.233-.183.2-.367.217-.7.067-.333-.167-1.4-.517-2.667-1.65-.983-.883-1.65-1.967-1.85-2.3-.183-.333-.02-.5.133-.667.133-.133.3-.333.45-.5.15-.167.2-.283.3-.467.1-.183.05-.35-.017-.5-.067-.133-.7-1.7-.967-2.333-.25-.6-.5-.517-.7-.517-.183-.017-.4-.017-.617-.017-.217 0-.567.083-.867.4-.3.333-1.133 1.1-1.133 2.683 0 1.583 1.167 3.117 1.333 3.333.167.217 2.3 3.517 5.617 4.783.783.267 1.4.433 1.883.55.792.2 1.517.167 2.083.1.633-.067 1.933-.783 2.2-1.55.267-.767.267-1.433.183-1.55-.083-.117-.3-.183-.633-.333z"/>
            </svg>
            B Block
          </a>
          <a href="https://chat.whatsapp.com/L1uztkFqbz23GbQ53cjTQY " target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition-colors duration-200" title="Join 2nd Floor WhatsApp Group">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32" fill="currentColor" className="mr-2">
              <path d="M16.003 3.2c-7.067 0-12.8 5.733-12.8 12.8 0 2.267.6 4.467 1.733 6.4l-1.867 6.8c-.133.533.4 1.067.933.933l6.8-1.867c1.867 1.067 4.133 1.733 6.267 1.733h.067c7.067 0 12.8-5.733 12.8-12.8s-5.733-12.8-12.8-12.8zm0 23.467c-2 0-4.067-.533-5.733-1.6-.267-.133-.533-.133-.8-.067l-5.067 1.4 1.4-5.067c.067-.267.067-.533-.067-.8-1.067-1.6-1.6-3.6-1.6-5.6 0-6.067 4.933-11 11-11s11 4.933 11 11-4.933 11-11 11zm6.267-8.267c-.333-.167-1.933-.933-2.233-1.033-.3-.1-.5-.167-.7.167-.2.333-.8 1.033-.983 1.233-.183.2-.367.217-.7.067-.333-.167-1.4-.517-2.667-1.65-.983-.883-1.65-1.967-1.85-2.3-.183-.333-.02-.5.133-.667.133-.133.3-.333.45-.5.15-.167.2-.283.3-.467.1-.183.05-.35-.017-.5-.067-.133-.7-1.7-.967-2.333-.25-.6-.5-.517-.7-.517-.183-.017-.4-.017-.617-.017-.217 0-.567.083-.867.4-.3.333-1.133 1.1-1.133 2.683 0 1.583 1.167 3.117 1.333 3.333.167.217 2.3 3.517 5.617 4.783.783.267 1.4.433 1.883.55.792.2 1.517.167 2.083.1.633-.067 1.933-.783 2.2-1.55.267-.767.267-1.433.183-1.55-.083-.117-.3-.183-.633-.333z"/>
            </svg>
            C Block
          </a>
          <a href="https://chat.whatsapp.com/BUAA6GA35Sl4Waj00hhkjH " target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition-colors duration-200" title="Join 2nd Floor WhatsApp Group">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32" fill="currentColor" className="mr-2">
              <path d="M16.003 3.2c-7.067 0-12.8 5.733-12.8 12.8 0 2.267.6 4.467 1.733 6.4l-1.867 6.8c-.133.533.4 1.067.933.933l6.8-1.867c1.867 1.067 4.133 1.733 6.267 1.733h.067c7.067 0 12.8-5.733 12.8-12.8s-5.733-12.8-12.8-12.8zm0 23.467c-2 0-4.067-.533-5.733-1.6-.267-.133-.533-.133-.8-.067l-5.067 1.4 1.4-5.067c.067-.267.067-.533-.067-.8-1.067-1.6-1.6-3.6-1.6-5.6 0-6.067 4.933-11 11-11s11 4.933 11 11-4.933 11-11 11zm6.267-8.267c-.333-.167-1.933-.933-2.233-1.033-.3-.1-.5-.167-.7.167-.2.333-.8 1.033-.983 1.233-.183.2-.367.217-.7.067-.333-.167-1.4-.517-2.667-1.65-.983-.883-1.65-1.967-1.85-2.3-.183-.333-.02-.5.133-.667.133-.133.3-.333.45-.5.15-.167.2-.283.3-.467.1-.183.05-.35-.017-.5-.067-.133-.7-1.7-.967-2.333-.25-.6-.5-.517-.7-.517-.183-.017-.4-.017-.617-.017-.217 0-.567.083-.867.4-.3.333-1.133 1.1-1.133 2.683 0 1.583 1.167 3.117 1.333 3.333.167.217 2.3 3.517 5.617 4.783.783.267 1.4.433 1.883.55.792.2 1.517.167 2.083.1.633-.067 1.933-.783 2.2-1.55.267-.767.267-1.433.183-1.55-.083-.117-.3-.183-.633-.333z"/>
            </svg>
            C Block
          </a>
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-lg font-semibold mb-4">Recent Announcements</div>
        <div className="text-center text-red-500">Failed to load announcements</div>
      </div>
    </div>
  );
}

export default CommuniCoPage;