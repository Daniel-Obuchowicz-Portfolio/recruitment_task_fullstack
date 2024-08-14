import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useCurrencyData } from './useCurrencyData';
import CurrencyTable from './CurrencyTable';
import MissingDatesInfo from './MissingDatesInfo';
import { formatDate } from './dateUtils';

const currencyNames = {
    EUR: 'Euro',
    USD: 'Dolar Amerykański',
    CZK: 'Korona Czeska',
    IDR: 'Rupia Indonezyjska',
    BRL: 'Real Brazylijski'
};

const supportedCurrencies = ['EUR', 'USD', 'CZK', 'IDR', 'BRL'];

const ExchangeRatesView = () => {
    const { startDate, endDate } = useParams();
    const history = useHistory();
    const today = new Date().toISOString().split('T')[0];

    const [selectedStartDate, setSelectedStartDate] = useState(today);
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [dateMode, setDateMode] = useState('single');

    const { exchangeRates, resultCount, missingDates, fetchedData } = useCurrencyData(
        selectedStartDate, 
        selectedEndDate || selectedStartDate, 
        supportedCurrencies
    );

    const handleStartDateChange = (event) => {
        const newStartDate = event.target.value;
        setSelectedStartDate(newStartDate);
        if (dateMode === 'single') {
            updateURLAndFetchData(newStartDate, newStartDate);
        } else {
            updateURLAndFetchData(newStartDate, selectedEndDate || newStartDate);
        }
    };

    const handleEndDateChange = (event) => {
        const newEndDate = event.target.value;
        setSelectedEndDate(newEndDate);
        updateURLAndFetchData(selectedStartDate, newEndDate);
    };

    const handleDateModeChange = (event) => {
        const mode = event.target.value;
        setDateMode(mode);
        if (mode === 'single') {
            setSelectedEndDate('');
            updateURLAndFetchData(selectedStartDate, selectedStartDate);
        }
    };

    const handleSubmit = () => {
        const start = selectedStartDate;
        const end = dateMode === 'range' && selectedEndDate ? selectedEndDate : start;
        updateURLAndFetchData(start, end);
    };

    const updateURLAndFetchData = (start, end) => {
        history.push(`/exchange-rates/${start}/${end}`);
    };

    return (
        <div className="container-full mt-5">
            <div className='container-custom'>
                <h1 className="container mb-4">Kursy Walut</h1>
                <div className="container date-picker-container jumbotron">
                    <div className="d-flex justify-center w-100 gap-5">
                        <div className="form-group w-100 mb-0">
                            <label htmlFor="dateMode">Wybierz Tryb Daty:</label>
                            <select id="dateMode" className="form-control" value={dateMode} onChange={handleDateModeChange}>
                                <option value="single">Pojedynczy Dzień</option>
                                <option value="range">Zakres Dat</option>
                            </select>
                        </div>
                        <div className="form-group w-100 mb-0">
                            <label htmlFor="startDate">{dateMode === 'single' ? 'Wybierz Datę:' : 'Wybierz Datę Początkową:'}</label>
                            <input
                                type="date"
                                id="startDate"
                                className="form-control"
                                value={selectedStartDate}
                                onChange={handleStartDateChange}
                                min="2023-01-01"
                                max={today}
                            />
                        </div>
                        {dateMode === 'range' && (
                            <div className="form-group w-100 mb-0">
                                <label htmlFor="endDate">Wybierz Datę Końcową:</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    className="form-control"
                                    value={selectedEndDate}
                                    onChange={handleEndDateChange}
                                    min={selectedStartDate || "2023-01-01"}
                                    max={today}
                                />
                            </div>
                        )}
                        <button className="btn btn-primary h-auto" onClick={handleSubmit}>Zatwierdź</button>
                    </div>
                </div>
                {fetchedData && (
                <div className="data-section">
                    {resultCount > 0 ? (
                        <>
                            <div className="container result-count mb-4">
                                <h2>Znaleziono wyniki ({resultCount})</h2>
                            </div>
                            {Object.keys(exchangeRates).map((date, index) => (
                                <div className={`date-section ${index % 2 === 0 ? 'second-section' : 'white-section'}`} key={date}>
                                    <div className='container'>
                                        <h4 className="date-header">Dane z dnia: <strong>{formatDate(date)}</strong></h4>

                                        {supportedCurrencies.some(currency => exchangeRates[date][currency]) ? (
                                            <div className="row">
                                                {supportedCurrencies.map(currency =>
                                                    exchangeRates[date][currency] ? (
                                                        <div className="col-md-4 mb-4" key={`${date}-${currency}`}>
                                                            <div className="card currency-card p-0">
                                                                <div className="card-body">
                                                                    <h5 className="card-title">{currency} ({currencyNames[currency]})</h5>
                                                                    <table className="table table-bordered table-striped text-dark">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>Data</td>
                                                                                <td><strong>{formatDate(date)}</strong></td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Kurs NBP</td>
                                                                                <td><strong>{exchangeRates[date][currency]?.averageRate != null ? `${exchangeRates[date][currency].averageRate.toFixed(4)} PLN` : 'N/A PLN'}</strong></td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Kurs Kupna</td>
                                                                                <td><strong>{exchangeRates[date][currency]?.buyRate != null ? `${exchangeRates[date][currency].buyRate.toFixed(4)} PLN` : 'N/A PLN'}</strong></td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Kurs Sprzedaży</td>
                                                                                <td><strong>{exchangeRates[date][currency]?.sellRate != null ? `${exchangeRates[date][currency].sellRate.toFixed(4)} PLN` : 'N/A PLN'}</strong></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : null
                                                )}
                                            </div>
                                        ) : (
                                            <div className="" key={date}>
                                                <div className="no-data-content">
                                                    <div className="icon-container">
                                                        <span className="icon">!</span>
                                                    </div>
                                                    <div className="message-container">
                                                        <h3>Brak informacji</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>

                            ))}
                            {missingDates.length > 0 && (
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
                                            className="text-primary ml-2"
                                        >
                                            [Źródło: nbp.pl]
                                        </a>
                                    </p>
                                </div>
                            )}

                        </>
                    ) : (
                        <div className="no-data-container">
                            <div className="no-data-content">
                                <div className="icon-container">
                                    <span className="icon">!</span>
                                </div>
                                <div className="message-container">
                                    <h3>Nie znaleziono wyników z tego dnia, wybierz inną datę</h3>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
                <footer className="footer mt-4">
                    <div className="container">
                        <span className="text-muted">© Copyright - 2024 Daniel Obuchowicz</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ExchangeRatesView;
