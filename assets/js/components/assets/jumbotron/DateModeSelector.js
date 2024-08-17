import React from 'react';

const DateModeSelector = ({ dateMode, onDateModeChange }) => {
    return (
        <div className="form-group w-100 mb-0">
            <strong>
                <label htmlFor="dateMode">Wybierz Tryb Daty:</label>
            </strong>
            <select
                id="dateMode"
                className="form-control"
                value={dateMode}
                onChange={onDateModeChange}
            >
                <option value="single">Pojedynczy Dzień</option>
                <option value="range">Zakres Dat</option>
            </select>
        </div>
    );
};

export default DateModeSelector;
