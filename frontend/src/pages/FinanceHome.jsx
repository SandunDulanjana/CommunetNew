import React from 'react';
import { assets } from '../assets/assets';

const FinanceHome = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap rounded-lg px-6 md:px-10 lg:px-20 bg-gray-100'>
      {/* Left Section */}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] bg-gray-100'>
        <p className='text-3xl md:text-4xl lg:text-5xl text-black font-semibold leading-tight md:leading-tight lg:leading-tight'>
          Welcome To <br /> The Finance Center
        </p>
        <div className='flex flex-col md:flex-row items-center gap-3 text-black text-sm font-light'>
          <img className='w-28' src={assets.group_profiles} alt="Group Profiles" />
          <p>
            Empowering you with the tools and insights <br className='hidden sm:block' /> to manage and optimize our financial growth
          </p>
        </div>
        <a href="/expences" className='flex items-center gap-2 bg-black px-8 py-3 rounded-full text-white text-sm m-auto md:m-0 hover:bg-gray-800 transition-all duration-300'>
          Create Expense Report <img className='w-3' src={assets.arrow_icon} alt="Arrow Icon" />
        </a>
      </div>
      {/* Right Section */}
      <div className='md:w-1/2 relative bg-gray-100'>
        <img className='w-full h-auto rounded-lg md:mt-20' src={assets.header_img} alt="Header" />
      </div>
    </div>
  );
}

export default FinanceHome;