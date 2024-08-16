import React from 'react';
import { formatDate } from './dateUtils';

const MissingDatesInfo = ({ missingDates }) => {
    // Check if there are any missing dates
    if (missingDates.length === 0) {
        return null; // Don't render the component if there are no missing dates
    }

    return (
        <div className="container no-data mt-4 p-4 border rounded shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
            <h3 className="text-danger mb-4">Brak informacji odnośnie następujących dni:</h3>
            <ul className="list-group mb-3">
                {missingDates.map((date) => (
                    <li key={date} className="list-group-item font-medium">
                        {formatDate(date)}
                    </li>
                ))}
            </ul>
            <p className="font-weight-bold">
                Wnioski: Tabela A kursów średnich walut obcych aktualizowana jest w każdy dzień roboczy, między godziną 11:45 a 12:15. 
                <a
                    href="https://nbp.pl/statystyka-i-sprawozdawczosc/kursy/informacja-o-terminach-publikacji-kursow-walut/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary d-block"
                >
                     [Źródło: nbp.pl]
                </a>
            </p>
        </div>
    );
};

export default MissingDatesInfo;
