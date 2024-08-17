import React from 'react';
import PropTypes from 'prop-types';

const NoDataContent = ({ message }) => {
    return (
        <div className="no-data-content">
            <div className="icon-container">
                <span className="icon">!</span>
            </div>
            <div className="message-container">
                <h3>{message}</h3>
            </div>
        </div>
    );
};

NoDataContent.propTypes = {
    message: PropTypes.string.isRequired,
};

export default NoDataContent;
