import React from 'react';

const PresetButtonGroup = ({ activePreset, handlePresetDateClick }) => {
    const presets = [
        { id: 'today', label: 'Dziś' },
        { id: 'yesterday', label: 'Wczoraj' },
        { id: 'dayBeforeYesterday', label: 'Przedwczoraj' },
        { id: 'last7Days', label: 'Ostatnie 7 dni' },
        { id: 'lastMonth', label: 'Ostatni miesiąc' },
        { id: 'lastYear', label: 'Ostatni rok' },
    ];

    return (
        <div className='col-md-12'>
            <strong>
                <label className='mt-4'>Na skróty:</label>
            </strong>
            <div className="d-flex justify-center w-100 gap-5 block">
                {presets.map((preset) => (
                    <button
                        key={preset.id}
                        className={`btn btn-secondary ${activePreset === preset.id ? 'active' : ''}`}
                        onClick={() => handlePresetDateClick(preset.id)}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PresetButtonGroup;