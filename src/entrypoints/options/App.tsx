import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';
import packageComponents from '@/package-index/options';
import Controller, { PackageStats } from '@/controller/index';
import { useMessagerData } from '@/hooks/useMessagerData';

function App() {
  const [count, setCount] = useState(0);
  const stats = useMessagerData(Controller);
  function renderPackageComponents() {
    return Object.entries(packageComponents).map(([name, Component]) => {
      return stats[name]?.on ? (
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
      <div>
        <img src={wxtLogo} className='logo' alt='WXT logo' />
      </div>
      <h1>WXT + React</h1>
      {renderPackageComponents()}
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>Click on the WXT and React logos to learn more</p>
      <p>{JSON.stringify(location.href)}</p>
    </>
  );
}

export default App;
