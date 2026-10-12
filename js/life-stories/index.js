// Gom các giai đoạn. Thêm giai đoạn mới: import rồi nối vào lifeStoryCatalog.
import { stage01To10 } from './stage-01-10.js';
import { stage11To23 } from './stage-11-23.js';
import { stage26To32 } from './stage-26-32.js';
import { stage33To39 } from './stage-33-39.js';
import { stage40To49 } from './stage-40-49.js';
import { stage50To59 } from './stage-50-59.js';
import { stage60To69 } from './stage-60-69.js';
import { stage70To79 } from './stage-70-79.js';
import { stage80To89 } from './stage-80-89.js';
import { stage90To104 } from './stage-90-104.js';

export const lifeStoryCatalog = [
  ...stage01To10,
  ...stage11To23,
  ...stage26To32,
  ...stage33To39,
  ...stage40To49,
  ...stage50To59,
  ...stage60To69,
  ...stage70To79,
  ...stage80To89,
  ...stage90To104,
];
