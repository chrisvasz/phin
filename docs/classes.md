# Classes

Phlank borrows heavily from Scala and Kotlin for class syntax.

## Properties

Class properties are declared using the same `var` syntax as regular variables.

Type annotations are optional, and as always, support the full suite of phpstan types. PHP modifiers can also be provided (`final`, `readonly`, `static`, and the visibility modifiers &ndash; `public`, `private` and `protected`). As in PHP, visibility of any class member is `public` by default.

In PHP, class property initializers can only be "compile-time-constant expressions". Phlank supports any property initializer expression by compiling complex expressions into the class constructor.

```kotlin
class User {
  var name: string = functionCall()
}
```

```php
class User {
  public string $name;
  function __construct() {
    $this->name = functionCall();
  }
}
```

## Constructors

Phlank borrows constructor syntax from languages like Scala and Kotlin. Class properties can be declared directly in the constructor using the same `var` syntax as in the class body.

```kotlin
class User(
  id: int,
  var name: string,
  private var emails: array<string>,
) {}
```

```php
class User {
  /**
   * @param array<string> $emails
   */
  function __construct(
    int $id,
    private string $name,
    private array $emails,
  ) {}
}
```

Visibility modifiers can be added to the class constructor by adding a visibility keyword after the class name. The constructor is public by default (same as PHP).

```kotlin
class Foo private() {}
```

```php
class Foo {
  private function __construct() {}
}
```

## Visibility syntactic sugar

Since adding `private` visibility is such a common use case, phlank provides a shortcut syntax. Anywhere visibility keywords can be used, the `+` and `-` characters represent `public` and `private` respectively. This syntactic shortcut is available on class constructors, constructor promoted properties, properties, methods, constants... anywhere the visibility keywords are valid. Here's an example with some private class properties declared in the constructor.

```kotlin
class User(-var first: string, -var last: string) {}
```

```php
class User {
  function __construct(
    private string $first,
    private string $last,
  ) {}
}
```

## Class methods

Class methods are declared using the same syntax as functions (including optional type annotations). As with functions, single-expression methods can be shortened using the `=>` syntax.

```kotlin
class Hello {
  fun world() => "world"
}
```

```php
class Hello {
  function world() {
    return "world";
  }
}
```

## Implicit `this` and `self` where possible

If an identifier inside a class method is not in the class method's scope, phlank checks whether the identifier is a member of the surrounding class, and if so, automatically adds `$this->`.

```kotlin
class User(-var first: string, -var last: string) {
  fun name() => "$first $last"
}
```

```php
class User {
  function __construct(
    private string $first,
    private string $last,
  ) {}
  function name() {
    return $this->first . " " . $this->last;
  }
}
```

This also works for class constants and `self::`.

```kotlin
class PaymentFactory {
  const CASH = 0
  const CREDIT = 1
  fun from(code: int) => match(code) {
    CASH => new Cash()
    CREDIT => new Credit()
    default => throw new DomainException("Unknown code $code")
  }
}
```

```php
class PaymentFactory {
  const CASH = 0;
  const CREDIT = 1;
  function from(int code) {
    return match(code) {
      self::CASH => new Cash(),
      self::CREDIT => new Credit(),
      default => throw new DomainException("Unknown code $code"),
    }
  }
}
```

Class members are accessed using `.` syntax.

```kotlin
class User(var name: string) {}
var user = new User()
echo user.name
```

```php
class User {
  function __construct(public string $name) {}
}
$user = new User();
echo $user->name;
```

## Inheritance

Inheritance works the same way as PHP. If you need to supply parameters to the superclass constructor, here's an example:

```kotlin
class UuidIdentity(id: string) extends StringIdentity(id) {}
```

```php
class UuidIdentity extends StringIdentity {
  function __construct(string $id) {
    super($id);
  }
}
```

## Interfaces

Interfaces work the same way as PHP.

```kotlin
interface PersonRepository {
  fun getPerson(id: int): Person
}
class PdoPersonRepository implements PersonRepository {}
```

```php
interface PersonRepository {
  function getPerson(int $id): Person;
}
class PdoPersonRepository implements PersonRepository {}
```

TODO full generic support ^^

#### Collection classes

Kotlin and Scala provide excellent tools for custom collection classes. Unfortunately, constrained by PHP's semantics, phlank can only go so far. Phlank provides a few syntactic shortcuts to make collections easier to manage. The first is the `iterates` clause on a class declaration, which automatically makes a class iterable via language constructs like `foreach`. The second is a new operator `#` that improves the ergonomics of functional-style data pipelines against arrays.

```kotlin
class Rentals(-rentals: array<Rental>) iterates rentals {
  fun total(): float => rentals
    #map(fun(r: Rental) => r.amount())
    #sum()
}
var rentals = new Rentals([])
foreach (rentals as rental) {} // works
```

```php
/**
 * @implements IteratorAggregate<Rental>
 */
class Rentals implements IteratorAggregate {
  /**
   * @param array<Rental> $rentals
   */
  function __construct(private readonly array $rentals) {}
  function getIterator(): Traversable {
    return new ArrayIterator($this->rentals);
  }
  function total(): float {
    return array_sum(
      array_map(function (Rental $rental) {
        return $rental->amount();
      }, $this->rentals)
    );
  }
}
$rentals = new Rentals([]);
foreach ($rentals as $rental) {}
```

In this example, `#map` refers to PHP's global `array_map` function. Phlank has special knowledge of each of PHP's `array_*` global functions (and their inconsistent parameter ordering) and uses the `#` operator to transform data pipelines into the equivalent nested calls. `#` accepts any of the global `array_*` functions, and the `array_` prefix is optional.
