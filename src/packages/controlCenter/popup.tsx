import { useEffect } from 'react';
import Controller, { toggleSwitch } from '@/controller';
const Demo = () => {
  useEffect(() => {
    return Controller?.subscribe((data) => {
      console.log('popup subs data', data, Controller?.queue);
    });
  }, []);
  const onClick = async () => {
    await toggleSwitch('demo', !Controller.stats.demo.on);
  };
  return (
    <div>
      <h1>Hello, World!</h1>
      <p>This is control center popup.</p>
      <button onClick={onClick}>switch demo on/off</button>
    </div>
  );
};
export default Demo;
