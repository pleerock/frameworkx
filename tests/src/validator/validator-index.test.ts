import { defaultValidator } from "@microframework/validator"
import { ValidationError } from "@microframework/core"

describe.only("validator > defaultValidator", () => {
  describe("StringValidationConstraints", () => {
    test("maxLength", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            maxLength: 2,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_MAX_LENGTH",
          `Validation error: someProperty ("maxLength")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            maxLength: 4,
          },
        }),
      ).not.toThrowError()
    })

    test("minLength", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "te",
          constraints: {
            minLength: 4,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_MIN_LENGTH",
          `Validation error: someProperty ("minLength")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            minLength: 4,
          },
        }),
      ).not.toThrowError()
    })

    test("length", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            length: 2,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_LENGTH",
          `Validation error: someProperty ("length")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            length: 4,
          },
        }),
      ).not.toThrowError()
    })

    test("contains", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            contains: "aaa",
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_CONTAINS",
          `Validation error: someProperty ("contains")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            contains: "te",
          },
        }),
      ).not.toThrowError()
    })

    test("equals", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            equals: "aaa",
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_EQUALS",
          `Validation error: someProperty ("equals")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            equals: "test",
          },
        }),
      ).not.toThrowError()
    })

    test("isBase32", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isBase32: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_BASE32",
          `Validation error: someProperty ("isBase32")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "K5SWYY3PNVSSA5DPEBXG6ZA=",
          constraints: {
            isBase32: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isBase64", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "12345",
          constraints: {
            isBase64: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_BASE64",
          `Validation error: someProperty ("isBase64")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "Zm9vYmFy",
          constraints: {
            isBase64: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isBIC", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isBIC: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_BIC",
          `Validation error: someProperty ("isBIC")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "SBICKEN1345",
          constraints: {
            isBIC: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isCreditCard", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isCreditCard: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_CREDIT_CARD",
          `Validation error: someProperty ("isCreditCard")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "375556917985515",
          constraints: {
            isCreditCard: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isCurrency", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isCurrency: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_CURRENCY",
          `Validation error: someProperty ("isCurrency")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "-$10,123.45",
          constraints: {
            isCurrency: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isDecimal", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isDecimal: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_DECIMAL",
          `Validation error: someProperty ("isDecimal")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "123",
          constraints: {
            isDecimal: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isEmail", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isEmail: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_EMAIL",
          `Validation error: someProperty ("isEmail")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "foo@bar.com",
          constraints: {
            isEmail: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isEmpty", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isEmpty: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_EMPTY",
          `Validation error: someProperty ("isEmpty")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "",
          constraints: {
            isEmpty: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isFQDN", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isFQDN: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_FQDN",
          `Validation error: someProperty ("isFQDN")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "domain.com",
          constraints: {
            isFQDN: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isHash", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isHash: "md5",
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_HASH",
          `Validation error: someProperty ("isHash")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "d94f3f016ae679c3008de268209132f2",
          constraints: {
            isHash: "md5",
          },
        }),
      ).not.toThrowError()
    })

    test("isHexColor", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isHexColor: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_HEX_COLOR",
          `Validation error: someProperty ("isHexColor")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "#ff0000ff",
          constraints: {
            isHexColor: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isHexadecimal", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isHexadecimal: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_HEXADECIMAL",
          `Validation error: someProperty ("isHexadecimal")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "0xff0044",
          constraints: {
            isHexadecimal: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isIdentityCard", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isIdentityCard: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_IDENTITY_CARD",
          `Validation error: someProperty ("isIdentityCard")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "99999999R",
          constraints: {
            isIdentityCard: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isIP", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "256.0.0.1",
          constraints: {
            isIP: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_IP",
          `Validation error: someProperty ("isIP")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "127.0.0.1",
          constraints: {
            isIP: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isIPRange", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "127.200.230.1/35",
          constraints: {
            isIPRange: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_IP_RANGE",
          `Validation error: someProperty ("isIPRange")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "127.0.0.1/24",
          constraints: {
            isIPRange: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isISBN", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "3-423-21412-1",
          constraints: {
            isISBN: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_ISBN",
          `Validation error: someProperty ("isISBN")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "3-8362-2119-5",
          constraints: {
            isISBN: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isISSN", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "0378-5954",
          constraints: {
            isISSN: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_ISSN",
          `Validation error: someProperty ("isISSN")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "0378-5955",
          constraints: {
            isISSN: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isISIN", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "DE000BAY0018",
          constraints: {
            isISIN: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_ISIN",
          `Validation error: someProperty ("isISIN")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "AU0000XVGZA3",
          constraints: {
            isISIN: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isISO8601", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "200905",
          constraints: {
            isISO8601: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_ISO8601",
          `Validation error: someProperty ("isISO8601")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "2009-12T12:34",
          constraints: {
            isISO8601: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isRFC3339", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "2010-02-18t00:23:32.33+24:00",
          constraints: {
            isRFC3339: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_RFC3339",
          `Validation error: someProperty ("isRFC3339")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "2009-05-19 14:39:22-06:00",
          constraints: {
            isRFC3339: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isISRC", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "USAT2990060",
          constraints: {
            isISRC: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_ISRC",
          `Validation error: someProperty ("isISRC")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "USAT29900609",
          constraints: {
            isISRC: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isIn", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "foobarbaz",
          constraints: {
            isIn: "foobar",
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_IN",
          `Validation error: someProperty ("isIn")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "foo",
          constraints: {
            isIn: "foobar",
          },
        }),
      ).not.toThrowError()
    })

    test("isJSON", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isJSON: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_JSON",
          `Validation error: someProperty ("isJSON")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: { key: "value" },
          constraints: {
            isJSON: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isJWT", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
          constraints: {
            isJWT: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_JWT",
          `Validation error: someProperty ("isJWT")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN_oWnFSRgCzcmJmMjLiuyu5CSpyHI",
          constraints: {
            isJWT: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isLatLong", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "(020.000000, 010.000000000)",
          constraints: {
            isLatLong: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_LAT_LONG",
          `Validation error: someProperty ("isLatLong")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "(-17.738223, 85.605469)",
          constraints: {
            isLatLong: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isLowercase", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "TEST",
          constraints: {
            isLowercase: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_LOWERCASE",
          `Validation error: someProperty ("isLowercase")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isLowercase: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isMACAddress", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "01:02:03:04::ab",
          constraints: {
            isMACAddress: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_MAC_ADDRESS",
          `Validation error: someProperty ("isMACAddress")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "01:02:03:04:05:ab",
          constraints: {
            isMACAddress: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isMD5", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "KYT0bf1c35032a71a14c2f719e5a14c1",
          constraints: {
            isMD5: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_MD5",
          `Validation error: someProperty ("isMD5")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "d94f3f016ae679c3008de268209132f2",
          constraints: {
            isMD5: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isMimeType", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "application",
          constraints: {
            isMimeType: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_MIMETYPE",
          `Validation error: someProperty ("isMimeType")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "application/json",
          constraints: {
            isMimeType: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isMobilePhone", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isMobilePhone: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_MOBILE_PHONE",
          `Validation error: someProperty ("isMobilePhone")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "19876543210",
          constraints: {
            isMobilePhone: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isMongoId", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "507f1f77bcf86cd7994390",
          constraints: {
            isMongoId: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_MONGO_ID",
          `Validation error: someProperty ("isMongoId")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "507f1f77bcf86cd799439011",
          constraints: {
            isMongoId: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isNumeric", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isNumeric: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_NUMERIC",
          `Validation error: someProperty ("isNumeric")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "123",
          constraints: {
            isNumeric: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isPort", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "65536",
          constraints: {
            isPort: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_PORT",
          `Validation error: someProperty ("isPort")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "8080",
          constraints: {
            isPort: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isPostalCode", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isPostalCode: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_POSTAL_CODE",
          `Validation error: someProperty ("isPostalCode")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "1234",
          constraints: {
            isPostalCode: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isURL", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "http://localhost:3000/",
          constraints: {
            isURL: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_URL",
          `Validation error: someProperty ("isURL")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "foobar.com",
          constraints: {
            isURL: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isUUID", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3",
          constraints: {
            isUUID: 4,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_UUID",
          `Validation error: someProperty ("isUUID")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "713ae7e3-cb32-45f9-adcb-7c4fa86b90c1",
          constraints: {
            isUUID: 4,
          },
        }),
      ).not.toThrowError()
    })

    test("isUppercase", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "test",
          constraints: {
            isUppercase: true,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_UPPERCASE",
          `Validation error: someProperty ("isUppercase")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "TEST",
          constraints: {
            isUppercase: true,
          },
        }),
      ).not.toThrowError()
    })

    test("isWhitelisted", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "foo bar",
          constraints: {
            isWhitelisted: "abcdefghijklmnopqrstuvwxyz-",
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_IS_WHITELISTED",
          `Validation error: someProperty ("isWhitelisted")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "foo",
          constraints: {
            isWhitelisted: "abcdefghijklmnopqrstuvwxyz-",
          },
        }),
      ).not.toThrowError()
    })

    test("matches", () => {
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "acb",
          constraints: {
            matches: /abc/,
          },
        }),
      ).toThrowError(
        new ValidationError(
          "VALIDATION_MATCHES",
          `Validation error: someProperty ("matches")`,
        ),
      )
      expect(() =>
        defaultValidator({
          key: "someProperty",
          value: "abc",
          constraints: {
            matches: /abc/,
          },
        }),
      ).not.toThrowError()
    })
  })
})
