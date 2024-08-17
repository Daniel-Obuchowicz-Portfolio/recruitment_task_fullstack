import React from 'react';

const SortOrderSelector = ({ dateMode, sortOrder, onSortOrderChange }) => {
    if (dateMode !== 'range') {
        return null;
    }

    return (
        <div className='col-md-12'>
            <div className="form-group mt-4">
                <strong>
                    <label htmlFor="sortOrder">Sortuj według daty:</label>
                </strong>
                <select
                    id="sortOrder"
                    className="form-control"
                    value={sortOrder}
                    onChange={onSortOrderChange}
                >
                    <option value="asc">Rosnąco</option>
                    <option value="desc">Malejąco</option>
                </select>
            </div>
        </div>
    );
};

export default SortOrderSelector;
