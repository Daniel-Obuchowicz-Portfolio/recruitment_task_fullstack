<?php

namespace App\Tests\Service;

use App\Service\DefaultRateCalculator;
use App\Service\EurUsdRateCalculator;
use App\Service\ExchangeRateService;
use App\Service\InputValidator;
use App\Service\RateCalculatorFactory;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpClient\MockHttpClient;
use Symfony\Component\HttpClient\Response\MockResponse;

class ExchangeRateServiceTest extends TestCase
{
    private $httpClient;
    private $validator;
    private $rateCalculatorFactory;
    private $exchangeRateService;

    protected function setUp(): void
    {
        $this->validator = new InputValidator();
        $defaultRateCalculator = new DefaultRateCalculator();
        $eurUsdRateCalculator = new EurUsdRateCalculator();
        $this->rateCalculatorFactory = new RateCalculatorFactory(
            $defaultRateCalculator,
            $eurUsdRateCalculator
        );

        $this->httpClient = new MockHttpClient();

        $this->exchangeRateService = new ExchangeRateService(
            $this->httpClient,
            $this->validator,
            $this->rateCalculatorFactory
        );
    }

    public function testGetExchangeRatesWithValidData()
    {
        $startDate = '2024-08-01';
        $endDate = '2024-08-07';
        $currencies = ['EUR', 'USD'];

        $responses = [
            new MockResponse(json_encode(['rates' => [['mid' => 4.23, 'effectiveDate' => '2024-08-01']]])), // Historical rate
            new MockResponse(json_encode(['rates' => [['mid' => 4.25, 'effectiveDate' => '2024-08-16']]])), // Today's rate
        ];
        $this->httpClient = new MockHttpClient($responses);

        $this->exchangeRateService = new ExchangeRateService(
            $this->httpClient,
            $this->validator,
            $this->rateCalculatorFactory
        );

        $result = $this->exchangeRateService->getExchangeRates($startDate, $endDate, $currencies);

        $this->assertArrayHasKey('2024-08-01', $result);
        $this->assertArrayHasKey('EUR', $result['2024-08-01']);
        $this->assertEqualsWithDelta(4.23, $result['2024-08-01']['EUR']['averageRate'], 0.0001);
        $this->assertEqualsWithDelta(4.18, $result['2024-08-01']['EUR']['buyRate'], 0.0001);
        $this->assertEqualsWithDelta(4.30, $result['2024-08-01']['EUR']['sellRate'], 0.0001);
        $this->assertEqualsWithDelta(4.25, $result['2024-08-01']['EUR']['todayRate'], 0.0001);
        $this->assertSame('up', $result['2024-08-01']['EUR']['trend']);
    }

    public function testGetExchangeRatesWithInvalidDates()
    {
        $startDate = 'invalid-date';
        $endDate = '2024-08-07';
        $currencies = ['EUR', 'USD'];
    
        // Wywołanie metody serwisu
        $result = $this->exchangeRateService->getExchangeRates($startDate, $endDate, $currencies);
    
        // Assercje
        $this->assertArrayHasKey('errors', $result);
        $this->assertStringContainsString('Invalid start date', $result['errors'][0]);
    }
    

    public function testGetExchangeRatesWithMultipleCurrencies() {
    $startDate = '2024-08-01';
    $endDate = '2024-08-07';
    $currencies = ['EUR', 'USD'];

    // Mockowanie odpowiedzi HTTP dla historycznych danych
    $responses = [
        new MockResponse(json_encode(['rates' => [['mid' => 4.23, 'effectiveDate' => '2024-08-01']]])),
        new MockResponse(json_encode(['rates' => [['mid' => 4.23, 'effectiveDate' => '2024-08-07']]])),
    ];
    $this->httpClient = new MockHttpClient($responses);

    // Tworzenie instancji serwisu z nowym MockHttpClient
    $this->exchangeRateService = new ExchangeRateService(
        $this->httpClient,
        $this->validator,
        $this->rateCalculatorFactory
    );

    // Wywołanie metody serwisu
    $result = $this->exchangeRateService->getExchangeRates($startDate, $endDate, $currencies);

    // Assercje
    $this->assertArrayHasKey('2024-08-01', $result);
    $this->assertArrayHasKey('EUR', $result['2024-08-01']);
    $this->assertEqualsWithDelta(4.23, $result['2024-08-01']['EUR']['averageRate'], 0.01);
    $this->assertEqualsWithDelta(4.18, $result['2024-08-01']['EUR']['buyRate'], 0.01);
    $this->assertEqualsWithDelta(4.30, $result['2024-08-01']['EUR']['sellRate'], 0.01);
    $this->assertEqualsWithDelta(4.23, $result['2024-08-01']['EUR']['todayRate'], 0.01);
    $this->assertSame('same', $result['2024-08-01']['EUR']['trend']);
}


    public function testGetExchangeRatesWithNoData()
    {
        $startDate = '2024-08-01';
        $endDate = '2024-08-07';
        $currencies = ['EUR'];

        $responses = [
            new MockResponse(json_encode(['rates' => []])), // No rates returned
            new MockResponse(json_encode(['rates' => [['mid' => 4.25, 'effectiveDate' => '2024-08-16']]])), // Today's rate
        ];
        $this->httpClient = new MockHttpClient($responses);

        $this->exchangeRateService = new ExchangeRateService(
            $this->httpClient,
            $this->validator,
            $this->rateCalculatorFactory
        );

        $result = $this->exchangeRateService->getExchangeRates($startDate, $endDate, $currencies);

        $this->assertEmpty($result);  // No data should be returned
    }
    
}
