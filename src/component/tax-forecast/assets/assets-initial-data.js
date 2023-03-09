import { startDateofYear, endDateofYear } from '../../../common/utils';

const DEFAULT_ASSETS_DATA = {
  ownHomes: [],
  substantialInterests: [],
  otherProperties: [],
  bankAccounts: [],
  investmentAccounts: [],
  environmentalInvestments: [],
  periodicalBenefits: [],
  outStandingLoansOrCash: [],
  otherAssets: [],
  nonExemptCapitalInsurances: [],
};

export const NEW_OWN_HOME_DATA = (taxableYear) => ({
  description: '',
  belongsTo: '',
  address: {
    street: '',
    houseNumber: '',
    additionToHouseNumber: null,
    zipCode: '',
    city: '',
    countryId: 1,
  },
  woz: null,
  wozReferenceNumber: null,
  fixedRate: null,
  percentageOfOwnership: 100,
  startDate: startDateofYear(taxableYear, 'YYYY-MM-DD'),
  endDate: endDateofYear(taxableYear, 'YYYY-MM-DD'),
  dateOfPurchase: null,
  purchaseprice: null,
  purchaseCosts: null,
  dateOfSelling: null,
  homeLoanLiability: null,
  sellingPrice: null,
  sellingCosts: null,
  paidGroundRent: null,
  monumentalReferenceNumber: null,
  expensesPaid: null,
  receivedSubsidy: null,
  rentalIncome: null,
  costOfRental: null,
  taxableCapitalInsurance: null,
});

export const NEW_SUBSTANTIAL_INTEREST_DATA = {
  groupingId: null,
  belongsTo: '',
  businessName: '',
  globalAdministrationId: '',
  numberOfShares: '',
  countryId: 1,
  acquisitionPrice: '',
  regularBenefit: '',
  deductibleCosts: '',
  withHeldDividendTax: '',
  transferPrice: '',
  deductibleAcquisitionPrice: '',
  incomeFromAbroad: '',
  withHeldSourceTax: '',
};

export const NEW_OTHER_PROPERTIES_DATA = {
  id: null,
  description: '',
  belongsTo: '',
  address: {
    street: '',
    houseNumber: '',
    additionToHouseNumber: null,
    zipCode: '',
    city: '',
    countryId: 1,
  },
  woz: '',
  wozReferenceNumber: '',
  percentageOfOwnership: 100,
  rentedOutOrLeased: {
    status: 0,
    isLeaseAgreementForMoreThenTwelveYears: null,
    yearLease: '',
    isUnusualBusinessConditionsForLease: null,
    tenantProtection: null,
    annualRent: '',
    unprofessionalRent: null,
    isPropertyPartOfBiggerBuilding: null,
    percentageOfRental: 100,
  },
  monumentalReferenceNumber: '',
  expensesPaid: '',
  subsidyReceived: '',
};

export const INITIAL_ASSETS_DATA = {
  assetsScreen: {
    jointAssets: { ...DEFAULT_ASSETS_DATA },
  },
};
