import React from 'react'
import QRCode from 'react-qr-code';
import { useParams } from 'react-router-dom';

const QR = () => {

    const id = useParams().id;
    console.log(id);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Event Attendance QR</h1>
        <QRCode
          size={256}
          bgColor="#ffffff"
          fgColor="#1e293b"
          value={`http://192.168.1.100:5173/mark-attendance/${id}`}
          className="mb-4"
        />
        <p className="text-gray-700 mb-2">Scan this QR code to mark your attendance for the event.</p>
        <div className="mt-4 text-sm text-gray-400">Event ID: {id}</div>
      </div>
    </div>
  )
}

export default QR