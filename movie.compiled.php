<?php
class Movie {
  function __construct(public readonly string $title, int $priceCode) {
    $this->price = match ($priceCode) {
      self::REGULAR => new Regular(),
      self::NEW_RELEASE => new NewRelease(),
      self::CHILDRENS => new Childrens(),
};
  }
  const REGULAR = 0;
  const NEW_RELEASE = 1;
  const CHILDRENS = 2;
  public $price;
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
    return $daysRented > 1 ? 2 : 1;
  }
}
class Rental {
  function __construct(private readonly Movie $movie, private readonly int $daysRented) {
    $this->title = $movie->title;
  }
  public $title;
  function points(): int {
    return $this->movie->price->points($this->daysRented);
  }
  function amount(): float {
    return $this->movie->price->amount($this->daysRented);
  }
}
class Rentals {
  function __construct(private readonly array $rentals) {}
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
  function __construct(private readonly string $name, private readonly Rentals $rentals) {}
  function statement(): string {
    $result = "Rental Record for " . $this->name . ":";
    foreach ($this->rentals->getRentals() as $rental) {
      $result .= $rental->title . " " . $rental->amount() . " ";
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