import deepFreeze from 'deep-freeze';

export const MOCK_LIABILITIES_DATA = deepFreeze({
  declarationID: '7fc7350d-05ed-4ce0-965d-ab8a0093ba49',
  dossierManifest: {
    name: '2020_Voorlopige Aangifte_1.1',
    taxableYear: 2020,
    dossierId: '20b1170b-64f8-4648-b021-ab8a0093ba4a',
    declarationTypeId: 2,
    isJointDeclaration: false,
    declarationStatusId: 1,
    declarationStatus: 'Onderhanden',
    taxLicenseNumber: null,
    version: '1.1',
    declarationType: 'Voorlopige Aangifte',
  },
  personalDetails: {
    taxableSubjectDetails: {
      taxableSubjectId: '2f7d389d-2bea-4fc5-9e40-aaa80087ab72',
      firstName: 'Sem',
      initials: null,
      middleName: 'Abel',
      lastName: 'Hiddie',
      bsn: '23123',
      birthDate: '2019-08-13T08:09:45.737',
      deathDate: null,
      taxationFormID: 1,
      taxFormType: 'P-Biljet',
      livingTogetherPreciseSituation: null,
      maritalStatus: 0,
      age: 0,
      fullName: 'Sem Abel Hiddie',
    },
    fiscalPartner: null,
    isJointDeclaration: true,
    relationShipSituation: null,
    children: [],
  },
  liabilitiesScreen: {
    jointLiabilities: {
      loansForOwnHome: [
        {
          loanDetails: {
            description: 'loan details desc',
            belongsTo: '2',
            accountNumber: 'ACC123',
            countryId: 1,
            loanGiver: 4,
            loanPurpose: 1,
            percentageOfAmount: 30,
            principalAmount: 0,
            interest: 0,
            employeeCredit: 7000,
          },
          costs: [
            {
              description: 'Test',
              amount: 5000,
            },
            {
              description: 'Test 1',
              amount: 15000,
            },
          ],
          loanGiverDetails: {
            startDate: '2020-05-05',
            endDate: '2020-05-25',
            originalPrincipalAmount: 6000,
            interestRate: 30,
            payBackMethod: 1,
            bsn: '123456789',
            firstName: 'Sachin',
            middleName: 'middleSachin',
            lastName: 'Tecndulkar',
            initials: 'initialsSachin',
            address: {
              street: 'mahanthi',
              houseNumber: 356,
              additionToHouseNumber: '23',
              zipCode: '1234AB',
              city: 'Hyd',
              countryId: 1,
            },
          },
        },
        {
          loanDetails: {
            description: 'loan details 2',
            belongsTo: '1',
            accountNumber: '123cc',
            countryId: 1,
            loanGiver: 1,
            loanPurpose: 1,
            percentageOfAmount: 30,
            principalAmount: 6000,
            interest: 85,
            employeeCredit: 9000,
          },
          costs: [
            {
              description: 'Test',
              amount: 6000,
            },
            {
              description: 'Test 1',
              amount: 4000,
            },
          ],
          loanGiverDetails: {
            startDate: '2020-05-05',
            endDate: '2020-05-25',
            originalPrincipalAmount: 6000,
            interestRate: 30,
            payBackMethod: 1,
            bsn: '123456789',
            firstName: 'nathan',
            middleName: '',
            lastName: 'Tecndulkar',
            initials: '',
            address: {
              street: 's209',
              houseNumber: 356,
              additionToHouseNumber: '23',
              zipCode: '7562ST',
              city: 'stocktown',
              countryId: 1,
            },
          },
        },
      ],
      residualLoans: [
        {
          loanDetails: {
            description: 'loan details desc',
            belongsTo: '2',
            accountNumber: 'ACC123',
            countryId: 1,
            loanPurpose: 1,
            percentageOfAmount: 30,
            principalAmount: 0,
            interest: 0,
            employeeCredit: 0,
          },
          costs: [
            {
              description: 'Test',
              belongsTo: '2',
              amount: 5000,
            },
            {
              description: 'Test 1',
              belongsTo: '2',
              amount: 15000,
            },
          ],
        },
        {
          loanDetails: {
            description: 'loan details 2',
            belongsTo: '1',
            accountNumber: '123cc',
            countryId: 1,
            loanPurpose: 1,
            percentageOfAmount: 30,
            principalAmount: 6000,
            interest: 85,
            employeeCredit: 9000,
          },
          costs: [
            {
              description: 'Test',
              belongsTo: '1',
              amount: 6000,
            },
            {
              description: 'Test 1',
              belongsTo: '1',
              amount: 4000,
            },
          ],
        },
      ],
      otherLoans: [
        {
          description: 'test 1',
          belongsTo: '1',
          accountNumber: '1111',
          countryId: 1,
          loanPurpose: '1',
          amount: '1000',
        }, {
          description: 'test 2',
          belongsTo: '2',
          accountNumber: '2222',
          countryId: 1,
          loanPurpose: '1',
          amount: '2000',
        },
      ],
    },
  },
  masterData: {
    parentCollectingChildCareOptions: [
      {
        displayName: 'Sem Abel Hiddie',
        value: '23123',
      },
      {
        displayName: 'Other',
        value: '0',
      },
    ],
    childRegisteredOnAddressOptions: [
      {
        displayName: 'Sem Abel Hiddie',
        value: 1,
      },
      {
        displayName: 'Ex Fiscaal Partner',
        value: 3,
      },
    ],
    owners: [
      {
        displayName: 'Sem Abel Hiddie',
        value: '1',
      },
      {
        displayName: 'Sem Abel',
        value: '2',
      },
      {
        displayName: 'Both',
        value: '3',
      },
    ],
  },
});

