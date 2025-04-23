import react_1 from 'react';
import util_1 from 'react-use/lib/misc/util';
const defaultEvents = ['mousedown', 'touchstart'];
const useClickAway = function (ref, onClickAway, events, ignores: (HTMLElement | null | undefined)[] = []) {
  if (events === void 0) {
    events = defaultEvents;
  }
  let savedCallback = react_1.useRef(onClickAway);
  react_1.useEffect(
    function () {
      savedCallback.current = onClickAway;
    },
    [onClickAway],
  );
  react_1.useEffect(
    function () {
      let handler = function (event) {
        let el = ref.current;
        if (ignores.some((i) => i?.contains(event.target))) {
          return;
        }
        el && !el.contains(event.target) && savedCallback.current(event);
      };
      for (let _i = 0, events_1 = events; _i < events_1.length; _i++) {
        let eventName = events_1[_i];
        util_1.on(document, eventName, handler);
      }
      return function () {
        for (let _i = 0, events_2 = events; _i < events_2.length; _i++) {
          let eventName = events_2[_i];
          util_1.off(document, eventName, handler);
        }
      };
    },
    [events, ref],
  );
};
export default useClickAway;
