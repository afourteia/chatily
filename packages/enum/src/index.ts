import type { Prisma } from '@project-name/db/generated/prisma/client';
export * as city from './city';
import {
  resourceTypeEnumIds,
  resourceTypeEnumKeys,
  resourceTypeEnum as resourceTypeEnumContent,
} from './enums/resource-type';
import {
  activeStatusEnumIds,
  activeStatusEnumKeys,
  activeStatusEnum as activeStatusEnumContent,
} from './enums/active-status';
import {
  cronJobStatusEnumIds,
  cronJobStatusEnumKeys,
  cronJobStatusEnum as cronJobStatusEnumContent,
} from './enums/cron-job-status';
import {
  genderEnumIds,
  genderEnumKeys,
  genderEnum as genderEnumContent,
} from './enums/gender';
import {
  healthcareFacilityTypeEnumIds,
  healthcareFacilityTypeEnumKeys,
  healthcareFacilityTypeEnum as healthcareFacilityTypeEnumContent,
} from './enums/healthcare-facility-type';
import {
  implementationStatusEnumIds,
  implementationStatusEnumKeys,
  implementationStatusEnum as implementationStatusEnumContent,
} from './enums/implementation-status';
import {
  jobEventStageEnumIds,
  jobEventStageEnumKeys,
  jobEventStageEnum as jobEventStageEnumContent,
} from './enums/job-event-stage';
import {
  jobEventTypeEnumIds,
  jobEventTypeEnumKeys,
  jobEventTypeEnum as jobEventTypeEnumContent,
} from './enums/job-event-type';
import {
  logLevelEnumIds,
  logLevelEnumKeys,
  logLevelEnum as logLevelEnumContent,
} from './enums/log-level';
import {
  tenantTypeEnumIds,
  tenantTypeEnumKeys,
  tenantTypeEnum as tenantTypeEnumContent,
} from './enums/tenant-type';
import {
  reviewStatusEnumIds,
  reviewStatusEnumKeys,
  reviewStatusEnum as reviewStatusEnumContent,
} from './enums/review-status';
import {
  transmissionStageEnumIds,
  transmissionStageEnumKeys,
  transmissionStageEnum as transmissionStageEnumContent,
} from './enums/transmission-stage';
import {
  transmissionTypeEnumIds,
  transmissionTypeEnumKeys,
  transmissionTypeEnum as transmissionTypeEnumContent,
} from './enums/transmission-type';
import {
  memberRoleEnumIds,
  memberRoleEnumKeys,
  memberRoleEnum as memberRoleEnumContent,
} from './enums/member-role';

function getEnumArray<
  T extends Record<
    string,
    Pick<Prisma.EnumerationCreateManyInput, 'nameAr' | 'nameEn' | 'meta'>
  >,
  PRE extends string,
  CAT extends string,
>({
  list,
  enumPrefix,
  enumCategory,
}: {
  list: T;
  enumPrefix: PRE;
  enumCategory: CAT;
}): Prisma.EnumerationCreateManyInput[] {
  const enumArray = Object.keys(list).map((key) => {
    return {
      id: `${enumPrefix}_${key}`,
      enumCategory,
      ...list[key as keyof T],
    };
  });

  return enumArray;
}

export const activeStatusEnum = {
  enumCategory: activeStatusEnumContent.enumCategory,
  enumPrefix: activeStatusEnumContent.enumPrefix,
  list: activeStatusEnumContent.list,
  keys: activeStatusEnumKeys,
  ids: activeStatusEnumIds,
  enum: getEnumArray(activeStatusEnumContent),
};

export const cronJobStatusEnum = {
  enumCategory: cronJobStatusEnumContent.enumCategory,
  enumPrefix: cronJobStatusEnumContent.enumPrefix,
  list: cronJobStatusEnumContent.list,
  keys: cronJobStatusEnumKeys,
  ids: cronJobStatusEnumIds,
  enum: getEnumArray(cronJobStatusEnumContent),
};

export const genderEnum = {
  enumCategory: genderEnumContent.enumCategory,
  enumPrefix: genderEnumContent.enumPrefix,
  list: genderEnumContent.list,
  keys: genderEnumKeys,
  ids: genderEnumIds,
  enum: getEnumArray(genderEnumContent),
};

