"use client"
import Qr from '@/components/Form/Qr'
import React from 'react';
import "./MyHome.css"

const MyHome = () => {
  return (
    <div>
      <h1 className='Logo'>VirtualCare</h1>
        <Qr/>
    </div>
  )
}

export default MyHome;