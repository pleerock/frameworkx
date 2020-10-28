import {
  NumberValidationConstraints,
  StringValidationConstraints,
  Validator,
} from "@microframework/core"

const validatorjs = require("validator")

export const defaultValidator: Validator = ({ key, value, constraints }) => {
  if (typeof value === "string") {
    constraints = constraints as StringValidationConstraints

    if (constraints.maxLength !== undefined) {
      if (value.length > constraints.maxLength)
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_MAX_LENGTH",
          message: `Validation error: ${key} ("maxLength")`,
        }
    }

    if (constraints.minLength !== undefined) {
      if (value.length < constraints.minLength) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_MIN_LENGTH",
          message: `Validation error: ${key} ("minLength")`,
        }
      }
    }
    if (constraints.length !== undefined) {
      if (value.length !== constraints.length) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_LENGTH",
          message: `Validation error: ${key} ("length")`,
        }
      }
    }
    if (constraints.contains !== undefined) {
      if (validatorjs.contains(value, constraints.contains) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_CONTAINS",
          message: `Validation error: ${key} ("contains")`,
        }
      }
    }
    if (constraints.equals !== undefined) {
      if (validatorjs.equals(value, constraints.equals) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_EQUALS",
          message: `Validation error: ${key} ("equals")`,
        }
      }
    }
    if (constraints.isBase32 === true) {
      if (validatorjs.isBase32(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_BASE_32",
          message: `Validation error: ${key} ("isBase32")`,
        }
      }
    }
    if (constraints.isBase64 === true) {
      if (validatorjs.isBase64(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_BASE_64",
          message: `Validation error: ${key} ("isBase64")`,
        }
      }
    }
    if (constraints.isBIC === true) {
      if (validatorjs.isBIC(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_BIC",
          message: `Validation error: ${key} ("isBIC")`,
        }
      }
    }
    if (constraints.isCreditCard === true) {
      if (validatorjs.isCreditCard(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_CREDIT_CARD",
          message: `Validation error: ${key} ("isCreditCard")`,
        }
      }
    }
    if (constraints.isCurrency === true) {
      if (validatorjs.isCurrency(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_CURRENCY",
          message: `Validation error: ${key} ("isCurrency")`,
        }
      }
    }
    if (constraints.isDecimal === true) {
      if (validatorjs.isDecimal(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_DECIMAL",
          message: `Validation error: ${key} ("isDecimal")`,
        }
      }
    }
    if (constraints.isEmail === true) {
      if (validatorjs.isEmail(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_EMAIL",
          message: `Validation error: ${key} ("isEmail")`,
        }
      }
    }
    if (constraints.isEmpty === true) {
      if (validatorjs.isEmpty(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_EMPTY",
          message: `Validation error: ${key} ("isEmpty")`,
        }
      }
    }
    if (constraints.isFQDN === true) {
      if (validatorjs.isFQDN(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_FQDN",
          message: `Validation error: ${key} ("isFQDN")`,
        }
      }
    }
    if (constraints.isHash !== undefined) {
      if (validatorjs.isHash(value, constraints.isHash) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_HASH",
          message: `Validation error: ${key} ("isHash")`,
        }
      }
    }
    if (constraints.isHexColor === true) {
      if (validatorjs.isHexColor(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_HEX_COLOR",
          message: `Validation error: ${key} ("isHexColor")`,
        }
      }
    }
    if (constraints.isHexadecimal === true) {
      if (validatorjs.isHexadecimal(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_HEXADECIMAL",
          message: `Validation error: ${key} ("isHexadecimal")`,
        }
      }
    }
    if (constraints.isIdentityCard !== undefined) {
      if (Array.isArray(constraints.isIdentityCard)) {
        if (
          validatorjs.isIdentityCard(value, ...constraints.isIdentityCard) ===
          false
        ) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_IDENTITY_CARD",
            message: `Validation error: ${key} ("isIdentityCard")`,
          }
        }
      } else if (constraints.isIdentityCard === true) {
        if (validatorjs.isIdentityCard(value) === false) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_IDENTITY_CARD",
            message: `Validation error: ${key} ("isIdentityCard")`,
          }
        }
      }
    }
    if (constraints.isIP !== undefined) {
      if (typeof constraints.isIP === "number") {
        if (validatorjs.isIP(value, constraints.isIP) === false) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_IP",
            message: `Validation error: ${key} ("isIP")`,
          }
        }
      } else if (constraints.isIP === true) {
        if (validatorjs.isIP(value) === false) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_IP",
            message: `Validation error: ${key} ("isIP")`,
          }
        }
      }
    }
    if (constraints.isIPRange !== undefined) {
      if (typeof constraints.isIPRange === "number") {
        if (validatorjs.isIPRange(value, constraints.isIPRange) === false) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_IPRANGE",
            message: `Validation error: ${key} ("isIPRange")`,
          }
        }
      } else if (constraints.isIPRange === true) {
        if (validatorjs.isIPRange(value) === false) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_IPRANGE",
            message: `Validation error: ${key} ("isIPRange")`,
          }
        }
      }
    }
    if (constraints.isISBN === true) {
      if (validatorjs.isISBN(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_ISBN",
          message: `Validation error: ${key} ("isISBN")`,
        }
      }
    }
    if (constraints.isISSN !== undefined) {
      if (Array.isArray(constraints.isISSN)) {
        if (validatorjs.isISSN(value, ...constraints.isISSN) === false) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_ISSN",
            message: `Validation error: ${key} ("isISSN")`,
          }
        }
      } else if (constraints.isISSN === true) {
        if (validatorjs.isISSN(value) === false) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_ISSN",
            message: `Validation error: ${key} ("isISSN")`,
          }
        }
      }
    }
    if (constraints.isISIN === true) {
      if (validatorjs.isISIN(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_ISIN",
          message: `Validation error: ${key} ("isISIN")`,
        }
      }
    }
    if (constraints.isISO8601 === true) {
      if (validatorjs.isISO8601(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_ISO_8601",
          message: `Validation error: ${key} ("isISO8601")`,
        }
      }
    }
    if (constraints.isRFC3339 === true) {
      if (validatorjs.isRFC3339(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_RFC_3339",
          message: `Validation error: ${key} ("isRFC3339")`,
        }
      }
    }
    if (constraints.isISRC === true) {
      if (validatorjs.isISRC(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_ISRC",
          message: `Validation error: ${key} ("isISRC")`,
        }
      }
    }
    if (constraints.isIn !== undefined) {
      if (validatorjs.isIn(value, constraints.isIn) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_IN",
          message: `Validation error: ${key} ("isIn")`,
        }
      }
    }
    if (constraints.isJSON !== undefined) {
      if (validatorjs.isJSON(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_JSON",
          message: `Validation error: ${key} ("isJSON")`,
        }
      }
    }
    if (constraints.isJWT === true) {
      if (validatorjs.isJWT(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_JWT",
          message: `Validation error: ${key} ("isJWT")`,
        }
      }
    }
    if (constraints.isLatLong === true) {
      if (validatorjs.isLatLong(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_LAT_LONG",
          message: `Validation error: ${key} ("isLatLong")`,
        }
      }
    }
    if (constraints.isLowercase === true) {
      if (validatorjs.isLowercase(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_LOWERCASE",
          message: `Validation error: ${key} ("isLowercase")`,
        }
      }
    }
    if (constraints.isMACAddress !== undefined) {
      if (Array.isArray(constraints.isMACAddress)) {
        if (
          validatorjs.isMACAddress(value, ...constraints.isMACAddress) === false
        ) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_MACADDRESS",
            message: `Validation error: ${key} ("isMACAddress")`,
          }
        }
      } else if (constraints.isMACAddress === true) {
        if (validatorjs.isMACAddress(value) === false) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_MACADDRESS",
            message: `Validation error: ${key} ("isMACAddress")`,
          }
        }
      }
    }
    if (constraints.isMD5 === true) {
      if (validatorjs.isMD5(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_MD_5",
          message: `Validation error: ${key} ("isMD5")`,
        }
      }
    }
    if (constraints.isMimeType === true) {
      if (validatorjs.isMimeType(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_MIME_TYPE",
          message: `Validation error: ${key} ("isMimeType")`,
        }
      }
    }
    if (constraints.isMobilePhone !== undefined) {
      if (Array.isArray(constraints.isMobilePhone)) {
        if (
          validatorjs.isMobilePhone(value, ...constraints.isMobilePhone) ===
          false
        ) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_MOBILE_PHONE",
            message: `Validation error: ${key} ("isMobilePhone")`,
          }
        }
      } else if (constraints.isMobilePhone === true) {
        if (validatorjs.isMobilePhone(value) === false) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_MOBILE_PHONE",
            message: `Validation error: ${key} ("isMobilePhone")`,
          }
        }
      }
    }
    if (constraints.isMongoId === true) {
      if (validatorjs.isMongoId(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_MONGO_ID",
          message: `Validation error: ${key} ("isMongoId")`,
        }
      }
    }
    if (constraints.isNumeric !== undefined) {
      if (Array.isArray(constraints.isNumeric)) {
        if (validatorjs.isNumeric(value, ...constraints.isNumeric) === false) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_NUMERIC",
            message: `Validation error: ${key} ("isNumeric")`,
          }
        }
      } else if (constraints.isNumeric === true) {
        if (validatorjs.isNumeric(value) === false) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_NUMERIC",
            message: `Validation error: ${key} ("isNumeric")`,
          }
        }
      }
    }
    if (constraints.isPort === true) {
      if (validatorjs.isPort(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_PORT",
          message: `Validation error: ${key} ("isPort")`,
        }
      }
    }
    if (constraints.isPostalCode !== undefined) {
      if (Array.isArray(constraints.isPostalCode)) {
        if (
          validatorjs.isPostalCode(value, ...constraints.isPostalCode) === false
        ) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_POSTAL_CODE",
            message: `Validation error: ${key} ("isPostalCode")`,
          }
        }
      } else if (constraints.isPostalCode === true) {
        if (validatorjs.isPostalCode(value) === false) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_POSTAL_CODE",
            message: `Validation error: ${key} ("isPostalCode")`,
          }
        }
      }
    }
    if (constraints.isURL !== undefined) {
      if (Array.isArray(constraints.isURL)) {
        if (validatorjs.isURL(value, ...constraints.isURL) === false) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_URL",
            message: `Validation error: ${key} ("isURL")`,
          }
        }
      } else if (constraints.isURL === true) {
        if (validatorjs.isURL(value) === false) {
          throw {
            "@type": "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_URL",
            message: `Validation error: ${key} ("isURL")`,
          }
        }
      }
    }
    if (constraints.isUUID !== undefined) {
      if (validatorjs.isUUID(value, constraints.isUUID) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_UUID",
          message: `Validation error: ${key} ("isUUID")`,
        }
      }
    }
    if (constraints.isUppercase === true) {
      if (validatorjs.isUppercase(value) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_UPPERCASE",
          message: `Validation error: ${key} ("isUppercase")`,
        }
      }
    }
    if (constraints.isWhitelisted !== undefined) {
      if (
        validatorjs.isWhitelisted(value, constraints.isWhitelisted) === false
      ) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_WHITELISTED",
          message: `Validation error: ${key} ("isWhitelisted")`,
        }
      }
    }
    if (constraints.matches !== undefined) {
      if (validatorjs.matches(value, constraints.matches) === false) {
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_MATCHES",
          message: `Validation error: ${key} ("matches")`,
        }
      }
    }
  } else if (typeof value === "number") {
    // bigint-not-supported options
    constraints = constraints as NumberValidationConstraints
    if (constraints.even === true) {
      if ((value % 2 === 0) === false)
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_EVEN",
          message: `Validation error: ${key} ("even")`,
        }
    }
    if (constraints.odd === true) {
      if ((Math.abs(value % 2) === 1) === false)
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_ODD",
          message: `Validation error: ${key} ("odd")`,
        }
    }
  } else if (typeof value === "number" || typeof value === "bigint") {
    constraints = constraints as NumberValidationConstraints
    if (constraints.equals !== undefined) {
      if (value !== constraints.equals)
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_EQUALS",
          message: `Validation error: ${key} ("equals")`,
        }
    }
    if (constraints.min !== undefined) {
      if (value < constraints.min)
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_MIN",
          message: `Validation error: ${key} ("min")`,
        }
    }
    if (constraints.max !== undefined) {
      if (value > constraints.max)
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_MAX",
          message: `Validation error: ${key} ("max")`,
        }
    }
    if (constraints.negative === true) {
      if (value > -1)
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_NEGATIVE",
          message: `Validation error: ${key} ("negative")`,
        }
    }
    if (constraints.positive === true) {
      if (value < 0)
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_POSITIVE",
          message: `Validation error: ${key} ("positive")`,
        }
    }
    if (constraints.between !== undefined) {
      if (value < constraints.between[0] || value > constraints.between[1])
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_BETWEEN",
          message: `Validation error: ${key} ("between")`,
        }
    }
    if (constraints.lessThan !== undefined) {
      if (value >= constraints.lessThan)
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_LESS_THAN",
          message: `Validation error: ${key} ("lessThan")`,
        }
    }
    if (constraints.lessThanOrEqual !== undefined) {
      if (value > constraints.lessThanOrEqual)
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_LESS_THAN_OR_EQUAL",
          message: `Validation error: ${key} ("lessThanOrEqual")`,
        }
    }
    if (constraints.greaterThan !== undefined) {
      if (value <= constraints.greaterThan)
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_GREATER_THAN",
          message: `Validation error: ${key} ("greaterThan")`,
        }
    }
    if (constraints.greaterThanOrEqual !== undefined) {
      if (value < constraints.greaterThanOrEqual)
        throw {
          "@type": "HttpError",
          httpCode: 400,
          code: "VALIDATION_GREATER_THAN_OR_EQUAL",
          message: `Validation error: ${key} ("greaterThanOrEqual")`,
        }
    }
  }
}
