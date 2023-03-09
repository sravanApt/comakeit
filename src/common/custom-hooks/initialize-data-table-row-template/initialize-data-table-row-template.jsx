import { useEffect, useRef } from 'react';
import get from 'lodash.get';


/**
 * Custom Hook that will initializes income from business DataTable row template
 * @param { arrayHelpers } - will use to insert or delete row from array of rows
 * @param { rowTemplate } - default row template for DataTable
 * @param { values } - values rendered in DataTable
 * @param { loadFooterData } - function that loads footer data for DataTable
 * @param { defaultDescription } - description of default first row for some sections
 * @param { fieldToCheck } - specifies which field in object to check to insert a new row
 */

export const useRowTemplate = ({
  arrayHelpers,
  rowTemplate,
  values,
  loadFooterData,
  defaultDescription,
  fieldToCheck = 'description',
}) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = {
      loadFunction: () => {
        if (values && values.length > 0) {
          const index = defaultDescription ? values.findIndex((obj) => get(obj, fieldToCheck) === defaultDescription) : 0;
          if (index === -1) {
            arrayHelpers.insert(0, { ...rowTemplate, description: defaultDescription });
          } else if (get(values[values.length - 1], fieldToCheck)) {
            arrayHelpers.push({ ...rowTemplate, newRow: 0 });
          }
        } else {
          arrayHelpers.push({
            ...rowTemplate,
            ...(defaultDescription ? { description: defaultDescription } : {}),
          });
        }
        loadFooterData && loadFooterData();
      },
    };
  });

  useEffect(() => {
    ref.current.loadFunction();
  }, [values]);

  return [ref];
};
