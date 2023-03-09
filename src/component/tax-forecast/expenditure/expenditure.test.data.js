import deepFreeze from 'deep-freeze';
import fetchMock from 'fetch-mock';
import { endDateofYear, startDateofYear, getCurrentYear } from '../../../common/utils';

const DATE_FORMAT = 'YYYY-MM-DD';
const CURRENT_YEAR = getCurrentYear();
export const EXPENDITURE_MODAL_FORM = 'expenditure-modal-form';

export const DOSSIER_DATA = deepFreeze({
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
    version: '1.3',
    declarationType: 'Provisional declaration',
  },
  personalDetails: {
    taxableSubjectDetails: {
      taxableSubjectId: '00000000-0000-0000-0000-000000000000',
      firstName: 'Robert',
      initials: null,
      middleName: 's',
      lastName: 'Ruther',
      bsn: 'string',
      birthDate: '2019-08-29T07:59:22.771',
      deathDate: '2019-08-29T07:59:22.771',
      livingTogetherPreciseSituation: 2,
      maritalStatus: 2,
      age: 0,
      fullName: 'Robert s Ruther',
    },
    fiscalPartner: {
      taxableSubjectId: '00000000-0000-0000-0000-000000000000',
      firstName: 'Thijs',
      initials: null,
      middleName: 'lk',
      lastName: 'c',
      bsn: '32131231-1',
      birthDate: '2019-08-29T13:29:26.4106301',
      deathDate: '',
      livingTogetherPreciseSituation: 2,
      maritalStatus: 2,
      age: 0,
      fullName: 'Thijs lk c',
    },
    relationShipSituation: {
      patnerDeathDate: null,
      divorceDate: '2019-09-10T06:30:00Z',
      periodOfLivingTogether: {
        startDate: '2019-09-01T06:30:00Z',
        endDate: '2019-09-16T06:30:00Z',
      },
      isFiscalPartnerCriteriaMet: true,
      marriageDate: '2019-08-01T06:30:00Z',
      applyFiscalPartnerForWholeYear: true,
    },
    children: [
      {
        name: 'Roger ca Will',
        dateOfBirth: '2019-08-29T13:29:26.4113587',
        dateOfDeath: '2019-09-01T06:30:00Z',
        bsn: '32131231-1',
        registrationOnAddress: 2,
        isCoParenting: null,
        isAtleastThreeDaysPerWeekLiving: null,
        isParentCollectingChildCare: true,
        isSignificantSupportExtended: null,
        age: 0,
        parentCollectingChildCare: '32131231-1',
      },
      {
        name: 'Federer ca KJako',
        dateOfBirth: '2019-08-29T13:29:28.3456106',
        dateOfDeath: '2019-09-01T06:30:00Z',
        bsn: '32131231-1',
        registrationOnAddress: 3,
        isCoParenting: true,
        isAtleastThreeDaysPerWeekLiving: false,
        isParentCollectingChildCare: true,
        isSignificantSupportExtended: true,
        age: 0,
        parentCollectingChildCare: '32131231-1',
      },
      {
        name: 'child1 string string',
        dateOfBirth: '2000-09-12T05:35:40.358',
        dateOfDeath: '2019-09-12T05:35:40.358',
        bsn: 'string',
        registrationOnAddress: 1,
        isCoParenting: null,
        isAtleastThreeDaysPerWeekLiving: null,
        isParentCollectingChildCare: true,
        isSignificantSupportExtended: null,
        age: 19,
        parentCollectingChildCare: 'string',
      },
    ],
    isJointDeclaration: false,
  },
  income: null,
  businessDetails: {
    taxableSubjectBusinessDetails: null,
    fiscalPartnerBusinessDetails: null,
  },
  profitAndLossDetails: null,
  balanceSheetDetails: null,
  masterData: {
    parentCollectingChildCareOptions: [
      {
        displayName: 'Robert s Ruther',
        value: 'string',
      },
      {
        displayName: 'Thijs lk c',
        value: '32131231-1',
      },
      {
        displayName: 'other',
        value: '0',
      },
    ],
  },
  expenditureDetails: {
    taxableSubjectExpenditureDetails: {
      expensesForPublicTransportation: {
        travelDeliveryDetails: [
          {
            description: '',
            singleTripDistance: '',
            daysInAWeek: 0,
            startDate: '',
            endDate: '',
            compensation: '',
          },
        ],
        totalCompensation: '',
        totalDeductionForExpenses: 0,
      },
      premiumForAnnuity: {
        premiumsPaidDetails: {
          premiumDetails: [
            {
              policyNumber: '',
              description: '',
              amount: '',
            },
          ],
          totalDeductions: '',
        },
        annualAndReserveMarginDetails: [
          {
            year: null,
            profitFromBusiness: 0,
            allocationToFor: 0,
            releaseOfFor: 0,
            incomeFromEmployment: 0,
            incomeFromOtherActivities: 0,
            incomeFromBenefits: 0,
            factorA: 0,
            deductedPremiums: 0,
          },
        ],
        totalDeductionForAnnuity: '',
      },
      premiumForDisabilityInsurance: {
        premiumDetails: [
          {
            policyNumber: '',
            description: '',
            amount: 0,
          },
        ],
        totalDeductions: 0,
      },
      premiumForGeneralSurvivorsLaw: {
        premiumDetails: [
          {
            policyNumber: '',
            description: '',
            amount: 0,
          },
        ],
        totalDeductions: 0,
      },
      premiumForAnnuityOfChild: {
        premiumDetails: [
          {
            policyNumber: '',
            description: '',
            amount: 0,
          },
        ],
        totalDeductions: 0,
      },
      educationalExpenses: {
        treshold: 0,
        expensesForEducationWithoutStudyGrant: {
          reimbursement: 0,
          details: [
            {
              description: '',
              amount: 0,
            },
          ],
          totalAmount: 0,
        },
        expensesForEducationWithStudyGrant: {
          reimbursement: 0,
          details: [
            {
              description: '',
              amount: '',
            },
          ],
          totalAmount: 0,
        },
        studyGrantRepaid: {
          studyGrantDetails: [
            {
              educationalYear: '',
              amountPaidBack: null,
              mbo: null,
              hbOWO: null,
              period: {
                startDate: '',
                endDate: '',
              },
            },
          ],
          totalAmount: 0,
        },
        totalDeductionForEducationalExpenses: 0,
      },
      expensesForMonumentalProperty: {
        description: null,
        referenceNumber: null,
        expensesPaid: null,
        receivedSubsidy: null,
        totalDeductionForMonumentalProperty: null,
      },
    },
    fiscalPartnerExpendituresDetails: {
      expensesForPublicTransportation: {
        travelDeliveryDetails: [
          {
            description: '',
            singleTripDistance: '',
            daysInAWeek: 0,
            startDate: '',
            endDate: '',
            compensation: '',
          },
        ],
        totalCompensation: '',
        totalDeductionForExpenses: 0,
      },
      premiumForAnnuity: {
        premiumsPaidDetails: {
          premiumDetails: [
            {
              policyNumber: '',
              description: '',
              amount: '',
            },
          ],
          totalDeductions: '',
        },
        annualAndReserveMarginDetails: [
          {
            year: null,
            profitFromBusiness: 0,
            allocationToFor: 0,
            releaseOfFor: 0,
            incomeFromEmployment: 0,
            incomeFromOtherActivities: 0,
            incomeFromBenefits: 0,
            factorA: 0,
            deductedPremiums: 0,
          },
        ],
        totalDeductionForAnnuity: '',
      },
      premiumForDisabilityInsurance: {
        premiumDetails: [
          {
            policyNumber: '',
            description: '',
            amount: 0,
          },
        ],
        totalDeductions: 0,
      },
      premiumForGeneralSurvivorsLaw: {
        premiumDetails: [
          {
            policyNumber: '',
            description: '',
            amount: 0,
          },
        ],
        totalDeductions: 0,
      },
      premiumForAnnuityOfChild: {
        premiumDetails: [
          {
            policyNumber: '',
            description: '',
            amount: 0,
          },
        ],
        totalDeductions: 0,
      },
      educationalExpenses: {
        treshold: 0,
        expensesForEducationWithoutStudyGrant: {
          reimbursement: 0,
          details: [
            {
              description: '',
              amount: 0,
            },
          ],
          totalAmount: 0,
        },
        expensesForEducationWithStudyGrant: {
          reimbursement: 0,
          details: [
            {
              description: '',
              amount: '',
            },
          ],
          totalAmount: 0,
        },
        studyGrantRepaid: {
          studyGrantDetails: [
            {
              educationalYear: '',
              amountPaidBack: null,
              mbo: null,
              hbOWO: null,
              period: {
                startDate: '',
                endDate: '',
              },
            },
          ],
          totalAmount: 0,
        },
        totalDeductionForEducationalExpenses: 0,
      },
      expensesForMonumentalProperty: {
        description: null,
        referenceNumber: null,
        expensesPaid: null,
        receivedSubsidy: null,
        totalDeductionForMonumentalProperty: null,
      },
    },
    jointExpendituresDetails: {
      alimony: [
        {
          alimonyPaidTo: '',
          periodicPayment: 0,
          lumpSumAmount: 0,
          settlementPensionRights: 0,
          welfare: 0,
          otherAlimony: 0,
          alimonyBasicDetails: {
            firstName: '',
            initials: '',
            middleName: '',
            lastName: '',
            bsn: '',
            dateOfBirth: '',
            dateOfDeath: '',
          },
          address: {
            street: '',
            houseNumber: '',
            additionToHouseNumber: null,
            zipCode: '',
            city: '',
            countryId: '',
          },
          totalDeductionForAlimony: 0,
        },
      ],
      giftsToCharity: {
        threshold: 0,
        generalGiftsToCharity: [
          {
            culturalANBI: null,
            description: '',
            amount: 0,
          },
        ],
        periodicGiftsToCharity: [
          {
            transactionNumber: 0,
            rsin: 0,
            culturalANBI: null,
            description: '',
            amount: 0,
          },
        ],
        totalDeductionForGiftsToCharity: 0,
      },
      expensesForHealthcare: {
        threshold: 0,
        treatment: {
          details: [
            {
              description: '',
              amount: 0,
            },
          ],
          totalAmount: 0,
        },
        prescribedMedication: {
          details: [
            {
              description: '',
              amount: 0,
            },
          ],
          totalAmount: 0,
        },
        aids: {
          details: [
            {
              description: '',
              amount: 0,
            },
          ],
          totalAmount: 0,
        },
        additionalFamilySupport: {
          details: [
            {
              description: '',
              amount: 0,
            },
          ],
          totalAmount: 0,
          reportAmount: 0,
        },
        prescribedDiet: {
          dietDetails: [
            {
              condition: '',
              startDate: '',
              endDate: '',
            },
          ],
          totalExpensesPrescribedDiet: 0,
        },
        travelExpensesForHealthcare: {
          extraExpensesForHealthcare: 0,
          expensesForTravelByAmbulance: 0,
          totalDistanceForHealthcareInKM: 0,
          expensesPerKMInCents: 0,
          totalExpensesForHealthcare: 0,
        },
        travelExpensesForHosipitalVisitOfFamilyMember: {
          travelExpensesForHoipitalVisitOfFamilyMembersDetails: [
            {
              description: '',
              numberOfVisits: 0,
              distance: 0,
              actualCostsPublicTransportationCost: 0,
            },
          ],
          totalTravelExpensesOfHospitalVisitOfFamilyMember: 0,
        },
        extraExpensesForClothesAndLinen: {
          clothesAndLineenDetails: [],
          totalExpensesForClothesAndLineen: 0,
        },
        totalDeductionForHealthcare: 0,
      },
      weekendExpensesForChildrenWithDisabilities: {
        weekendExpensesOfDisabledChildrens: [
          {
            name: '',
            dateOfBirth: '',
            daysOfCare: 0,
            daysTraveled: 0,
            distanceOfTrip: 0,
            compensation: 0,
          },
        ],
        totalDeductionForChildrenWithDisabilities: 0,
      },
      waivedVentureCapital: {
        waivedVentureCapitalDetails: [
          {
            description: '',
            alreadyWavedAmount: 0,
            amountWaivedThisYear: 0,
          },
        ],
        totalDeductionForWaivedVentureCapital: 0,
      },
    },
  },
});

