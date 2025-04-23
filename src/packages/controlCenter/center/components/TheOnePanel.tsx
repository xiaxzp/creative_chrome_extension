import { useState, useEffect, useMemo } from 'react';
import ControlItem from './ControlItem';
import { useControlCenterContext } from '../provider';
import config from '@/package-index/config';
import { motion, AnimatePresence } from 'framer-motion';
interface TheOnePanelProps {
  visible: boolean;
  left: number;
  top: number;
}
const TheOnePanel = ({ visible, left, top }: TheOnePanelProps) => {
  const { availableSwitches, stats, toggleSwitch } = useControlCenterContext();
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          onClick={(e) => {
            console.log('one panel click');
            e.stopPropagation();
            e.preventDefault();
          }}
          initial={{ y: 0, opacity: 0 }}
          exit={{ y: 0, opacity: 0 }}
          animate={{ y: -58 * availableSwitches.length, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 270, damping: 20.5 }}
          className='the-panel absolute top-[20px] left-[20px]'
          style={{
            position: 'absolute',
            left: `0px`,
            top: `0px`,
            pointerEvents: 'all',
            willChange: 'transform, opacity',
          }}
        >
          {availableSwitches.map((item, idx) => (
            <motion.div
              key={item}
              initial={{ y: -20 * idx, opacity: 0, display: 'none' }}
              exit={{ y: -20 * idx, opacity: 0, display: 'none' }}
              animate={{ y: 0, opacity: 1, display: 'block' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <ControlItem
                name={config[item]?.name ?? item}
                enabled={stats[item]?.on}
                toggleEnable={(isOn) => {
                  toggleSwitch(item, isOn);
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default TheOnePanel;
