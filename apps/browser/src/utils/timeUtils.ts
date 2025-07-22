export function isWithinTimeThreshold(
  startTime: Date,
  endTime: Date,
  timeDiffThresholdInSeconds = 20 * 60,
): boolean {
  timeDiffThresholdInSeconds;
  const differenceInSeconds = Math.abs(
    endTime.getTime() / 1000 - startTime.getTime() / 1000,
  );

  return differenceInSeconds <= timeDiffThresholdInSeconds;
}
