import React from 'react';
import { formatDate } from './dateUtils';

const CurrencyTable = ({ date, exchangeRates, currency, currencyName }) => (
    <div className="col-md-4 mb-4">
        <div className="card currency-card p-0">
            <div className="card-body">
                <h5 className="card-title">{currency} ({currencyName})</h5>
                <table className="table table-bordered table-striped text-dark">
                    <tbody>
                        <tr>
                            <td>Data</td>
                            <td><strong>{formatDate(date)}</strong></td>
                        </tr>
                        <tr>
                            <td>Kurs NBP</td>
                            <td><strong>{exchangeRates?.averageRate != null ? `${exchangeRates.averageRate.toFixed(4)} PLN` : 'N/A PLN'}</strong></td>
                        </tr>
                        <tr>
                            <td>Kurs Kupna</td>
                            <td><strong>{exchangeRates?.buyRate != null ? `${exchangeRates.buyRate.toFixed(4)} PLN` : 'N/A PLN'}</strong></td>
                        </tr>
                        <tr>
                            <td>Kurs Sprzedaży</td>
                            <td><strong>{exchangeRates?.sellRate != null ? `${exchangeRates.sellRate.toFixed(4)} PLN` : 'N/A PLN'}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default CurrencyTable;
