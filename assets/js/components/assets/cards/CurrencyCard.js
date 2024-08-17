import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../dateUtils';

// Mapowanie kodów walut na URL flag
const currencyFlags = {
    EUR: 'https://flagcdn.com/w80/eu.png',
    USD: 'https://flagcdn.com/w80/us.png',
    CZK: 'https://flagcdn.com/w80/cz.png',
    IDR: 'https://flagcdn.com/w80/id.png',
    BRL: 'https://flagcdn.com/w80/br.png',
};

const CurrencyCard = ({ date, currency, currencyData, currencyNames }) => {
    const renderTrendIcon = (trend) => {
        switch (trend) {
            case 'up':
                return <span style={{ color: 'green' }}> ▲</span>;
            case 'down':
                return <span style={{ color: 'red' }}> ▼</span>;
            case 'same':
                return <span style={{ color: 'gray' }}> ➔</span>;
            default:
                return null;
        }
    };

    return (
        <div className="col-md-4 mb-4" key={`${date}-${currency}`}>
            <div className="card currency-card p-0">
                <div className="card-body">
                    <h5 className="card-title">
                        <img
                            src={currencyFlags[currency]}
                            alt={`${currencyNames[currency]} flag`}
                            className="mr-2"
                            style={{ width: '32px', height: '20px' }}
                        />
                        {currency} ({currencyNames[currency]})
                    </h5>
                    <table className="table table-bordered table-striped text-dark">
                        <tbody>
                            <tr>
                                <td>Data</td>
                                <td><strong>{formatDate(date)}</strong></td>
                            </tr>
                            <tr>
                                <td>Kurs NBP</td>
                                <td>
                                    <strong>
                                        {currencyData?.averageRate != null ? `${currencyData.averageRate.toFixed(4)} PLN` : '-'}
                                        {renderTrendIcon(currencyData?.trend)}
                                    </strong>
                                </td>
                            </tr>
                            <tr>
                                <td>Kurs Kupna</td>
                                <td>
                                    <strong>
                                        {currencyData?.buyRate != null ? `${currencyData.buyRate.toFixed(4)} PLN` : '-'}
                                        {currencyData?.buyRate != null ? renderTrendIcon(currencyData?.trend) : ''}
                                    </strong>
                                </td>
                            </tr>
                            <tr>
                                <td>Kurs Sprzedaży</td>
                                <td>
                                    <strong>
                                        {currencyData?.sellRate != null ? `${currencyData.sellRate.toFixed(4)} PLN` : '-'}
                                        {renderTrendIcon(currencyData?.trend)}
                                    </strong>
                                </td>
                            </tr>
                            <tr>
                                <td>Kurs Dnia Dzisiejszego</td>
                                <td>
                                    <strong>{currencyData?.todayRate != null ? `${currencyData.todayRate.toFixed(4)} PLN` : 'N/A PLN'}</strong>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

CurrencyCard.propTypes = {
    date: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    currencyData: PropTypes.shape({
        averageRate: PropTypes.number,
        buyRate: PropTypes.number,
        sellRate: PropTypes.number,
        todayRate: PropTypes.number,
        trend: PropTypes.string,
        buyRateTrend: PropTypes.string,
        sellRateTrend: PropTypes.string,
    }),
    currencyNames: PropTypes.object.isRequired,
};

export default CurrencyCard;
