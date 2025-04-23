import { createContext, useContext, useState, useMemo } from 'react';

import Controller, { PackageStats, toggleSwitch } from '@/controller/index';
import { matchUrlInPage } from '@/utils/matcher';
import Config from '@/package-index/config';
import { useMessagerData } from '@/hooks/useMessagerData';

export interface ControlCenterContextType {
  stats: PackageStats;
  availableSwitches: string[];
  toggleSwitch: (name: string, isOn: boolean) => Promise<void>;
}
const defaultControlCenterContext: ControlCenterContextType = {
  stats: {},
  availableSwitches: [],
  toggleSwitch: async () => {},
};
const ControlCenterContext = createContext(defaultControlCenterContext);
export const useControlCenterContext = () => {
  return useContext(ControlCenterContext);
};

export const ControlCenterProvider = ({ children }) => {
  const stats = useMessagerData(Controller);

  const availableSwitches = useMemo(() => {
    const switches = Object.keys(stats);
    return switches.filter((name) => {
      const switchConfig = Config[name];
      if (!switchConfig) {
        return false;
      }
      const { showInCenter, matches } = switchConfig;
      return showInCenter && matchUrlInPage(matches);
    });
  }, [stats]);

  return (
    <ControlCenterContext.Provider value={{ stats, availableSwitches, toggleSwitch }}>
      {children}
    </ControlCenterContext.Provider>
  );
};
