import type { Prisma } from '@prisma/generated';

export type ModelName = Prisma.ModelName;
export const modelNameObj = {
  EFMigrationsHistory: 'eFMigrationsHistory',
  Attachments: 'attachments',
  cities: 'cities',
  ClaimStatus: 'claimStatus',
  cloudRequests: 'cloudRequests',
  CloudRequestsBooking: 'cloudRequestsBooking',
  Currency: 'currency',
  Doctors: 'doctors',
  DoctorsScheduals: 'doctorsScheduals',
  Examination_services: 'examination_services',
  ExaminationAttachments: 'examinationAttachments',
  ExaminationData: 'examinationData',
  ExaminationData_scanner: 'examinationData_scanner',
  ExaminationsClinics: 'examinationsClinics',
  Filter: 'filter',
  FilterParameter: 'filterParameter',
  fingerprints: 'fingerprints',
  fingerprints_updates: 'fingerprints_updates',
  healthcenter_contracts: 'healthcenter_contracts',
  healthcenter_services: 'healthcenter_services',
  healthcenterInstitutes: 'healthcenterInstitutes',
  healthCenters: 'healthCenters',
  healthcenters_activations: 'healthcenters_activations',
  healthcenters_contact: 'healthcenters_contact',
  healthCenters_credential: 'healthCenters_credential',
  healthcenters_staff: 'healthcenters_staff',
  healthcenters_staff_info: 'healthcenters_staff_info',
  healthcenters_staff_permissions: 'healthcenters_staff_permissions',
  healthcenters_tags: 'healthcenters_tags',
  InReceipts: 'inReceipts',
  Institute_contact: 'institute_contact',
  Institute_contracts: 'institute_contracts',
  institutes: 'institutes',
  institutes_tags: 'institutes_tags',
  invoices: 'invoices',
  Invoices_DailyProcedures: 'invoices_DailyProcedures',
  invoices_notes: 'invoices_notes',
  Invoices_StateTrans: 'invoices_StateTrans',
  Invoices_Trans: 'invoices_Trans',
  log_table: 'log_table',
  nationality: 'nationality',
  outReceipt: 'outReceipt',
  package_services: 'package_services',
  Packages: 'packages',
  PartnerInfo: 'partnerInfo',
  PatientExamination: 'patientExamination',
  PatientExaminationServices_Log: 'patientExaminationServices_Log',
  PatientInfo: 'patientInfo',
  PatientRejectServices: 'patientRejectServices',
  PatientServices: 'patientServices',
  PatientServicesMedications: 'patientServicesMedications',
  PatientServicesNotes: 'patientServicesNotes',
  PatientServicesTrans: 'patientServicesTrans',
  fawt_Reasons: 'fawt_Reasons',
  huia_Reasons: 'huia_Reasons',
  RecordData: 'recordData',
  Relation_Coverage: 'relation_Coverage',
  RelationShips: 'relationShips',
  reports: 'reports',
  Sections: 'sections',
  Services: 'services',
  SpentPackage: 'spentPackage',
  SpentPackageTN: 'spentPackageTN',
  SpentPackageZH: 'spentPackageZH',
  Subscriber_DeactivationReasons: 'subscriber_DeactivationReasons',
  subscriberCredit_Services: 'subscriberCredit_Services',
  subscribers: 'subscribers',
  subscribers_Credit: 'subscribers_Credit',
  Subscribers_hidden: 'subscribers_hidden',
  subscribers_info: 'subscribers_info',
  subscribers_LimitCredit: 'subscribers_LimitCredit',
  subscribers_records: 'subscribers_records',
  subscribers_recordsLog: 'subscribers_recordsLog',
  subscribers_tags: 'subscribers_tags',
  SubscribersNotes: 'subscribersNotes',
  sysdiagrams: 'sysdiagrams',
  tags: 'tags',
  dal_Terms: 'dal_Terms',
  Dal_users: 'dal_users',
  users_info: 'users_info',
  users_permissions: 'users_permissions',
  users_sections: 'users_sections',
  UsersClaimsActions: 'usersClaimsActions',
  VerificationTypes: 'verificationTypes',
  fawt_InvoicesValues: 'fawt_InvoicesValues',
  ChronicDiseases: 'chronicDiseases',
  Classifications: 'classifications',
  Diagnosis: 'diagnosis',
  MedicationInfo: 'medicationInfo',
  MedicationUnits: 'medicationUnits',
  PatientServices_MedicationsReviewed: 'patientServices_MedicationsReviewed',
  ReviewNotesList: 'reviewNotesList',
  Services_medications: 'services_medications',
  Services_medicationsDiagnosis: 'services_medicationsDiagnosis',
  Services_packages: 'services_packages',
  SubscriberDiagnosis: 'subscriberDiagnosis',
  SubscriberMedications: 'subscriberMedications',
  temp_subscriberlist_CNC_ZWRC: 'temp_subscriberlist_CNC_ZWRC',
  AnalysisDevices: 'analysisDevices',
  AnalysisFamily: 'analysisFamily',
  AnalysisInfo: 'analysisInfo',
  AnalysisMethods: 'analysisMethods',
  AnalysisParameters: 'analysisParameters',
  AnalysisParametersTypes: 'analysisParametersTypes',
  AnalysisRanges: 'analysisRanges',
  AnalysisRangesGroups: 'analysisRangesGroups',
  AnalysisRangesVTypes: 'analysisRangesVTypes',
  AnalysisResultTypes: 'analysisResultTypes',
  AnalysisUnits: 'analysisUnits',
  Invoice_detailsANA_multi: 'invoice_detailsANA_multi',
  Invoice_detailsANA_ranges: 'invoice_detailsANA_ranges',
  Invoice_detailsANA_report: 'invoice_detailsANA_report',
  Invoice_detailsANA_single: 'invoice_detailsANA_single',
  Roles: 'roles',
  RolesCategories: 'rolesCategories',
  Lab_users: 'lab_users',
  UsersLog: 'usersLog',
  UsersPermissions: 'usersPermissions',
  UsersRoles: 'usersRoles',
  MedicalAudit: 'medicalAudit',
  VSubscribers_info: 'vSubscribers_info',
} as const;
export type GetOperations =
  | 'findFirst'
  | 'findFirstOrThrow'
  | 'findUnique'
  | 'findUniqueOrThrow'
  | 'findMany'
  | 'aggregate'
  | 'count'
  | 'groupBy';

