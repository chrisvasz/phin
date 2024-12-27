// @ts-ignore
import { expect, test, describe } from 'bun:test'
import scan from '../scanner'
import parse from '../parser'
import { PhpPrinter } from './print'

function print(src: string) {
  let result = new PhpPrinter().print(parse(scan(src)))
  return result.trim()
}

test('print Movie solution', () => {
  let source = `
var REGULAR = 0;
var NEW_RELEASE = 1;
var CHILDRENS = 2;

class Movie(title: string, priceCode: int) {
  fun getPriceCode(): int => priceCode;
  fun getTitle(): string => title;
}

class Rental(movie: Movie, daysRented: int) {
  fun getDaysRented(): int => daysRented;
  fun getMovie(): Movie => movie;
}

class Customer(name: string) {
  private var rentals: array = [];

  fun addRental(rental: Rental) => array_push(rentals, rental);
  fun getName(): string => name;

  public fun statement(): string {
    var totalAmount = 0;
    var frequentRenterPoints = 0;
    var result = "Rental Record for " +. name +. ":";

    // determine amounts for each line
    foreach (rentals as rental) {
      var thisAmount = 0;
      if (rental.getMovie().getPriceCode() == REGULAR) {
        thisAmount += 2;
        if (rental.getDaysRented() > 2) {
          thisAmount += (rental.getDaysRented() - 2) * 1.5;
        }
      } else if (rental.getMovie().getPriceCode() == NEW_RELEASE) {
        thisAmount += rental.getDaysRented() * 3;
      } else if (rental.getMovie().getPriceCode() == CHILDRENS) {
        thisAmount += 1.5;
        if (rental.getDaysRented() > 3) {
          thisAmount += (rental.getDaysRented() - 3) * 1.5;
        }
      }

      // add frequent renter points
      frequentRenterPoints++;

      // add bonus for a two day new release rental
      if ((rental.getMovie().getPriceCode() == NEW_RELEASE) &&
          rental.getDaysRented() > 1) frequentRenterPoints++;

      // show figures for this rental
      result +.= rental.getMovie().getTitle() +. " " +. thisAmount +. " ";
      totalAmount += thisAmount;
    }

    // add footer lines
    result +.= "Amount owed is " +. totalAmount +. ". ";
    result +.= "You earned " +. frequentRenterPoints +.  " frequent renter points";

    return result;
  }
}

var prognosisNegative = new Movie("Prognosis Negative", NEW_RELEASE);
var sackLunch = new Movie("Sack Lunch", CHILDRENS);
var painAndYearning = new Movie("The Pain and the Yearning", REGULAR);

var customer = new Customer("Susan Ross");
customer.addRental(new Rental(prognosisNegative, 3));
customer.addRental(new Rental(painAndYearning, 1));
customer.addRental(new Rental(sackLunch, 1));

echo customer.statement();
  `.trim()
  let expected = `
$REGULAR = 0;
$NEW_RELEASE = 1;
$CHILDRENS = 2;
class Movie {
  public function __construct(private readonly $title, private readonly $priceCode) {}
  function getPriceCode(): int {
    return $this->priceCode;
  }
  function getTitle(): string {
    return $this->title;
  }
}
class Rental {
  public function __construct(private readonly $movie, private readonly $daysRented) {}
  function getDaysRented(): int {
    return $this->daysRented;
  }
  function getMovie(): Movie {
    return $this->movie;
  }
}
class Customer {
  public function __construct(private readonly $name) {}
  private array $rentals = [];
  function addRental(Rental $rental) {
    return array_push($this->rentals, $rental);
  }
  function getName(): string {
    return $this->name;
  }
  function statement(): string {
    $totalAmount = 0;
    $frequentRenterPoints = 0;
    $result = "Rental Record for " . $this->name . ":";
    foreach ($this->rentals as $rental) {
      $thisAmount = 0;
      if ($rental->getMovie()->getPriceCode() == $REGULAR) {
        $thisAmount += 2;
        if ($rental->getDaysRented() > 2) {
          $thisAmount += ($rental->getDaysRented() - 2) * 1.5;
        }
      } else if ($rental->getMovie()->getPriceCode() == $NEW_RELEASE) {
        $thisAmount += $rental->getDaysRented() * 3;
      } else if ($rental->getMovie()->getPriceCode() == $CHILDRENS) {
        $thisAmount += 1.5;
        if ($rental->getDaysRented() > 3) {
          $thisAmount += ($rental->getDaysRented() - 3) * 1.5;
        }
      }
      $frequentRenterPoints++;
      if (($rental->getMovie()->getPriceCode() == $NEW_RELEASE) && $rental->getDaysRented() > 1) $frequentRenterPoints++;
      $result .= $rental->getMovie()->getTitle() . " " . $thisAmount . " ";
      $totalAmount += $thisAmount;
    }
    $result .= "Amount owed is " . $totalAmount . ". ";
    $result .= "You earned " . $frequentRenterPoints . " frequent renter points";
    return $result;
  }
}
$prognosisNegative = new Movie("Prognosis Negative", $NEW_RELEASE);
$sackLunch = new Movie("Sack Lunch", $CHILDRENS);
$painAndYearning = new Movie("The Pain and the Yearning", $REGULAR);
$customer = new Customer("Susan Ross");
$customer->addRental(new Rental($prognosisNegative, 3));
$customer->addRental(new Rental($painAndYearning, 1));
$customer->addRental(new Rental($sackLunch, 1));
echo $customer->statement();
  `.trim()
  expect(print(source)).toEqual(expected)
})
