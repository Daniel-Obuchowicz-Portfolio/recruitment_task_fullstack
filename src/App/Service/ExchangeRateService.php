<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class ExchangeRateService
{
    private const API_URL = 'https://api.nbp.pl/api/exchangerates/rates/A';
    private $httpClient;
    private $validator;
    private $rateCalculatorFactory;

    public function __construct(
        HttpClientInterface $httpClient,
        InputValidator $validator,
        RateCalculatorFactory $rateCalculatorFactory
    ) {
        $this->httpClient = $httpClient;
        $this->validator = $validator;
        $this->rateCalculatorFactory = $rateCalculatorFactory;
    }

    public function getExchangeRates(string $startDate, string $endDate, array $currencies): array
    {
        // Validate input
        $errors = $this->validator->validate($startDate, $endDate, $currencies);

        if (!empty($errors)) {
            // Jeśli są błędy, zwracamy je
            return ['errors' => $errors];
        }

        $results = [];
        $today = date('Y-m-d');

        foreach ($currencies as $currency) {
            try {
                // Fetch historical rates
                $url = sprintf('%s/%s/%s/%s?format=json', self::API_URL, $currency, $startDate, $endDate);
                $response = $this->httpClient->request('GET', $url);

                // Fetch today's rate
                $url_today = sprintf('%s/%s/%s?format=json', self::API_URL, $currency, $today);
                $response_today = $this->httpClient->request('GET', $url_today);
                $todayRateData = $response_today->getStatusCode() === 200 ? $response_today->toArray() : null;

                if ($response->getStatusCode() === 200) {
                    $data = $response->toArray();

                    foreach ($data['rates'] as $rateData) {
                        $averageRate = $rateData['mid'];
                        $date = $rateData['effectiveDate'];

                        // Calculate additional rates
                        $rateCalculator = $this->rateCalculatorFactory->getCalculator($currency);
                        $rates = $rateCalculator->calculate($averageRate);

                        // Determine trend based on today's rate
                        $todayAverageRate = $todayRateData['rates'][0]['mid'] ?? null;
                        $trend = null;

                        if ($todayAverageRate !== null) {
                            if ($todayAverageRate > $averageRate) {
                                $trend = 'up';
                            } elseif ($todayAverageRate < $averageRate) {
                                $trend = 'down';
                            } else {
                                $trend = 'same';
                            }
                        }

                        // Add data to results
                        $results[$date][$currency] = array_merge(
                            ['currency' => $currency, 'averageRate' => $averageRate],
                            $rates,
                            ['todayRate' => $todayAverageRate, 'trend' => $trend]
                        );
                    }
                } else {
                    throw new \Exception("Error fetching data for {$currency} between {$startDate} and {$endDate}");
                }
            } catch (\Exception $e) {
                $results[$startDate][$currency] = [
                    'currency' => $currency,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return $results;
    }
}
