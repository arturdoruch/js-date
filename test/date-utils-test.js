/*
 * (c) Artur Doruch <arturdoruch@interia.pl>
 */

import dateUtils from './../lib/date-utils';
import './../lib/date-polyfills';

console.log( dateUtils.getMonthName(6, true) );
console.log( dateUtils.getMonthNumber('June') );

const dateRange = dateUtils.generateDateRange(
    new Date(),
    new Date().modify('1 day'),
    '10 hours',
);

console.log(dateRange);