/**
 * copied from 'plausible-tracker' to do package patch to support custom api path
 */

import Plausible from './lib/tracker';

export type { PlausibleOptions } from './lib/tracker';
export type { EventOptions } from './lib/request';

export default Plausible;
