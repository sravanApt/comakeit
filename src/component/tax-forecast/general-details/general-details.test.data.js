import deepFreeze from 'deep-freeze';

export const GENERAL_DETAILS = deepFreeze({
  declarationID: '7f3c4fa9-fe84-46ad-8f8e-aacb0057364e',
  dossierManifest: {
    name: '2019_Provisional declaration_1.3',
    taxableYear: 2019,
    dossierId: 'b106308c-13be-4aef-8860-aacd008f0540',
    taxationFormID: 2,
    taxFormType: 'F-Form',
    declarationTypeId: 2,
    isJointDeclaration: false,
    declarationStatusId: 1,
    taxLicenseNumber: null,
    declarationStatus: 'Onderhanden',
    version: '1.3',
    declarationType: 'Provisional declaration',
  },
  personalDetails: {
    taxableSubjectDetails: {
      taxableSubjectId: '537e489a-c621-4c85-b7fb-abbf00cb4f5b',
      firstName: 'Robert',
      initials: null,
      middleName: 's',
      lastName: 'Ruther',
      bsn: '111111111',
      birthDate: '2012-09-30T06:30:00Z',
      deathDate: '',
      taxationFormID: 4,
      taxFormType: 'M-Biljet',
      livingTogetherPreciseSituation: null,
      maritalStatus: 2,
      age: 0,
      fullName: 'Robert s Ruther',
    },
    fiscalPartner: {
      taxableSubjectId: '537e489a-c621-4c85-b7fb-abbf00cb4f5b',
      firstName: 'Thijs',
      initials: null,
      middleName: 'lk',
      lastName: 'c',
      bsn: '235647894',
      birthDate: '2012-09-30T06:30:00Z',
      deathDate: '',
      taxationFormID: 1,
      taxFormType: 'P-Biljet',
      livingTogetherPreciseSituation: null,
      maritalStatus: 2,
      age: 0,
      fullName: 'Thijs lk c',
    },
    generalDetails: {
      fiscalPartnerGeneralInformation: {
        beconNumber: null,
        dueDate: null,
        emailId: 'test1@gmail.com',
        name: 'Thijs lk c',
      },
      taxablesubjectGeneralInformation: {
        beconNumber: null,
        dueDate: null,
        emailId: 'test@gmail.com',
        name: 'Robert s Ruther',
      },

    },
  },
});

// TODO: Will be reverted after Elfin release
// export const MOCK_TAXABLE_SUBJECT_ID = '537e489a-c621-4c85-b7fb-abbf00cb4f5b';
// export const EMAIL_OPTIONS = [
//   {
//     label: 'test@gmail.com',
//     value: 'test@gmail.com',
//   },
//   {
//     label: 'test1@gmail.com',
//     value: 'test1@gmail.com',
//   },
//   {
//     label: 'test2@gmail.com',
//     value: 'test2@gmail.com',
//   },
// ];
