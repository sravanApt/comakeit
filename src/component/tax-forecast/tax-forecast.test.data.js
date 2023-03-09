import fetchMock from 'fetch-mock';
import deepFreeze from 'deep-freeze';
import { INITIAL_ADDITIONAL_CALCULATION_DATA } from './additional-calculation-information/additional-calculation-information-container.test.data';
import { MOCK_DOSSIER_LIST } from '../create-dossier/create-dossier-modal.test.data';

export const DECLARATION_TYPE = 2;
export const TAXABLE_YEAR = 2018;

export const DECLARATION_ID = 'b106308c-13be-4aef-8860-aacd008f0540';
export const GLOBAL_CLIENT_ID = 'a123308c-13be-4aef-8860-aacd008f0540';
export const GLOBAL_ADVISER_ID = '0C8263F5-4B52-4ABD-B83F-B5D3CF216DF5';

export const ACTIVE_TAB = 0;
export const ACTIVE_PARTNER_OBJECT = { activeTab: 1 };

export const VPC_OPTIONS = {
  TaxableSubjectID: '00000000-0000-0000-0000-000000000000',
  globalAdministrationId: '38a273d3-5df8-4d32-872d-aad8008c5fb1',
  dataSource: 1,
  declarationId: 'b106308c-13be-4aef-8860-aacd008f0540',
  declarationTypeId: 2,
  taxableYear: 2018,
  businessPartnerId: 1,
};

