import React from 'react';
import PropTypes from 'prop-types';

const PaginationButton = ({ label, isDisabled, onClick, className }) => (
    <button
        className={`btn mal btn-secondary mx-1 ${className}`}
        disabled={isDisabled}
        onClick={onClick}
    >
        {label}
    </button>
);

PaginationButton.propTypes = {
    label: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
};

PaginationButton.defaultProps = {
    className: '',
};

export default PaginationButton;
