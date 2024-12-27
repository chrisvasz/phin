<?php
class Movie {
  public function __construct(private readonly string $title, private readonly int $priceCode) {}
  const REGULAR = 0;
  const NEW_RELEASE = 1;
  const CHILDRENS = 2;
  function getPriceCode(): int {
    return $this->priceCode;
  }
  function getTitle(): string {
    return $this->title;
  }
  function price(): Price {
    if ($this->priceCode == Movie::REGULAR) return new Regular();
    if ($this->priceCode == Movie::NEW_RELEASE) return new NewRelease();
    if ($this->priceCode == Movie::CHILDRENS) return new Childrens();
    return new Regular();
  }
}
class Price {
  function points(int $daysRented): int {
    return 1;
  }
}
class Regular extends Price {
  function amount(int $daysRented): float {
    $result = 2;
    if ($daysRented > 2) {
      $result += ($daysRented - 2) * 1.5;
    }
    return $result;
  }
}
class Childrens extends Price {
  function amount(int $daysRented): float {
    $result = 1.5;
    if ($daysRented > 3) {
      $result += ($daysRented - 3) * 1.5;
    }
    return $result;
  }
}
class NewRelease extends Price {
  function amount(int $daysRented): float {
    return $daysRented * 3;
  }
  function points(int $daysRented): int {
    if ($daysRented > 1) return 2;
    return 1;
  }
}
class Rental {
  public function __construct(private readonly Movie $movie, private readonly int $daysRented) {}
  function getMovie(): Movie {
    return $this->movie;
  }
  function points(): int {
    return $this->movie->price()->points($this->daysRented);
  }
  function amount(): float {
    return $this->movie->price()->amount($this->daysRented);
  }
}
class Rentals {
  public function __construct(private readonly array $rentals) {}
  function getRentals(): array {
    return $this->rentals;
  }
  function totalPoints(): int {
    $result = 0;
    foreach ($this->rentals as $rental) {
      $result += $rental->points();
    }
    return $result;
  }
  function totalAmount(): float {
    $result = 0;
    foreach ($this->rentals as $rental) {
      $result += $rental->amount();
    }
    return $result;
  }
}
class Customer {
  public function __construct(private readonly string $name, private readonly Rentals $rentals) {}
  function statement(): string {
    $result = "Rental Record for " . $this->name . ":";
    foreach ($this->rentals->getRentals() as $rental) {
      $result .= $rental->getMovie()->getTitle() . " " . $rental->amount() . " ";
    }
    $result .= "Amount owed is " . $this->rentals->totalAmount() . ". ";
    $result .= "You earned " . $this->rentals->totalPoints() . " frequent renter points";
    return $result;
  }
}
$prognosisNegative = new Movie("Prognosis Negative", Movie::NEW_RELEASE);
$sackLunch = new Movie("Sack Lunch", Movie::CHILDRENS);
$painAndYearning = new Movie("The Pain and the Yearning", Movie::REGULAR);
$rentals = new Rentals(array(new Rental($prognosisNegative, 3), new Rental($painAndYearning, 1), new Rental($sackLunch, 1)));
$customer = new Customer("Susan Ross", $rentals);
echo $customer->statement();