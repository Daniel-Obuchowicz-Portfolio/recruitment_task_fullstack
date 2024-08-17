import { useState, useEffect, useRef } from 'react';
import { getExchangeRates } from './CurrencyService';
import { getAllDatesInRange } from './dateUtils';

export const useCurrencyData = (startDate, endDate, supportedCurrencies) => {
    const [exchangeRates, setExchangeRates] = useState({});
    const [resultCount, setResultCount] = useState(0);
    const [missingDates, setMissingDates] = useState([]);
    const [fetchedData, setFetchedData] = useState(false);

    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true; // Set isMounted to true when the component is mounted

        if (startDate && endDate) {
            fetchExchangeRates(startDate, endDate);
        }

        return () => {
            isMounted.current = false; // Cleanup function to set isMounted to false when component is unmounted
        };
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

            if (isMounted.current) {
                setExchangeRates(validResults);
                setResultCount(count);
                setMissingDates(missing);
                setFetchedData(true);
            }
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
            if (isMounted.current) {
                setExchangeRates({});
                setResultCount(0);
                setMissingDates([]);
                setFetchedData(true);
            }
        }
    };

    return { exchangeRates, resultCount, missingDates, fetchedData };
};
