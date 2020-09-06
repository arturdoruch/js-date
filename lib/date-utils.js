/*
 * (c) Artur Doruch <arturdoruch@interia.pl>
 */

const monthsData = {
    number: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    short:  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    full:   ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

export default {
    /**
     * Gets number of the month with name.
     *
     * @param {string} monthName The month name in short "Jan" or full "January" format.
     *
     * @returns {string}
     */
    getMonthNumber(monthName) {
        for (let i = 0; i < 12; i++) {
            if (monthName.indexOf(monthsData.short[i]) === 0) {
                return monthsData.number[i];
            }
        }

        throw new Error(`Invalid month name "${monthName}".`);
    },

    /**
     * Gets name of the month with number.
     *
     * @param {string|number} monthNumber The month number.
     * @param {boolean} [full = false] Whether to get the full name of the month.
     *
     * @returns {string}
     */
    getMonthName(monthNumber, full) {
        monthNumber = padZero(monthNumber);

        for (let i = 0; i < 12; i++) {
            if (monthNumber === monthsData.number[i]) {
                return full === true ? monthsData.full[i] : monthsData.short[i];
            }
        }

        throw new Error(`Invalid month number "${monthNumber}".`);
    },

    /**
     * Generates Date objects for specified time range.
     *
     * @param {number|Date} startTime The range start time as timestamp in milliseconds or Date object.
     * @param {number|Date} endTime  The range end time as timestamp in milliseconds or Date object.
     * @param {string|number} [timeInterval="1 day"] Time interval between consecutive dates. Format: "digit [day|hour|minute]s?".
     * @param {string} [direction="asc"] Direction of range dates. Allowed values: "asc", "desc".
     *
     * @returns {Date[]}
     */
    generateDateRange(startTime, endTime, timeInterval = '1 day', direction) {
        let dates = [];
        const parseTimeInterval = function(timeInterval) {
            let values = /^(\d+) (minute|hour|day)s?$/.exec(timeInterval);
            let multiplier = 60;

            if (!values) {
                throw new TypeError(`Invalid step value "${timeInterval}".`);
            }

            if (values[2] === 'hour') {
                multiplier = 60 * 60;
            } else if (values[2] === 'day') {
                multiplier = 60 * 60 * 24;
            }

            return multiplier * parseInt(values[1]) * 1000;
        };

        timeInterval = parseTimeInterval(timeInterval);

        if (startTime instanceof Date) {
            startTime = startTime.getTime();
        }
        if (endTime instanceof Date) {
            endTime = endTime.getTime();
        }

        while (startTime <= endTime) {
            dates.push(new Date(startTime));
            startTime += timeInterval;
        }

        if (direction === 'desc') {
            dates.reverse();
        }

        return dates;
    },

    /**
     * Gets difference (in minutes) between server and Universal Coordinated Time (UTC) time.
     *
     * @return {int}
     */
    getTimezoneOffset() {
        new Date().getTimezoneOffset();
    },
};

/**
 * Adds zero "0" before number smaller than 10.
 *
 * @param {string|number} number
 * @returns {string}
 */
function padZero(number) {
    return (number = number.toString()) < 10 ? "0" + number : number;
}
