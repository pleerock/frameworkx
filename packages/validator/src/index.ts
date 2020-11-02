import {
  NumberValidationConstraints,
  StringValidationConstraints,
  ValidationError,
  Validator,
} from "@microframework/core"

const validatorjs = require("validator")

// todo: create Error class here

export const defaultValidator: Validator = ({ key, value, constraints }) => {
  if (typeof value === "string") {
    constraints = constraints as StringValidationConstraints

    if (constraints.maxLength !== undefined) {
      if (value.length > constraints.maxLength) {
        throw new ValidationError(
          "VALIDATION_MAX_LENGTH",
          `Validation error: ${key} ("maxLength")`,
        )
      }
    }

    if (constraints.minLength !== undefined) {
      if (value.length < constraints.minLength) {
        throw new ValidationError(
          "VALIDATION_MIN_LENGTH",
          `Validation error: ${key} ("minLength")`,
        )
      }
    }
    if (constraints.length !== undefined) {
      if (value.length !== constraints.length) {
        throw new ValidationError(
          "VALIDATION_LENGTH",
          `Validation error: ${key} ("length")`,
        )
      }
    }
    if (constraints.contains !== undefined) {
      if (validatorjs.contains(value, constraints.contains) === false) {
        throw new ValidationError(
          "VALIDATION_CONTAINS",
          `Validation error: ${key} ("contains")`,
        )
      }
    }
    if (constraints.equals !== undefined) {
      if (validatorjs.equals(value, constraints.equals) === false) {
        throw new ValidationError(
          "VALIDATION_EQUALS",
          `Validation error: ${key} ("equals")`,
        )
      }
    }
    if (constraints.isBase32 === true) {
      if (validatorjs.isBase32(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_BASE32",
          `Validation error: ${key} ("isBase32")`,
        )
      }
    }
    if (constraints.isBase64 === true) {
      if (validatorjs.isBase64(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_BASE64",
          `Validation error: ${key} ("isBase64")`,
        )
      }
    }
    if (constraints.isBIC === true) {
      if (validatorjs.isBIC(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_BIC",
          `Validation error: ${key} ("isBIC")`,
        )
      }
    }
    if (constraints.isCreditCard === true) {
      if (validatorjs.isCreditCard(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_CREDIT_CARD",
          `Validation error: ${key} ("isCreditCard")`,
        )
      }
    }
    if (constraints.isCurrency === true) {
      if (validatorjs.isCurrency(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_CURRENCY",
          `Validation error: ${key} ("isCurrency")`,
        )
      }
    }
    if (constraints.isDecimal === true) {
      if (validatorjs.isDecimal(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_DECIMAL",
          `Validation error: ${key} ("isDecimal")`,
        )
      }
    }
    if (constraints.isEmail === true) {
      if (validatorjs.isEmail(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_EMAIL",
          `Validation error: ${key} ("isEmail")`,
        )
      }
    }
    if (constraints.isEmpty === true) {
      if (validatorjs.isEmpty(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_EMPTY",
          `Validation error: ${key} ("isEmpty")`,
        )
      }
    }
    if (constraints.isFQDN === true) {
      if (validatorjs.isFQDN(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_FQDN",
          `Validation error: ${key} ("isFQDN")`,
        )
      }
    }
    if (constraints.isHash !== undefined) {
      if (validatorjs.isHash(value, constraints.isHash) === false) {
        throw new ValidationError(
          "VALIDATION_IS_HASH",
          `Validation error: ${key} ("isHash")`,
        )
      }
    }
    if (constraints.isHexColor === true) {
      if (validatorjs.isHexColor(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_HEX_COLOR",
          `Validation error: ${key} ("isHexColor")`,
        )
      }
    }
    if (constraints.isHexadecimal === true) {
      if (validatorjs.isHexadecimal(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_HEXADECIMAL",
          `Validation error: ${key} ("isHexadecimal")`,
        )
      }
    }
    if (constraints.isIdentityCard !== undefined) {
      if (Array.isArray(constraints.isIdentityCard)) {
        if (
          validatorjs.isIdentityCard(value, ...constraints.isIdentityCard) ===
          false
        ) {
          throw new ValidationError(
            "VALIDATION_IS_IDENTITY_CARD",
            `Validation error: ${key} ("isIdentityCard")`,
          )
        }
      } else if (constraints.isIdentityCard === true) {
        if (validatorjs.isIdentityCard(value, "any") === false) {
          throw new ValidationError(
            "VALIDATION_IS_IDENTITY_CARD",
            `Validation error: ${key} ("isIdentityCard")`,
          )
        }
      }
    }
    if (constraints.isIP !== undefined) {
      if (typeof constraints.isIP === "number") {
        if (validatorjs.isIP(value, constraints.isIP) === false) {
          throw new ValidationError(
            "VALIDATION_IS_IP",
            `Validation error: ${key} ("isIP")`,
          )
        }
      } else if (constraints.isIP === true) {
        if (validatorjs.isIP(value) === false) {
          throw new ValidationError(
            "VALIDATION_IS_IP",
            `Validation error: ${key} ("isIP")`,
          )
        }
      }
    }
    if (constraints.isIPRange !== undefined) {
      if (typeof constraints.isIPRange === "number") {
        if (validatorjs.isIPRange(value, constraints.isIPRange) === false) {
          throw new ValidationError(
            "VALIDATION_IS_IP_RANGE",
            `Validation error: ${key} ("isIPRange")`,
          )
        }
      } else if (constraints.isIPRange === true) {
        if (validatorjs.isIPRange(value) === false) {
          throw new ValidationError(
            "VALIDATION_IS_IP_RANGE",
            `Validation error: ${key} ("isIPRange")`,
          )
        }
      }
    }
    if (constraints.isISBN === true) {
      if (validatorjs.isISBN(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_ISBN",
          `Validation error: ${key} ("isISBN")`,
        )
      }
    }
    if (constraints.isISSN !== undefined) {
      if (Array.isArray(constraints.isISSN)) {
        if (validatorjs.isISSN(value, ...constraints.isISSN) === false) {
          throw new ValidationError(
            "VALIDATION_IS_ISSN",
            `Validation error: ${key} ("isISSN")`,
          )
        }
      } else if (constraints.isISSN === true) {
        if (validatorjs.isISSN(value) === false) {
          throw new ValidationError(
            "VALIDATION_IS_ISSN",
            `Validation error: ${key} ("isISSN")`,
          )
        }
      }
    }
    if (constraints.isISIN === true) {
      if (validatorjs.isISIN(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_ISIN",
          `Validation error: ${key} ("isISIN")`,
        )
      }
    }
    if (constraints.isISO8601 === true) {
      if (validatorjs.isISO8601(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_ISO8601",
          `Validation error: ${key} ("isISO8601")`,
        )
      }
    }
    if (constraints.isRFC3339 === true) {
      if (validatorjs.isRFC3339(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_RFC3339",
          `Validation error: ${key} ("isRFC3339")`,
        )
      }
    }
    if (constraints.isISRC === true) {
      if (validatorjs.isISRC(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_ISRC",
          `Validation error: ${key} ("isISRC")`,
        )
      }
    }
    if (constraints.isIn !== undefined) {
      if (validatorjs.isIn(value, constraints.isIn) === false) {
        throw new ValidationError(
          "VALIDATION_IS_IN",
          `Validation error: ${key} ("isIn")`,
        )
      }
    }
    if (constraints.isJSON !== undefined) {
      if (validatorjs.isJSON(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_JSON",
          `Validation error: ${key} ("isJSON")`,
        )
      }
    }
    if (constraints.isJWT === true) {
      if (validatorjs.isJWT(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_JWT",
          `Validation error: ${key} ("isJWT")`,
        )
      }
    }
    if (constraints.isLatLong === true) {
      if (validatorjs.isLatLong(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_LAT_LONG",
          `Validation error: ${key} ("isLatLong")`,
        )
      }
    }
    if (constraints.isLowercase === true) {
      if (validatorjs.isLowercase(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_LOWERCASE",
          `Validation error: ${key} ("isLowercase")`,
        )
      }
    }
    if (constraints.isMACAddress !== undefined) {
      if (Array.isArray(constraints.isMACAddress)) {
        if (
          validatorjs.isMACAddress(value, ...constraints.isMACAddress) === false
        ) {
          throw new ValidationError(
            "VALIDATION_IS_MAC_ADDRESS",
            `Validation error: ${key} ("isMACAddress")`,
          )
        }
      } else if (constraints.isMACAddress === true) {
        if (validatorjs.isMACAddress(value) === false) {
          throw new ValidationError(
            "VALIDATION_IS_MAC_ADDRESS",
            `Validation error: ${key} ("isMACAddress")`,
          )
        }
      }
    }
    if (constraints.isMD5 === true) {
      if (validatorjs.isMD5(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_MD5",
          `Validation error: ${key} ("isMD5")`,
        )
      }
    }
    if (constraints.isMimeType === true) {
      if (validatorjs.isMimeType(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_MIME_TYPE",
          `Validation error: ${key} ("isMimeType")`,
        )
      }
    }
    if (constraints.isMobilePhone !== undefined) {
      if (Array.isArray(constraints.isMobilePhone)) {
        if (
          validatorjs.isMobilePhone(value, ...constraints.isMobilePhone) ===
          false
        ) {
          throw new ValidationError(
            "VALIDATION_IS_MOBILE_PHONE",
            `Validation error: ${key} ("isMobilePhone")`,
          )
        }
      } else if (constraints.isMobilePhone === true) {
        if (validatorjs.isMobilePhone(value) === false) {
          throw new ValidationError(
            "VALIDATION_IS_MOBILE_PHONE",
            `Validation error: ${key} ("isMobilePhone")`,
          )
        }
      }
    }
    if (constraints.isMongoId === true) {
      if (validatorjs.isMongoId(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_MONGO_ID",
          `Validation error: ${key} ("isMongoId")`,
        )
      }
    }
    if (constraints.isNumeric !== undefined) {
      if (Array.isArray(constraints.isNumeric)) {
        if (validatorjs.isNumeric(value, ...constraints.isNumeric) === false) {
          throw new ValidationError(
            "VALIDATION_IS_NUMERIC",
            `Validation error: ${key} ("isNumeric")`,
          )
        }
      } else if (constraints.isNumeric === true) {
        if (validatorjs.isNumeric(value) === false) {
          throw new ValidationError(
            "VALIDATION_IS_NUMERIC",
            `Validation error: ${key} ("isNumeric")`,
          )
        }
      }
    }
    if (constraints.isPort === true) {
      if (validatorjs.isPort(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_PORT",
          `Validation error: ${key} ("isPort")`,
        )
      }
    }
    if (constraints.isPostalCode !== undefined) {
      if (Array.isArray(constraints.isPostalCode)) {
        if (
          validatorjs.isPostalCode(value, ...constraints.isPostalCode) === false
        ) {
          throw new ValidationError(
            "VALIDATION_IS_POSTAL_CODE",
            `Validation error: ${key} ("isPostalCode")`,
          )
        }
      } else if (constraints.isPostalCode === true) {
        if (validatorjs.isPostalCode(value, "any") === false) {
          throw new ValidationError(
            "VALIDATION_IS_POSTAL_CODE",
            `Validation error: ${key} ("isPostalCode")`,
          )
        }
      }
    }
    if (constraints.isURL !== undefined) {
      if (Array.isArray(constraints.isURL)) {
        if (validatorjs.isURL(value, ...constraints.isURL) === false) {
          throw new ValidationError(
            "VALIDATION_IS_URL",
            `Validation error: ${key} ("isURL")`,
          )
        }
      } else if (constraints.isURL === true) {
        if (validatorjs.isURL(value) === false) {
          throw new ValidationError(
            "VALIDATION_IS_URL",
            `Validation error: ${key} ("isURL")`,
          )
        }
      }
    }
    if (constraints.isUUID !== undefined) {
      if (validatorjs.isUUID(value, constraints.isUUID) === false) {
        throw new ValidationError(
          "VALIDATION_IS_UUID",
          `Validation error: ${key} ("isUUID")`,
        )
      }
    }
    if (constraints.isUppercase === true) {
      if (validatorjs.isUppercase(value) === false) {
        throw new ValidationError(
          "VALIDATION_IS_UPPERCASE",
          `Validation error: ${key} ("isUppercase")`,
        )
      }
    }
    if (constraints.isWhitelisted !== undefined) {
      if (
        validatorjs.isWhitelisted(value, constraints.isWhitelisted) === false
      ) {
        throw new ValidationError(
          "VALIDATION_IS_WHITELISTED",
          `Validation error: ${key} ("isWhitelisted")`,
        )
      }
    }
    if (constraints.matches !== undefined) {
      if (validatorjs.matches(value, constraints.matches) === false) {
        throw new ValidationError(
          "VALIDATION_MATCHES",
          `Validation error: ${key} ("matches")`,
        )
      }
    }
  } else if (typeof value === "number") {
    // bigint-not-supported options
    constraints = constraints as NumberValidationConstraints
    if (constraints.even === true) {
      if ((value % 2 === 0) === false)
        throw new ValidationError(
          "VALIDATION_EVEN",
          `Validation error: ${key} ("even")`,
        )
    }
    if (constraints.odd === true) {
      if ((Math.abs(value % 2) === 1) === false)
        throw new ValidationError(
          "VALIDATION_ODD",
          `Validation error: ${key} ("odd")`,
        )
    }
  } else if (typeof value === "number" || typeof value === "bigint") {
    constraints = constraints as NumberValidationConstraints
    if (constraints.equals !== undefined) {
      if (value !== constraints.equals)
        throw new ValidationError(
          "VALIDATION_EQUALS",
          `Validation error: ${key} ("equals")`,
        )
    }
    if (constraints.min !== undefined) {
      if (value < constraints.min)
        throw new ValidationError(
          "VALIDATION_MIN",
          `Validation error: ${key} ("min")`,
        )
    }
    if (constraints.max !== undefined) {
      if (value > constraints.max)
        throw new ValidationError(
          "VALIDATION_MAX",
          `Validation error: ${key} ("max")`,
        )
    }
    if (constraints.negative === true) {
      if (value > -1)
        throw new ValidationError(
          "VALIDATION_NEGATIVE",
          `Validation error: ${key} ("negative")`,
        )
    }
    if (constraints.positive === true) {
      if (value < 0)
        throw new ValidationError(
          "VALIDATION_POSITIVE",
          `Validation error: ${key} ("positive")`,
        )
    }
    if (constraints.between !== undefined) {
      if (value < constraints.between[0] || value > constraints.between[1])
        throw new ValidationError(
          "VALIDATION_BETWEEN",
          `Validation error: ${key} ("between")`,
        )
    }
    if (constraints.lessThan !== undefined) {
      if (value >= constraints.lessThan)
        throw new ValidationError(
          "VALIDATION_LESS_THAN",
          `Validation error: ${key} ("lessThan")`,
        )
    }
    if (constraints.lessThanOrEqual !== undefined) {
      if (value > constraints.lessThanOrEqual)
        throw new ValidationError(
          "VALIDATION_LESS_THAN_OR_EQUAL",
          `Validation error: ${key} ("lessThanOrEqual")`,
        )
    }
    if (constraints.greaterThan !== undefined) {
      if (value <= constraints.greaterThan)
        throw new ValidationError(
          "VALIDATION_GREATER_THAN",
          `Validation error: ${key} ("greaterThan")`,
        )
    }
    if (constraints.greaterThanOrEqual !== undefined) {
      if (value < constraints.greaterThanOrEqual)
        throw new ValidationError(
          "VALIDATION_GREATER_THAN_OR_EQUAL",
          `Validation error: ${key} ("greaterThanOrEqual")`,
        )
    }
  }
}
