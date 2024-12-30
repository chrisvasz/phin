<?php

class Controller
{
    function __invoke()
    {
        $prognosisNegative = new Movie("Prognosis Negative", Movie::NEW_RELEASE);
        $sackLunch = new Movie("Sack Lunch", Movie::CHILDRENS);
        $painAndYearning = new Movie("The Pain and the Yearning", Movie::REGULAR);

        $customer = new Customer("Susan Ross");
        $customer->addRental(
            new Rental($prognosisNegative, 3)
        );
        $customer->addRental(
            new Rental($painAndYearning, 1)
        );
        $customer->addRental(
            new Rental($sackLunch, 1)
        );

        $statement = $customer->statement();

        echo $statement;
    }
}
