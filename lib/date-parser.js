/*
 * (c) Artur Doruch <arturdoruch@interia.pl>
 */

import './date-polyfills.js';

const monthNames = {
    1: ['january', 'styczeń'],
    2: ['february', 'luty'],
    3: ['match', 'marzec'],
    4: ['april', 'kwiecień'],
    5: ['may', 'maj'],
    6: ['june', 'czerwiec'],
    7: ['july', 'lipiec'],
    8: ['august', 'sierpień'],
    9: ['september', 'wrzesień'],
    10: ['october', 'październik'],
    11: ['november', 'listopad'],
    12: ['december', 'grudzień'],
}

const dayNames = {
    'yesterday': ['wczoraj'],
    'today': ['dzisiaj'],
    'tomorrow': ['jutro'],
};

const timeAgoSingularPhrases = {
    'second ago': ['sekundę temu'],
    'minute ago': ['minutę temu'],
    'hour ago': ['godzinę temu'],
    'day ago': ['dzień temu'],
    'week ago': ['tydzień temu'],
    'month ago': ['miesiąc temu'],
    'year ago': ['rok temu'],
};

const timeAgoPluralPhrases = {
    'seconds ago': ['sekundy temu', 'sekund temu'],
    'minutes ago': ['minuty temu', 'minut temu'],
    'hours ago': ['godziny temu', 'godzin temu'],
    'days ago': ['dni temu'],
    'weeks ago': ['tygodnie temu', 'tygodni temu'],
    'months ago': ['miesiące temu', 'miesięcy temu'],
    'years ago': ['lata temu', 'lat temu'],
};

/**
 * Registers month names in a specified language (other then english or polish), in order to
 * correctly parse date with month name.
 *
 * @param {array} names The names of all 12 months in proper order, in specified language.
 */
function registerMonthNames(names) {
    if (names.length !== 12) {
        throw new TypeError(`Missing or invalid month names. The array must contain names for the all 12 months,`
             + ` but contains names for ${names.length} months.`);
    }

    for (let number in monthNames) {
        const name = names[number - 1];

        if (!name) {
            throw new TypeError(`Empty name for month with number ${number}.`);
        }

        monthNames[number].push(name.toLowerCase());
    }
}

/**
 * Registers day names (yesterday, today, tomorrow) in a specified language (other, then english or polish),
 * in order to correctly parse date with day name.
 *
 * @param {string} yesterday
 * @param {string} today
 * @param {string} tomorrow
 */
function registerDayNames(yesterday, today, tomorrow) {
    const names = {
        yesterday: yesterday,
        today: today,
        tomorrow: tomorrow
    };

    for (let name in names) {
        if (!names[name]) {
            throw new TypeError(`Missing name for "${name}" day.`);
        }

        dayNames[name].push(names[name]);
    }
}

/**
 * Registers phrases in a specified language (other, then english or polish), in order to
 * correctly parse date with "time ago" phrase, like: "20 hours ago", "month ago".
 *
 * @param {{}} singularPhrases The time ago singular phrases in specified language.
 * Format:
 * {
 *     "second ago": "", // One second ago phrase
 *     "minute ago": "",
 *     "hour ago": "",
 *     "day ago": "",
 *     "week ago": "",
 *     "month ago": "",
 *     "year ago": "",
 * }
 * @param {{}} pluralPhrases The time ago plural phrases in specified language.
 *                           The object value can be a single value or an array with multiple values.
 * Format:
 * {
 *     "seconds ago": [], // ["Many seconds ago phrase 1", "Many seconds ago phrase n"]
 *     "minutes ago": "", // Many seconds ago phrase
 *     "hours ago": "",
 *     "days ago": "",
 *     "weeks ago": "",
 *     "months ago": "",
 *     "years ago": "",
 * }
 */
function registerTimeAgoPhrases(singularPhrases, pluralPhrases) {
    doRegisterTimeAgoPhrases('singular', timeAgoSingularPhrases, singularPhrases);
    doRegisterTimeAgoPhrases('plural', timeAgoPluralPhrases, pluralPhrases);
}

/**
 * @param {string} type
 * @param {{}} timeAgoPhrases
 * @param {{}} phrases
 */
function doRegisterTimeAgoPhrases(type, timeAgoPhrases, phrases) {
    for (let phraseEnglish in timeAgoPhrases) {
        if (!phrases.hasOwnProperty(phraseEnglish)) {
            throw new TypeError(`Missing ${type} phrase for "${phraseEnglish}".`);
        }

        let _phrases = phrases[phraseEnglish];

        if (!Array.isArray(_phrases)) {
            _phrases = [_phrases];
        }

        for (let p of _phrases) {
            p = p.toLowerCase();
            if (timeAgoPhrases[phraseEnglish].indexOf(p) === -1) {
                timeAgoPhrases[phraseEnglish].push(p);
            }
        }
    }
}

/**
 * Parses date string into Date object.
 *
 * @param {string} date Date time to parse, e.g. "February 23rd, 2014 11:32 AM", "2014-11-21 13:16:45".
 * @param {string} [timezone] Sets (override if exist) date time zone. Permissible values:
 *                            "UTC", range form -12:00 to +12:00.
 *
 * @return {Date}
 */
