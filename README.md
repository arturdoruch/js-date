# Date

JavaScript date helpers.

## Install

```sh
yarn add @arturdoruch/date
```

## Contents

### Date polyfills

```js
import '@arturdoruch/date/lib/date-polyfills';
```

Adds useful methods to the native Date object.

 * `createFromTimestamp` - Creates Date from a timestamp.
 * `format` - Formats Date into a string.
 * `modify` - Modifies date time.
 * `getTimestamp` - Gets date Unix timestamp.
 
 
### Date parser

Parses date string into Date object.

#### Usage 
 
```js
import dateParser from '@arturdoruch/date/lib/date-parser';

dateParser.parse('2020-06-01');
dateParser.parse('2020-06-01 15:00:00');
dateParser.parse('February 23rd, 2014 11:32 PM');
dateParser.parse('Yesterday, 18:00');
dateParser.parse('day ago');
dateParser.parse('2 months ago');
``` 
 
#### Functions

 * `registerMonthNames` - Registers month names in a specified language, in order to correctly parse date
  with month name in language other, then english or polish.
 * `registerDayNames` - Registers day names (yesterday, today, tomorrow) in a specified language, in order to correctly parse date
  with day name in language other, then english or polish.
 * `registerTimeAgoPhrases` - Registers phrases in a specified language, in order to correctly parse date
  with "time ago" phrase, like: "20 hours ago", "month ago" in language other, then english or polish.
  
See functions description for more info. 
  
### Date utils

```js
import dateUtils from '@arturdoruch/date/lib/date-utils';
```

#### Functions

 * getMonthNumber
 * getMonthName
 * generateDateRange
 * getTimezoneOffset