export const EXPENDITURE_DATA = {
  taxableSubjectExpenditureDetails: {
    expensesForPublicTransportation: {
      travelDeliveryDetails: [
        {
          description: 'travelDeliveryDetails',
          singleTripDistance: 100,
          daysInAWeek: 10,
          startDate: startDateofYear(CURRENT_YEAR),
          endDate: endDateofYear(CURRENT_YEAR),
          compensation: 10,
        },
      ],
      totalCompensation: 100,
      totalDeductionForExpenses: 200,
    },
    premiumForAnnuity: {
      premiumsPaidDetails: {
        premiumDetails: [
          {
            policyNumber: 'PO_123',
            description: 'Life Insurance',
            amount: 100,
          },
          {
            policyNumber: 'PO_345',
            description: 'Life Insurance 1',
            amount: 210,
          },
        ],
        totalDeductions: 0,
      },
      annualAndReserveMarginDetails: null,
      totalDeductionForAnnuity: 10000,
    },
    premiumForDisabilityInsurance: {
      premiumDetails: [
        {
          policyNumber: 'PO_123',
          description: 'Life Insurance',
          amount: 100,
        },
        {
          policyNumber: 'PO_345',
          description: 'Life Insurance 1',
          amount: 210,
        },
      ],
      totalDeductions: 0,
    },
    premiumForGeneralSurvivorsLaw: {
      premiumDetails: [
        {
          policyNumber: 'PO_123',
          description: 'Life Insurance',
          amount: 100,
        },
        {
          policyNumber: 'PO_345',
          description: 'Life Insurance 1',
          amount: 210,
        },
      ],
      totalDeductions: 0,
    },
    premiumForAnnuityOfChild: {
      premiumDetails: [
        {
          policyNumber: 'PO_123',
          description: 'Life Insurance',
          amount: 100,
        },
        {
          policyNumber: 'PO_345',
          description: 'Life Insurance 1',
          amount: 210,
        },
      ],
      totalDeductions: 0,
    },
    educationalExpenses: {
      treshold: 0,
      expensesForEducationWithoutStudyGrant: {
        reimbursement: 200,
        details: [
          {
            description: 'string',
            amount: 0,
          },
        ],
        totalAmount: 0,
      },
      expensesForEducationWithStudyGrant: {
        reimbursement: 0,
        details: [
          {
            description: 'string',
            amount: 0,
          },
        ],
        totalAmount: 0,
      },
      studyGrantRepaid: {
        studyGrantDetails: [
          {
            educationalYear: 0,
            amountPaidBack: 0,
            mbo: true,
            hbOWO: true,
            period: {
              startDate: startDateofYear(CURRENT_YEAR, DATE_FORMAT),
              endDate: endDateofYear(CURRENT_YEAR, DATE_FORMAT),
            },
          },
        ],
        totalAmount: 0,
      },
      totalDeductionForEducationalExpenses: 0,
    },
    expensesForMonumentalProperty: {
      description: 'string',
      referenceNumber: 0,
      expensesPaid: 0,
      receivedSubsidy: 0,
      totalDeductionForMonumentalProperty: 0,
    },
  },
  fiscalPartnerExpendituresDetails: {
    expensesForPublicTransportation: {
      travelDeliveryDetails: [
        {
          description: 'string',
          singleTripDistance: 0,
          daysInAWeek: 0,
          startDate: startDateofYear(CURRENT_YEAR),
          endDate: endDateofYear(CURRENT_YEAR),
          compensation: 0,
        },
      ],
      totalCompensation: 0,
      totalDeductionForExpenses: 0,
    },
    premiumForAnnuity: {
      premiumsPaidDetails: {
        premiumDetails: [
          {
            policyNumber: 'string',
            description: 'string',
            amount: 0,
          },
        ],
        totalDeductions: 0,
      },
      annualAndReserveMarginDetails: [
        {
          year: 0,
          profitFromBusiness: 0,
          allocationToFor: 0,
          releaseOfFor: 0,
          incomeFromEmployment: 0,
          incomeFromOtherActivities: 0,
          incomeFromBenefits: 0,
          factorA: 0,
          deductedPremiums: 0,
        },
      ],
      totalDeductionForAnnuity: 0,
    },
    premiumForDisabilityInsurance: {
      premiumDetails: [
        {
          policyNumber: 'string',
          description: 'string',
          amount: 0,
        },
      ],
      totalDeductions: 0,
    },
    premiumForGeneralSurvivorsLaw: {
      premiumDetails: [
        {
          policyNumber: 'string',
          description: 'string',
          amount: 0,
        },
      ],
      totalDeductions: 0,
    },
    premiumForAnnuityOfChild: {
      premiumDetails: [
        {
          policyNumber: 'string',
          description: 'string',
          amount: 0,
        },
      ],
      totalDeductions: 0,
    },
    educationalExpenses: {
      treshold: 0,
      expensesForEducationWithoutStudyGrant: {
        reimbursement: 0,
        details: [
          {
            description: 'string',
            amount: 0,
          },
        ],
        totalAmount: 0,
      },
      expensesForEducationWithStudyGrant: {
        reimbursement: 0,
        details: [
          {
            description: 'string',
            amount: 0,
          },
        ],
        totalAmount: 0,
      },
      studyGrantRepaid: {
        studyGrantDetails: [
          {
            educationalYear: 0,
            amountPaidBack: 0,
            mbo: true,
            hbOWO: true,
            period: {
              startDate: startDateofYear(CURRENT_YEAR),
              endDate: endDateofYear(CURRENT_YEAR),
            },
          },
        ],
        totalAmount: 0,
      },
      totalDeductionForEducationalExpenses: 0,
    },
    expensesForMonumentalProperty: {
      description: 'string',
      referenceNumber: 0,
      expensesPaid: 0,
      receivedSubsidy: 0,
      totalDeductionForMonumentalProperty: 0,
    },
  },
  jointExpendituresDetails: {
    alimony: [
      {
        alimonyPaidTo: 'string',
        periodicPayment: 0,
        lumpSumAmount: 0,
        settlementPensionRights: 0,
        welfare: 0,
        otherAlimony: 0,
        alimonyBasicDetails: {
          firstName: 'string',
          initials: 'string',
          middleName: 'string',
          lastName: 'string',
          bsn: '123456789',
          dateOfBirth: startDateofYear(getCurrentYear(1994)),
          dateOfDeath: endDateofYear(getCurrentYear(2019)),
        },
        address: {
          street: 'string',
          houseNumber: 'string',
          additionToHouseNumber: '34',
          zipCode: 'string',
          city: 'string',
          countryId: 'string',
        },
      },
    ],
    giftsToCharity: {
      threshold: 0,
      generalGiftsToCharity: [
        {
          culturalANBI: true,
          description: 'string',
          amount: 0,
        },
      ],
      periodicGiftsToCharity: [
        {
          transactionNumber: 0,
          rsin: 0,
          culturalANBI: true,
          description: 'string',
          amount: 0,
        },
      ],
      totalDeductionForGiftsToCharity: 0,
    },
    expensesForHealthcare: {
      threshold: 0,
      treatment: {
        details: [
          {
            description: 'string',
            amount: 0,
          },
        ],
        totalAmount: 0,
      },
      prescribedMedication: {
        details: [
          {
            description: 'string',
            amount: 0,
          },
        ],
        totalAmount: 0,
      },
      aids: {
        details: [
          {
            description: 'string',
            amount: 0,
          },
        ],
        totalAmount: 0,
      },
      additionalFamilySupport: {
        details: [
          {
            description: 'string',
            amount: 0,
          },
        ],
        totalAmount: 0,
        reportAmount: 0,
      },
      prescribedDiet: {
        dietDetails: [
          {
            condition: 0,
            startDate: '2020-03-30',
            endDate: '2020-04-30',
          },
        ],
        totalExpensesPrescribedDiet: 0,
      },
      travelExpensesForHealthcare: {
        extraExpensesForHealthcare: 0,
        expensesForTravelByAmbulance: 0,
        totalDistanceForHealthcareInKM: 0,
        expensesPerKMInCents: 0,
        totalExpensesForHealthcare: 0,
      },
      travelExpensesForHosipitalVisitOfFamilyMember: {
        travelExpensesForHoipitalVisitOfFamilyMembersDetails: [
          {
            description: 'string',
            numberOfVisits: 0,
            distance: 0,
            actualCostsPublicTransportationCost: 0,
          },
        ],
        totalTravelExpensesOfHospitalVisitOfFamilyMember: 0,
      },
      extraExpensesForClothesAndLinen: {
        clothesAndLineenDetails: [{
          description: 'description',
          isConditionMoreThanOneYear: null,
          isMoreThanStandardForfeit: null,
          period: {
            startDate: '2020-03-30T09:11:43.815Z',
            endDate: '2020-03-30T09:11:43.815Z',
          },
        }],
        totalExpensesForClothesAndLineen: 0,
      },
      totalDeductionForHealthcare: 0,
    },
    weekendExpensesForChildrenWithDisabilities: {
      weekendExpensesOfDisabledChildrens: [
        {
          name: 'string',
          dateOfBirth: '2020-03-30T09:11:43.815Z',
          daysOfCare: 0,
          daysTraveled: 0,
          distanceOfTrip: 0,
          compensation: 0,
        },
      ],
      totalDeductionForChildrenWithDisabilities: 0,
    },
    waivedVentureCapital: {
      waivedVentureCapitalDetails: [
        {
          description: 'string',
          alreadyWavedAmount: 0,
          amountWaivedThisYear: 0,
        },
      ],
      totalDeductionForWaivedVentureCapital: 0,
    },
    totalDeductionForAlimony: 0,
  },
};

