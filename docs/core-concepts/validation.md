# Validation

Microframework's core provides an interface to validate models and inputs.
Inputs are validated on every client request, while models are validated on the server response.
In order for a framework to execute a validation you must define validation rules.
Each validation rule is a set of constraints you want to apply to the given input / model.
When validation on a defined constraint fails, `ValidationError` will be **thrown**.

* [Validation rules](#validation-rules)
    * [Using constraints](#using-constraints)
    * [Custom validation](#custom-validation)
* [Constraints](#constraints)
    * [String constraints](#string-constraints)
    * [Number constraints](#number-constraints)
* [Manual validation](#manual-validation)

## Validation rules

To execute an input and model validation you must define the *validation rules*.

### Using constraints

There are set of default constraints that you apply to your model properties.
It is the simplest and convenient way to perform validation.

Input validation rule example:

```typescript
import { validationRule } from "@microframework/core"

export const UserRegisterInputValidationRule = validationRule(
  App.model("UserRegisterInput"),
  {
    projection: {
      email: {
        isEmail: true,
      },
      firstName: {
        minLength: 3,
        maxLength: 25,
      },
      lastName: {
        minLength: 3,
        maxLength: 25,
      },
      age: {
        min: 12,
        max: 120
      }
    },
  },
)
```

Model validation rule example:

```typescript
import { validationRule } from "@microframework/core"

export const UserModelValidationRule = validationRule(
  App.model("User"),
  {
    projection: {
      password: {
        // this validation rule tells that password that we return to the client
        // should be empty, e.g. we never expose it to the client 
        isEmpty: true
      },
    },
  },
)
```

Once validation rules defined, they must be registered in the app:

```typescript
export const AppServer = createApplicationServer(App, {
  // ...
  validationRules: [
    UserModelValidationRule,
    UserRegisterInputValidationRule,
  ]
  // ...
})
```

### Custom validation

If default constraints do not satisfy requirements, you can put a custom validation logic
into the validation rule:

```typescript
import { ValidationError, validationRule } from "@microframework/core"

export const UserModelValidationRule = validationRule(
  App.input("UserRegisterInput"),
  {
    async validate(user, context) {
      const userWithSuchEmail = await UserRepository.find({ email: email })
      if (userWithSuchEmail) {
        throw new ValidationError(
          "USER_REGISTER_BUSY_EMAIL",
          `Provided email is already busy, please use a different email address.`
        )
      }
   }
})
```


## Constraints

### String constraints

You can use following string constraints:

* `maxLength: number` - checks if the string not longer than given length.
* `minLength: number` - checks if the string not shorter than given length.
* `length: number` - checks if the string is exactly given length.
* `contains: string` - checks if the string contains the seed.
* `equals: string` - check if the string matches the comparison.
* `isBase32: boolean` - checks if a string is base32 encoded.
* `isBase64: boolean` - checks if a string is base64 encoded.
* `isBIC: boolean` - checks if a string is a BIC (Bank Idenfication Code) or SWIFT code.
* `isCreditCard: boolean` - checks if the string is a credit card.
* `isCurrency: boolean` - checks if the string is a valid currency amount.
* `isDecimal: boolean` - checks if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
* `isEmail: boolean` - checks if the string is an email.
* `isEmpty: boolean` - checks if the string has a length of zero.
* `isFQDN: boolean` - checks if the string is a fully qualified domain name (e.g. domain.com).
* `isHash: string` - checks if the string is a hash of type algorithm.
* `isHexColor: boolean` - checks if the string is a hexadecimal color.
* `isHexadecimal: boolean` - checks if the string is a hexadecimal number.
* `isIdentityCard: boolean | any[]` - checks if the string is a valid identity card code.
* `isIP: boolean | 4 | 6` - checks if the string is an IP (version 4 or 6).
* `isIPRange: boolean | 10 | 13` - checks if the string is an IP Range(version 4 only).
* `isISBN: boolean` - checks if the string is an ISBN (version 10 or 13).
* `isISSN: boolean | any[]` - checks if the string is an ISSN.
* `isISIN: boolean` - checks if the string is an ISIN (stock/security identifier).
* `isISO8601: boolean` - checks if the string is a valid ISO 8601 date
* `isRFC3339: boolean` - checks if the string is a valid RFC 3339 date.
* `isISRC: boolean` - check if the string is a ISRC.
* `isIn: string | string[]` - check if the string or array of strings is in a array of allowed values.
* `isJSON: boolean` - checks if the string is valid JSON.
* `isJWT: boolean` - checks if the string is valid JWT token.
* `isLatLong: boolean` - checks if the string is a valid latitude-longitude coordinate in the format lat,long or lat, long.
* `isLowercase: boolean` - checks if the string is lowercase.
* `isMACAddress: boolean | any[]` - checks if the string is a MAC address.
* `isMD5: boolean` - checks if the string is a MD5 hash.
* `isMimeType: boolean` - checks if the string matches to a valid MIME type format.
* `isMobilePhone: boolean | any[]` - checks if the string is a mobile phone number.
* `isMongoId: boolean` - checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
* `isNumeric: boolean | any[]` - checks if the string contains only numbers.
* `isPort: boolean` - checks if the string is a valid port number.
* `isPostalCode: boolean | any[]` - checks if the string is a postal code.
* `isURL: boolean | any[]` - checks if the string is an URL.
* `isUUID: 3 | 4 | 5` - checks if the string is a UUID (version 3, 4 or 5).
* `isUppercase: boolean` - checks if the string is uppercase.
* `isWhitelisted: string` - checks characters if they appear in the whitelist.
* `matches: RegExp` - checks if string matches the pattern.

### Number constraints

You can use following number constraints:

* `equals: number` - check if the number absolutely matches given number.
* `min: number` - checks if given number isn't lower as this number.
* `max: number` - checks if given number isn't greater as this number.
* `negative: boolean` - checks if given number is negative.
* `positive: boolean` - checks if given number is positive.
* `between: [number, number]` - checks if given number is between two numbers.
* `lessThan: number` - checks if given number is less than this number.
* `lessThanOrEqual: number` - checks if given number is less than or equal to this number.
* `greaterThan: number` - checks if given number is greater than this number.
* `greaterThanOrEqual: number` - checks if given number is greater than or equal to this number.
* `even: boolean` - checks if given number is even number.
* `odd: boolean` - checks if given number is odd number.

## Manual validation

You can validate any value by using a `validate` function:

```typescript
import { validate } from "@microframework/validator"

validate("my-string", {
  minLength: 4,
  maxLength: 10
})
```

If validation for a given value has failed, `validate` function will throw a `ValidationError`.