function parse(date, timezone) {
    const processingDate = date;
    const newTimezone = timezone ? compileTimezone(timezone) : null;
    let parts;

    date = date.trim().toLowerCase();

    // SQL format. "2014-11-21 13:16:45" -> "2014-11-21T13:16:45"
    if (parts = date.match(/^(\d{4}-\d{2}-\d{2})( |t)(\d{2}:\d{2}:\d{2})(.*)$/)) {
        date = parts[1] + 'T' + parts[3] + parts[4];
    }

    // "February 23rd, 2014 11:32 AM" -> "February 23, 2014 11:32 AM"
    else if (parts = date.match(/^(.+) (\d{1,2})[a-z]{2},(.+)$/)) {
        date = parts[1] + ' ' + parts[2] + ',' + parts[3];
    }

    // "2014-11-21 1:32", "20-01-2015, 18:19" -> month day, year
    else if (parts = date.match(/^(?:(\d{1,2}-\d{2}-\d{4})|(\d{4}-\d{2}-\d{2}))[, ]+(.*)$/)) {
        if (parts[1]) {
            let dt = parts[1].split('-');
            date = dt[1] + ' ' + dt[0] + ', ' + dt[2] + ' ' + parts[3];
        } else {
            let dt = parts[2].split('-');
            date = dt[1] + ' ' + dt[2] + ', ' + dt[0] + ' ' + parts[3];
        }
    }

    // "Yesterday", "Today", "Today, 23:01" -> month day, year
    else if (parts = date.match(/^([\p{Ll}]{5,})([, ]+(\d+.+))?$/u)) {
        let value = parts[1];

        for (let dayName in dayNames) {
            if (dayName !== value && dayNames[dayName].indexOf(value) === -1) {
                continue;
            }

            let _date = new Date();

            if (dayName === 'yesterday') {
                _date.setDate(_date.getDate() - 1);
            } else if (dayName === 'tomorrow') {
                _date.setDate(_date.getDate() + 1);
            }

            date = (_date.getMonth() + 1) + ' ' + _date.getDate() + ', ' + _date.getFullYear() + (parts[3] ? ' ' + parts[3] : '');

            break;
        }
    }

    // Time ago: "day ago", "hour ago"
    else if (parts = date.match(/^(([\p{Ll}]{1,} ){1,})([\p{Ll}]{1,})$/u)) {
        date = compileTimeAgoPhrase(parts[0], 1, timeAgoSingularPhrases) || date;
    }

    // Time ago with value at the beginning: "2 hours ago", "2 weeks ago", "vor 2 tagen"
    else if (parts = date.match(/^(\d+) ([\p{Ll}]{2,} [\p{Ll}]{2,})$/u)) {
        date = compileTimeAgoPhrase(parts[2], parts[1], timeAgoPluralPhrases) || date;
    }

    // Time ago with value in the middle: "vor 2 tagen", "il y a 2 jours"
    else if (parts = date.match(/^([\p{Ll}]+ )+(\d+) ([\p{Ll}]{3,})$/u)) {
        const value = parts.reverse()[1];
        const phrase = parts.pop().replace(value, '{value}');

        date = compileTimeAgoPhrase(phrase, value, timeAgoPluralPhrases) || date;
    }

    // "23 luty 2014", "23 wrzesień, 14:50" -> day month year
    else if (parts = date.match(/^(\d+) ([\p{Ll}]+)( \d{2,4})?([, ]+.+)?$/u)) {
        let month = parts[2];
        found:

        for (let number in monthNames) {
            for (let name of monthNames[number]) {
                if (name.startsWith(month)) {
                    date = parts[1] + ' ' + monthNames[number][0]
                        + (parts[3] ? parts[3] : ' ' + new Date().getFullYear())
                        + (parts[4] ? parts[4] : '');

                    break found;
                }
            }
        }
    }

    return createDate(processingDate, date.toUpperCase(), newTimezone);
}

/**
 * Converts timezone time into minutes.
 *
 * @param {string} timezone
 *
 * @return {int} The timezone in minutes.
 */
function compileTimezone(timezone) {
    if (timezone.toUpperCase() === 'UTC' || timezone === 'Z') {
        timezone = '+00:00';
    }

    const parts = /^([\-+])(\d{2}):(\d{2})$/.exec(timezone);

    if (!parts) {
        throw new TypeError(`Invalid timezone "${timezone}".`);
    }

    return (parseInt(parts[2]) * 60 + parseInt(parts[3])) * (parts[1] === '-' ? -1 : 1);
}

/**
 * @param {string} phrase
 * @param {int} value
 * @param {{}} availablePhrases
 *
 * @return {string|null}
 */
function compileTimeAgoPhrase(phrase, value, availablePhrases) {
    for (const englishPhrase in availablePhrases) {
        if (englishPhrase === phrase || availablePhrases[englishPhrase].indexOf(phrase) > -1) {
            return new Date().modify(value + ' ' + englishPhrase).format('iso');
        }
    }

    return null;
}

/**
 * @param {string} inputDate
 * @param {string} formattedDate
 * @param {int|null} timezoneNew
 *
 * @return {Date}
 */
function createDate(inputDate, formattedDate, timezoneNew) {
    if (timezoneNew !== null) {
        let parts;

        if (parts = formattedDate.match(/^(.+\d)(Z|[+\-]\d{1,2}:\d{2})$/)) {
            formattedDate = parts[1];
        } else if (parts = formattedDate.match(/^(.+) (?!AM|PM)([A-Z]{1,5})$/)) {
            // Remove timezone abbreviation https://www.timeanddate.com/time/zones/ from the date.
            // Example of date: "2014-11-21 1:32 AM EST"
            formattedDate = parts[1];
        }
    }

    const time = Date.parse(formattedDate);

    if (isNaN(time)) {
        throw new TypeError(`Invalid date "${inputDate}".`);
    }

    const date = new Date(time);

    if (timezoneNew !== null) {
        date.setTime(date.getTime() - ((timezoneNew + date.getTimezoneOffset()) * 60 * 1000));
    }

    return date;
}

export default {
    parse,
    registerMonthNames,
    registerDayNames,
    registerTimeAgoPhrases
}
