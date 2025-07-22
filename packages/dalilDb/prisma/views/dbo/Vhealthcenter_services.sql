SELECT
  id,
  ServiceID,
  ServiceCode,
  ServiceName,
  ServiceType,
  sectionCode,
  Price,
  updatedAt
FROM
  fawt.healthcenter_services
WHERE
  (contractId = N'33.2020');