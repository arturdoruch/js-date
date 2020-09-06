/*
 * (c) Artur Doruch <arturdoruch@interia.pl>
 */

import dateParser from './../lib/date-parser';

dateParser.registerDayNames('wczoraj', 'dzisiaj', 'jutro');
dateParser.registerTimeAgoPhrases({
    "second ago": "vor einer sekunde",
    "minute ago": "vor einer minute",
    "hour ago":   "vor einer stunde",
    "day ago":    "vor einem tag",
    "week ago":   "vor einer woche",
    "month ago":  "vor einem monat",
    "year ago":   "vor einem jahr",
}, {
    "seconds ago": "vor {value} sekunden",
    "minutes ago": "vor {value} minuten",
    "hours ago":   "vor {value} stunden",
    "days ago":    "vor {value} tagen",
    "weeks ago":   "vor {value} wochen",
    "months ago":  "vor {value} monaten",
    "years ago":   "vor {value} jahren",
});

const currentDate = new Date();

// SQL format: local time
console.log(dateParser.parse('2020-06-01 15:00:00').format('iso') === '2020-06-01T15:00:00+02:00');
// ISO format: local time
console.log(dateParser.parse('2020-06-01T15:00:00').format('iso') === '2020-06-01T15:00:00+02:00');
// ISO format: UTC time
console.log(dateParser.parse('2020-06-01T15:00:00+00:00').format('iso') === '2020-06-01T17:00:00+02:00');
console.log(dateParser.parse('2020-06-01T15:00:00Z').format('iso') === '2020-06-01T17:00:00+02:00');
console.log(dateParser.parse('2020-06-01T15:00:00-03:00').format('iso') === '2020-06-01T20:00:00+02:00');
//console.log(dateUtils.parse('2020-06-01T15:00:00+02:00').format('iso') === '2020-06-01T15:00:00+02:00');
console.log(dateParser.parse('2020-06-01T15:00:00+03:00').format('iso') === '2020-06-01T14:00:00+02:00');

console.log(dateParser.parse('2020-12-01T15:00:00+00:00').format('iso') === '2020-12-01T16:00:00+01:00');
console.log(dateParser.parse('2020-12-01T15:00:00-03:30').format('iso') === '2020-12-01T19:30:00+01:00');
console.log(dateParser.parse('2020-12-01T15:00:00-05:00', 'UTC').format('iso') === '2020-12-01T16:00:00+01:00');
console.log(dateParser.parse('2020-12-01T15:00:00-04:30', '+02:00').format('iso') === '2020-12-01T14:00:00+01:00');

console.log(dateParser.parse('2014-11-21 1:30 AM EST').format('iso') === '2014-11-21T07:30:00+01:00');
console.log(dateParser.parse('2014-11-21 1:30 AM EST', 'UTC').format('iso') === '2014-11-21T02:30:00+01:00');
console.log(dateParser.parse('20-01-2015, 18:19').format('iso') === '2015-01-20T18:19:00+01:00');

// Month parsing test.
console.log(dateParser.parse('February 23rd, 2014 11:32 PM').format('iso') === '2014-02-23T23:32:00+01:00');
console.log(dateParser.parse('23 luty 2014, 12:00').format('iso') === '2014-02-23T12:00:00+01:00');
console.log(dateParser.parse('23 wrzesień, 14:50').format('iso') === currentDate.getFullYear() + '-09-23T14:50:00+02:00');
console.log(dateParser.parse('27 Sie').format('iso') === currentDate.getFullYear() + '-08-27T00:00:00+02:00');

// Time ago parsing test.
console.log(['yesterday', dateParser.parse('Wczoraj, 23:01:23').format('iso')]);
console.log(['tomorrow', dateParser.parse('Jutro').format('iso')]);

console.log(['hour ago', dateParser.parse('godzinę temu').format('iso')]);
console.log(['day ago',  dateParser.parse('vor einem tag').format('iso')]);
console.log(['year ago', dateParser.parse('year ago').format('iso')]);

console.log(['20 seconds ago', dateParser.parse('20 seconds ago').format('iso')]);
console.log(['3 days ago',     dateParser.parse('vor 3 tagen').format('iso')]);
console.log(['2 weeks ago',    dateParser.parse('2 tygodnie temu').format('iso')]);
console.log(['120 months ago', dateParser.parse('120 miesięcy temu').format('iso')]);
console.log(['5 years ago',    dateParser.parse('5 lat temu').format('iso')]);
