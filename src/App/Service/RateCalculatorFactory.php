<?php

namespace App\Service;

class RateCalculatorFactory
{
    private $defaultRateCalculator;
    private $eurUsdRateCalculator;

    public function __construct(
        DefaultRateCalculator $defaultRateCalculator,
        EurUsdRateCalculator $eurUsdRateCalculator
    ) {
        $this->defaultRateCalculator = $defaultRateCalculator;
        $this->eurUsdRateCalculator = $eurUsdRateCalculator;
    }

    public function getCalculator(string $currency): RateCalculatorInterface
    {
        if (in_array($currency, ['EUR', 'USD'])) {
            return $this->eurUsdRateCalculator;
        }

        return $this->defaultRateCalculator;
    }
}
