// import { Browser } from 'webextension-polyfill';
import styles from './Ring.module.scss';
// import Gradient1 from '@/assets/imgs/ring-g1.jpg';
// import Gradient2 from '@/assets/imgs/ring-g2.jpg';

const Gradient1 = browser.runtime.getURL('/imgs/ring-g1.jpg');
const Gradient2 = browser.runtime.getURL('/imgs/ring-g2.jpg');
interface RingProps {
  otherGradient?: boolean;
  reverseSpin?: boolean;
  play?: boolean;
}

const Ring = ({ otherGradient, reverseSpin, play }: RingProps) => {
  return (
    <img
      src={otherGradient ? Gradient2 : Gradient1}
      alt='ring'
      className={`${styles.theRing} object-cover ${reverseSpin ? 'isReverse' : ''}`}
      style={{
        borderRadius: '50%',
        height: '100%',
        width: '100%',
        animationPlayState: play ? 'running' : 'paused',
      }}
    />
  );
};

export default Ring;
