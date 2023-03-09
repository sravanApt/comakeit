import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Typography } from '@visionplanner/ui-react-material';
import { useModal } from '@visionplanner/vp-ui-fiscal-library';
import { incomeTranslate as translate } from '../income-translate';

const SectionHeadingWrapper = styled.div`
  .income-section {
    &__header {
      color: ${({ theme }) => theme.colors.mirage};
      margin-right: ${({ theme }) => theme.margins.base};
    }

    &__remove {
      color: ${({ theme }) => theme.primary};
      cursor: pointer;
      font-size: ${({ theme }) => theme.fontSizes.fs12};
      line-height: 2;
      margin: auto 0;
      text-transform: capitalize;
    }
  }
`;

const IncomeSectionHeading = ({
  children, heading, handleRemove, dataTa, hideDelete = false,
}) => {
  const { showModal } = useModal();
  return (
    <SectionHeadingWrapper className="income-section forecast-section" data-ta={dataTa}>
      <div className="income-section__head flex">
        <Typography use="h6" className="income-section__header font-weight-bold">{heading}</Typography>
        {!hideDelete && (
          <span
            data-ta={`remove-${dataTa}`}
            className="income-section__remove"
            role="presentation"
            onClick={() => {
              showModal('delete-confirmation-modal', {
                onConfirm: () => handleRemove(),
                dataTa: 'delete-section-modal',
                modalTitle: heading,
                confirmButtonText: translate('confirmation-yes'),
                cancelButtonText: translate('confirmation-no'),
                children: `${translate('delete')} ${heading.toLowerCase()}?`,
              });
            }}
          >
            {translate('delete')}
          </span>
        )}
      </div>
      {children}
    </SectionHeadingWrapper>
  );
};

IncomeSectionHeading.propTypes = {
  children: PropTypes.node,
  /** heading for the section */
  heading: PropTypes.string.isRequired,
  /** function that handle remove this section */
  handleRemove: PropTypes.func.isRequired,
  /** testing attribute for section */
  dataTa: PropTypes.string,
  /** to disable or enable delete */
  hideDelete: PropTypes.bool,
};

export default IncomeSectionHeading;