export const MOCK_LIABILITIES_DATA_WITH_OWN_HOME = deepFreeze({
  jointLiabilities: {
    loansForOwnHome: [
      {
        loanDetails: {
          description: 'loan details desc',
          belongsTo: '2',
          accountNumber: 'ACC123',
          countryId: 1,
          loanGiver: 4,
          loanPurpose: 1,
          percentageOfAmount: 30,
          principalAmount: 0,
          interest: 0,
          employeeCredit: 7000,
        },
        costs: [
          {
            description: 'Test',
            amount: 5000,
          },
          {
            description: 'Test 1',
            amount: 15000,
          },
        ],
        loanGiverDetails: {
          startDate: '2020-05-05',
          endDate: '2020-05-25',
          originalPrincipalAmount: 6000,
          interestRate: 30,
          payBackMethod: 1,
          bsn: '123456789',
          firstName: 'Sachin',
          middleName: 'middleSachin',
          lastName: 'Tecndulkar',
          initials: 'initialsSachin',
          dateOfBirth: '10-10-1991',
          address: {
            street: 'mahanthi',
            houseNumber: 356,
            additionToHouseNumber: '23',
            zipCode: '1234AB',
            city: 'Hyd',
            countryId: 1,
          },
        },
      },
      {
        loanDetails: {
          description: 'loan details 2',
          belongsTo: '1',
          accountNumber: '123cc',
          countryId: 1,
          loanGiver: 1,
          loanPurpose: 1,
          percentageOfAmount: 30,
          principalAmount: 6000,
          interest: 85,
          employeeCredit: 9000,
        },
        costs: [
          {
            description: 'Test',
            amount: 6000,
          },
          {
            description: 'Test 1',
            amount: 4000,
          },
        ],
        loanGiverDetails: {
          startDate: '2020-05-05',
          endDate: '2020-05-25',
          originalPrincipalAmount: 6000,
          interestRate: 30,
          payBackMethod: 1,
          bsn: '123456789',
          firstName: 'nathan',
          middleName: '',
          lastName: 'Tecndulkar',
          initials: '',
          address: {
            street: 's209',
            houseNumber: 356,
            additionToHouseNumber: '23',
            zipCode: '7562ST',
            city: 'stocktown',
            countryId: 1,
          },
        },
      },
    ],
  },
});


