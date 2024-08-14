<?php

namespace App\Repository;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class ExchangeRateRepository
{
    private const API_URL = 'https://api.nbp.pl/api/exchangerates/rates/A';
    
    // Usuń typowanie w deklaracji właściwości, aby było zgodne z PHP 7.2.5
    private $httpClient;

    // Konstruktor z typowaniem parametru, co jest obsługiwane w PHP 7.2.5
    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function getExchangeRates(string $startDate, string $endDate, array $currencies): array
    {
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

                        $buyRate = null;
                        $sellRate = $averageRate + 0.15;

                        if (in_array($currency, ['EUR', 'USD'])) {
                            $buyRate = $averageRate - 0.05;
                            $sellRate = $averageRate + 0.07;
                        }

                        $results[$date][$currency] = [
                            'currency' => $currency,
                            'averageRate' => $averageRate,
                            'buyRate' => $buyRate,
                            'sellRate' => $sellRate,
                        ];
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
