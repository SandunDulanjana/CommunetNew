import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const MarkAttendance = () => {
  const { eventId } = useParams();
  const [status, setStatus] = useState('Marking your attendance...');

  useEffect(() => {
    const mark = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setStatus('You must be logged in to mark attendance.');
          return;
        }
        const response = await fetch('http://localhost:5000/api/event/mark-attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId }),
        });
        const data = await response.json();
        setStatus(data.message);
      } catch (err) {
        setStatus('Failed to mark attendance.');
      }
    };
    mark();
  }, [eventId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Event Attendance</h1>
        <p className="text-gray-700">{status}</p>
      </div>
    </div>
  );
};

export default MarkAttendance;
