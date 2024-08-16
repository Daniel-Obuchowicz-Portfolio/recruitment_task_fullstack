<?php

namespace App\Service;

class DefaultRateCalculator implements RateCalculatorInterface
{
    public function calculate(float $averageRate): array
    {
        return [
            'buyRate' => null,
            'sellRate' => $averageRate + 0.15,
        ];
    }
}
