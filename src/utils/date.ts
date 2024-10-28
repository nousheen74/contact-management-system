import { DateTime } from 'luxon';

export const convertToUserTimezone = (timestamp: string, timezone: string) => {
  return DateTime.fromISO(timestamp, { zone: 'UTC' }).setZone(timezone).toISO();
};

export const getCurrentUTCTime = () => {
  return DateTime.utc().toISO();
};
