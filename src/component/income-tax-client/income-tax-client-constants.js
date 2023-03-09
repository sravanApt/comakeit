import deepFreeze from 'deep-freeze';
import * as Yup from 'yup';
import { incomeTaxClientTranslate as translate } from './income-tax-client-translate';
import { validateBsnNumber } from '../../common/utils';
import { REG_EXP_TITLE } from '../../common/constants';

export const DOSSIER_COLUMN_GROUP = deepFreeze([
  {
    id: 11,
    label: translate('name'),
    className: 'col-dossier-name',
    column: 'dossierName',
    isSortableColumn: true,
    flex: 2.5,
  },
  {
    id: 12,
    label: translate('dossier-type'),
    className: 'col-dossier-type',
    column: 'dossierType',
    isSortableColumn: true,
    flex: 1.8,
  },
  {
    id: 13,
    label: translate('year'),
    className: 'col-period',
    column: 'period',
    isSortableColumn: true,
    flex: 1,
  },
  {
    id: 14,
    label: translate('version'),
    className: 'col-version',
    column: 'version',
    isSortableColumn: true,
    flex: 1,
  },
  {
    id: 15,
    label: translate('status'),
    className: 'col-status',
    column: 'status',
    isSortableColumn: true,
    flex: 1.2,
  },
  {
    id: 16,
    label: translate('last-modified'),
    className: 'col-last-modified',
    column: 'lastModified',
    isSortableColumn: true,
    flex: 2.2,
  },
  {
    id: 31,
    label: translate('actions'),
    className: 'col-actions',
    column: 'actions',
    isSortableColumn: true,
    flex: 0.6,
  },
]);

export const GENDER_OPTIONS = deepFreeze([
  { value: 1, label: translate('male') },
  { value: 2, label: translate('female') },
  { value: 3, label: translate('others') },
]);

export const LAST_MODIFIED = 'lastModified';

export const DOSSIER_IN_PROGRESS_STATUS = 'Onderhanden';

export const GENERAL_INFO_VALIDATION = Yup.object().shape({
  genderId: Yup.number().required(translate('required-field')),
  title: Yup.string()
    .required(translate('required-field'))
    .matches(REG_EXP_TITLE, translate('invalid-entry'))
    .nullable(),
  firstName: Yup.string().required(translate('required-field')),
  lastName: Yup.string().required(translate('required-field')),
  dateOfBirth: Yup.date().required(translate('required-field')),
  bsnNumber: Yup.string().required(translate('required-field')).test('bsn number', translate('invalid-entry'), (value) => validateBsnNumber(value)),
});