export const EXPENDITURE_EMPTY_DATA = deepFreeze({
  taxableSubjectExpenditureDetails: null,
  fiscalPartnerExpendituresDetails: null,
  jointExpendituresDetails: null,
});

export const PUBLIC_TRANSPORT_DATA = deepFreeze({
  ...EXPENDITURE_EMPTY_DATA,
  taxableSubjectExpenditureDetails: {
    expensesForPublicTransportation: {
      travelDeliveryDetails: [
        {
          description: 'travelDeliveryDetails',
          singleTripDistance: 100,
          daysInAWeek: 10,
          startDate: startDateofYear(CURRENT_YEAR, 'YYYY-MM-DDTHH:mm:ssZ'),
          endDate: endDateofYear(CURRENT_YEAR, 'YYYY-MM-DDTHH:mm:ssZ'),
          compensation: 10,
        },
      ],
      totalCompensation: 100,
      totalDeductionForExpenses: 200,
    },
  },
});

export const ANNUITY_PREMIUM_DATA = deepFreeze({
  ...EXPENDITURE_EMPTY_DATA,
  taxableSubjectExpenditureDetails: {
    premiumForAnnuity: {
      premiumsPaidDetails: {
        premiumDetails: [
          {
            policyNumber: 'PO_123',
            description: 'Life Insurance',
            amount: 100,
          },
          {
            policyNumber: 'PO_345',
            description: 'Life Insurance 1',
            amount: 210,
          },
        ],
        totalDeductions: 0,
      },
      annualAndReserveMarginDetails: null,
      totalDeductionForAnnuity: 10000,
    },
  },
});

