<?php

namespace App\Service;

class InputValidator
{
    public function validate(string $startDate, string $endDate, array $currencies): array
    {
        $errors = [];

        // Validate dates
        if (!$this->isValidDate($startDate)) {
            $errors[] = "Invalid start date: {$startDate}. It must be in YYYY-MM-DD format.";
        }

        if (!$this->isValidDate($endDate)) {
            $errors[] = "Invalid end date: {$endDate}. It must be in YYYY-MM-DD format.";
        }

        // Validate currencies
        foreach ($currencies as $currency) {
            if (!$this->isValidCurrency($currency)) {
                $errors[] = "Invalid currency code: {$currency}. It must be a three-letter ISO code.";
            }
        }

        return $errors;
    }

    private function isValidDate(string $date): bool
    {
        // Check if date matches the YYYY-MM-DD format
        $format = 'Y-m-d';
        $d = \DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) === $date;
    }

    private function isValidCurrency(string $currency): bool
    {
        // Check if currency is a three-letter uppercase string
        return preg_match('/^[A-Z]{3}$/', $currency) === 1;
    }
}
