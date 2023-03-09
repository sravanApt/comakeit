const EXPENDITURE_DATA = {
  expensesForPublicTransportation: {
    travelDeliveryDetails: [
      {
        description: '',
        singleTripDistance: null,
        daysInAWeek: null,
        startDate: '',
        endDate: '',
        compensation: 0,
      },
    ],
    totalCompensation: '',
    totalDeductionForExpenses: 0,
  },
  premiumForAnnuity: {
    premiumsPaidDetails: {
      premiumDetails: [
        {
          policyNumber: null,
          description: '',
          amount: 0,
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
    totalDeductionForAnnuity: null,
  },
  premiumForDisabilityInsurance: {
    premiumDetails: [
      {
        policyNumber: null,
        description: '',
        amount: 0,
      },
    ],
    totalDeductions: 0,
  },
  premiumForGeneralSurvivorsLaw: {
    premiumDetails: [
      {
        policyNumber: null,
        description: '',
        amount: 0,
      },
    ],
    totalDeductions: 0,
  },
  premiumForAnnuityOfChild: {
    premiumDetails: [
      {
        policyNumber: null,
        description: '',
        amount: 0,
      },
    ],
    totalDeductions: 0,
  },
  educationalExpenses: {
    treshold: null,
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
    // Will be enabled after pilot
    // expensesForEducationWithStudyGrant: {
    //   reimbursement: 0,
    //   details: [
    //     {
    //       description: '',
    //       amount: 0,
    //     },
    //   ],
    //   totalAmount: 0,
    // },
    studyGrantRepaid: {
      studyGrantDetails: [
        {
          educationalYear: '',
          amountPaidBack: null,
          mbo: null,
          hbO_WO: null,
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
};
const JOIT_EXPENDITURE_DATA = {
  alimony: [
    {
      alimonyPaidTo: '',
      periodicPayment: null,
      lumpSumAmount: null,
      settlementPensionRights: null,
      welfare: null,
      otherAlimony: null,
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
    threshold: null,
    generalGiftsToCharity: [
      {
        culturalANBI: null,
        description: '',
        amount: 0,
      },
    ],
    periodicGiftsToCharity: [
      {
        transactionNumber: null,
        rsin: null,
        culturalANBI: null,
        description: '',
        amount: 0,
      },
    ],
    totalDeductionForGiftsToCharity: 0,
  },
  expensesForHealthcare: {
    threshold: null,
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
      totalDistanceForHealthcareInKM: null,
      expensesPerKMInCents: null,
      totalExpensesForHealthcare: 0,
    },
    travelExpensesForHosipitalVisitOfFamilyMember: {
      travelExpensesForHoipitalVisitOfFamilyMembersDetails: [
        {
          description: '',
          numberOfVisits: null,
          distance: null,
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
        daysOfCare: null,
        daysTraveled: null,
        distanceOfTrip: null,
        compensation: 0,
      },
    ],
    totalDeductionForChildrenWithDisabilities: 0,
  },
  // Enabled after pilot
  // waivedVentureCapital: {
  //   waivedVentureCapitalDetails: [
  //     {
  //       description: '',
  //       alreadyWavedAmount: 0,
  //       amountWaivedThisYear: 0,
  //     },
  //   ],
  //   totalDeductionForWaivedVentureCapital: 0,
  // },
};

export const INITIAL_EXPENDITURE_DATA = {
  expenditureDetails: {
    taxableSubjectExpenditureDetails: { ...EXPENDITURE_DATA },
    fiscalPartnerExpendituresDetails: { ...EXPENDITURE_DATA },
    jointExpendituresDetails: { ...JOIT_EXPENDITURE_DATA },
  },
};

export const INITIAL_REPORT_DATA = {
  taxableSubjectExpenditureDetails: {
    reportValues: {
      totalDeductionForExpenses: 0,
      totalDeductionForAnnuity: 0,
      totalDeductionForEducationalExpenses: 0,
    },
    thresholdValues: {
      educationalExpenses: null,
    },
  },
  fiscalPartnerExpendituresDetails: {
    reportValues: {
      totalDeductionForExpenses: 0,
      totalDeductionForAnnuity: 0,
      totalDeductionForEducationalExpenses: 0,
    },
    thresholdValues: {
      educationalExpenses: null,
    },
  },
  jointExpendituresDetails: {
    reportValues: {
      totalDeductionForGiftsToCharity: 0,
      totalDeductionForHealthcare: 0,
      reportAmount: 0,
      totalExpensesPrescribedDiet: 0,
      totalExpensesForHealthcare: 0,
      totalTravelExpensesOfHospitalVisitOfFamilyMember: 0,
      totalDeductionForChildrenWithDisabilities: 0,
      totalExpensesForClothesAndLineen: 0,
    },
    thresholdValues: {
      giftsToCharity: null,
      expensesForHealthcare: null,
    },
  },
};