export const PREMIUM_DISABLE_INSURANCE_DATA = deepFreeze({
  ...EXPENDITURE_EMPTY_DATA,
  taxableSubjectExpenditureDetails: {
    premiumForDisabilityInsurance: {
      premiumDetails: [
        {
          policyNumber: 'PO_123',
          description: 'Life Insurance',
          amount: 100,
        },
        {
          policyNumber: 'PO_345',
          description: 'Life Insurance 1',
          amount: 210,
        },
      ],
      totalDeductions: 0,
    },
  },
});

export const PREMIUM_GENERAL_SURVIVORS_DATA = deepFreeze({
  ...EXPENDITURE_EMPTY_DATA,
  taxableSubjectExpenditureDetails: {
    premiumForGeneralSurvivorsLaw: {
      premiumDetails: [
        {
          policyNumber: 'PO_345',
          description: 'string',
          amount: 0,
        },
      ],
      totalDeductions: 0,
    },
  },
});

export const PREMIUM_CHILD_DATA = deepFreeze({
  ...EXPENDITURE_EMPTY_DATA,
  taxableSubjectExpenditureDetails: {
    premiumForAnnuityOfChild: {
      premiumDetails: [
        {
          policyNumber: 'PO_345',
          description: 'string',
          amount: 0,
        },
      ],
      totalDeductions: 0,
    },
  },
});