export const FORECAST_DATA = deepFreeze({
  content: {
    declarationID: 'b106308c-13be-4aef-8860-aacd008f0540',
    dossierManifest: {
      name: '2018_Provisional declaration_1.1',
      taxableYear: 2018,
      dossierId: 'ad979398-592d-4f10-8801-aacd008f0546',
      declarationTypeId: 2,
      declarationStatusId: 1,
      taxLicenseNumber: null,
      version: '1.1',
      declarationType: 'Provisional declaration',
    },
    personalDetails: {
      taxableSubjectDetails: {
        taxableSubjectId: '00000000-0000-0000-0000-000000000000',
        firstName: 'Christoffel',
        initials: null,
        middleName: 'Abel',
        lastName: 'Hiddie',
        bsn: '23123',
        birthDate: '1992-08-03T00:00:00',
        deathDate: '',
        taxationFormID: 1,
        taxFormType: 'P-Biljet',
        livingTogetherPreciseSituation: 0,
        maritalStatus: 4,
        age: -2,
        fullName: 'Christoffel Abel Hiddie',
      },
      fiscalPartner: {
        taxableSubjectId: '00000000-0000-0000-0000-000000000000',
        firstName: 'Christoffel',
        initials: null,
        middleName: 'Abel',
        lastName: 'Hiddie',
        bsn: '23123',
        birthDate: '1994-04-06T00:00:00',
        deathDate: '',
        taxationFormID: 1,
        taxFormType: 'P-Biljet',
        livingTogetherPreciseSituation: 0,
        maritalStatus: 4,
        age: -2,
        fullName: 'Christoffel Abel Hiddie',
      },
      relationShipSituation: {
        partnerDeathDate: null,
        divorceDate: null,
        periodOfLivingTogether: {
          startDate: '2018-07-01T00:00:00',
          endDate: '2018-07-02T00:00:00',
        },
        isFiscalPartnerCriteriaMet: true,
        marriageDate: null,
        applyFiscalPartnerForWholeYear: true,
      },
      children: [
        {
          name: '',
          dateOfBirth: '1992-06-03T00:00:00',
          dateOfDeath: null,
          bsn: '',
          registrationOnAddress: 0,
          isCoParenting: null,
          isAtleastThreeDaysPerWeekLiving: null,
          isParentCollectingChildCare: null,
          isSignificantSupportExtended: null,
          age: 26,
          parentCollectingChildCare: null,
        },
      ],
      isJointDeclaration: false,
    },
    income: {
      taxableSubjectIncome: {
        taxableWages: {
          currentEmploymentIncome: [
            {
              salary: {
                description: 'test',
              },
              withHeldWageTax: 100,
              employmentDiscount: 100,
            },
            {
              salary: {
                description: '',
                amount: 0,
              },
              withHeldWageTax: 0,
              employmentDiscount: 0,
            },
          ],
          previousEmploymentIncome: null,
          taxableIncomeAbroad: null,
          exemptedIncomeFromInternationalOrganization: null,
          dubbelePositie: null,
        },
        gainCostFromOtherActivities: null,
        incomeOutOfBenefits: null,
        refundedPremium: null,
        refundedExpenses: null,
        otherIncome: null,
      },
      fiscalPartnerIncome: null,
    },
    businessDetails: {
      taxableSubjectBusinessDetails: [
        {
          businessActivities: 'A-2',
          businessEndDate: null,
          businessFormId: 3,
          businessFormName: 'Eenmanszaak',
          businessName: 'A-2',
          businessStartDate: '2020-02-01T00:00:00',
          countryId: 1,
          countryName: 'NLD',
          dataSourceId: 1,
          fiscalYearEndDate: '2020-12-31T00:00:00',
          fiscalYearStartDate: '2020-01-01T00:00:00',
          fromVPC: true,
          globalAdministrationId: '5f7f7079-5fe4-4fee-99a3-ac0500a03adf',
          rsin: '123456789',
          vpBusinessName: 'test',
          businessPartnerId: 1,
        },
        {
          businessActivities: 'A-1',
          businessEndDate: null,
          businessFormId: 2,
          businessFormName: 'Eenmanszaak-1',
          businessName: 'A-1',
          businessStartDate: '2020-03-04T00:00:00',
          countryId: 1,
          countryName: 'NLD',
          dataSourceId: 0,
          fiscalYearEndDate: '2020-12-31T00:00:00',
          fiscalYearStartDate: '2020-01-01T00:00:00',
          fromVPC: true,
          globalAdministrationId: '6f7f7079-5fe4-4fee-99a3-ac0500a03adf',
          rsin: null,
          vpBusinessName: 'Eenmanszaak',
        },
      ],
      fiscalPartnerBusinessDetails: [
        {
          globalAdministrationId: '38a273d3-5df8-4d32-872d-aad8008c5fb1',
          businessName: 'Farming',
          businessActivities: 'farming',
          countryId: 1,
          countryName: 'NLD',
          businessStartDate: '2020-02-01T00:00:00',
          businessEndDate: null,
          rsin: '123456789',
          dataSourceId: 1,
          businessFormId: 3,
          businessFormName: 'Commanditaire vennootschap',
          fiscalYearEndDate: '2020-12-31T00:00:00',
          fiscalYearStartDate: '2020-01-01T00:00:00',
          vpBusinessName: 'farm',
          fromVPC: true,
          businessPartnerId: 1,
        },
      ],
    },
    profitAndLossDetails: {
      taxableSubjectProfitAndLoss: [
        {
          globalAdministrationId: '5f7f7079-5fe4-4fee-99a3-ac0500a03adf',
          dateSource: 0,
          revenue: {
            currentYearAmount: 10000,
            previousYearAmount: 0,
            businessProfitAndLossDetails: [
              {
                costCategory: 0,
                description: 'test',
                amount: 10000,
                amountVPC: 0,
                amountCorrection: 10000,
                prevYearAmount: 0,
                prevYearAmountVPC: 0,
                prevYearAmountCorrection: 0,
              },
            ],
          },
          plBenefitsDetails: {
            financialBenifitsForBusiness: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [],
            },
            extraordinaryBenefitsForBusiness: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [],
            },
          },
          costsOfBusiness: {
            purchaseCost: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [],
            },
            personalCost: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [],
            },
            depreciationCost: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [

              ],
            },
            carAndTransportationCost: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [

              ],
            },
            housingCost: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [

              ],
            },
            sellingCost: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [

              ],
            },
            otherCost: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [

              ],
            },
          },
          plCostDetails: {
            financialCostsForBusiness: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [

              ],
            },
            extraordinaryCostsForBusiness: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [

              ],
            },
          },
        },
      ],
      fiscalPartnerProfitAndLoss: [
        {
          globalAdministrationId: '38a273d3-5df8-4d32-872d-aad8008c5fb1',
          dateSource: 0,
          revenue: {
            currentYearAmount: 10000,
            previousYearAmount: 0,
            businessProfitAndLossDetails: [
              {
                costCategory: 0,
                description: 'test',
                amount: 10000,
                amountVPC: 0,
                amountCorrection: 10000,
                prevYearAmount: 0,
                prevYearAmountVPC: 0,
                prevYearAmountCorrection: 0,
              },
            ],
          },
          plBenefitsDetails: {
            financialBenifitsForBusiness: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [],
            },
            extraordinaryBenefitsForBusiness: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [],
            },
          },
          costsOfBusiness: {
            purchaseCost: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [],
            },
            personalCost: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [],
            },
            depreciationCost: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [

              ],
            },
            carAndTransportationCost: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [

              ],
            },
            housingCost: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [

              ],
            },
            sellingCost: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [

              ],
            },
            otherCost: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [

              ],
            },
          },
          plCostDetails: {
            financialCostsForBusiness: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [

              ],
            },
            extraordinaryCostsForBusiness: {
              currentYearAmount: 0,
              previousYearAmount: 0,
              businessProfitAndLossDetails: [

              ],
            },
          },
        },
      ],
    },
    balanceSheetDetails: null,
    entrepreneurDetails: {
      taxableSubjectEntrepreneurDetails: {
        fiscalPensionReserve: {
          isAllocateTo: {
            previousYearAmount: null,
            currentYearAmount: null,
          },
          allocatedPension: 0,
          paidAnnuityPremium: {
            previousYearAmount: 0,
            currentYearAmount: 0,
          },
          pensionReserveDetails: [
            {
              allocation: 100,
              release: 10,
              description: '38a273d3-5df8-4d32-872d-aad8008c5fb1',
              opening: 150,
              closing: null,
            },
          ],
        },
      },
    },
    assetsScreen: {
      jointAssets: {
        ownHomes: [],
        substantialInterests: [
          {
            acquisitionPrice: '222',
            belongsTo: 1,
            businessName: 'A-2',
            countryId: 1,
            deductibleAcquisitionPrice: '',
            deductibleCosts: '',
            globalAdministrationId: '5f7f7079-5fe4-4fee-99a3-ac0500a03adf',
            incomeFromAbroad: '',
            numberOfShares: 222,
            regularBenefit: '',
            transferPrice: '',
            withHeldDividendTax: '',
            withHeldSourceTax: '',
          },
          {
            acquisitionPrice: '111',
            belongsTo: 1,
            businessName: 'A-1',
            countryId: 1,
            deductibleAcquisitionPrice: '',
            deductibleCosts: '',
            globalAdministrationId: '6f7f7079-5fe4-4fee-99a3-ac0500a03adf',
            incomeFromAbroad: '',
            numberOfShares: '',
            regularBenefit: '',
            transferPrice: '',
            withHeldDividendTax: '',
            withHeldSourceTax: '',
          },
          {
            acquisitionPrice: '222',
            belongsTo: 2,
            businessName: 'A-2',
            countryId: 1,
            deductibleAcquisitionPrice: '',
            deductibleCosts: '',
            globalAdministrationId: '6f7f7079-5fe4-4fee-99a3-ac0500a03adf',
            incomeFromAbroad: '',
            numberOfShares: '',
            regularBenefit: '',
            transferPrice: '',
            withHeldDividendTax: '',
            withHeldSourceTax: '',
          },
        ],
        otherProperties: [],
        bankAccounts: [],
        investmentAccounts: [],
        environmentalInvestments: [],
        periodicalBenefits: [],
        outStandingLoansOrCash: [],
        otherAssets: [],
        nonExemptCapitalInsurances: [],
      },
    },
    liabilitiesScreen: {
      jointLiabilities: {
        loansForOwnHome: [
          {
            loanDetails: {
              description: 'loan details - 1',
              belongsTo: 1,
              accountNumber: 'ACC123',
              countryId: 1,
              loanGiver: 1,
              loanPurpose: 1,
              percentageOfAmount: 30,
              principalAmount: 5000,
              interest: 100,
              employeeCredit: 7000,
            },
            costs: [],
            loanGiverDetails: null,
          },
          {
            loanDetails: {
              description: 'loan details - 2',
              belongsTo: 2,
              accountNumber: 'ACC124',
              countryId: 1,
              loanGiver: 1,
              loanPurpose: 1,
              percentageOfAmount: 30,
              principalAmount: 5000,
              interest: 100,
              employeeCredit: 7000,
            },
            costs: [],
            loanGiverDetails: null,
          },
        ],
      },
    },
    additionalCalculationDetails: {
      taxableSubjectAdditionalCalculations: { ...INITIAL_ADDITIONAL_CALCULATION_DATA },
      fiscalPartnerAdditionalCalculations: { ...INITIAL_ADDITIONAL_CALCULATION_DATA },
    },
    masterData: {
      parentCollectingChildCareOptions: [
        {
          displayName: 'Christoffel Abel Hiddie',
          value: '23123',
        },
        {
          displayName: 'Other',
          value: '0',
        },
      ],
      owners: [
        {
          displayName: 'Taxable Subject Test',
          value: 1,
        },
        {
          displayName: 'Fiscal Partner Test',
          value: 2,
        },
        {
          displayName: 'Both',
          value: 3,
        },
      ],
    },
  },
  meta: {
    totalRecords: '1',
  },
});