export type PostOperations =
  | 'create'
  | 'createMany'
  | 'createManyAndReturn'
  | 'update'
  | 'updateMany'
  | 'upsert'
  | 'delete'
  | 'deleteMany';

export type ApiEndpoint =
  `/crud/${ModelName}/${PostOperations | GetOperations}`;

export type Delegates = {
  EFMigrationsHistory: Prisma.EFMigrationsHistoryDelegate;
  Attachments: Prisma.AttachmentsDelegate;
  cities: Prisma.citiesDelegate;
  ClaimStatus: Prisma.ClaimStatusDelegate;
  cloudRequests: Prisma.cloudRequestsDelegate;
  CloudRequestsBooking: Prisma.CloudRequestsBookingDelegate;
  Currency: Prisma.CurrencyDelegate;
  Doctors: Prisma.DoctorsDelegate;
  DoctorsScheduals: Prisma.DoctorsSchedualsDelegate;
  Examination_services: Prisma.Examination_servicesDelegate;
  ExaminationAttachments: Prisma.ExaminationAttachmentsDelegate;
  ExaminationData: Prisma.ExaminationDataDelegate;
  ExaminationData_scanner: Prisma.ExaminationData_scannerDelegate;
  ExaminationsClinics: Prisma.ExaminationsClinicsDelegate;
  Filter: Prisma.FilterDelegate;
  FilterParameter: Prisma.FilterParameterDelegate;
  fingerprints: Prisma.fingerprintsDelegate;
  fingerprints_updates: Prisma.fingerprints_updatesDelegate;
  healthcenter_contracts: Prisma.healthcenter_contractsDelegate;
  healthcenter_services: Prisma.healthcenter_servicesDelegate;
  healthcenterInstitutes: Prisma.healthcenterInstitutesDelegate;
  healthCenters: Prisma.healthCentersDelegate;
  healthcenters_activations: Prisma.healthcenters_activationsDelegate;
  healthcenters_contact: Prisma.healthcenters_contactDelegate;
  healthCenters_credential: Prisma.healthCenters_credentialDelegate;
  healthcenters_staff: Prisma.healthcenters_staffDelegate;
  healthcenters_staff_info: Prisma.healthcenters_staff_infoDelegate;
  healthcenters_staff_permissions: Prisma.healthcenters_staff_permissionsDelegate;
  healthcenters_tags: Prisma.healthcenters_tagsDelegate;
  InReceipts: Prisma.InReceiptsDelegate;
  Institute_contact: Prisma.Institute_contactDelegate;
  Institute_contracts: Prisma.Institute_contractsDelegate;
  institutes: Prisma.institutesDelegate;
  institutes_tags: Prisma.institutes_tagsDelegate;
  invoices: Prisma.invoicesDelegate;
  Invoices_DailyProcedures: Prisma.Invoices_DailyProceduresDelegate;
  invoices_notes: Prisma.invoices_notesDelegate;
  Invoices_StateTrans: Prisma.Invoices_StateTransDelegate;
  Invoices_Trans: Prisma.Invoices_TransDelegate;
  log_table: Prisma.log_tableDelegate;
  nationality: Prisma.nationalityDelegate;
  outReceipt: Prisma.outReceiptDelegate;
  package_services: Prisma.package_servicesDelegate;
  Packages: Prisma.PackagesDelegate;
  PartnerInfo: Prisma.PartnerInfoDelegate;
  PatientExamination: Prisma.PatientExaminationDelegate;
  PatientExaminationServices_Log: Prisma.PatientExaminationServices_LogDelegate;
  PatientInfo: Prisma.PatientInfoDelegate;
  PatientRejectServices: Prisma.PatientRejectServicesDelegate;
  PatientServices: Prisma.PatientServicesDelegate;
  PatientServicesMedications: Prisma.PatientServicesMedicationsDelegate;
  PatientServicesNotes: Prisma.PatientServicesNotesDelegate;
  PatientServicesTrans: Prisma.PatientServicesTransDelegate;
  fawt_Reasons: Prisma.fawt_ReasonsDelegate;
  huia_Reasons: Prisma.huia_ReasonsDelegate;
  RecordData: Prisma.RecordDataDelegate;
  Relation_Coverage: Prisma.Relation_CoverageDelegate;
  RelationShips: Prisma.RelationShipsDelegate;
  reports: Prisma.reportsDelegate;
  Sections: Prisma.SectionsDelegate;
  Services: Prisma.ServicesDelegate;
  SpentPackage: Prisma.SpentPackageDelegate;
  SpentPackageTN: Prisma.SpentPackageTNDelegate;
  SpentPackageZH: Prisma.SpentPackageZHDelegate;
  Subscriber_DeactivationReasons: Prisma.Subscriber_DeactivationReasonsDelegate;
  subscriberCredit_Services: Prisma.subscriberCredit_ServicesDelegate;
  subscribers: Prisma.subscribersDelegate;
  subscribers_Credit: Prisma.subscribers_CreditDelegate;
  Subscribers_hidden: Prisma.Subscribers_hiddenDelegate;
  subscribers_info: Prisma.subscribers_infoDelegate;
  subscribers_LimitCredit: Prisma.subscribers_LimitCreditDelegate;
  subscribers_records: Prisma.subscribers_recordsDelegate;
  subscribers_recordsLog: Prisma.subscribers_recordsLogDelegate;
  subscribers_tags: Prisma.subscribers_tagsDelegate;
  SubscribersNotes: Prisma.SubscribersNotesDelegate;
  sysdiagrams: Prisma.sysdiagramsDelegate;
  tags: Prisma.tagsDelegate;
  dal_Terms: Prisma.dal_TermsDelegate;
  Dal_users: Prisma.Dal_usersDelegate;
  users_info: Prisma.users_infoDelegate;
  users_permissions: Prisma.users_permissionsDelegate;
  users_sections: Prisma.users_sectionsDelegate;
  UsersClaimsActions: Prisma.UsersClaimsActionsDelegate;
  VerificationTypes: Prisma.VerificationTypesDelegate;
  fawt_InvoicesValues: Prisma.fawt_InvoicesValuesDelegate;
  ChronicDiseases: Prisma.ChronicDiseasesDelegate;
  Classifications: Prisma.ClassificationsDelegate;
  Diagnosis: Prisma.DiagnosisDelegate;
  MedicationInfo: Prisma.MedicationInfoDelegate;
  MedicationUnits: Prisma.MedicationUnitsDelegate;
  PatientServices_MedicationsReviewed: Prisma.PatientServices_MedicationsReviewedDelegate;
  ReviewNotesList: Prisma.ReviewNotesListDelegate;
  Services_medications: Prisma.Services_medicationsDelegate;
  Services_medicationsDiagnosis: Prisma.Services_medicationsDiagnosisDelegate;
  Services_packages: Prisma.Services_packagesDelegate;
  SubscriberDiagnosis: Prisma.SubscriberDiagnosisDelegate;
  SubscriberMedications: Prisma.SubscriberMedicationsDelegate;
  temp_subscriberlist_CNC_ZWRC: Prisma.temp_subscriberlist_CNC_ZWRCDelegate;
  AnalysisDevices: Prisma.AnalysisDevicesDelegate;
  AnalysisFamily: Prisma.AnalysisFamilyDelegate;
  AnalysisInfo: Prisma.AnalysisInfoDelegate;
  AnalysisMethods: Prisma.AnalysisMethodsDelegate;
  AnalysisParameters: Prisma.AnalysisParametersDelegate;
  AnalysisParametersTypes: Prisma.AnalysisParametersTypesDelegate;
  AnalysisRanges: Prisma.AnalysisRangesDelegate;
  AnalysisRangesGroups: Prisma.AnalysisRangesGroupsDelegate;
  AnalysisRangesVTypes: Prisma.AnalysisRangesVTypesDelegate;
  AnalysisResultTypes: Prisma.AnalysisResultTypesDelegate;
  AnalysisUnits: Prisma.AnalysisUnitsDelegate;
  Invoice_detailsANA_multi: Prisma.Invoice_detailsANA_multiDelegate;
  Invoice_detailsANA_ranges: Prisma.Invoice_detailsANA_rangesDelegate;
  Invoice_detailsANA_report: Prisma.Invoice_detailsANA_reportDelegate;
  Invoice_detailsANA_single: Prisma.Invoice_detailsANA_singleDelegate;
  Roles: Prisma.RolesDelegate;
  RolesCategories: Prisma.RolesCategoriesDelegate;
  Lab_users: Prisma.Lab_usersDelegate;
  UsersLog: Prisma.UsersLogDelegate;
  UsersPermissions: Prisma.UsersPermissionsDelegate;
  UsersRoles: Prisma.UsersRolesDelegate;
  MedicalAudit: Prisma.MedicalAuditDelegate;
  VSubscribers_info: Prisma.VSubscribers_infoDelegate;
};

export type Arguments<
  T extends ModelName,
  O extends PostOperations | GetOperations,
> = Prisma.Args<Delegates[T], O>;

export type Results<
  T extends ModelName,
  A,
  O extends PostOperations | GetOperations,
> = Prisma.Result<Delegates[T], A, O>;

export type Exact<
  A extends Arguments<ModelName, PostOperations | GetOperations>,
  T extends ModelName,
  O extends PostOperations | GetOperations,
> = Prisma.Exact<A, Prisma.Args<Delegates[T], O>>;