export const GIFTS_DATA = deepFreeze({
  ...EXPENDITURE_EMPTY_DATA,
  jointExpendituresDetails: {
    giftsToCharity: {
      threshold: 0,
      generalGiftsToCharity: [
        {
          culturalANBI: true,
          description: 'string',
          amount: 0,
        },
      ],
      periodicGiftsToCharity: [
        {
          transactionNumber: 0,
          rsin: 0,
          culturalANBI: true,
          description: 'string',
          amount: 0,
        },
      ],
      totalDeductionForGiftsToCharity: 0,
    },
  },
});

export const EDUCATIONAL_EXPENSES_DATA = deepFreeze({
  ...EXPENDITURE_EMPTY_DATA,
  taxableSubjectExpenditureDetails: {
    educationalExpenses: {
      treshold: 0,
      expensesForEducationWithoutStudyGrant: {
        reimbursement: 200,
        details: [
          {
            description: 'string',
            amount: 0,
          },
        ],
        totalAmount: 0,
      },
      expensesForEducationWithStudyGrant: {
        reimbursement: 0,
        details: [
          {
            description: 'string',
            amount: 0,
          },
        ],
        totalAmount: 0,
      },
      studyGrantRepaid: {
        studyGrantDetails: [
          {
            educationalYear: 0,
            amountPaidBack: 0,
            mbo: true,
            hbOWO: true,
            period: {
              startDate: startDateofYear(CURRENT_YEAR, DATE_FORMAT),
              endDate: endDateofYear(CURRENT_YEAR, DATE_FORMAT),
            },
          },
        ],
        totalAmount: 0,
      },
      totalDeductionForEducationalExpenses: 0,
    },
  },
});
export const EDUCATIONAL_EXPENSES_DATA_WITH_OUT_DETAILS = deepFreeze({
  ...EXPENDITURE_EMPTY_DATA,
  taxableSubjectExpenditureDetails: {
    educationalExpenses: {
      treshold: 1987,
      expensesForEducationWithoutStudyGrant: {
        reimbursement: 200,
        details: null,
        totalAmount: 0,
      },
      expensesForEducationWithStudyGrant: {
        reimbursement: 0,
        details: [
          {
            description: 'string',
            amount: 0,
          },
        ],
        totalAmount: 0,
      },
      studyGrantRepaid: {
        studyGrantDetails: [
          {
            educationalYear: 0,
            amountPaidBack: 0,
            mbo: true,
            hbOWO: true,
            period: {
              startDate: startDateofYear(CURRENT_YEAR, DATE_FORMAT),
              endDate: endDateofYear(CURRENT_YEAR, DATE_FORMAT),
            },
          },
        ],
        totalAmount: 0,
      },
      totalDeductionForEducationalExpenses: 0,
    },
  },
});

