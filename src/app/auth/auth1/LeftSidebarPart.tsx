'use client';
import Image from 'next/image';
import React from 'react';
import Bgimg from '/public/images/logos/logo-icon.svg';
import { Button } from 'flowbite-react';

const LeftSidebarPart = () => {
  return (
    <>
      <div className='circle-top'></div>
      <div>
        <Image src={Bgimg} alt='materilm' className='circle-bottom' />
      </div>
      <div className='flex justify-center h-screen items-center z-10 relative'>
        <div className='xl:w-7/12 xl:px-0 px-6'>
          <h2 className='text-white text-[40px] font-bold leading-[normal]'>
            <br></br>
            Vybe{' '}
          </h2>
        </div>
      </div>
    </>
  );
};

export default LeftSidebarPart;
