<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ExchangeRatesControllerTest extends WebTestCase
{
    public function testGetRatesWithValidData()
    {
        $client = static::createClient();
        $client->request('GET', '/api/exchange-rates/2024-08-01/2024-08-07');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $responseContent = $client->getResponse()->getContent();
        $data = json_decode($responseContent, true);

        $this->assertIsArray($data);
        $this->assertArrayHasKey('2024-08-01', $data);
        $this->assertArrayHasKey('EUR', $data['2024-08-01']);
    }

    public function testGetRatesWithInvalidStartDate()
    {
        $client = static::createClient();
        $client->request('GET', '/api/exchange-rates/invalid-date/2024-08-07');

        $this->assertEquals(400, $client->getResponse()->getStatusCode());

        $responseContent = $client->getResponse()->getContent();
        $data = json_decode($responseContent, true);

        $this->assertIsArray($data);
        $this->assertArrayHasKey('errors', $data);
        $this->assertStringContainsString('Invalid date format', $data['errors']);  // Zaktualizowany test
    }


    public function testGetRatesWithInvalidEndDate()
    {
        $client = static::createClient();
        $client->request('GET', '/api/exchange-rates/2024-08-01/invalid-date');

        $this->assertEquals(400, $client->getResponse()->getStatusCode());

        $responseContent = $client->getResponse()->getContent();
        $data = json_decode($responseContent, true);

        $this->assertIsArray($data);
        $this->assertArrayHasKey('errors', $data);
        $this->assertStringContainsString('Invalid date format', $data['errors']);  // Zaktualizowany test
    }


    public function testGetRatesWithInvalidCurrency()
    {
        $client = static::createClient();
        $client->request('GET', '/api/exchange-rates/2024-08-01/2024-08-07?currencies=XYZ');
    
        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    
        $responseContent = $client->getResponse()->getContent();
        $data = json_decode($responseContent, true);
    
        $this->assertIsArray($data);
        $this->assertArrayHasKey('errors', $data);
        $this->assertStringContainsString('Invalid currency code: XYZ', $data['errors']);  // Użycie assertStringContainsString zamiast assertContains
    }
    

    public function testGetRatesWithValidDateAndCurrency()
    {
        $client = static::createClient();
        $client->request('GET', '/api/exchange-rates/2024-08-01/2024-08-07?currencies=EUR,USD');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $responseContent = $client->getResponse()->getContent();
        $data = json_decode($responseContent, true);

        $this->assertIsArray($data);
        $this->assertArrayHasKey('2024-08-01', $data);
        $this->assertArrayHasKey('EUR', $data['2024-08-01']);
        $this->assertArrayHasKey('USD', $data['2024-08-01']);
    }
}
