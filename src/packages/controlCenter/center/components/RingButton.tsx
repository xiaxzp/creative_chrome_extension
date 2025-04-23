import { useControlCenterContext } from '../provider';
import { useRef, useState, useEffect } from 'react';
import styles from './RingButton.module.scss';
import Ring from './Ring';
import TheOnePanel from './TheOnePanel';
import { motion } from 'framer-motion';
import { getRingPosition, saveRingPosition, RingPosition } from '../data/RingPositionStore';
import useClickAway from '@/hooks/useClickAway';
import { getShadowContainerSync } from '@/utils/webContainer';

const RingButton = () => {
  const { availableSwitches } = useControlCenterContext();
  const [position, setPosition] = useState<RingPosition>({});
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const noControlledExtensionAvailable = availableSwitches.length <= 0;

  const presentPosition = position[location.hostname] ?? {
    x: 0,
    y: 0,
  };

  useEffect(() => {
    getRingPosition().then((pos) => {
      setPosition(pos ?? position);
    });
  }, []);

  useClickAway(
    containerRef,
    () => {
      console.log('OUTSIDE CLICKED', document);
      setVisible(false);
    },
    ['click'],
    [getShadowContainerSync().container],
  );

  const openPanel = () => {
    console.log('open');
    setVisible((b) => !b);
  };

  return (
    <div
      className='control-center'
      style={{
        position: 'fixed',
        bottom: '15px',
        right: '15px',
        zIndex: 9999,
        paddingTop: '20px',
      }}
    >
      {/* Tooltip 组件需要替换为React实现 */}
      <motion.div
        ref={containerRef}
        onClick={openPanel}
        drag
        dragMomentum
        initial={false}
        animate={{ x: presentPosition.x, y: presentPosition.y }}
        onDragEnd={(_, info) => {
          const newX = presentPosition.x + info.offset.x;
          const newY = presentPosition.y + info.offset.y;
          const newPosition = {
            [location.hostname]: {
              x: newX,
              y: newY,
            },
          };
          setPosition(newPosition);
          saveRingPosition(newPosition);
        }}
        className={`the-button max-w-20vw max-h-20vw fixed right-[16px] bottom-[16px] h-[55px] w-[55px]`}
      >
        {/* 环形动画组件 */}
        {[75, 100, 75, 50].map((opacity, idx) => (
          <div key={idx} className={`${styles.ringBox} h-[55px] w-[55px]`} style={{ opacity: opacity / 100 }}>
            <Ring reverseSpin={idx === 1} otherGradient={idx === 1} play />
          </div>
        ))}

        <TheOnePanel left={0} top={0} visible={visible} />
      </motion.div>

      <aside className='badge-container'>
        {/* 状态标识区块 */}
        {/* 此处需要补充具体实现 */}
      </aside>
    </div>
  );
};
export default RingButton;
