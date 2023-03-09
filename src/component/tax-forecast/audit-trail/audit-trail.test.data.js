import deepFreeze from 'deep-freeze';

export const MOCK_AUDIT_TRAIL_DATA = deepFreeze({
  content: {
    globalDossierId: '27f5f911-bc4a-4a58-b8d8-acad00dfb70d',
    actionItems: [
      {
        actionName: 'Aanmaakdatum',
        lastModified: '2021-01-11T13:34:33.721Z',
        user: '26052020_01 Ram siva_ram',
        sequence: 1,
        error: null,
        name: 'test',
      },
      {
        actionName: 'Aanmaakdatum',
        lastModified: '2021-01-11T13:34:33.721Z',
        user: '26052020_01 Ram siva_ram',
        sequence: 2,
        error: 'test error',
      },
    ],
    lastModifiedBy: null,
    definition: 'IT_Declration',
    lastModifiedDate: '2021-01-11T13:34:33.721Z',
  },
  meta: {
    totalRecords: '1',
  },
  errors: null,
});
