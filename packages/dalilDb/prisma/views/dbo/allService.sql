SELECT
  id,
  ServiceID,
  ServiceCode,
  dalilServiceCode,
  ServiceName,
  Price,
  updatedAt,
  contractId,
  isActive,
  ServiceType,
  sectionCode
FROM
  fawt.healthcenter_services
WHERE
  (contractId = N'031-2020');