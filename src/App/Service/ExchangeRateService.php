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
        InputValidator $validator,  // Zamiast "validator", używamy konkretnego InputValidator
        RateCalculatorFactory $rateCalculatorFactory
    ) {
        $this->httpClient = $httpClient;
        $this->validator = $validator;
        $this->rateCalculatorFactory = $rateCalculatorFactory;
    }

    public function getExchangeRates(string $startDate, string $endDate, array $currencies): array
    {
        // Walidacja danych wejściowych
        $errors = $this->validator->validate($startDate, $endDate, $currencies);

        if (!empty($errors)) {
            return ['errors' => $errors];
        }

        $results = [];

        foreach ($currencies as $currency) {
            try {
                $url = sprintf('%s/%s/%s/%s?format=json', self::API_URL, $currency, $startDate, $endDate);
                $response = $this->httpClient->request('GET', $url);

                if ($response->getStatusCode() === 200) {
                    $data = $response->toArray();

                    foreach ($data['rates'] as $rateData) {
                        $averageRate = $rateData['mid'];
                        $date = $rateData['effectiveDate'];

                        $rateCalculator = $this->rateCalculatorFactory->getCalculator($currency);
                        $rates = $rateCalculator->calculate($averageRate);

                        $results[$date][$currency] = array_merge(
                            ['currency' => $currency, 'averageRate' => $averageRate],
                            $rates
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