export const PROGNOSE_FORECAST_DATA = deepFreeze({
  ...FORECAST_DATA,
  content: {
    ...FORECAST_DATA.content,
    dossierManifest: {
      ...FORECAST_DATA.content.dossierManifest,
      declarationTypeId: 3,
    },
  },
});

export const PROVISIONAL_FORECAST_DATA = deepFreeze({
  ...FORECAST_DATA,
  content: {
    ...FORECAST_DATA.content,
    dossierManifest: {
      ...FORECAST_DATA.content.dossierManifest,
      declarationTypeId: 4,
    },
  },
});

export const JOINT_FORECAST_DATA = deepFreeze({
  ...FORECAST_DATA,
  content: {
    ...FORECAST_DATA.content,
    personalDetails: {
      ...FORECAST_DATA.content.personalDetails,
      isJointDeclaration: true,
    },
  },
});

export const ALLOCATION_FORECAST_DATA = deepFreeze({
  ...JOINT_FORECAST_DATA,
  content: {
    ...JOINT_FORECAST_DATA.content,
    allocationDetails: {
      recommendedAllocation: false,
    },
  },
});

export const MOCK_JOINT_DOSSIER_DATA = deepFreeze({
  "content": {
    "declarationID": "b106308c-13be-4aef-8860-aacd008f0540",
    "dossierManifest": {
      "name": "IB Aangifte jaar 2020-2.1",
      "taxableYear": 2020,
      "dossierId": "8e571e9d-d957-4c37-84b0-acb500c0ab41",
      "declarationTypeId": 5,
      "declarationStatusId": 1,
      "declarationStatus": "Onderhanden",
      "taxLicenseNumber": null,
      "version": "2.1",
      "declarationType": "Aangifte",
      "globalAdviserId": "00000000-0000-0000-0000-000000000000"
    },
    "personalDetails": {
      "isJointDeclaration": true,
      "taxableSubjectDetails": {
        "taxableSubjectId": "10c5240e-6948-438e-97fa-ac7700a4370e",
        "firstName": "Allocation",
        "initials": null,
        "middleName": null,
        "lastName": "Test",
        "bsn": "926800449",
        "birthDate": "2020-11-01T00:00:00",
        "deathDate": null,
        "taxationFormID": 1,
        "taxFormType": "P-biljet",
        "livingTogetherPreciseSituation": null,
        "maritalStatus": 1,
        "age": 0,
        "fullName": "Allocation  Test"
      },
      "fiscalPartner": {
        "taxableSubjectId": "61f2689b-dfad-4c6a-853c-abf400c91be4",
        "firstName": "Dinesh",
        "initials": null,
        "middleName": null,
        "lastName": "Kumar2",
        "bsn": "661790745",
        "birthDate": "1985-07-01T00:00:00",
        "deathDate": null,
        "taxationFormID": 1,
        "taxFormType": "P-biljet",
        "livingTogetherPreciseSituation": null,
        "maritalStatus": 1,
        "age": 34,
        "fullName": "Dinesh  Kumar2"
      },
      "relationShipSituation": null,
      "children": [
        
      ],
      "representative": null,
      "generalDetails": {
        "taxablesubjectGeneralInformation": {
          "name": null,
          "beconNumber": "453454",
          "dueDate": "2021-01-07T00:00:00",
          "emailId": "test@gmail.com"
        },
        "fiscalPartnerGeneralInformation": {
          "name": null,
          "beconNumber": "213456",
          "dueDate": null,
          "emailId": "test1@gmail.com"
        }
      }
    },
    "income": {
      "taxableSubjectIncome": {
        "taxableWages": {
          "currentEmploymentIncome": [
            {
              "salary": {
                "description": "terse",
                "amount": 0
              },
              "withHeldWageTax": null,
              "employmentDiscount": null
            }
          ],
          "previousEmploymentIncome": null,
          "taxableIncomeAbroad": null,
          "exemptedIncomeFromInternationalOrganization": null,
          "dubbelePositie": null
        },
        "gainCostFromOtherActivities": null,
        "incomeOutOfBenefits": null,
        "refundedPremium": null,
        "refundedExpenses": null,
        "otherIncome": null
      },
      "fiscalPartnerIncome": {
        "taxableWages": {
          "currentEmploymentIncome": [
            {
              "salary": {
                "description": "Income",
                "amount": 100000
              },
              "withHeldWageTax": null,
              "employmentDiscount": null
            }
          ],
          "previousEmploymentIncome": null,
          "taxableIncomeAbroad": null,
          "exemptedIncomeFromInternationalOrganization": null,
          "dubbelePositie": null
        },
        "gainCostFromOtherActivities": null,
        "incomeOutOfBenefits": null,
        "refundedPremium": null,
        "refundedExpenses": null,
        "otherIncome": null
      }
    },
    "businessDetails": {
      "taxableSubjectBusinessDetails": [
        {
          "globalAdministrationId": "169e568b-26b8-44d5-aede-ac9900e54f06",
          "businessName": "KSR_Shares_Deposites_Withdrawals_ 01122020New",
          "businessActivities": "Bike Store East B.V._Fiscal_IT_NewTemplate",
          "countryId": 1,
          "countryName": "NLD",
          "businessStartDate": "2013-12-05T00:00:00",
          "businessEndDate": null,
          "rsin": "123456789",
          "businessFormId": 3,
          "businessFormName": "Maatschap",
          "fiscalYearStartDate": "2020-01-01T00:00:00",
          "fiscalYearEndDate": "2020-12-31T00:00:00",
          "vpBusinessName": "KSR_Shares_Deposites_Withdrawals_ 01122020New",
          "fromVPC": true,
          "dataSourceId": 1,
          "businessPartnerId": 1,
          "businessPartnerName": "Firmant 1"
        }
      ],
      "fiscalPartnerBusinessDetails": null
    },
    "profitAndLossDetails": null,
    "balanceSheetDetails": null,
    "otherItemsDetails": null,
    "entrepreneurDetails": null,
    "expenditureDetails": null,
    "assetsScreen": null,
    "liabilitiesScreen": null,
    "additionalCalculationDetails": null,
    "allocationDetails": null,
    "adviserAdvice": null,
    "masterData": {
      "parentCollectingChildCareOptions": [
        {
          "displayName": "Allocation  Test",
          "value": 1
        },
        {
          "displayName": "Dinesh  Kumar2",
          "value": 2
        },
        {
          "displayName": "Overige",
          "value": 3
        }
      ],
      "childRegisteredOnAddressOptions": [
        {
          "displayName": "Allocation  Test",
          "value": 1
        },
        {
          "displayName": "Dinesh  Kumar2",
          "value": 2
        },
        {
          "displayName": "Ex fiscaal partner",
          "value": 3
        }
      ],
      "owners": [
        {
          "displayName": "Allocation  Test",
          "value": 1
        },
        {
          "displayName": "Dinesh  Kumar2",
          "value": 2
        },
        {
          "displayName": "Beide",
          "value": 3
        }
      ]
    }
  },
  "meta": {
    "totalRecords": "1"
  },
  "errors": null
});

