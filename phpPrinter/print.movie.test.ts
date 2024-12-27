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

var prognosisNegative = new Movie("Prognosis Negative", NEW_RELEASE);
var sackLunch = new Movie("Sack Lunch", CHILDRENS);
var painAndYearning = new Movie("The Pain and the Yearning", REGULAR);
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
$prognosisNegative = new Movie("Prognosis Negative", $NEW_RELEASE);
$sackLunch = new Movie("Sack Lunch", $CHILDRENS);
$painAndYearning = new Movie("The Pain and the Yearning", $REGULAR);
  `.trim()
  expect(print(source)).toEqual(expected)
})
