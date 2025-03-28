import { DateTime } from "luxon";
import Configure from "../services/Configure";

class Carbon {
  private static formatMapping: Record<string, string> = {
    Y: "yyyy",
    y: "yy",
    m: "MM",
    n: "M",
    d: "dd",
    j: "d",
    H: "HH",
    h: "hh",
    i: "mm",
    s: "ss",
    A: "a",
    T: "z",
    e: "ZZ",
    o: "yyyy",
    P: "ZZ",
    c: "yyyy-MM-dd'T'HH:mm:ssZZ",
    r: "EEE, dd MMM yyyy HH:mm:ss Z",
    u: "yyyy-MM-dd HH:mm:ss.SSS",
    W: "W",
    N: "E",
    z: "o",
  };

  private static timeAlters: Record<string, number> = {
    weeks: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    years: 0,
  };

  static addDays(days: number = 0): typeof Carbon {
    Carbon.timeAlters["days"] += days;
    return Carbon;
  }

  static addHours(hours: number = 0): typeof Carbon {
    Carbon.timeAlters["hours"] += hours;
    return Carbon;
  }

  static addMinutes(minutes: number = 0): typeof Carbon {
    Carbon.timeAlters["minutes"] += minutes;
    return Carbon;
  }

  static addSeconds(seconds: number = 0): typeof Carbon {
    Carbon.timeAlters["seconds"] += seconds;
    return Carbon;
  }

  static addYears(years: number = 0): typeof Carbon {
    Carbon.timeAlters["years"] += years;
    return Carbon;
  }

  static addMonths(months: number = 0): typeof Carbon {
    Carbon.timeAlters["months"] += months;
    return Carbon;
  }

  static addWeeks(weeks: number = 0): typeof Carbon {
    Carbon.timeAlters["weeks"] += weeks;
    return Carbon;
  }

  private static generateDateTime(): DateTime {
    const getDateTime = DateTime.now()
      .plus({
        years: Carbon.timeAlters.years,
        months: Carbon.timeAlters.months,
        weeks: Carbon.timeAlters.weeks,
        days: Carbon.timeAlters.days,
        hours: Carbon.timeAlters.hours,
        minutes: Carbon.timeAlters.minutes,
        seconds: Carbon.timeAlters.seconds,
      })
      .setZone(Configure.read("app.timezone") || "UTC");

    Carbon.reset();
    return getDateTime;
  }

  static getDateTime(): string {
    return Carbon.generateByFormat(
      Configure.read("app.datetime_format") || "Y-m-d H:i:s"
    );
  }

  static getDate(): string {
    return Carbon.generateByFormat(
      Configure.read("app.date_format") || "Y-m-d"
    );
  }

  static getTime(): string {
    return Carbon.generateByFormat(
      Configure.read("app.time_format") || "H:i:s"
    );
  }

  private static generateByFormat(format: string): string {
    if (typeof format !== "string") {
      throw new Error(`Invalid format`);
    }

    const time = Carbon.generateDateTime();
    const formattings = Object.keys(Carbon.formatMapping);
    let newFormat = "";

    for (let i = 0; i < format.length; i++) {
      newFormat += formattings.includes(format[i])
        ? Carbon.formatMapping[format[i]]
        : format[i];
    }

    return time.toFormat(newFormat);
  }

  static getByFormat(format: string): string {
    return Carbon.generateByFormat(format);
  }

  private static reset(): void {
    Carbon.timeAlters = {
      weeks: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      years: 0,
    };
  }

  static getByUnixTimestamp(unixTimestamp: number, format: string): string {
    if (typeof unixTimestamp !== "number") {
      throw new Error(`Invalid Unix timestamp: ${unixTimestamp}`);
    }
    if (typeof format !== "string") {
      throw new Error(`Invalid format: ${format}`);
    }

    const time = DateTime.fromSeconds(unixTimestamp).setZone(
      Configure.read("app.timezone") || "UTC"
    );
    const formattings = Object.keys(Carbon.formatMapping);
    let newFormat = "";

    for (let i = 0; i < format.length; i++) {
      newFormat += formattings.includes(format[i])
        ? Carbon.formatMapping[format[i]]
        : format[i];
    }

    return time.toFormat(newFormat);
  }
}

export default Carbon;
