import axios from 'axios';

const apiUrl = `${window.location.origin}/api/exchange-rates`;

export const getExchangeRates = async (start, end) => {
    try {
        const response = await axios.get(`${apiUrl}/${start}/${end}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        throw error;
    }
};
