import {
  NumberValidationConstraints,
  StringValidationConstraints,
  Validator,
} from "@microframework/core"

const validatorjs = require("validator")

export const defaultValidator: Validator = ({ key, value, options }) => {
  if (typeof value === "string") {
    options = options as StringValidationConstraints

    if (options.maxLength !== undefined) {
      if (value.length > options.maxLength)
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_MAX_LENGTH",
          message: `Validation error: ${key} ("maxLength")`,
        }
    }

    if (options.minLength !== undefined) {
      if (value.length < options.minLength) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_MIN_LENGTH",
          message: `Validation error: ${key} ("minLength")`,
        }
      }
    }
    if (options.length !== undefined) {
      if (value.length !== options.length) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_LENGTH",
          message: `Validation error: ${key} ("length")`,
        }
      }
    }
    if (options.contains !== undefined) {
      if (validatorjs.contains(value, options.contains) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_CONTAINS",
          message: `Validation error: ${key} ("contains")`,
        }
      }
    }
    if (options.equals !== undefined) {
      if (validatorjs.equals(value, options.equals) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_EQUALS",
          message: `Validation error: ${key} ("equals")`,
        }
      }
    }
    if (options.isBase32 === true) {
      if (validatorjs.isBase32(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_BASE_32",
          message: `Validation error: ${key} ("isBase32")`,
        }
      }
    }
    if (options.isBase64 === true) {
      if (validatorjs.isBase64(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_BASE_64",
          message: `Validation error: ${key} ("isBase64")`,
        }
      }
    }
    if (options.isBIC === true) {
      if (validatorjs.isBIC(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_BIC",
          message: `Validation error: ${key} ("isBIC")`,
        }
      }
    }
    if (options.isCreditCard === true) {
      if (validatorjs.isCreditCard(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_CREDIT_CARD",
          message: `Validation error: ${key} ("isCreditCard")`,
        }
      }
    }
    if (options.isCurrency === true) {
      if (validatorjs.isCurrency(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_CURRENCY",
          message: `Validation error: ${key} ("isCurrency")`,
        }
      }
    }
    if (options.isDecimal === true) {
      if (validatorjs.isDecimal(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_DECIMAL",
          message: `Validation error: ${key} ("isDecimal")`,
        }
      }
    }
    if (options.isEmail === true) {
      if (validatorjs.isEmail(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_EMAIL",
          message: `Validation error: ${key} ("isEmail")`,
        }
      }
    }
    if (options.isEmpty === true) {
      if (validatorjs.isEmpty(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_EMPTY",
          message: `Validation error: ${key} ("isEmpty")`,
        }
      }
    }
    if (options.isFQDN === true) {
      if (validatorjs.isFQDN(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_FQDN",
          message: `Validation error: ${key} ("isFQDN")`,
        }
      }
    }
    if (options.isHash !== undefined) {
      if (validatorjs.isHash(value, options.isHash) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_HASH",
          message: `Validation error: ${key} ("isHash")`,
        }
      }
    }
    if (options.isHexColor === true) {
      if (validatorjs.isHexColor(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_HEX_COLOR",
          message: `Validation error: ${key} ("isHexColor")`,
        }
      }
    }
    if (options.isHexadecimal === true) {
      if (validatorjs.isHexadecimal(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_HEXADECIMAL",
          message: `Validation error: ${key} ("isHexadecimal")`,
        }
      }
    }
    if (options.isIdentityCard !== undefined) {
      if (options.isIdentityCard instanceof Array) {
        if (
          validatorjs.isIdentityCard(value, ...options.isIdentityCard) === false
        ) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_IDENTITY_CARD",
            message: `Validation error: ${key} ("isIdentityCard")`,
          }
        }
      } else if (options.isIdentityCard === true) {
        if (validatorjs.isIdentityCard(value) === false) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_IDENTITY_CARD",
            message: `Validation error: ${key} ("isIdentityCard")`,
          }
        }
      }
    }
    if (options.isIP !== undefined) {
      if (typeof options.isIP === "number") {
        if (validatorjs.isIP(value, options.isIP) === false) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_IP",
            message: `Validation error: ${key} ("isIP")`,
          }
        }
      } else if (options.isIP === true) {
        if (validatorjs.isIP(value) === false) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_IP",
            message: `Validation error: ${key} ("isIP")`,
          }
        }
      }
    }
    if (options.isIPRange !== undefined) {
      if (typeof options.isIPRange === "number") {
        if (validatorjs.isIPRange(value, options.isIPRange) === false) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_IPRANGE",
            message: `Validation error: ${key} ("isIPRange")`,
          }
        }
      } else if (options.isIPRange === true) {
        if (validatorjs.isIPRange(value) === false) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_IPRANGE",
            message: `Validation error: ${key} ("isIPRange")`,
          }
        }
      }
    }
    if (options.isISBN === true) {
      if (validatorjs.isISBN(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_ISBN",
          message: `Validation error: ${key} ("isISBN")`,
        }
      }
    }
    if (options.isISSN !== undefined) {
      if (options.isISSN instanceof Array) {
        if (validatorjs.isISSN(value, ...options.isISSN) === false) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_ISSN",
            message: `Validation error: ${key} ("isISSN")`,
          }
        }
      } else if (options.isISSN === true) {
        if (validatorjs.isISSN(value) === false) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_ISSN",
            message: `Validation error: ${key} ("isISSN")`,
          }
        }
      }
    }
    if (options.isISIN === true) {
      if (validatorjs.isISIN(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_ISIN",
          message: `Validation error: ${key} ("isISIN")`,
        }
      }
    }
    if (options.isISO8601 === true) {
      if (validatorjs.isISO8601(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_ISO_8601",
          message: `Validation error: ${key} ("isISO8601")`,
        }
      }
    }
    if (options.isRFC3339 === true) {
      if (validatorjs.isRFC3339(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_RFC_3339",
          message: `Validation error: ${key} ("isRFC3339")`,
        }
      }
    }
    if (options.isISRC === true) {
      if (validatorjs.isISRC(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_ISRC",
          message: `Validation error: ${key} ("isISRC")`,
        }
      }
    }
    if (options.isIn !== undefined) {
      if (validatorjs.isIn(value, options.isIn) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_IN",
          message: `Validation error: ${key} ("isIn")`,
        }
      }
    }
    if (options.isJSON !== undefined) {
      if (validatorjs.isJSON(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_JSON",
          message: `Validation error: ${key} ("isJSON")`,
        }
      }
    }
    if (options.isJWT === true) {
      if (validatorjs.isJWT(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_JWT",
          message: `Validation error: ${key} ("isJWT")`,
        }
      }
    }
    if (options.isLatLong === true) {
      if (validatorjs.isLatLong(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_LAT_LONG",
          message: `Validation error: ${key} ("isLatLong")`,
        }
      }
    }
    if (options.isLowercase === true) {
      if (validatorjs.isLowercase(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_LOWERCASE",
          message: `Validation error: ${key} ("isLowercase")`,
        }
      }
    }
    if (options.isMACAddress !== undefined) {
      if (options.isMACAddress instanceof Array) {
        if (
          validatorjs.isMACAddress(value, ...options.isMACAddress) === false
        ) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_MACADDRESS",
            message: `Validation error: ${key} ("isMACAddress")`,
          }
        }
      } else if (options.isMACAddress === true) {
        if (validatorjs.isMACAddress(value) === false) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_MACADDRESS",
            message: `Validation error: ${key} ("isMACAddress")`,
          }
        }
      }
    }
    if (options.isMD5 === true) {
      if (validatorjs.isMD5(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_MD_5",
          message: `Validation error: ${key} ("isMD5")`,
        }
      }
    }
    if (options.isMimeType === true) {
      if (validatorjs.isMimeType(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_MIME_TYPE",
          message: `Validation error: ${key} ("isMimeType")`,
        }
      }
    }
    if (options.isMobilePhone !== undefined) {
      if (options.isMobilePhone instanceof Array) {
        if (
          validatorjs.isMobilePhone(value, ...options.isMobilePhone) === false
        ) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_MOBILE_PHONE",
            message: `Validation error: ${key} ("isMobilePhone")`,
          }
        }
      } else if (options.isMobilePhone === true) {
        if (validatorjs.isMobilePhone(value) === false) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_MOBILE_PHONE",
            message: `Validation error: ${key} ("isMobilePhone")`,
          }
        }
      }
    }
    if (options.isMongoId === true) {
      if (validatorjs.isMongoId(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_MONGO_ID",
          message: `Validation error: ${key} ("isMongoId")`,
        }
      }
    }
    if (options.isNumeric !== undefined) {
      if (options.isNumeric instanceof Array) {
        if (validatorjs.isNumeric(value, ...options.isNumeric) === false) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_NUMERIC",
            message: `Validation error: ${key} ("isNumeric")`,
          }
        }
      } else if (options.isNumeric === true) {
        if (validatorjs.isNumeric(value) === false) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_NUMERIC",
            message: `Validation error: ${key} ("isNumeric")`,
          }
        }
      }
    }
    if (options.isPort === true) {
      if (validatorjs.isPort(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_PORT",
          message: `Validation error: ${key} ("isPort")`,
        }
      }
    }
    if (options.isPostalCode !== undefined) {
      if (options.isPostalCode instanceof Array) {
        if (
          validatorjs.isPostalCode(value, ...options.isPostalCode) === false
        ) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_POSTAL_CODE",
            message: `Validation error: ${key} ("isPostalCode")`,
          }
        }
      } else if (options.isPostalCode === true) {
        if (validatorjs.isPostalCode(value) === false) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_POSTAL_CODE",
            message: `Validation error: ${key} ("isPostalCode")`,
          }
        }
      }
    }
    if (options.isURL !== undefined) {
      if (options.isURL instanceof Array) {
        if (validatorjs.isURL(value, ...options.isURL) === false) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_URL",
            message: `Validation error: ${key} ("isURL")`,
          }
        }
      } else if (options.isURL === true) {
        if (validatorjs.isURL(value) === false) {
          throw {
            instanceof: "HttpError",
            httpCode: 400,
            code: "VALIDATION_IS_URL",
            message: `Validation error: ${key} ("isURL")`,
          }
        }
      }
    }
    if (options.isUUID !== undefined) {
      if (validatorjs.isUUID(value, options.isUUID) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_UUID",
          message: `Validation error: ${key} ("isUUID")`,
        }
      }
    }
    if (options.isUppercase === true) {
      if (validatorjs.isUppercase(value) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_UPPERCASE",
          message: `Validation error: ${key} ("isUppercase")`,
        }
      }
    }
    if (options.isWhitelisted !== undefined) {
      if (validatorjs.isWhitelisted(value, options.isWhitelisted) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_IS_WHITELISTED",
          message: `Validation error: ${key} ("isWhitelisted")`,
        }
      }
    }
    if (options.matches !== undefined) {
      if (validatorjs.matches(value, options.matches) === false) {
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_MATCHES",
          message: `Validation error: ${key} ("matches")`,
        }
      }
    }
  } else if (typeof value === "number") {
    // bigint-not-supported options
    options = options as NumberValidationConstraints
    if (options.even === true) {
      if ((value % 2 === 0) === false)
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_EVEN",
          message: `Validation error: ${key} ("even")`,
        }
    }
    if (options.odd === true) {
      if ((Math.abs(value % 2) === 1) === false)
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_ODD",
          message: `Validation error: ${key} ("odd")`,
        }
    }
  } else if (typeof value === "number" || typeof value === "bigint") {
    options = options as NumberValidationConstraints
    if (options.equals !== undefined) {
      if (value !== options.equals)
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_EQUALS",
          message: `Validation error: ${key} ("equals")`,
        }
    }
    if (options.min !== undefined) {
      if (value < options.min)
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_MIN",
          message: `Validation error: ${key} ("min")`,
        }
    }
    if (options.max !== undefined) {
      if (value > options.max)
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_MAX",
          message: `Validation error: ${key} ("max")`,
        }
    }
    if (options.negative === true) {
      if (value > -1)
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_NEGATIVE",
          message: `Validation error: ${key} ("negative")`,
        }
    }
    if (options.positive === true) {
      if (value < 0)
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_POSITIVE",
          message: `Validation error: ${key} ("positive")`,
        }
    }
    if (options.between !== undefined) {
      if (value < options.between[0] || value > options.between[1])
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_BETWEEN",
          message: `Validation error: ${key} ("between")`,
        }
    }
    if (options.lessThan !== undefined) {
      if (value >= options.lessThan)
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_LESS_THAN",
          message: `Validation error: ${key} ("lessThan")`,
        }
    }
    if (options.lessThanOrEqual !== undefined) {
      if (value > options.lessThanOrEqual)
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_LESS_THAN_OR_EQUAL",
          message: `Validation error: ${key} ("lessThanOrEqual")`,
        }
    }
    if (options.greaterThan !== undefined) {
      if (value <= options.greaterThan)
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_GREATER_THAN",
          message: `Validation error: ${key} ("greaterThan")`,
        }
    }
    if (options.greaterThanOrEqual !== undefined) {
      if (value < options.greaterThanOrEqual)
        throw {
          instanceof: "HttpError",
          httpCode: 400,
          code: "VALIDATION_GREATER_THAN_OR_EQUAL",
          message: `Validation error: ${key} ("greaterThanOrEqual")`,
        }
    }
  }
}
