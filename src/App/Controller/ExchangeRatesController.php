<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\ExchangeRateService;

class ExchangeRatesController extends AbstractController
{
    private $exchangeRateService;

    public function __construct(ExchangeRateService $exchangeRateService)
    {
        $this->exchangeRateService = $exchangeRateService;
    }

    /**
     * @Route("/api/exchange-rates/{startDate}/{endDate?}", name="exchange_rates", methods={"GET"})
     */
    public function getRates(Request $request, string $startDate, ?string $endDate = null): JsonResponse
    {
        $supportedCurrencies = ['EUR', 'USD', 'CZK', 'IDR', 'BRL'];
        $endDate = $endDate ?? $startDate;

        $results = $this->exchangeRateService->getExchangeRates($startDate, $endDate, $supportedCurrencies);

        return new JsonResponse($results);
    }
}