export const MOCK_LIABILITIES_DATA_WITH_RESIDUAL_LOANS = deepFreeze({
  jointLiabilities: {
    residualLoans: [
      {
        loanDetails: {
          description: 'loan details desc',
          belongsTo: '2',
          accountNumber: 'ACC123',
          countryId: 1,
          loanPurpose: 1,
          percentageOfAmount: 30,
          principalAmount: 0,
          interest: 0,
          employeeCredit: 0,
        },
        costs: [
          {
            description: 'Test',
            belongsTo: '2',
            amount: 5000,
          },
          {
            description: 'Test 1',
            belongsTo: '2',
            amount: 15000,
          },
        ],
      },
      {
        loanDetails: {
          description: 'loan details 2',
          belongsTo: '1',
          accountNumber: '123cc',
          countryId: 1,
          loanPurpose: 1,
          percentageOfAmount: 30,
          principalAmount: 6000,
          interest: 85,
          employeeCredit: 9000,
        },
        costs: [
          {
            description: 'Test',
            belongsTo: '1',
            amount: 6000,
          },
          {
            description: 'Test 1',
            belongsTo: '1',
            amount: 4000,
          },
        ],
      },
    ],
  },
});

export const LIABILITIES_DATA_WITH_OUT_COSTS = deepFreeze({
  jointLiabilities: {
    loansForOwnHome: [
      {
        loanDetails: {
          description: 'loan details desc',
          belongsTo: '2',
          accountNumber: 'ACC123',
          countryId: 1,
          loanGiver: 4,
          loanPurpose: 1,
          percentageOfAmount: 30,
          principalAmount: 5000,
          interest: 100,
          employeeCredit: 7000,
        },
        costs: [
          {
            description: 'Test',
            amount: 5000,
          },
          {
            description: 'Test 1',
            amount: 15000,
          },
        ],
        loanGiverDetails: {
          startDate: '2020-05-05T08:21:08.869Z',
          endDate: null,
          originalPrincipalAmount: 6000,
          interestRate: 30.5,
          payBackMethod: 1,
          bsn: '123456789',
          firstName: 'Sachin',
          middleName: 'middleSachin',
          lastName: 'Tecndulkar',
          initials: 'initialsSachin',
          address: {
            street: 'mahanthi',
            houseNumber: 356,
            additionToHouseNumber: '23',
            zipCode: '1234AB',
            city: 'Hyd',
            countryId: 1,
          },
        },
      },
      {
        loanDetails: {
          description: 'loan details 2',
          belongsTo: '1',
          accountNumber: '123cc',
          countryId: 1,
          loanGiver: 4,
          loanPurpose: 1,
          percentageOfAmount: 30,
          principalAmount: 6000,
          interest: 85,
          employeeCredit: 9000,
        },
        costs: null,
        loanGiverDetails: {
          startDate: '2020-05-05',
          endDate: null,
          originalPrincipalAmount: 6000,
          interestRate: 30.5,
          payBackMethod: 1,
          bsn: '123456789',
          firstName: 'nathan',
          middleName: '',
          lastName: 'Tecndulkar',
          initials: '',
          address: {
            street: 's209',
            houseNumber: 356,
            additionToHouseNumber: '23',
            zipCode: '7562ST',
            city: 'stocktown',
            countryId: 1,
          },
        },
      },
    ],
  },
});

export const EMPTY_LIABILITY_DATA = deepFreeze({
  jointLiabilities: {},
});

