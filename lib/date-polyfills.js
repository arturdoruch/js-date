/*
 * Adds own functions to the Date object.
 *
 * (c) Artur Doruch <arturdoruch@interia.pl>
 */

/**
 * Creates Date from a timestamp.
 *
 * @param {int} timestamp The timestamp in seconds.
 *
 * @return {Date}
 */
Date.createFromTimestamp = function(timestamp) {
    return new Date(timestamp * 1000);
}

/**
 * Formats Date object into string.
 *
 * @param {string} format One of: "date", "datetime", "time", "iso".
 * @param {boolean} [utc = false] Whether to use UTC (Universal Time Coordinated) timezone.
 *
 * @returns {string}
 */
Date.prototype.format = function(format, utc) {
    switch (format) {
        case 'date':
            return formatDate(this, utc);
        case 'datetime':
            return formatDate(this, utc) + ' ' + formatTime(this, utc);
        case 'time':
            return formatTime(this, utc);
        case 'iso':
            let timezone = utc === true ? 0 : this.getTimezoneOffset();
            const sign = timezone > 0 ? '-' : '+';
            timezone = Math.abs(timezone);

            const timezoneHour = sign + padZero(Math.floor(timezone / 60)) + ':' + padZero(timezone % 60);

            return formatDate(this, utc) + 'T' + formatTime(this, utc) + /*'.' + formatMilliseconds(this, utc) +*/ timezoneHour;
    }

    throw new TypeError(`Invalid date format "${format}". Permissible formats are: "date", "datetime", "time", "iso".`);
};

/**
 * Modifies date time.
 *
 * @param {string} modifier The modifier in format "^([-+]?\d+) (second|minute|hour|day|week|month|year)s?( ago)?$".
 *
 * @returns {Date}
 */
Date.prototype.modify = function(modifier) {
    let parts = modifier.match(/^([-+]?\d+) (second|minute|hour|day|week|month|year)s?( ago)?$/);

    if (!parts) {
        throw new TypeError(`Invalid time modifier "${modifier}".`);
    }

    let value = parts[1];

    if (parts[3]) {
        value *= -1;
    }

    modifyTime(this, parts[2], value);

    return this;
};

/**
 * Gets date Unix timestamp.
 *
 * @return {number} Unix timestamp in seconds.
 */
Date.prototype.getTimestamp = function () {
    return Math.floor(this.getTime() / 1000);
}

/**
 * @param {Date} date
 * @param {boolean} [utc = false]
 *
 * @return {string}
 */
function formatDate(date, utc) {
    if (utc === true) {
        return date.getUTCFullYear() + '-' + padZero(date.getUTCMonth()+1) + '-' + padZero(date.getUTCDate());
    }

    return date.getFullYear() + '-' + padZero(date.getMonth()+1) + '-' +  padZero(date.getDate());
}

/**
 * @param {Date} date
 * @param {boolean} [utc = false]
 *
 * @return {string}
 */
function formatTime(date, utc) {
    let hours, minutes, seconds;

    if (utc === true) {
        hours = date.getUTCHours();
        minutes = date.getUTCMinutes();
        seconds = date.getUTCSeconds();
    } else{
        hours = date.getHours();
        minutes = date.getMinutes();
        seconds = date.getSeconds();
    }

    return padZero(hours) + ':' + padZero(minutes) + ':' + padZero(seconds);
}

/*function formatMilliseconds(date, utc) {
    let milliseconds = utc === true ? date.getUTCMilliseconds() : date.getMilliseconds();

    return (milliseconds / 1000).toFixed(3).slice(2, 5);
}*/

/**
 * Pads "0" before number smaller than 10.
 *
 * @param {Number} number
 * @returns {string}
 */
function padZero(number) {
    return number < 10 ? '0' + number : number;
}

const monthsWith31Days = [1, 3, 5, 7, 8, 10, 12];

/**
 * @param {Date} date
 * @param {string} portion The time portion.
 * @param {int} value
 *
 * @return {Date}
 */
function modifyTime(date, portion, value) {
    let seconds = 1;
    let positiveValue = value > 0;
    value = Math.abs(value);

    const countDaysSeconds = function(days) {
        return days * 24 * 60 * 60;
    }

    if (portion === 'year') {
        let year = date.getFullYear();
        let days = 0;

        for (let i = 0; i < value; i++) {
            if (positiveValue) {
                year++;
            }

            days += year % 4 === 0 ? 366 : 365;

            if (!positiveValue) {
                year--;
            }
        }

        seconds *= countDaysSeconds(days);
    } else if (portion === 'month') {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let days = 0;

        for (let i = 0; i < value; i++) {
            if (!positiveValue && --month === 0) {
                month = 12;
                year--;
            }

            days += monthsWith31Days.indexOf(month) > -1 ? 31 : (month === 2 ? (year % 4 === 0 ? 29 : 28) : 30);

            if (positiveValue && ++month === 13) {
                month = 1;
                year++;
            }
        }

        seconds *= countDaysSeconds(days);
    } else if (portion === 'week') {
        seconds *= countDaysSeconds(7);
    } else if (portion === 'day') {
        seconds *= countDaysSeconds(1);
    } else if (portion === 'hour') {
        seconds *= 60 * 60;
    } else if (portion === 'minute') {
        seconds *= 60;
    }

    if (portion !== 'year' && portion !== 'month') {
        seconds *= value;
    }

    date.setTime(date.getTime() + seconds * 1000 * (positiveValue ? 1 : -1));
}
