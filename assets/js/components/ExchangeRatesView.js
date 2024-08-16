import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useCurrencyData } from './assets/useCurrencyData';
import MissingDatesInfo from './assets/MissingDatesInfo';
import { formatDate } from './assets/dateUtils';

const currencyNames = {
    EUR: 'Euro',
    USD: 'Dolar Amerykański',
    CZK: 'Korona Czeska',
    IDR: 'Rupia Indonezyjska',
    BRL: 'Real Brazylijski'
};

const supportedCurrencies = ['EUR', 'USD', 'CZK', 'IDR', 'BRL'];

const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regex)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

const ExchangeRatesView = () => {
    const { startDate, endDate } = useParams();
    const history = useHistory();
    const today = new Date().toISOString().split('T')[0];

    const [selectedStartDate, setSelectedStartDate] = useState(startDate || today);
    const [selectedEndDate, setSelectedEndDate] = useState(endDate || '');
    const [dateMode, setDateMode] = useState(endDate ? 'range' : 'single');
    const [showAlert, setShowAlert] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activePreset, setActivePreset] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc');

    const itemsPerPage = 5;

    const { exchangeRates, resultCount, missingDates, fetchedData } = useCurrencyData(
        selectedStartDate,
        selectedEndDate || selectedStartDate,
        supportedCurrencies
    );

    useEffect(() => {
        if (startDate && endDate) {
            if (!isValidDate(startDate) || !isValidDate(endDate)) {
                setShowAlert(true);
                setSelectedStartDate(today);
                setCurrentPage(1);
                history.push(`/exchange-rates/${today}`);
            } else {
                setCurrentPage(1);
                setDateMode('range');
                setSelectedStartDate(startDate);
                setSelectedEndDate(endDate);
            }
        } else if (startDate) {
            if (!isValidDate(startDate)) {
                setShowAlert(true);
                setSelectedStartDate(today);
                setCurrentPage(1);
                history.push(`/exchange-rates/${today}`);
            } else {
                setCurrentPage(1);
                setSelectedStartDate(startDate);
                setSelectedEndDate('');
            }
        }
    }, [startDate, endDate, history, today]);

    const handleStartDateChange = (event) => {
        const newStartDate = event.target.value;
        setSelectedStartDate(newStartDate);
        setShowAlert(false);
        setActivePreset(null);
        if (dateMode === 'single') {
            updateURLAndFetchData(newStartDate, newStartDate);
        } else {
            updateURLAndFetchData(newStartDate, selectedEndDate || newStartDate);
        }
    };

    const handleEndDateChange = (event) => {
        const newEndDate = event.target.value;
        setSelectedEndDate(newEndDate);
        setShowAlert(false);
        setActivePreset(null);
        updateURLAndFetchData(selectedStartDate, newEndDate);
    };

    const handleDateModeChange = (event) => {
        const mode = event.target.value;
        setDateMode(mode);
        setActivePreset(null);
        if (mode === 'single') {
            setSelectedEndDate('');
            updateURLAndFetchData(selectedStartDate, selectedStartDate);
        }
    };

    const handlePresetDateClick = (preset) => {
        let start, end;
        if (preset === 'today') {
            start = today;
            end = start;
        } else if (preset === 'yesterday') {
            start = new Date();
            start.setDate(start.getDate() - 1);
            start = start.toISOString().split('T')[0];
            end = start;
        } else if (preset === 'dayBeforeYesterday') {
            start = new Date();
            start.setDate(start.getDate() - 2);
            start = start.toISOString().split('T')[0];
            end = start;
        } else if (preset === 'last7Days') {
            start = new Date();
            start.setDate(start.getDate() - 6);
            start = start.toISOString().split('T')[0];
            end = today;
        } else if (preset === 'lastMonth') {
            start = new Date();
            start.setMonth(start.getMonth() - 1);
            start = start.toISOString().split('T')[0];
            end = today;
        } else if (preset === 'lastYear') {
            start = new Date();
            start.setFullYear(start.getFullYear() - 1);
            start = start.toISOString().split('T')[0];
            end = today;
        }
        setActivePreset(preset);
        setCurrentPage(1);
        setSelectedStartDate(start);
        setSelectedEndDate(end);
        setDateMode(preset === 'today' ? 'single' : 'range');
        updateURLAndFetchData(start, end);
    };

    const handleSubmit = () => {
        const start = selectedStartDate;
        const end = dateMode === 'range' && selectedEndDate ? selectedEndDate : start;
        setActivePreset(null);
        updateURLAndFetchData(start, end);
    };

    const renderItemCount = () => {
        // Calculate the total number of sub-elements (currency entries) on the current page
        const currentPageItems = sortedRates
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .reduce((count, date) => {
                return count + Object.keys(exchangeRates[date]).filter(currency => exchangeRates[date][currency]).length;
            }, 0);
    
        // Calculate start and end indices for display
        const totalDisplayedBeforeCurrentPage = sortedRates
            .slice(0, (currentPage - 1) * itemsPerPage)
            .reduce((count, date) => {
                return count + Object.keys(exchangeRates[date]).filter(currency => exchangeRates[date][currency]).length;
            }, 0);
    
        const startIndex = totalDisplayedBeforeCurrentPage + 1;
        const endIndex = totalDisplayedBeforeCurrentPage + currentPageItems;
    
        return (
            <h5>
                Pokazuję <strong>{startIndex}-{endIndex}</strong> z <strong>{resultCount}</strong> elementów
            </h5>
        );
    };
    

    const updateURLAndFetchData = (start, end) => {
        if (dateMode === 'range') {
            history.push(`/exchange-rates/${start}/${end}`);
        } else {
            history.push(`/exchange-rates/${start}`);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({
            top: 0,
            behavior: "smooth"  // Smoothly scroll to the top of the page
        });
    };

    // Sorting logic
    const sortedRates = Object.keys(exchangeRates).sort((a, b) => {
        if (sortOrder === 'asc') {
            return new Date(a) - new Date(b);
        } else {
            return new Date(b) - new Date(a);
        }
    });

    const paginatedRates = sortedRates
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        .reduce((result, key) => {
            result[key] = exchangeRates[key];
            return result;
        }, {});

    const totalPages = Math.ceil(sortedRates.length / itemsPerPage);
    const maxVisibleButtons = 10;

    const renderPaginationButtons = () => {
        const visiblePages = [];

        let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

        if (endPage - startPage < maxVisibleButtons - 1) {
            startPage = Math.max(1, endPage - maxVisibleButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            visiblePages.push(
                <button
                    key={i}
                    className={`btn mx-1 d-none d-lg-block ${currentPage === i ? 'active ' : 'btn-outline-secondary'}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        return visiblePages;
    };

    return (
        <div className="container-full mt-5">
            <div className="container-custom">
                <h1 className="container p-0 mb-4">Kursy Walut</h1>

                <div className="container date-picker-container jumbotron">
                    <div className='w-100 block'>
                        <div className="d-flex justify-center w-100 gap-5 block">
                            <div className="form-group w-100 mb-0">
                                <strong><label htmlFor="dateMode">Wybierz Tryb Daty:</label></strong>
                                <select id="dateMode" className="form-control" value={dateMode} onChange={handleDateModeChange}>
                                    <option value="single">Pojedynczy Dzień</option>
                                    <option value="range">Zakres Dat</option>
                                </select>
                            </div>
                            <div className="form-group w-100 mb-0">
                                <strong><label htmlFor="startDate">{dateMode === 'single' ? 'Wybierz Datę:' : 'Wybierz Datę Początkową:'}</label></strong>
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
                                    <strong><label htmlFor="endDate">Wybierz Datę Końcową:</label></strong>
                                    <input
                                        type="date"
                                        id="endDate"
                                        className="form-control"
                                        value={selectedEndDate}
                                        onChange={handleEndDateChange}
                                        min={selectedStartDate}
                                        max={today}
                                    />
                                </div>
                            )}
                            <button className="btn btn-primary h-auto mmt-2" onClick={handleSubmit}>Zatwierdź</button>
                        </div>

                        {/* Przyciski do presetów */}

                        <div className='row'>
                            <div className='col-md-12'>
                                 {/* Sort Order Selection */}
                                {dateMode === 'range' && (
                                        <div className="form-group mt-4">
                                        <strong><label htmlFor="sortOrder">Sortuj według daty:</label></strong>
                                        <select id="sortOrder" className="form-control" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                            <option value="asc">Rosnąco</option>
                                            <option value="desc">Malejąco</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className='col-md-12'>
                                <strong><label className='mt-4'>Na skróty:</label></strong>
                                <div className="d-flex justify-center w-100 gap-5 block">
                                    <button className={`btn btn-secondary ${activePreset === 'today' ? 'active' : ''}`} onClick={() => handlePresetDateClick('today')}>Dziś</button>
                                    <button className={`btn btn-secondary ${activePreset === 'yesterday' ? 'active' : ''}`} onClick={() => handlePresetDateClick('yesterday')}>Wczoraj</button>
                                    <button className={`btn btn-secondary ${activePreset === 'dayBeforeYesterday' ? 'active' : ''}`} onClick={() => handlePresetDateClick('dayBeforeYesterday')}>Przedwczoraj</button>
                                    <button className={`btn btn-secondary ${activePreset === 'last7Days' ? 'active' : ''}`} onClick={() => handlePresetDateClick('last7Days')}>Ostatnie 7 dni</button>
                                    <button className={`btn btn-secondary ${activePreset === 'lastMonth' ? 'active' : ''}`} onClick={() => handlePresetDateClick('lastMonth')}>Ostatni miesiąc</button>
                                    <button className={`btn btn-secondary ${activePreset === 'lastYear' ? 'active' : ''}`} onClick={() => handlePresetDateClick('lastYear')}>Ostatni rok</button>
                                </div>
                            </div>
                        </div>
                        
                        

                    </div>
                </div>

                {showAlert && (
                    <div className="container px-0">
                        <div className="alert alert-danger p-4" role="alert">
                            <h4 className="alert-heading">Błąd!</h4>
                            <p className='mb-0'>Wprowadzono nieprawidłową datę. Została ustawiona dzisiejsza data: <strong>{today}</strong>.</p>
                            <button type="button" className="btn-close custom-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setShowAlert(false)}>
                                <i className="fa fa-times" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                )}

                {fetchedData && (
                    <div className="data-section">
                        {resultCount > 0 ? (
                            <>
                                <div className="container result-count mb-4 p-0">
                                    <h2>Znaleziono wyniki <strong>({resultCount})</strong></h2>
                                </div>
                                {sortedRates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((date, index) => (
                                    <div className={`date-section ${index % 2 === 0 ? 'second-section' : 'white-section'}`} key={date}>
                                        <div className="container px-0">
                                            <h4 className="date-header">Dane z dnia: <strong>{formatDate(date)}</strong></h4>

                                            {supportedCurrencies.some(currency => paginatedRates[date][currency]) ? (
                                                <div className="row">
                                                    {supportedCurrencies.map(currency =>
                                                        paginatedRates[date][currency] ? (
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
                                                                                    <td><strong>{paginatedRates[date][currency]?.averageRate != null ? `${paginatedRates[date][currency].averageRate.toFixed(4)} PLN` : 'N/A PLN'}</strong></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>Kurs Kupna</td>
                                                                                    <td><strong>{paginatedRates[date][currency]?.buyRate != null ? `${paginatedRates[date][currency].buyRate.toFixed(4)} PLN` : 'N/A PLN'}</strong></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>Kurs Sprzedaży</td>
                                                                                    <td><strong>{paginatedRates[date][currency]?.sellRate != null ? `${paginatedRates[date][currency].sellRate.toFixed(4)} PLN` : 'N/A PLN'}</strong></td>
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
                               
                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="container px-0">
                                        {renderItemCount()}
                                        <div className='d-block d-lg-flex justify-center mt-4 mb-5 fin'>
                                            <button
                                                className="btn mal btn-secondary mx-1 hide"
                                                disabled={currentPage === 1}
                                                onClick={() => handlePageChange(1)}
                                            >
                                                Pierwsza
                                            </button>
                                            <button
                                                className="btn mal btn-secondary mx-1"
                                                disabled={currentPage === 1}
                                                onClick={() => handlePageChange(currentPage - 1)}
                                            >
                                                Poprzednia
                                            </button>
                                            {renderPaginationButtons()}
                                            <button
                                                className="btn mal btn-secondary mx-1"
                                                disabled={currentPage === totalPages}
                                                onClick={() => handlePageChange(currentPage + 1)}
                                            >
                                                Następna
                                            </button>
                                            <button
                                                className="btn mal btn-secondary mx-1 hide"
                                                disabled={currentPage === totalPages}
                                                onClick={() => handlePageChange(totalPages)}
                                            >
                                                Ostatnia
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <MissingDatesInfo missingDates={missingDates} />

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