export const LIABILITIES_DATA_WITH_LOAN_GIVER = deepFreeze({
  jointLiabilities: {
    loansForOwnHome: [
      {
        loanDetails: {
          description: 'loan details desc',
          belongsTo: '2',
          accountNumber: 'ACC123',
          countryId: 1,
          loanGiver: 4,
          loanPurpose: 1,
          percentageOfAmount: 30,
          principalAmount: 5000,
          interest: 100,
          employeeCredit: 7000,
        },
        costs: [
          {
            description: 'Test',
            amount: 5000,
          },
          {
            description: 'Test 1',
            amount: 15000,
          },
        ],
        loanGiverDetails: {
          startDate: null,
          endDate: null,
          originalPrincipalAmount: 6000,
          interestRate: 30.5,
          payBackMethod: 1,
          bsn: '123456789',
          firstName: 'Sachin',
          middleName: 'middleSachin',
          lastName: 'Tecndulkar',
          initials: 'initialsSachin',
          address: {
            street: 'mahanthi',
            houseNumber: 356,
            additionToHouseNumber: '23',
            zipCode: '5555dc',
            city: 'Hyd',
            countryId: 1,
          },
        },
      },
      {
        loanDetails: {
          description: 'loan details 2',
          belongsTo: '1',
          accountNumber: '123cc',
          countryId: 1,
          loanGiver: 4,
          loanPurpose: 1,
          percentageOfAmount: 30,
          principalAmount: 6000,
          interest: 85,
          employeeCredit: 9000,
        },
        costs: [{ description: 'test', amount: 100 }],
        loanGiverDetails: {
          startDate: '2020-05-05',
          endDate: null,
          originalPrincipalAmount: 6000,
          interestRate: 30.5,
          payBackMethod: 1,
          bsn: '123456789',
          firstName: 'nathan',
          middleName: '',
          lastName: 'Tecndulkar',
          initials: '',
          address: {
            street: 's209',
            houseNumber: 356,
            additionToHouseNumber: '23',
            zipCode: '7562ST',
            city: 'stocktown',
            countryId: 1,
          },
        },
      },
    ],
  },
});

export const MOCK_LIABILITIES_OTHER_LOANS_DATA = deepFreeze({
  declarationID: '7fc7350d-05ed-4ce0-965d-ab8a0093ba49',
  dossierManifest: {
    name: '2020_Voorlopige Aangifte_1.1',
    taxableYear: 2020,
    dossierId: '20b1170b-64f8-4648-b021-ab8a0093ba4a',
    declarationTypeId: 2,
    isJointDeclaration: false,
    declarationStatusId: 1,
    declarationStatus: 'Onderhanden',
    taxLicenseNumber: null,
    version: '1.1',
    declarationType: 'Voorlopige Aangifte',
  },
  personalDetails: {
    taxableSubjectDetails: {
      taxableSubjectId: '2f7d389d-2bea-4fc5-9e40-aaa80087ab72',
      firstName: 'Sem',
      initials: null,
      middleName: 'Abel',
      lastName: 'Hiddie',
      bsn: '23123',
      birthDate: '2019-08-13T08:09:45.737',
      deathDate: null,
      taxationFormID: 1,
      taxFormType: 'P-Biljet',
      livingTogetherPreciseSituation: null,
      maritalStatus: 0,
      age: 0,
      fullName: 'Sem Abel Hiddie',
    },
    fiscalPartner: null,
    relationShipSituation: null,
    children: [

    ],
  },
  liabilitiesScreen: {
    jointLiabilities: {
      otherLoans: [
        {
          description: 'test 1',
          belongsTo: '1',
          accountNumber: '1111',
          countryId: 1,
          loanPurpose: '1',
          amount: '1000',
        }, {
          description: 'test 2',
          belongsTo: '2',
          accountNumber: '2222',
          countryId: 1,
          loanPurpose: '1',
          amount: '2000',
        },
      ],
    },
  },
  masterData: {
    parentCollectingChildCareOptions: [
      {
        displayName: 'Sem Abel Hiddie',
        value: '23123',
      },
    ],
    childRegisteredOnAddressOptions: [
      {
        displayName: 'Sem Abel Hiddie',
        value: 1,
      },
    ],
    owners: [
      {
        displayName: 'Sem Abel Hiddie',
        value: '1',
      },
    ],
  },
});
