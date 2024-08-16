<?php

namespace App\Service;

interface RateCalculatorInterface
{
    public function calculate(float $averageRate): array;
}
