import * as Yup from 'yup';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import {
  DEFAULT_DESCRIPTION, DEFAULT_TANGIBLE_ASSETS_DESCRIPTION,
} from './balance-sheet.constants';
import { manageCorrection } from '../common/utils';

/**
 * Modal - Component that can be used to show the detail of balance sheet assets/liabilities
 *
 */

export const validationSchema = Yup.object({
  correctionData: Yup
    .array()
    .of(Yup.object().shape({
      currentYear: Yup.object().when(['description', 'newRow'], {
        is: (description) => description && (description !== DEFAULT_DESCRIPTION) && (description.toLowerCase() !== DEFAULT_TANGIBLE_ASSETS_DESCRIPTION.toLowerCase()),
        then: Yup.object({
          correction: Yup.string().test('correction-test', translate('required-field'), (value) => ((value === '0') ? true : !!Number(value))).nullable(),
        }),
        otherwise: Yup.object().when(['description'], {
          is: (description) => (description === DEFAULT_DESCRIPTION),
          then: Yup.object({
            correction: Yup.string().test('correction-test', translate('invalid-entry'), function (value) {
              const {
                vatThisYear, vatPreviousYear, vatOtherYears, baseAmount,
              } = this.parent;
              return !!value && (((baseAmount || 0) + manageCorrection(parseInt(value, 10))) === (manageCorrection(vatThisYear) + manageCorrection(vatPreviousYear) + manageCorrection(vatOtherYears)));
            }).nullable(),
          }),
          otherwise: Yup.object().when(['description'], {
            is: (description) => description && (description.toLowerCase() === DEFAULT_TANGIBLE_ASSETS_DESCRIPTION.toLowerCase()),
            then: Yup.object({
              correction: Yup.string().required(translate('required-field')),
              baseValue: Yup.string().test('correction-test', translate('invalid-entry'), (value) => (Number(value) >= 0)).nullable(),
            }),
            otherwise: Yup.object({
              purchaseValue: Yup.string().test('correction-test', translate('invalid-entry'), (value) => (value === '0' ? true : !value)).nullable(),
              residualValue: Yup.string().test('correction-test', translate('invalid-entry'), (value) => (value === '0' ? true : !value)).nullable(),
            }),
          }),
        }),
      }),
      description: Yup.string().max(500, translate('invalid-entry')).test('description-test', translate('required-field'), function (value) {
        const { currentYear, previousYear } = this.parent;
        return !((!value && !!Number(currentYear.correction)) || (!value && !!Number(previousYear.correction)));
      }).nullable(),
      previousYear: Yup.object().when(['description'], {
        is: (description) => description,
        then: Yup.object({
          correction: Yup.string().required(translate('required-field')),
        }),
      }).nullable(),
    }).nullable()).nullable(),
});
