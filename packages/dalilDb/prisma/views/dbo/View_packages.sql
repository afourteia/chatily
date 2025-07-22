SELECT
  fawt.package_services.id,
  fawt.package_services.packageServiceId,
  fawt.package_services.packageId,
  fawt.package_services.serviceId
FROM
  fawt.healthcenter_services
  JOIN fawt.package_services ON fawt.healthcenter_services.ServiceID = fawt.package_services.serviceId
WHERE
  (fawt.healthcenter_services.contractId = N'027');