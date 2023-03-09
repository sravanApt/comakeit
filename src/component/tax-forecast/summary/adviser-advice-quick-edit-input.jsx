import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import { QuickEdit, TextInput } from '@visionplanner/ui-react-material';
import { summaryTranslate as translate } from './summary-translate';

const AdviserAdviceQuickEditInput = ({
  type, name, fieldValue, onFieldSave, shouldShowQuickActionOnFocusLost, quickEditButtonType, disabledInput,
}) => (
  <>
    <QuickEdit
      className="mar-b-lg mar-t-sm"
      initialValue={fieldValue}
      onSubmit={onFieldSave}
      quickEditButtonType={quickEditButtonType}
      shouldShowQuickActionOnFocusLost={shouldShowQuickActionOnFocusLost}
    >
      {({
        onBlur,
        onFocus,
        value,
        onChange,
        setIsValid,
      }) => (
        <AdviceTextInput
          type={type}
          onBlur={onBlur}
          name={name}
          onChange={onChange}
          value={value}
          onFocus={onFocus}
          setIsValid={setIsValid}
          disabled={disabledInput}
        />
      )}
    </QuickEdit>
  </>
);

const AdviceTextInput = ({
  name, onBlur, onChange, value, onFocus, type, setIsValid, disabled,
}) => {
  const [isTouched, setIsTouched] = useState(false);
  const { isValid, errorMessage } = useMemo(() => ({
    isValid: value.length <= 350,
    errorMessage: value.length > 350 ? translate('advice-error') : '',
  }), [value]);

  useEffect(() => {
    setIsValid(isValid);
  }, [isValid, setIsValid]);

  const handleBlur = useCallback(() => {
    setIsTouched(true);
    return onBlur();
  }, [onBlur]);

  return (
    <TextInput
      type={type}
      dataTa="advice-field"
      onBlur={handleBlur}
      name={name}
      placeholder={translate('advice-placeholder')}
      onFieldChange={(_, fieldValue) => onChange(fieldValue)}
      value={value}
      onFocus={onFocus}
      metaData={{ isTouched, error: errorMessage }}
      disabled={disabled}
    />
  );
};

export default AdviserAdviceQuickEditInput;
