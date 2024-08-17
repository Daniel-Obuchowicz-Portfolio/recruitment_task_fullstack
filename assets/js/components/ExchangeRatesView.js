import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useCurrencyData } from './assets/useCurrencyData';
import MissingDatesInfo from './assets/MissingDatesInfo';
import { formatDate } from './assets/dateUtils';
import DateModeSelector from './assets/jumbotron/DateModeSelector';
import StartDatePicker from './assets/jumbotron/StartDatePicker';
import EndDatePicker from './assets/jumbotron/EndDatePicker';
import SubmitButton from './assets/jumbotron/SubmitButton';
import SortOrderSelector from './assets/jumbotron/SortOrderSelector';
import PresetButtonGroup from './assets/jumbotron/PresetButtonGroup';
import AlertBox from './assets/small/AlertBox';
import NoDataContent from './assets/small/NoDataContent';
import CurrencyCard from './assets/cards/CurrencyCard';
import PaginationControls from './assets/small/PaginationControls';
import Footer from './assets/footer/Footer';


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
    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
    };


    return (
        <div className="container-full mt-5">
            <div className="container-custom">
                <h1 className="container p-0 mb-4">Kursy Walut</h1>

                <div className="container date-picker-container jumbotron">
                    <div className='w-100 block'>
                        <div className="d-flex justify-center w-100 gap-5 block">
                            <DateModeSelector dateMode={dateMode} onDateModeChange={handleDateModeChange} />
                            <StartDatePicker
                                dateMode={dateMode}
                                selectedStartDate={selectedStartDate}
                                onStartDateChange={handleStartDateChange}
                                today={today}
                            />
                            <EndDatePicker
                                dateMode={dateMode}
                                selectedEndDate={selectedEndDate}
                                onEndDateChange={handleEndDateChange}
                                selectedStartDate={selectedStartDate}
                                today={today}
                            />
                            <SubmitButton onClick={handleSubmit} label="Submit" />
                        </div>

                        {/* Przyciski do presetów */}

                        <div className='row'>
                            <SortOrderSelector
                                dateMode={dateMode}
                                sortOrder={sortOrder}
                                onSortOrderChange={handleSortOrderChange}
                            />
                            <PresetButtonGroup
                                activePreset={activePreset}
                                handlePresetDateClick={handlePresetDateClick}
                            />
                        </div>



                    </div>
                </div>

                <AlertBox
                    showAlert={showAlert}
                    onClose={() => setShowAlert(false)}
                    today={today}
                />

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
                                                            <CurrencyCard
                                                                key={`${date}-${currency}`}
                                                                date={date}
                                                                currency={currency}
                                                                currencyData={paginatedRates[date][currency]}
                                                                currencyNames={currencyNames}
                                                            />
                                                        ) : null
                                                    )}
                                                </div>
                                            ) : (
                                                <NoDataContent message="Brak informacji" />
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <PaginationControls
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    handlePageChange={handlePageChange}
                                    renderItemCount={renderItemCount}
                                    renderPaginationButtons={renderPaginationButtons}
                                />

                                <MissingDatesInfo missingDates={missingDates} />

                            </>
                        ) : (
                            <NoDataContent message="Nie znaleziono wyników z tego dnia, wybierz inną datę" />
                        )}
                    </div>
                )}
                <Footer/>
            </div>
        </div>
    );
};

export default ExchangeRatesView;
