import dotenv from "dotenv";
import path from "path";
import Configure from "./Configure";
import Carbon from "../datetime/Carbon";
import Express from "./Express";
dotenv.config();

Object.defineProperty(globalThis, "env", {
  value: (key: string, defaultValue: any = null): any => {
    return process.env[key] ?? defaultValue;
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "only", {
  value: <T extends Record<string, any>>(
    source: T,
    keys: string[]
  ): Record<string, any> => {
    const result: Record<string, any> = {};
    keys.forEach((key) => {
      if (key in source) {
        result[key] = source[key];
      }
    });
    return result;
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "ucFirst", {
  value: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "getFutureDate", {
  value: (addTime: number = 60): string => {
    return Carbon.addHours(addTime).getDateTime();
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "basePath", {
  value: (): string => {
    return path.join(__dirname, "..", "..");
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "resourcePath", {
  value: (): string => {
    return path.join(__dirname, "..", "..", "resources");
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "publicPath", {
  value: (): string => {
    return path.join(__dirname, "..", "..", "public");
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "viewPath", {
  value: (): string => {
    return path.join(__dirname, "..", "..", "resources", "views");
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "databasePath", {
  value: (): string => {
    return path.join(__dirname, "..", "..", "database");
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "appPath", {
  value: (): string => {
    return path.join(__dirname, "..", "..", "app");
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "stubPath", {
  value: (): string => {
    return path.join(__dirname, "..", "..", "stubs");
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "config", {
  value: (finder: string, value: any = undefined): any | void => {
    if (value == undefined) {
      return Configure.read(finder);
    } else {
      Configure.write(finder, value);
    }
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "log", {
  value: (value: unknown, destination: string, text: string = ""): void => {
    Express.log(value, destination, text);
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "generateTableNames", {
  value: (entity: string): string => {
    const irregularPlurals: Record<string, string> = config(
      "irregular_pronouns"
    ) as Record<string, string>;
    const splitWords: string[] = entity.split(/(?=[A-Z])/);
    const lastWord: string = splitWords.pop()?.toLowerCase() || "";

    const pluralizedLastWord: string = (() => {
      if (irregularPlurals[lastWord]) {
        return irregularPlurals[lastWord];
      }
      if (lastWord.endsWith("y")) {
        return lastWord.slice(0, -1) + "ies";
      }
      if (
        ["s", "x", "z", "ch", "sh"].some((suffix) => lastWord.endsWith(suffix))
      ) {
        return lastWord + "es";
      }
      if ("1234567890".split("").some((suffix) => lastWord.endsWith(suffix))) {
        return lastWord;
      }
      return lastWord + "s";
    })();

    return [...splitWords, pluralizedLastWord].join("_").toLowerCase();
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "base64Encode", {
  value: (str: string): string => {
    return Buffer.from(str, "utf-8").toString("base64");
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "base64Decode", {
  value: (str: string): string => {
    try {
      return Buffer.from(str, "base64").toString("utf-8");
    } catch (error) {
      throw new Error("Invalid Base64 string");
    }
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "base64UrlEncode", {
  value: (str: string): string => {
    return base64Encode(str)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "base64UrlDecode", {
  value: (str: string): string => {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

    while (base64.length % 4 !== 0) {
      base64 += "=";
    }

    return base64Decode(base64);
  },
  writable: false,
  configurable: false,
});

import { DateTime } from "luxon";

const getRelativeTime = (
  expression: string,
  direction: "next" | "last",
  now: DateTime
): number | null => {
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const lowerExpression = expression.toLowerCase();
  const dayIndex = daysOfWeek.indexOf(lowerExpression);

  if (dayIndex !== -1) {
    let daysDifference = dayIndex - now.weekday;

    if (direction === "next" && daysDifference <= 0) {
      daysDifference += 7;
    } else if (direction === "last" && daysDifference >= 0) {
      daysDifference -= 7;
    }

    return now.plus({ days: daysDifference }).toSeconds();
  }

  return now[direction === "next" ? "plus" : "minus"]({ days: 7 }).toSeconds();
};

Object.defineProperty(globalThis, "strtotime", {
  value: (time: string, now: number = Date.now() / 1000): number | null => {
    const timeUnits = {
      second: "seconds",
      minute: "minutes",
      hour: "hours",
      day: "days",
      week: "weeks",
      month: "months",
      year: "years",
    } as const;

    const timeZone =
      config("app.timezone") ||
      Intl.DateTimeFormat().resolvedOptions().timeZone;
    const adjustedNow = DateTime.fromSeconds(now).setZone(timeZone);

    time = time.trim().toLowerCase();
    if (Date.parse(time)) {
      return DateTime.fromISO(time, { zone: timeZone }).toSeconds();
    }

    const regexPatterns: { [key: string]: RegExp } = {
      next: /^next\s+(.+)/,
      last: /^last\s+(.+)/,
      ago: /(\d+)\s*(second|minute|hour|day|week|month|year)s?\s*ago$/,
      specificTime: /(\d{4}-\d{2}-\d{2})|(\d{2}:\d{2}(:\d{2})?)/,
    };

    const agoMatch = time.match(regexPatterns.ago);
    if (agoMatch) {
      const num = parseInt(agoMatch[1]);
      const unit = agoMatch[2] as keyof typeof timeUnits;
      return adjustedNow.minus({ [unit]: num }).toSeconds();
    }

    const nextMatch = time.match(regexPatterns.next);
    if (nextMatch) {
      return getRelativeTime(nextMatch[1], "next", adjustedNow);
    }

    const lastMatch = time.match(regexPatterns.last);
    if (lastMatch) {
      return getRelativeTime(lastMatch[1], "last", adjustedNow);
    }

    return null;
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "date", {
  value: (
    format: string = "Y-m-d H:i:s",
    unixTimestamp: number | null = null
  ) => {
    if (unixTimestamp !== null) {
      return Carbon.getByUnixTimestamp(unixTimestamp, format);
    }
    return Carbon.getByFormat(format);
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "DATE", {
  value: date,
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "functionExists", {
  value: (name: string): boolean => {
    return (
      name in globalThis &&
      typeof globalThis[name as keyof typeof globalThis] === "function"
    );
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "classExists", {
  value: (name: string): boolean => {
    return (
      name in globalThis &&
      typeof globalThis[name as keyof typeof globalThis] === "function" &&
      globalThis[name as keyof typeof globalThis].toString().startsWith("class")
    );
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "define", {
  value: (name: string, value: any): void => {
    if (name in globalThis) {
      throw new Error(`Global variable '${name}' already exists.`);
    }
    Object.defineProperty(globalThis, name, {
      value,
      writable: true,
      configurable: false,
    });
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "isDefined", {
  value: (name: string): boolean => {
    return name in globalThis;
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "end", {
  value: (array: any[]): any => {
    return array[array.length - 1] ?? null;
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(globalThis, "TMP_PATH", {
  value: basePath() + "/tmp",
  writable: false,
  configurable: false,
});
