import React from 'react';

const SubmitButton = ({ onClick, label = 'Zatwierdź' }) => {
    return (
        <button className="btn btn-primary h-auto mmt-2" onClick={onClick}>
            {label}
        </button>
    );
};

export default SubmitButton;