export const MOCK_SINGLE_DOSSIER_FORECAST_DATA = deepFreeze({
  content: {
    "declarationID": "b106308c-13be-4aef-8860-aacd008f0540",
    "dossierManifest": {
      "name": "2020_Aangifte_2.1",
      "taxableYear": 2020,
      "dossierId": "e86c2c3f-c18c-475f-8a9d-aca90087534e",
      "declarationTypeId": 5,
      "declarationStatusId": 1,
      "declarationStatus": "Wacht op akkoord klant",
      "taxLicenseNumber": null,
      "version": "2.1",
      "declarationType": "Aangifte",
      "globalAdviserId": "0cd8a90d-d936-4a82-b787-ab8900d6a1ac"
    },
    "personalDetails": {
      "isJointDeclaration": false,
      "taxableSubjectDetails": {
        "taxableSubjectId": "3179ad8f-8ac9-48d2-8cf7-aca900861a63",
        "firstName": "Single",
        "initials": null,
        "middleName": null,
        "lastName": "Dossier",
        "bsn": "225124786",
        "birthDate": "2021-01-01T00:00:00",
        "deathDate": null,
        "taxationFormID": 1,
        "taxFormType": "P-biljet",
        "livingTogetherPreciseSituation": null,
        "maritalStatus": 3,
        "age": -1,
        "fullName": "Single  Dossier"
      },
      "fiscalPartner": null,
      "relationShipSituation": null,
      "children": null,
      "representative": null,
      "generalDetails": {
        "taxablesubjectGeneralInformation": {
          "name": "Single Dossier",
          "beconNumber": 453454,
          "dueDate": "2021-01-07T00:00:00",
          "emailId": "test@gmail.com"
        },
        "fiscalPartnerGeneralInformation": null
      }
    },
    "income": null,
    "businessDetails": {
      "taxableSubjectBusinessDetails": [
        {
          "globalAdministrationId": "33ae02cd-1299-46d4-a2bc-ab3d007b6db3",
          "businessName": "3 - Bike Retail B.V. *",
          "businessActivities": "TEstere",
          "countryId": 1,
          "countryName": "NLD",
          "businessStartDate": "2020-12-01T00:00:00",
          "businessEndDate": null,
          "rsin": null,
          "businessFormId": 2,
          "businessFormName": "Eenmanszaak",
          "fiscalYearStartDate": "2021-01-01T00:00:00",
          "fiscalYearEndDate": "2021-12-31T00:00:00",
          "vpBusinessName": "3 - Bike Retail B.V. *",
          "fromVPC": true,
          "dataSourceId": 0,
          "businessPartnerId": null,
          "businessPartnerName": null
        }
      ],
      "fiscalPartnerBusinessDetails": null
    },
    "profitAndLossDetails": null,
    "balanceSheetDetails": null,
    "otherItemsDetails": null,
    "entrepreneurDetails": null,
    "expenditureDetails": null,
    "assetsScreen": null,
    "liabilitiesScreen": null,
    "additionalCalculationDetails": null,
    "allocationDetails": null,
    "adviserAdvice": null,
    "masterData": {
      "parentCollectingChildCareOptions": [
        {
          "displayName": "Single  Dossier",
          "value": 1
        }
      ],
      "childRegisteredOnAddressOptions": [
        {
          "displayName": "Single  Dossier",
          "value": 1
        },
        {
          "displayName": "Ex fiscaal partner",
          "value": 3
        }
      ],
      "owners": [
        {
          "displayName": "Single  Dossier",
          "value": 1
        }
      ]
    }
  },
  meta: {
    "totalRecords": "1"
  },
  errors: null,
});

