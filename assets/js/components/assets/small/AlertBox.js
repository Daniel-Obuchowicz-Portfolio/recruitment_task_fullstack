import React from 'react';
import PropTypes from 'prop-types';

const AlertBox = ({ showAlert, onClose, today }) => {
    if (!showAlert) {
        return null; // Do not render anything if showAlert is false
    }

    return (
        <div className="container px-0">
            <div className="alert alert-danger p-4" role="alert">
                <h4 className="alert-heading">Błąd!</h4>
                <p className='mb-0'>
                    Wprowadzono nieprawidłową datę. Została ustawiona dzisiejsza data: <strong>{today}</strong>.
                </p>
                <button
                    type="button"
                    className="btn-close custom-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    onClick={onClose}
                >
                    <i className="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    );
};

AlertBox.propTypes = {
    showAlert: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    today: PropTypes.string.isRequired,
};

export default AlertBox;
