import {
  NumberValidationConstraints,
  StringValidationConstraints,
  ValidationConstraints,
  ValidationFn,
} from "@microframework/core"
import { createValidationError } from "./validator-utils"
const validatorjs = require("validator")

/**
 * Validates a given value based on a given constraints.
 * Throws an error if validation failed.
 */
export function validate<T>(value: T, constraints: ValidationConstraints<T>) {
  return defaultValidator({ value, constraints })
}

/**
 * Default validator function for the framework.
 */
export const defaultValidator: ValidationFn<any> = ({
  key,
  value,
  constraints,
}) => {
  if (typeof value === "string") {
    constraints = constraints as StringValidationConstraints

    if (constraints.maxLength !== undefined) {
      if (value.length > constraints.maxLength) {
        throw createValidationError(key, "maxLength")
      }
    }

    if (constraints.minLength !== undefined) {
      if (value.length < constraints.minLength) {
        throw createValidationError(key, "minLength")
      }
    }
    if (constraints.length !== undefined) {
      if (value.length !== constraints.length) {
        throw createValidationError(key, "length")
      }
    }
    if (constraints.contains !== undefined) {
      if (validatorjs.contains(value, constraints.contains) === false) {
        throw createValidationError(key, "contains")
      }
    }
    if (constraints.equals !== undefined) {
      if (validatorjs.equals(value, constraints.equals) === false) {
        throw createValidationError(key, "equals")
      }
    }
    if (constraints.isBase32 === true) {
      if (validatorjs.isBase32(value) === false) {
        throw createValidationError(key, "isBase32")
      }
    }
    if (constraints.isBase64 === true) {
      if (validatorjs.isBase64(value) === false) {
        throw createValidationError(key, "isBase64")
      }
    }
    if (constraints.isBIC === true) {
      if (validatorjs.isBIC(value) === false) {
        throw createValidationError(key, "isBIC")
      }
    }
    if (constraints.isCreditCard === true) {
      if (validatorjs.isCreditCard(value) === false) {
        throw createValidationError(key, "isCreditCard")
      }
    }
    if (constraints.isCurrency === true) {
      if (validatorjs.isCurrency(value) === false) {
        throw createValidationError(key, "isCurrency")
      }
    }
    if (constraints.isDecimal === true) {
      if (validatorjs.isDecimal(value) === false) {
        throw createValidationError(key, "isDecimal")
      }
    }
    if (constraints.isEmail === true) {
      if (validatorjs.isEmail(value) === false) {
        throw createValidationError(key, "isEmail")
      }
    }
    if (constraints.isEmpty === true) {
      if (validatorjs.isEmpty(value) === false) {
        throw createValidationError(key, "isEmpty")
      }
    }
    if (constraints.isFQDN === true) {
      if (validatorjs.isFQDN(value) === false) {
        throw createValidationError(key, "isFQDN")
      }
    }
    if (constraints.isHash !== undefined) {
      if (validatorjs.isHash(value, constraints.isHash) === false) {
        throw createValidationError(key, "isHash")
      }
    }
    if (constraints.isHexColor === true) {
      if (validatorjs.isHexColor(value) === false) {
        throw createValidationError(key, "isHexColor")
      }
    }
    if (constraints.isHexadecimal === true) {
      if (validatorjs.isHexadecimal(value) === false) {
        throw createValidationError(key, "isHexadecimal")
      }
    }
    if (constraints.isIdentityCard !== undefined) {
      if (Array.isArray(constraints.isIdentityCard)) {
        if (
          validatorjs.isIdentityCard(value, ...constraints.isIdentityCard) ===
          false
        ) {
          throw createValidationError(key, "isIdentityCard")
        }
      } else if (constraints.isIdentityCard === true) {
        if (validatorjs.isIdentityCard(value, "any") === false) {
          throw createValidationError(key, "isIdentityCard")
        }
      }
    }
    if (constraints.isIP !== undefined) {
      if (typeof constraints.isIP === "number") {
        if (validatorjs.isIP(value, constraints.isIP) === false) {
          throw createValidationError(key, "isIP")
        }
      } else if (constraints.isIP === true) {
        if (validatorjs.isIP(value) === false) {
          throw createValidationError(key, "isIP")
        }
      }
    }
    if (constraints.isIPRange !== undefined) {
      if (typeof constraints.isIPRange === "number") {
        if (validatorjs.isIPRange(value, constraints.isIPRange) === false) {
          throw createValidationError(key, "isIPRange")
        }
      } else if (constraints.isIPRange === true) {
        if (validatorjs.isIPRange(value) === false) {
          throw createValidationError(key, "isIPRange")
        }
      }
    }
    if (constraints.isISBN === true) {
      if (validatorjs.isISBN(value) === false) {
        throw createValidationError(key, "isISBN")
      }
    }
    if (constraints.isISSN !== undefined) {
      if (Array.isArray(constraints.isISSN)) {
        if (validatorjs.isISSN(value, ...constraints.isISSN) === false) {
          throw createValidationError(key, "isISSN")
        }
      } else if (constraints.isISSN === true) {
        if (validatorjs.isISSN(value) === false) {
          throw createValidationError(key, "isISSN")
        }
      }
    }
    if (constraints.isISIN === true) {
      if (validatorjs.isISIN(value) === false) {
        throw createValidationError(key, "isISIN")
      }
    }
    if (constraints.isISO8601 === true) {
      if (validatorjs.isISO8601(value) === false) {
        throw createValidationError(key, "isISO8601")
      }
    }
    if (constraints.isRFC3339 === true) {
      if (validatorjs.isRFC3339(value) === false) {
        throw createValidationError(key, "isRFC3339")
      }
    }
    if (constraints.isISRC === true) {
      if (validatorjs.isISRC(value) === false) {
        throw createValidationError(key, "isISRC")
      }
    }
    if (constraints.isIn !== undefined) {
      if (validatorjs.isIn(value, constraints.isIn) === false) {
        throw createValidationError(key, "isIn")
      }
    }
    if (constraints.isJSON !== undefined) {
      if (validatorjs.isJSON(value) === false) {
        throw createValidationError(key, "isJSON")
      }
    }
    if (constraints.isJWT === true) {
      if (validatorjs.isJWT(value) === false) {
        throw createValidationError(key, "isJWT")
      }
    }
    if (constraints.isLatLong === true) {
      if (validatorjs.isLatLong(value) === false) {
        throw createValidationError(key, "isLatLong")
      }
    }
    if (constraints.isLowercase === true) {
      if (validatorjs.isLowercase(value) === false) {
        throw createValidationError(key, "isLowercase")
      }
    }
    if (constraints.isMACAddress !== undefined) {
      if (Array.isArray(constraints.isMACAddress)) {
        if (
          validatorjs.isMACAddress(value, ...constraints.isMACAddress) === false
        ) {
          throw createValidationError(key, "isMACAddress")
        }
      } else if (constraints.isMACAddress === true) {
        if (validatorjs.isMACAddress(value) === false) {
          throw createValidationError(key, "isMACAddress")
        }
      }
    }
    if (constraints.isMD5 === true) {
      if (validatorjs.isMD5(value) === false) {
        throw createValidationError(key, "isMD5")
      }
    }
    if (constraints.isMimeType === true) {
      if (validatorjs.isMimeType(value) === false) {
        throw createValidationError(key, "isMimeType")
      }
    }
    if (constraints.isMobilePhone !== undefined) {
      if (Array.isArray(constraints.isMobilePhone)) {
        if (
          validatorjs.isMobilePhone(value, ...constraints.isMobilePhone) ===
          false
        ) {
          throw createValidationError(key, "isMobilePhone")
        }
      } else if (constraints.isMobilePhone === true) {
        if (validatorjs.isMobilePhone(value) === false) {
          throw createValidationError(key, "isMobilePhone")
        }
      }
    }
    if (constraints.isMongoId === true) {
      if (validatorjs.isMongoId(value) === false) {
        throw createValidationError(key, "isMongoId")
      }
    }
    if (constraints.isNumeric !== undefined) {
      if (Array.isArray(constraints.isNumeric)) {
        if (validatorjs.isNumeric(value, ...constraints.isNumeric) === false) {
          throw createValidationError(key, "isNumeric")
        }
      } else if (constraints.isNumeric === true) {
        if (validatorjs.isNumeric(value) === false) {
          throw createValidationError(key, "isNumeric")
        }
      }
    }
    if (constraints.isPort === true) {
      if (validatorjs.isPort(value) === false) {
        throw createValidationError(key, "isPort")
      }
    }
    if (constraints.isPostalCode !== undefined) {
      if (Array.isArray(constraints.isPostalCode)) {
        if (
          validatorjs.isPostalCode(value, ...constraints.isPostalCode) === false
        ) {
          throw createValidationError(key, "isPostalCode")
        }
      } else if (constraints.isPostalCode === true) {
        if (validatorjs.isPostalCode(value, "any") === false) {
          throw createValidationError(key, "isPostalCode")
        }
      }
    }
    if (constraints.isURL !== undefined) {
      if (Array.isArray(constraints.isURL)) {
        if (validatorjs.isURL(value, ...constraints.isURL) === false) {
          throw createValidationError(key, "isURL")
        }
      } else if (constraints.isURL === true) {
        if (validatorjs.isURL(value) === false) {
          throw createValidationError(key, "isURL")
        }
      }
    }
    if (constraints.isUUID !== undefined) {
      if (validatorjs.isUUID(value, constraints.isUUID) === false) {
        throw createValidationError(key, "isUUID")
      }
    }
    if (constraints.isUppercase === true) {
      if (validatorjs.isUppercase(value) === false) {
        throw createValidationError(key, "isUppercase")
      }
    }
    if (constraints.isWhitelisted !== undefined) {
      if (
        validatorjs.isWhitelisted(value, constraints.isWhitelisted) === false
      ) {
        throw createValidationError(key, "isWhitelisted")
      }
    }
    if (constraints.matches !== undefined) {
      if (validatorjs.matches(value, constraints.matches) === false) {
        throw createValidationError(key, "matches")
      }
    }
  } else if (typeof value === "number" || typeof value === "bigint") {
    constraints = constraints as NumberValidationConstraints
    if (typeof value !== "bigint") {
      // bigint-not-supported options
      if (constraints.even === true) {
        if ((value % 2 === 0) === false)
          throw createValidationError(key, "even")
      }
      if (constraints.odd === true) {
        if ((Math.abs(value % 2) === 1) === false)
          throw createValidationError(key, "odd")
      }
    }

    if (constraints.equals !== undefined) {
      if (value !== constraints.equals)
        throw createValidationError(key, "equals")
    }
    if (constraints.min !== undefined) {
      if (value < constraints.min) throw createValidationError(key, "min")
    }
    if (constraints.max !== undefined) {
      if (value > constraints.max) throw createValidationError(key, "max")
    }
    if (constraints.negative === true) {
      if (value > -1) throw createValidationError(key, "negative")
    }
    if (constraints.positive === true) {
      if (value < 0) throw createValidationError(key, "positive")
    }
    if (constraints.between !== undefined) {
      if (value < constraints.between[0] || value > constraints.between[1])
        throw createValidationError(key, "between")
    }
    if (constraints.lessThan !== undefined) {
      if (value >= constraints.lessThan)
        throw createValidationError(key, "lessThan")
    }
    if (constraints.lessThanOrEqual !== undefined) {
      if (value > constraints.lessThanOrEqual)
        throw createValidationError(key, "lessThanOrEqual")
    }
    if (constraints.greaterThan !== undefined) {
      if (value <= constraints.greaterThan)
        throw createValidationError(key, "greaterThan")
    }
    if (constraints.greaterThanOrEqual !== undefined) {
      if (value < constraints.greaterThanOrEqual)
        throw createValidationError(key, "greaterThanOrEqual")
    }
  }
}