export const EXPENSES_FOR_HEALTH_CARE_DATA = deepFreeze({
  ...EXPENDITURE_EMPTY_DATA,
  jointExpendituresDetails: {
    expensesForHealthcare: {
      threshold: 0,
      treatment: {
        details: [
          {
            description: 'string',
            amount: 0,
          },
        ],
        totalAmount: 0,
      },
      prescribedMedication: {
        details: [
          {
            description: 'string',
            amount: 0,
          },
        ],
        totalAmount: 0,
      },
      aids: {
        details: [
          {
            description: 'string',
            amount: 0,
          },
        ],
        totalAmount: 0,
      },
      additionalFamilySupport: {
        details: [
          {
            description: 'string',
            amount: 0,
          },
        ],
        totalAmount: 0,
        reportAmount: 0,
      },
      prescribedDiet: {
        dietDetails: [
          {
            condition: 1,
            startDate: '2020-03-30',
            endDate: '2020-04-30',
          },
        ],
        totalExpensesPrescribedDiet: 0,
      },
      travelExpensesForHealthcare: {
        extraExpensesForHealthcare: 0,
        expensesForTravelByAmbulance: 0,
        totalDistanceForHealthcareInKM: 0,
        expensesPerKMInCents: 0,
        totalExpensesForHealthcare: 0,
      },
      travelExpensesForHosipitalVisitOfFamilyMember: {
        travelExpensesForHoipitalVisitOfFamilyMembersDetails: [
          {
            description: 'string',
            numberOfVisits: 0,
            distance: 0,
            actualCostsPublicTransportationCost: 0,
          },
        ],
        totalTravelExpensesOfHospitalVisitOfFamilyMember: 0,
      },
      extraExpensesForClothesAndLinen: {
        clothesAndLineenDetails: [{
          description: 'description',
          isConditionMoreThanOneYear: false,
          isMoreThanStandardForfeit: false,
          period: {
            startDate: '2020-03-30',
            endDate: '2020-04-30',
          },
        }],
        totalExpensesForClothesAndLineen: 0,
      },
      totalDeductionForHealthcare: 0,
    },
  },
});

