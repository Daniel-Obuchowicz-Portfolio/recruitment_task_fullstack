import React from 'react';

const StartDatePicker = ({ dateMode, selectedStartDate, onStartDateChange, today }) => {
    return (
        <div className="form-group w-100 mb-0">
            <strong>
                <label htmlFor="startDate">
                    {dateMode === 'single' ? 'Wybierz Datę:' : 'Wybierz Datę Początkową:'}
                </label>
            </strong>
            <input
                type="date"
                id="startDate"
                className="form-control"
                value={selectedStartDate}
                onChange={onStartDateChange}
                min="2023-01-01"
                max={today}
            />
        </div>
    );
};

export default StartDatePicker;
