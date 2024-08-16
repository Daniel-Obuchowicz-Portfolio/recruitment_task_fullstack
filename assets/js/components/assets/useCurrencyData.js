import { useState, useEffect } from 'react';
import { getExchangeRates } from './CurrencyService';
import { getAllDatesInRange } from './dateUtils';

export const useCurrencyData = (startDate, endDate, supportedCurrencies) => {
    const [exchangeRates, setExchangeRates] = useState({});
    const [resultCount, setResultCount] = useState(0);
    const [missingDates, setMissingDates] = useState([]);
    const [fetchedData, setFetchedData] = useState(false);

    useEffect(() => {
        if (startDate && endDate) {
            fetchExchangeRates(startDate, endDate);
        }
    }, [startDate, endDate]);

    const fetchExchangeRates = async (start, end) => {
        try {
            const data = await getExchangeRates(start, end);
            const validResults = {};
            const missing = [];
            let count = 0;

            const allDates = getAllDatesInRange(start, end);

            allDates.forEach((date) => {
                const dayData = data[date] || {};
                validResults[date] = {};

                supportedCurrencies.forEach((currency) => {
                    const currencyData = dayData[currency];
                    if (currencyData?.averageRate != null || currencyData?.buyRate != null || currencyData?.sellRate != null) {
                        validResults[date][currency] = currencyData;
                        count++;
                    }
                });

                if (Object.keys(validResults[date]).length === 0) {
                    missing.push(date);
                }
            });

            setExchangeRates(validResults);
            setResultCount(count);
            setMissingDates(missing);
            setFetchedData(true);
        } catch (error) {
            setExchangeRates({});
            setResultCount(0);
            setMissingDates([]);
            setFetchedData(true);
        }
    };

    return { exchangeRates, resultCount, missingDates, fetchedData };
};
