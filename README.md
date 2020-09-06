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

Adds the following methods to the native Date object:

 * createFromTimestamp - Creates Date from a timestamp.
 * format - Formats Date into a string.
 * modify - Modifies date time.
 * getTimestamp - Gets date Unix timestamp.
 
 
### Date parser

Functions:
 * parse
 * registerMonthNames
 * registerDayNames
 * registerTimeAgoPhrases
 
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
 
  
### Date utils

```js
import dateUtils from '@arturdoruch/date/lib/date-utils';
```

Functions:

 * getMonthNumber
 * getMonthName
 * generateDateRange
 * getTimezoneOffset
