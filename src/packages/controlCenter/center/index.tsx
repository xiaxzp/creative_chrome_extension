import React, { useEffect, useState } from 'react';
import { ControlCenterProvider } from './provider';
import RingButton from './components/RingButton';
const Center = () => {
  console.log('Center');

  return (
    <ControlCenterProvider>
      <div className='bg-gray-100 p-16'>Center</div>
      <RingButton />
    </ControlCenterProvider>
  );
};
export default React.createElement(Center);
