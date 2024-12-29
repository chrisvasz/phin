# Phlank

> PHP from a different angle

Phlank is a compile-to-PHP language that attempts to bridge the gap between PHP's lasting influence and the comforts of modern language syntax. TODO improve that

## Why?

PHP is a serious language, used to solve serious problems by serious businesses. Its "shared nothing architecture" enables a programming model where each request is completely decoupled from others TODO

Unfortunately, from a language design standpoint, PHP is... a bit of a mess. Both PHP's syntax and semantics are sprawling, inconsistent, and complex, and growing moreso with each new version. PHP 8.4 just introduced [property hooks](https://www.php.net/releases/8.4/en.php#property_hooks) with entirely new syntax and semantics with [unintuitive edge cases](https://x.com/OndrejMirtes/status/1866781874686775533) and [serious footguns](https://x.com/OndrejMirtes/status/1869383658316210251) &ndash; so much so that the creator of phpstan insists static analysis is basically mandatory if you want to use property hooks correctly (particularly setters). Here are some more examples of common frustrations with the state of affairs in PHP:

- function expressions require the programmer to declare closed-over scope variables in a `use` statement, yet single-line arrow functions (which use a different syntax) do not. Function expressions use yet a third syntax for calling `$` <-- TODO
- declaring types - : for return types, but not others, variables can't have type declarations at all
- class properties can only be initialized inline with _compile-time-constant_ expressions &ndash; Any dynamic expression requires a constructor
- third-party static typing systems like phpstan require `@var`-style commenting to cover common cases like generic collections and globals
- data pipelines using functional patterns like map, filter, and reduce are way cumbersome to express in PHP than other modern languages
- string interpolation in PHP does not support embedded expressions

Modern languages like Scala fuse OO and functional paradigms with concise, clean, expressive syntax that is a joy to write and read. What if we brought that syntax to PHP without changing any of PHP's semantics?

## Code samples

```
// a class with two public readonly properties
class Movie(+title: string, +price: Price) {}
```

## Documentation

### Variables

In phlank, variables are declared using the `var` keyword. The type annotation and initializer are optional.

```kotlin
var name = "hello"

// compiles to:
$name = "hello";
```

If a type annotation is supplied, then phlank will generate the appropriate `@var` comment for static analysis tools like phpstan. As always, the full suite of phpstan types is available in type annotations.

```kotlin
var names: array<string> = ['Chris']
```

```php
/** @var array<string> $names */
$names = ['Chris'];
```

Phlank improves PHP's _syntax_ without changing its _semantics_, so phlank variables have the same scoping rules as PHP variables. Variables can be redeclared &ndash; useful especially if their type changes midway through execution.

```kotlin
var id: int = 4;
var id: string = '4';
```

```php
/** @var int $id */
$id = 4;
/** @var string $id */
$id = '4';
```

phlank omits the mandatory `$` at the front of every PHP variable. In phlank, as in many other C-family languages, the only valid "identifier" characters are alphanumeric and \_.

This creates a compiling challenge however. Given code like this, how does phlank know whether `a` refers to a function or a variable?

```php
a()
```

```php
a();  // if `a` is a function in scope
$a(); // if `a` is a variable in scope
```

To solve this problem, phlank tracks all identifier declarations and categorizes them as variables, functions, classes, class properties, etc. This means all identifiers must be declared before they can be used, or the compiler will throw an "Undefined identifier" error. Phlank is aware of common PHP globals like `array_map` or `DomainException`, but all other identifiers must be declared in some way:

- `use` statement at the top of the file
- `var` or `global` declaration
- TODO more examples

### Functions

Functions are declared with the `fun` keyword:

```kotlin
fun hello(name) {
  return "hello $name";
}
```

Type annotations can be specified for parameters and the function's return type. As always, the full suite of phpstan types are available in type annotations. If a type annotation can be expressed in phpstan, but not php, the appropriate comment will be added automatically, and the "simplified" type that _is_ expressible in PHP will be used in the code.

```kotlin
fun hello(names: array<string>): array<string> {
  return ["hello", ...names];
}
```

```php
/**
 * @param array<string> $name
 * @return array<string>
 */
function hello(array $name): array {
  return ["hello", ...$names];
}
```

If the function body is a single expression, the function can be written using shorthand syntax.

```kotlin
fun add(a, b) => a + b
```

```php
function add($a, $b) {
  return $a + $b;
}
```

### Classes

Phlank borrows heavily from Scala and Kotlin for class syntax. Here's a User class with two `public readonly` property and one `private readonly` property.

```kotlin
class User(+id: int, +name: string, -email: string) {}
```

```php
class User {
  function __construct(
    public readonly int $id,
    public readonly string $name,
    private readonly string $email,
  ) {}
}
```

Since `public readonly` and `private readonly` are such common cases, phlank provides shorthand syntax sugar for them:

- `+` for `public readonly`
- `-` for `private readonly`

#### Class Properties

Class properties are declared using the same `var` syntax as variables. In PHP, class property initializers can only be "compile-time-constant expressions". Phlank supports any expression by compiling complex expressions into the constructor. Type annotations are optional, and as always, support the full suite of phpstan types. PHP modifiers can also be provided (final, readonly, static, and the visibility modifiers &ndash; public, private and protected).

```kotlin
class User(first: string, last: string) {
  var name: string = "$first $last"
}
```

```php
class User {
  public string $name;
  function __construct(string $first, string $last) {
    $this->name = "$first $last";
  }
}
```

#### Class methods

Class methods are declared using the same syntax as functions. The same shorthand syntax is available for one-liners.

```kotlin
class User(-first: string, -last: string) {
  fun name() => "$first $last"
}
```

```php
class User {
  function __construct(
    private readonly string $first,
    private readonly string $last,
  ) {}
  function name() {
    return $this->first . " " . $this->last;
  }
}
```

#### Implicit `this` and `self` where possible

This example also showcases phlank's "implicit $this" feature. If an identifier inside a class method is not in the class method's scope, phlank checks whether the identifier is a member of the surrounding class, and if so, automatically adds `$this->`.

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
class User(+name:string) {}
var user = new User()
echo user.name
```

```php
class User {
  function __construct(public readonly string $name) {}
}
$user = new User();
echo $user->name;
```

#### Class Inheritance

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

#### Class Interfaces

Interfaces work the same way as PHP.

```php
class PdoPersonRepository implements PersonRepository {}
```

```php
class PdoPersonRepository implements PersonRepository {}
```

Visibility modifiers can be added to the class constructor by adding a visibility keyword. The constructor is public by default (same as PHP).

```kotlin
class User private(-id: string) {}
```

```php
class User {
  private function __construct(
    private readonly string $id,
  ) {}
}
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
