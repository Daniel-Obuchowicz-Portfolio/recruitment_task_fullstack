<?php

namespace App\Service;

class EurUsdRateCalculator implements RateCalculatorInterface
{
    public function calculate(float $averageRate): array
    {
        return [
            'buyRate' => $averageRate - 0.05,
            'sellRate' => $averageRate + 0.07,
        ];
    }
}