export const fetchDossierDataWithUpdatedStatus = (status = 1) => deepFreeze({
  ...FORECAST_DATA,
  content: {
    ...FORECAST_DATA.content,
    dossierManifest: {
      ...FORECAST_DATA.content.dossierManifest,
      declarationStatusId: status,
    },
  },
});

export const COUNTRIES = deepFreeze([
  {
    label: 'NL',
    value: 1,
  },
  {
    label: 'IND',
    value: 2,
  },
  {
    label: 'US',
    value: 3,
  },
  {
    label: 'BEL',
    value: 12,
  },
  {
    label: 'DEU',
    value: 23,
  },
]);

export const DATA_SOURCES = deepFreeze({
  content: [
    { displayName: 'Actual', value: 1 },
    { displayName: 'Actual+Last Year', value: 2 },
    { displayName: 'Actual+Forecast', value: 3 },
    { displayName: 'Actual+Budget', value: 4 },
  ],
  meta: { totalRecords: 4 },
  errors: null,
});

export const TAB_OPTIONS = deepFreeze([{ label: 'Karst' }, { label: 'Mariska' }]);

export const CALCULATE_TAX = deepFreeze({
  content: { taxableAmount: 1766.0 },
  meta: { totalRecords: 1 },
  errors: null,
});

export const VPC_DATA = deepFreeze({
  content: {
    globalAdministrationId: '38a273d3-5df8-4d32-872d-aad8008c5fb1',
    balanceSheet: {
      globalAdministrationId: '38a273d3-5df8-4d32-872d-aad8008c5fb1',
      assets: {
        intangibleFixedAssets: {
          intangibleAssets: [
            {
              description: 'A1001-Kosten van ontwikkeling',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                baseAmount: 213733,
                correction: null,
                finalAmount: 213733,
              },
            },
          ],
          previousYearAmount: 0,
          currentYearAmount: 213733,
        },
        tangibleFixedAssets: {
          tangibleAssets: [
            {
              description: 'A16-Machines en installaties',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                residualValue: null,
                baseValue: null,
                baseAmount: 8383,
                correction: null,
                finalAmount: 8383,
              },
            },
          ],
          previousYearAmount: 0,
          currentYearAmount: 8383,
        },
        financialFixedAssets: {
          businessAccountBalance: [
            {
              description: 'A42-Groepsmaatschappij 1',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                residualValue: null,
                baseValue: null,
                baseAmount: -56396,
                correction: null,
                finalAmount: -56396,
              },
            },
          ],
          previousYearAmount: 0,
          currentYearAmount: -56396,
        },
        stockOrInventory: {
          businessAccountBalance: [
            {
              description: 'A44-Handelsgoederen',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                residualValue: null,
                baseValue: null,
                baseAmount: 45756,
                correction: null,
                finalAmount: 45756,
              },
            },
          ],
          previousYearAmount: 0,
          currentYearAmount: 45756,
        },
        receivables: {
          receivables: [
            {
              description: 'A50-Debiteuren',
              previousYear: null,
              currentYear: {
                nominalValue: null,
                vatThisYear: null,
                vatPreviousYear: null,
                vatOtherYears: null,
                baseAmount: 906437,
                correction: null,
                finalAmount: 906437,
              },
            },
            {
              description: 'A1050-Vooruitbetaalde facturen',
              previousYear: null,
              currentYear: {
                nominalValue: null,
                vatThisYear: null,
                vatPreviousYear: null,
                vatOtherYears: null,
                baseAmount: 13332,
                correction: null,
                finalAmount: 13332,
              },
            },
            {
              description: 'A1154-Vooruitverzonden op bestellingen',
              previousYear: null,
              currentYear: {
                nominalValue: null,
                vatThisYear: null,
                vatPreviousYear: null,
                vatOtherYears: null,
                baseAmount: -135373,
                correction: null,
                finalAmount: -135373,
              },
            },
            {
              description: 'A1155-Nog te factureren of nog te verzenden facturen',
              previousYear: null,
              currentYear: {
                nominalValue: null,
                vatThisYear: null,
                vatPreviousYear: null,
                vatOtherYears: null,
                baseAmount: 193062,
                correction: null,
                finalAmount: 193062,
              },
            },
          ],
          previousYearAmount: 0,
          currentYearAmount: 977458,
        },
        liquidAssets: {
          businessAccountBalance: [
            {
              description: 'A75-Kas',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                residualValue: null,
                baseValue: null,
                baseAmount: 7028,
                correction: null,
                finalAmount: 7028,
              },
            },
            {
              description: 'A77-Rekening-courant bank',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                residualValue: null,
                baseValue: null,
                baseAmount: 254020,
                correction: null,
                finalAmount: 254020,
              },
            },
          ],
          previousYearAmount: 0,
          currentYearAmount: 261048,
        },
        securities: {
          businessAccountBalance: [

          ],
          previousYearAmount: 0,
          currentYearAmount: 0,
        },
      },
      liabilities: {
        equityCapital: {
          businessAccountBalance: [
            {
              description: 'A89-Gewone aandelen',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                residualValue: null,
                baseValue: null,
                baseAmount: 20000,
                correction: null,
                finalAmount: 20000,
              },
            },
            {
              description: 'A92-Wettelijke reserve voor geactiveerde kosten van ontwikkeling',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                residualValue: null,
                baseValue: null,
                baseAmount: 196000,
                correction: null,
                finalAmount: 196000,
              },
            },
            {
              description: 'A101-Overige reserve',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                residualValue: null,
                baseValue: null,
                baseAmount: 209998,
                correction: null,
                finalAmount: 209998,
              },
            },
            {
              description: 'A600-Resultaat lopend boekjaar',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                residualValue: null,
                baseValue: null,
                baseAmount: 212580,
                correction: null,
                finalAmount: 212580,
              },
            },
          ],
          previousYearAmount: 0,
          currentYearAmount: 638578,
        },
        provisions: {
          businessAccountBalance: [
            {
              description: 'A140-Overige voorzieningen',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                residualValue: null,
                baseValue: null,
                baseAmount: 1700,
                correction: null,
                finalAmount: 1700,
              },
            },
          ],
          previousYearAmount: 0,
          currentYearAmount: 1700,
        },
        longTermLiabilities: {
          businessAccountBalance: [
            {
              description: 'A1203-Lening 1',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                residualValue: null,
                baseValue: null,
                baseAmount: 50000,
                correction: null,
                finalAmount: 50000,
              },
            },
          ],
          previousYearAmount: 0,
          currentYearAmount: 50000,
        },
        shortTermLiabilities: {
          shortTermLiabilities: [
            {
              description: 'A184-Crediteuren',
              previousYear: null,
              currentYear: {
                vatThisYear: null,
                vatPreviousYear: null,
                vatOtherYears: null,
                baseAmount: 673737,
                correction: null,
                finalAmount: 673737,
              },
            },
            {
              description: 'A194-Omzetbelasting',
              previousYear: null,
              currentYear: {
                vatThisYear: null,
                vatPreviousYear: null,
                vatOtherYears: null,
                baseAmount: 74618,
                correction: null,
                finalAmount: 74618,
              },
            },
            {
              description: 'A195-Loonheffing',
              previousYear: null,
              currentYear: {
                vatThisYear: null,
                vatPreviousYear: null,
                vatOtherYears: null,
                baseAmount: 11000,
                correction: null,
                finalAmount: 11000,
              },
            },
            {
              description: 'A200-Netto lonen',
              previousYear: null,
              currentYear: {
                vatThisYear: null,
                vatPreviousYear: null,
                vatOtherYears: null,
                baseAmount: 350,
                correction: null,
                finalAmount: 350,
              },
            },
          ],
          previousYearAmount: 0,
          currentYearAmount: 759705,
        },
      },
    },
    profitAndLoss: {
      globalAdministrationId: '38a273d3-5df8-4d32-872d-aad8008c5fb1',
      dateSource: 0,
      revenue: {
        currentYearAmount: 1233520,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [
          {
            costCategory: null,
            description: 'A227-Verkoop van handelsgoederen',
            amount: -206200,
            amountVPC: -206200,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A226-Verlening van diensten',
            amount: 25557,
            amountVPC: 25557,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A223-Overige omzet',
            amount: 1414163,
            amountVPC: 1414163,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
        ],
      },
      plBenefitsDetails: {
        financialBenifitsForBusiness: {
          currentYearAmount: 0,
          previousYearAmount: 0,
          businessProfitAndLossDetails: [

          ],
        },
        extraordinaryBenefitsForBusiness: {
          currentYearAmount: 0,
          previousYearAmount: 0,
          businessProfitAndLossDetails: [

          ],
        },
      },
      costsOfBusiness: {
        purchaseCost: {
          currentYearAmount: 484095,
          previousYearAmount: 0,
          businessProfitAndLossDetails: [
            {
              costCategory: null,
              description: 'A232-Inkopen 1',
              amount: 418764,
              amountVPC: 418764,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
            {
              costCategory: null,
              description: 'A256-Inkoopkosten potgrond',
              amount: 46887,
              amountVPC: 46887,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
            {
              costCategory: null,
              description: 'A1713-Inkoopwaarde handels- en productiegoederen',
              amount: 63644,
              amountVPC: 63644,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
            {
              costCategory: null,
              description: 'A1719-Voorraadmutatie',
              amount: -45200,
              amountVPC: -45200,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
          ],
        },
        personalCost: {
          currentYearAmount: 206600,
          previousYearAmount: 0,
          businessProfitAndLossDetails: [
            {
              costCategory: null,
              description: 'A246-Bruto-loon',
              amount: 167700,
              amountVPC: 167700,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
            {
              costCategory: null,
              description: 'A249-Vakantiegeld',
              amount: 1700,
              amountVPC: 1700,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
            {
              costCategory: null,
              description: 'A255-Sociale lasten',
              amount: 37200,
              amountVPC: 37200,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
          ],
        },
        depreciationCost: {
          currentYearAmount: 67933,
          previousYearAmount: 0,
          businessProfitAndLossDetails: [
            {
              costCategory: null,
              description: 'A1070-Kosten van onderzoek en ontwikkeling',
              amount: 55033,
              amountVPC: 55033,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
            {
              costCategory: null,
              description: 'A275-Machines en installaties',
              amount: 2100,
              amountVPC: 2100,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
            {
              costCategory: null,
              description: 'A279-Transport- en vervoermiddelen',
              amount: 10800,
              amountVPC: 10800,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
          ],
        },
        carAndTransportationCost: {
          currentYearAmount: 53128,
          previousYearAmount: 0,
          businessProfitAndLossDetails: [
            {
              costCategory: null,
              description: "A401-Brandstofkosten auto's",
              amount: 32769,
              amountVPC: 32769,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
            {
              costCategory: null,
              description: "A403-Verzekering auto's",
              amount: 2130,
              amountVPC: 2130,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
            {
              costCategory: null,
              description: "A405-Operational leasing auto's",
              amount: 18229,
              amountVPC: 18229,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
          ],
        },
        housingCost: {
          currentYearAmount: 57231,
          previousYearAmount: 0,
          businessProfitAndLossDetails: [
            {
              costCategory: null,
              description: 'A336-Huur',
              amount: 44939,
              amountVPC: 44939,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
            {
              costCategory: null,
              description: 'A339-Onderhoud gebouwen',
              amount: 1800,
              amountVPC: 1800,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
            {
              costCategory: null,
              description: 'A341-Schoonmaakkosten',
              amount: 10492,
              amountVPC: 10492,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
          ],
        },
        sellingCost: {
          currentYearAmount: 10826,
          previousYearAmount: 0,
          businessProfitAndLossDetails: [
            {
              costCategory: null,
              description: 'A382-Reclame- en advertentiekosten',
              amount: 10826,
              amountVPC: 10826,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
          ],
        },
        otherCost: {
          currentYearAmount: 106489,
          previousYearAmount: 0,
          businessProfitAndLossDetails: [
            {
              costCategory: null,
              description: 'A420-Kantoorbenodigdheden',
              amount: 238,
              amountVPC: 238,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
            {
              costCategory: null,
              description: 'A421-Porti',
              amount: 350,
              amountVPC: 350,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
            {
              costCategory: null,
              description: 'A422-Telefoon en internet',
              amount: 93940,
              amountVPC: 93940,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
            {
              costCategory: null,
              description: 'A440-Accountantskosten',
              amount: 9983,
              amountVPC: 9983,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
            {
              costCategory: null,
              description: 'A1270-Advocaat en juridisch advies',
              amount: 1978,
              amountVPC: 1978,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
            {
              costCategory: null,
              description: 'A477-Algemene kosten',
              amount: 0,
              amountVPC: 0,
              amountCorrection: 0,
              prevYearAmount: 0,
              prevYearAmountVPC: 0,
              prevYearAmountCorrection: 0,
            },
          ],
        },
      },
      plCostDetails: {
        financialCostsForBusiness: {
          currentYearAmount: 0,
          previousYearAmount: 0,
          businessProfitAndLossDetails: [],
        },
        extraordinaryCostsForBusiness: {
          currentYearAmount: 0,
          previousYearAmount: 0,
          businessProfitAndLossDetails: [],
        },
      },
    },
  },
  meta: {
    totalRecords: '1',
  },
  errors: null,
});

export const mockGetInititalForeCastData = ({ globalClientId = GLOBAL_CLIENT_ID, declarationId = DECLARATION_ID, response = FORECAST_DATA } = {}) => fetchMock.get(
  `/itx-api/v1/client-dossiers/${globalClientId}/declaration-dossiers/${declarationId}`,
  {
    body: response,
  },
);

export const mockGetAutoSyncData = ({ globalClientId = GLOBAL_CLIENT_ID, declarationId = DECLARATION_ID, response = FORECAST_DATA } = {}) => fetchMock.get(
  `/itx-api/v1/client-dossiers/${globalClientId}/declaration-dossier-with-vpc-Details/${declarationId}`,
  {
    body: response,
  },
);

export const mockGetCountriesList = ({ response = COUNTRIES } = {}) => fetchMock.get(
  '/itx-api/v1/lookup/countries',
  {
    body: response,
  },
);

export const mockGetDossierDataSources = ({ declarationType = DECLARATION_TYPE, taxableYear = TAXABLE_YEAR, response = DATA_SOURCES } = {}) => fetchMock.get(
  `/itx-api/v1/lookup/dossier-data-sources?declarationType=${declarationType}&taxableYear=${taxableYear}`,
  {
    body: response,
  },
);

export const mockAutoSaveDeclaration = ({
  data = FORECAST_DATA, globalClientId = GLOBAL_CLIENT_ID, declarationId = DECLARATION_ID,
} = {}) => fetchMock.put(`/itx-api/v1/client-dossiers/${globalClientId}/declaration-dossiers/${declarationId}`, {
  body: data,
});

export const mockGetDossierList = (advisorId = '0C8263F5-4B52-4ABD-B83F-B5D3CF216DF5') => fetchMock.get(
  `/itx-api/v1/declaration/${GLOBAL_CLIENT_ID}/dossier-names?globalAdviserId=${advisorId}&taxationYear=${TAXABLE_YEAR}`,
  {
    body: MOCK_DOSSIER_LIST,
  },
);

export const mockImportDossier = () => fetchMock.post(
  `/itx-api/v1/client-dossiers/${GLOBAL_CLIENT_ID}/import-dossier`,
  {
    body: MOCK_IMPORT_RESPONSE,
  },
);

export const MOCK_IMPORT_RESPONSE = deepFreeze({
  content: '16af6eeb-00e1-4cfe-b875-ac6300572b71',
  meta: {
    totalRecords: '0',
  },
  errors: null,
});

const MOCK_DOSSIER_SUBMIT_RESPONSE = deepFreeze({
  content: true,
  meta: { totalRecords: 0 },
  errors: null,
});

export const mockSubmitDossier = (adviserId = GLOBAL_ADVISER_ID, declarationId = DECLARATION_ID) => fetchMock.post(
  `/itx-api/v1/declaration/${adviserId}/${declarationId}/action-on-dossier`,
  {
    body: MOCK_DOSSIER_SUBMIT_RESPONSE,
  },
);