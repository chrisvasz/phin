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
  fun statement(): string => "hello world";
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
    return "hello world";
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
  console.log(print(source))
  expect(print(source)).toEqual(expected)
})