export const WEEKEND_EXPENSE_DATA = deepFreeze({
  ...EXPENDITURE_EMPTY_DATA,
  jointExpendituresDetails: {
    weekendExpensesForChildrenWithDisabilities: {
      weekendExpensesOfDisabledChildrens: [
        {
          name: 'string',
          dateOfBirth: '2020-03-30T09:11:43.815Z',
          daysOfCare: 0,
          daysTraveled: 0,
          distanceOfTrip: 0,
          compensation: 0,
        },
      ],
      totalDeductionForChildrenWithDisabilities: 0,
    },
  },
});

export const WAIVED_EXPENDITURE_CAPITAL_DATA = deepFreeze({
  ...EXPENDITURE_EMPTY_DATA,
  jointExpendituresDetails: {
    waivedVentureCapital: {
      waivedVentureCapitalDetails: [
        {
          description: 'string',
          alreadyWavedAmount: 0,
          amountWaivedThisYear: 0,
        },
      ],
      totalDeductionForWaivedVentureCapital: 0,
    },
  },
});

export const ALIMONY_DATA = deepFreeze({
  ...EXPENDITURE_EMPTY_DATA,
  jointExpendituresDetails: {
    alimony: [
      {
        alimonyPaidTo: 'string',
        periodicPayment: 0,
        lumpSumAmount: 0,
        settlementPensionRights: 0,
        welfare: 0,
        otherAlimony: 0,
        alimonyBasicDetails: {
          firstName: 'string',
          initials: 'string',
          middleName: 'string',
          lastName: 'string',
          bsn: '123456789',
          dateOfBirth: startDateofYear(getCurrentYear(1994)),
          dateOfDeath: endDateofYear(getCurrentYear(2019)),
        },
        address: {
          street: 'string',
          houseNumber: 'string',
          additionToHouseNumber: '34',
          zipCode: 'string',
          city: 'string',
          countryId: 'string',
        },
      },
    ],
  },
});

