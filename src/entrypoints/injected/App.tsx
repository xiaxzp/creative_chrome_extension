import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '@/assets/wxt.svg';
import './App.css';
import packageComponents from '@/package-index/injected';
import Controller, { PackageStats } from '@/controller/index-inject';
import { matchUrlInPage } from '@/utils/matcher';
import Config from '@/package-index/config';
import { useMessagerData } from '@/hooks/useMessagerData';

function App() {
  const [count, setCount] = useState(0);
  const stats = useMessagerData(Controller);
  function renderPackageComponents() {
    return Object.entries(packageComponents).map(([name, Component]) => {
      const config = Config[name];
      const match = matchUrlInPage(config?.matches);
      return stats[name]?.on && match ? (
        <div key={name}>
          <h1>{name}</h1>
          <div>
            <Component />
          </div>
        </div>
      ) : null;
    });
  }

  return (
    <>
      <div className='p-16'>
        <img src={wxtLogo} className='logo' alt='WXT logo' />
      </div>
      <h1>WXT + React</h1>
      {renderPackageComponents()}
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
      </div>
    </>
  );
}

export default App;
