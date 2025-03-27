import React from 'react'
import QRCode from 'react-qr-code';
import { useParams } from 'react-router-dom';

const QR = () => {

    const id = useParams().id;
    console.log(id);
  return (
    <div>
        <QRCode 
        size={400}
        bgColor='white'
        fgColor='black'
        value={id} />
        <h1>Scan this QR code to mark attendance</h1>

    </div>
  )
}

export default QR