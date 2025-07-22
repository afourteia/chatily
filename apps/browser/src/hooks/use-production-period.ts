// TODO: Need a way to share the instance of production period so that different UIs get the same value. Also I need to add a grace period between production periods to avoid any potential conflicts. This could be db driven.
export function useProductionUTCPeriod(dayThreshold: number = 7): {
  productionStartDateUTC: Date;
  productionEndDateUTC: Date;
} {
  const now = new Date();
  // console.log('hook used at ', now);
  const productionStartDateUTC =
    now.getUTCDate() <= dayThreshold
      ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
      : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const productionEndDateUTC = new Date(
    Date.UTC(
      productionStartDateUTC.getUTCFullYear(),
      productionStartDateUTC.getUTCMonth() + 1,
      1,
    ),
  );
  return {
    productionStartDateUTC,
    productionEndDateUTC,
  };
}