export const STUDYGRANT_EDUCATIONAL_EXPENSES_DATA = deepFreeze({
  ...EXPENDITURE_EMPTY_DATA,
  taxableSubjectExpenditureDetails: {
    educationalExpenses: {
      treshold: 0,
      expensesForEducationWithoutStudyGrant: null,
      expensesForEducationWithStudyGrant: null,
      studyGrantRepaid: {
        studyGrantDetails: [
          {
            educationalYear: 1,
            amountPaidBack: 0,
            mbo: true,
            hbOWO: true,
            period: { startDate: startDateofYear(CURRENT_YEAR, DATE_FORMAT), endDate: endDateofYear(CURRENT_YEAR, DATE_FORMAT) },
          },
          {
            educationalYear: 2,
            amountPaidBack: 0,
            mbo: true,
            hbOWO: true,
            period: { startDate: startDateofYear(CURRENT_YEAR, DATE_FORMAT), endDate: endDateofYear(CURRENT_YEAR, DATE_FORMAT) },
          },
          {
            educationalYear: 3,
            amountPaidBack: 0,
            mbo: true,
            hbOWO: true,
            period: { startDate: startDateofYear(CURRENT_YEAR, DATE_FORMAT), endDate: endDateofYear(CURRENT_YEAR, DATE_FORMAT) },
          },
          {
            educationalYear: 4,
            amountPaidBack: 0,
            mbo: true,
            hbOWO: true,
            period: { startDate: startDateofYear(CURRENT_YEAR, DATE_FORMAT), endDate: endDateofYear(CURRENT_YEAR, DATE_FORMAT) },
          },
          {
            educationalYear: 5,
            amountPaidBack: 0,
            mbo: true,
            hbOWO: true,
            period: { startDate: startDateofYear(CURRENT_YEAR, DATE_FORMAT), endDate: endDateofYear(CURRENT_YEAR, DATE_FORMAT) },
          },
          {
            educationalYear: 6,
            amountPaidBack: 0,
            mbo: true,
            hbOWO: true,
            period: { startDate: startDateofYear(CURRENT_YEAR, DATE_FORMAT), endDate: endDateofYear(CURRENT_YEAR, DATE_FORMAT) },
          },
          {
            educationalYear: 7,
            amountPaidBack: 0,
            mbo: true,
            hbOWO: true,
            period: { startDate: startDateofYear(CURRENT_YEAR, DATE_FORMAT), endDate: endDateofYear(CURRENT_YEAR, DATE_FORMAT) },
          },
          {
            educationalYear: 8,
            amountPaidBack: 0,
            mbo: true,
            hbOWO: true,
            period: { startDate: startDateofYear(CURRENT_YEAR, DATE_FORMAT), endDate: endDateofYear(CURRENT_YEAR, DATE_FORMAT) },
          },
          {
            educationalYear: 9,
            amountPaidBack: 0,
            mbo: true,
            hbOWO: true,
            period: { startDate: startDateofYear(CURRENT_YEAR, DATE_FORMAT), endDate: endDateofYear(CURRENT_YEAR, DATE_FORMAT) },
          },
          {
            educationalYear: 10,
            amountPaidBack: 0,
            mbo: true,
            hbOWO: true,
            period: { startDate: startDateofYear(CURRENT_YEAR, DATE_FORMAT), endDate: endDateofYear(CURRENT_YEAR, DATE_FORMAT) },
          },
          {
            educationalYear: 11,
            amountPaidBack: 0,
            mbo: true,
            hbOWO: true,
            period: { startDate: startDateofYear(CURRENT_YEAR, DATE_FORMAT), endDate: endDateofYear(CURRENT_YEAR, DATE_FORMAT) },
          },
          {
            educationalYear: 12,
            amountPaidBack: 0,
            mbo: true,
            hbOWO: true,
            period: { startDate: startDateofYear(CURRENT_YEAR, DATE_FORMAT), endDate: endDateofYear(CURRENT_YEAR, DATE_FORMAT) },
          },
          {
            educationalYear: 13,
            amountPaidBack: 0,
            mbo: true,
            hbOWO: true,
            period: { startDate: startDateofYear(CURRENT_YEAR, DATE_FORMAT), endDate: endDateofYear(CURRENT_YEAR, DATE_FORMAT) },
          },
        ],
        totalAmount: 0,
      },
      totalDeductionForEducationalExpenses: 0,
    },
  },
});

export const DECEASE_LIST = deepFreeze({
  content: [
    { value: 1, displayName: 'decease 1' },
    { value: 2, displayName: 'decease 2' },
    { value: 3, displayName: 'decease 3' },
    { value: 4, displayName: 'decease 4' },
  ],
  meta: { totalRecords: '4' },
});

export const mockGetDeceaseList = ({ data = DECEASE_LIST } = {}) => fetchMock.get(
  '/itx-api/v1/lookup/disease-conditions',
  {
    body: data,
  },
);

const THRESHOLD_ENDPOINTS = ['EducationalExpense', 'ExpenseForHealthcare', 'GiftsToCharity'];

const getMockReportData = (reportType) => {
  if (THRESHOLD_ENDPOINTS.includes(reportType)) {
    return deepFreeze({
      content: {
        result: {
          [reportType]: {
            totalAmount: 250,
            totalDeductionAmount: null,
          },
        },
      },
      meta: { totalRecords: 1 },
      errors: null,
    });
  }
  return deepFreeze({
    content: {
      result: {
        [reportType]: {
          totalAmount: 100,
          totalDeductionAmount: 0,
        },
      },
    },
    meta: { totalRecords: '1' },
    errors: null,
  });
};

export const mockGetReportBokkzData = (reportType, isPartner = false) => fetchMock.post(
  `/itx-api/v1/tax-calculation-report?reportType=${reportType}&forFiscalPartner=${isPartner}`,
  {
    body: getMockReportData(reportType),
  },
);

const mockAggrigatedReportData = deepFreeze({
  content: {
    result: {
      GiftsToCharity: { totalAmount: 250, totalDeductionAmount: null },
      ExpenditureTotalDeductionForGiftsToCharity: { totalAmount: 100, totalDeductionAmount: null },
      ExpenseForHealthcare: { totalAmount: 0, totalDeductionAmount: 100 },
    },
  },
  meta: { totalRecords: '3' },
  errors: null,
});

export const mockGetAggrigatedReportData = (isPartner = false) => fetchMock.post(
  `/itx-api/v1/aggregated-tax-calculation-report?forFiscalPartner=${isPartner}`,
  {
    body: mockAggrigatedReportData,
  },
);
