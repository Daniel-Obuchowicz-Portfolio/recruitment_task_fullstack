import React from 'react';

const EndDatePicker = ({ dateMode, selectedEndDate, onEndDateChange, selectedStartDate, today }) => {
    if (dateMode !== 'range') {
        return null;
    }

    return (
        <div className="form-group w-100 mb-0">
            <strong>
                <label htmlFor="endDate">Wybierz Datę Końcową:</label>
            </strong>
            <input
                type="date"
                id="endDate"
                className="form-control"
                value={selectedEndDate}
                onChange={onEndDateChange}
                min={selectedStartDate}
                max={today}
            />
        </div>
    );
};

export default EndDatePicker;