export const healthcareFacilityTypeEnum = {
  enumCategory: healthcareFacilityTypeEnumContent.enumCategory,
  enumPrefix: healthcareFacilityTypeEnumContent.enumPrefix,
  list: healthcareFacilityTypeEnumContent.list,
  keys: healthcareFacilityTypeEnumKeys,
  ids: healthcareFacilityTypeEnumIds,
  enum: getEnumArray(healthcareFacilityTypeEnumContent),
};

export const implementationStatusEnum = {
  enumCategory: implementationStatusEnumContent.enumCategory,
  enumPrefix: implementationStatusEnumContent.enumPrefix,
  list: implementationStatusEnumContent.list,
  keys: implementationStatusEnumKeys,
  ids: implementationStatusEnumIds,
  enum: getEnumArray(implementationStatusEnumContent),
};

export const jobEventStageEnum = {
  enumCategory: jobEventStageEnumContent.enumCategory,
  enumPrefix: jobEventStageEnumContent.enumPrefix,
  list: jobEventStageEnumContent.list,
  keys: jobEventStageEnumKeys,
  ids: jobEventStageEnumIds,
  enum: getEnumArray(jobEventStageEnumContent),
};

export const jobEventTypeEnum = {
  enumCategory: jobEventTypeEnumContent.enumCategory,
  enumPrefix: jobEventTypeEnumContent.enumPrefix,
  list: jobEventTypeEnumContent.list,
  keys: jobEventTypeEnumKeys,
  ids: jobEventTypeEnumIds,
  enum: getEnumArray(jobEventTypeEnumContent),
};

export const logLevelEnum = {
  enumCategory: logLevelEnumContent.enumCategory,
  enumPrefix: logLevelEnumContent.enumPrefix,
  list: logLevelEnumContent.list,
  keys: logLevelEnumKeys,
  ids: logLevelEnumIds,
  enum: getEnumArray(logLevelEnumContent),
};

export const memberRoleEnum = {
  enumCategory: memberRoleEnumContent.enumCategory,
  enumPrefix: memberRoleEnumContent.enumPrefix,
  list: memberRoleEnumContent.list,
  keys: memberRoleEnumKeys,
  ids: memberRoleEnumIds,
  enum: getEnumArray(memberRoleEnumContent),
};

export const resourceTypeEnum = {
  enumCategory: resourceTypeEnumContent.enumCategory,
  enumPrefix: resourceTypeEnumContent.enumPrefix,
  list: resourceTypeEnumContent.list,
  keys: resourceTypeEnumKeys,
  ids: resourceTypeEnumIds,
  enum: getEnumArray(resourceTypeEnumContent),
};

export const reviewStatusEnum = {
  enumCategory: reviewStatusEnumContent.enumCategory,
  enumPrefix: reviewStatusEnumContent.enumPrefix,
  list: reviewStatusEnumContent.list,
  keys: reviewStatusEnumKeys,
  ids: reviewStatusEnumIds,
  enum: getEnumArray(reviewStatusEnumContent),
};

export const tenantTypeEnum = {
  enumCategory: tenantTypeEnumContent.enumCategory,
  enumPrefix: tenantTypeEnumContent.enumPrefix,
  list: tenantTypeEnumContent.list,
  keys: tenantTypeEnumKeys,
  ids: tenantTypeEnumIds,
  enum: getEnumArray(tenantTypeEnumContent),
};

export const transmissionStageEnum = {
  enumCategory: transmissionStageEnumContent.enumCategory,
  enumPrefix: transmissionStageEnumContent.enumPrefix,
  list: transmissionStageEnumContent.list,
  keys: transmissionStageEnumKeys,
  ids: transmissionStageEnumIds,
  enum: getEnumArray(transmissionStageEnumContent),
};

export const transmissionTypeEnum = {
  enumCategory: transmissionTypeEnumContent.enumCategory,
  enumPrefix: transmissionTypeEnumContent.enumPrefix,
  list: transmissionTypeEnumContent.list,
  keys: transmissionTypeEnumKeys,
  ids: transmissionTypeEnumIds,
  enum: getEnumArray(transmissionTypeEnumContent),
};

export const enums = {
  activeStatusEnum,
  cronJobStatusEnum,
  genderEnum,
  healthcareFacilityTypeEnum,
  implementationStatusEnum,
  jobEventStageEnum,
  jobEventTypeEnum,
  logLevelEnum,
  memberRoleEnum,
  resourceTypeEnum,
  reviewStatusEnum,
  tenantTypeEnum,
  transmissionStageEnum,
  transmissionTypeEnum,
};
