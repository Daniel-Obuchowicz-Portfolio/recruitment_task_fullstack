<?php

namespace App\Controller;

use App\Service\ExchangeRateService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ExchangeRatesController extends AbstractController
{
    private $exchangeRateService;

    public function __construct(ExchangeRateService $exchangeRateService)
    {
        $this->exchangeRateService = $exchangeRateService;
    }

    /**
     * @Route("/api/exchange-rates/{startDate}/{endDate?}", methods={"GET"})
     */
    public function getRates(Request $request, string $startDate, ?string $endDate = null): JsonResponse
    {
        $supportedCurrencies = ['EUR', 'USD', 'CZK', 'IDR', 'BRL'];
        $endDate = $endDate ?? $startDate;

        // Walidacja daty
        if (!$this->isValidDate($startDate) || !$this->isValidDate($endDate)) {
            return new JsonResponse(['errors' => 'Invalid date format. Please use YYYY-MM-DD.'], 400);
        }

        // Walidacja waluty
        $currencies = $request->query->get('currencies', $supportedCurrencies);
        $currencies = is_array($currencies) ? $currencies : explode(',', $currencies);
        
        foreach ($currencies as $currency) {
            if (!in_array($currency, $supportedCurrencies)) {
                return new JsonResponse(['errors' => "Invalid currency code: {$currency}."], 400);
            }
        }

        $results = $this->exchangeRateService->getExchangeRates($startDate, $endDate, $currencies);

        return new JsonResponse($results);
    }

    private function isValidDate(string $date): bool
    {
        $format = 'Y-m-d';
        $d = \DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) === $date;
    }
}
