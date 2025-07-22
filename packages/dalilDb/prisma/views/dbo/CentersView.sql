SELECT
  C.centerId AS CenterId,
  C.centerName AS CenterName,
  C.centerAllowance AS CenterAllowance,
  C.isActive AS IsActive,
  C.State AS IsState,
  C.CenterIcon,
  Co.currencyID,
  Co.CurrencyName,
  C.VpnIp AS VpnIp,
  (
    SELECT
      count(log_table.Id)
    FROM
      log_table
    WHERE
      C.VpnIp = log_table.healthCentersIP
    GROUP BY
      healthCentersIP
  ) AS LOGS,
  R.reasonName AS DeactivationReason,
  R.reasonId AS ReasonId,
  C.infoID AS InfoId,
  I.email AS Email,
  I.location AS Location,
  I.PhoneNumber AS phoneNumber
FROM
  huia.healthCenters AS C
  LEFT JOIN huia.Reasons AS R ON C.deactivationReason = R.reasonId
  JOIN huia.PartnerInfo AS I ON C.infoID = I.InfoId
  LEFT JOIN fawt.Currency AS Co ON C.currencyID = Co.currencyID;