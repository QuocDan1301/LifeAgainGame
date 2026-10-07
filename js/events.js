import { ageEvents1To10 } from "./events-1-10.js";
import { ageEvents11To20 } from "./events-11-20.js";
import { applyEventMedia } from "./event-media.js";
export const ageEvents = {};
Object.assign(ageEvents, ageEvents1To10);
Object.assign(ageEvents, ageEvents11To20);
applyEventMedia(ageEvents);
