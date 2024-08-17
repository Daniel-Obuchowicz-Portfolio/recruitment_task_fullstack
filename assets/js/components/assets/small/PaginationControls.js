import React from 'react';
import PropTypes from 'prop-types';
import PaginationButton from './PaginationButton';

const PaginationControls = ({
    totalPages,
    currentPage,
    handlePageChange,
    renderItemCount,
    renderPaginationButtons
}) => {

    const createButton = (label, page, isDisabled, extraClass = '') => (
        <PaginationButton
            label={label}
            isDisabled={isDisabled}
            onClick={() => handlePageChange(page)}
            className={extraClass}
        />
    );

    return (
        totalPages > 1 && (
            <div className="container px-0">
                {renderItemCount()}
                <div className="d-block d-lg-flex justify-center mt-4 mb-5 fin">
                    {createButton('Pierwsza', 1, currentPage === 1, 'hide')}
                    {createButton('Poprzednia', currentPage - 1, currentPage === 1)}
                    {renderPaginationButtons()}
                    {createButton('Następna', currentPage + 1, currentPage === totalPages)}
                    {createButton('Ostatnia', totalPages, currentPage === totalPages, 'hide')}
                </div>
            </div>
        )
    );
};

PaginationControls.propTypes = {
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    renderItemCount: PropTypes.func.isRequired,
    renderPaginationButtons: PropTypes.func.isRequired,
};

export default PaginationControls;
