/*
 * (c) Artur Doruch <arturdoruch@interia.pl>
 */

import './../lib/date-polyfills';

const date = new Date();

// Test modify
//date.modify('-15 year');
//date.modify('716 month');
date.modify('+230 hours');
console.log(date.format('iso'));
