import { useState, useEffect } from 'react';
import type { MessageBase } from '@/messager/base';
import type { MessageBaseInject } from '@/messager/base-inject';
export function useMessagerData<T extends Record<string, any>>(messager: MessageBase<T> | MessageBaseInject<T>) {
  const [statData, setStatData] = useState(messager.stats);
  useEffect(() => {
    return messager.subscribe((data) => {
      setStatData(data?.data.value!);
    });
  }, []);
  return statData;
}
