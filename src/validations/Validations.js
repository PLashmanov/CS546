import * as deepEmailValidator from 'deep-email-validator';
import { ObjectId } from 'mongodb';
import validator from 'validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { ValidationError } from '../error/customErrors.js';

export const FRAUDSTER_FIELDS = ['name', 'id', 'ein', 'itin', 'ssn', 'email', 'phone']

export const isValidEmailAddress = async (userEmail) => {
  const result = await deepEmailValidator.validate({
    email: userEmail,
    validateRegex: true,
    validateMx: false,
    validateTypo: true,
    validateDisposable: false,
    validateSMTP: true,
  });
  return result.valid;
}

export const getMongoID = (id) => {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    throw new ValidationError("must be a valid id");
  }
  try {
    return new ObjectId(id.trim());
  } catch (error) {
    throw new ValidationError("invalid mongo id");
  }
}

export const isArray = (arr) => {
  return arr !== undefined && arr !== null && Array.isArray(arr);
}

function validateString(str, name) {
  if (!str) throw new ValidationError(`error: Please provide ${name}`);
  if (typeof str !== 'string') throw new ValidationError(`${name} must be string`);
  str = str.trim();
  if (str.length === 0) throw new ValidationError(`${name} cannot be an empty string`);
  return str;
}
export function validateId(id) {
  id = validateString(id, "id");
  if (!ObjectId.isValid(id)) throw new ValidationError("invalid object id");
  return id;
};

export function validateEIN(ein) {
  if (ein === null) return 'N/A';
  if (typeof ein === 'string' && ein.trim() === 'N/A') return ein;
  if (typeof ein !== 'string') throw new ValidationError("ein must be string");
  ein = ein.trim();
  if (ein.length === 0) {
    ein = "N/A";
    return ein;
  }
  if (!validator.matches(ein, /^\d{2}-\d{7}$/)) {
    throw new ValidationError("Invalid EIN");
  }
  return ein;
}

export function validateSSN(ssn) {
  if (ssn === null) return 'N/A';
  if (typeof ssn === 'string' && ssn.trim() === 'N/A') return ssn;
  if (typeof ssn !== 'string') throw new ValidationError(" ssn must be string");
  ssn = ssn.trim();
  if (ssn.length === 0) {
    ssn = "N/A";
    return ssn;
  }
  if (!validator.matches(ssn, /^(?!666|000|9\d\d)\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/)) {
    throw new ValidationError("Invalid SSN");
  }
  return ssn;
}

export function validateITIN(itin) {
  if (itin === null) return 'N/A';
  if (typeof itin === 'string' && itin.trim() === 'N/A') return itin;
  if (typeof itin !== 'string') throw new ValidationError("itin must be string");
  itin = itin.trim();
  if (itin.length === 0) {
    itin = "N/A";
    return itin;
  }
  if (!validator.matches(itin, /^9\d{2}-\d{2}-\d{4}$/)) throw new ValidationError("error: Invalid ITIN");
  return itin;
}

export function validateEmail(email) {
  email = validateString(email, "Email");
  var validFormat = /^(?=.{1,64}@.{4,64}$)(?=.{6,100}$)([a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*)@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})$/;
  if (!email.match(validFormat)) throw new ValidationError("Error: invalid email address");
  return email.toLowerCase();
}

export function validateEmailFr(email) {
  if (email === null) return 'N/A';
  if (typeof email === 'string' && email.trim() === 'N/A') return email;
  if (typeof email !== 'string') throw new ValidationError("error: email must be string");
  email = email.trim();
  if (email.length === 0) {
    email = "N/A";
    return email;
  }
  var validFormat = /^(?=.{1,64}@.{4,64}$)(?=.{6,100}$)([a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*)@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})$/;
  if (!email.match(validFormat)) throw new ValidationError("Error: invalid email address");
  return email;
}

export function validatePhoneNumber(phone) {
  phone = validateString(phone, "Phone number");
  const phoneNumber = parsePhoneNumberFromString(phone);
  if (!phoneNumber || !phoneNumber.isValid()) throw new ValidationError("Error: Invalid phone number");
  return phone;
}

export function validatePhoneNumberFr(phone) {
  if (phone === null) return 'N/A';
  if (typeof phone === 'string' && phone.trim() === 'N/A') return phone;
  if (typeof phone !== 'string') throw new ValidationError("error: phone must be string");
  phone = phone.trim();
  if (phone.length === 0) {
    phone = "N/A";
    return phone;
  }
  const phoneNumber = parsePhoneNumberFromString(phone);
  if (!phoneNumber || !phoneNumber.isValid()) throw new ValidationError("Error: Invalid phone number");
  return phone;
}

export function validateState(state) {
  state = state.trim().toUpperCase();
  if (state.length !== 2) throw new ValidationError("error: wrong state");
  const states =
    ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
      'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
      'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
      'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
      'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];
  if (!states.includes(state)) throw new ValidationError("error: not a valid state");
  return state;
}

function validateZip(zip) {
  zip = zip.trim();

  if (zip.length !== 5) throw new ValidationError("Error: wrong zip");
  let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  for (let x of zip) {
    if (!numbers.includes(x)) throw new ValidationError("Error: wrong zip");
  }
  return zip;
}

export function validateName(name) {
  name = validateString(name, "Fraudster name").toUpperCase();
  if (name.length < 2 || name.length > 20) throw new ValidationError("error: name length must be between 2 and 30");
  return name;
}

export function validateNameFr(name) {
  if (name === null) return 'N/A';
  if (typeof name === 'string' && name.trim() === 'N/A') return name;
  if (typeof name !== 'string') throw new ValidationError("error: name must be string");
  name = name.trim();
  if (name.length === 0) return 'N/A';
  if (name.length < 2 || name.length > 20) throw new ValidationError("error: name length must be between 2 and 30");
  return name;
}

export function validateCompanyName(companyName) {
  if (companyName === undefined) throw new ValidationError("error: companyName is missing");
  if (typeof companyName !== 'string') throw new ValidationError("error: companyName must be a string");
  companyName = companyName.trim();
  if (companyName.length === 0) {
    return 'N/A';
  }
  if (companyName.length < 3 || companyName.length > 50) throw new ValidationError("error: company name must be between 3 and 50 characters");
  return companyName.toUpperCase();
}

export function validateCity(city) {
  if (city === undefined) throw new Error('provide city');
  city = validateString(city, "city").toUpperCase();
  if (city.length < 3 || city.length > 50) throw new ValidationError("City must be between 3 and 50 characters long");
  return city;
}

export function validateText50Char(text) {
  if (text === null) return 'N/A';
  if (typeof text === 'string' && text.trim().length === 0) return 'N/A';
  if (typeof text !== 'string') throw new ValidationError("error: text must be string");
  text = text.trim();
  if (text.length < 10 || text.length > 50) throw new ValidationError("text length must be between 10 and 50 characters");
  return text;
}

export function validateReportIds(reportIds) {
  if (!reportIds) throw new ValidationError("reportIds missing");
  if (!Array.isArray(reportIds)) throw new ValidationError("reportIds must be an array");
  if (reportIds.length > 0) {
    for (let i in reportIds) {
      if (!validateId(reportIds[i])) throw new ValidationError("error: one ore more report IDs are invalid IDs");
    }
  }
}

export function validateNotifications(notifications) {
  if (notifications === undefined) throw new ValidationError("notifications must be provided");
  if (typeof notifications !== 'boolean') throw new ValidationError("notifications must be boolean type");
  return notifications;
}

export function validatePassword(password) {
  if (password === undefined) throw new Error('please provide password');
  password = validateString(password, "password");
  if (password.length < 8 || password.length > 15) {
    throw new Error('Password length should be between 8 and 15 characters');
  }

  const letters = /[A-Za-z]/;
  const numbers = /\d/g;
  const specialCharacters = /[!@#$%^&*(),?]/;

  if (!password.match(letters)) {
    throw new Error('Password must contain at least one letter');
  }

  if (!password.match(numbers) || (password.match(numbers) && password.match(numbers).length < 2)) {
    throw new Error('Password must contain at least two digits');
  }

  if (!password.match(specialCharacters)) {
    throw new Error('Password must contain at least one of the following special characters: ! @ # $ % ^ & * , ?');

  }
  return password;
}

export function validateRequestHas1Field(params, arr) {

  let hasField = false
  arr.forEach((fieldName) => {
    if (Object.values(params).includes(fieldName)) {
      hasField = true
    }
  });
  if (!hasField) throw new Error("Must have at least 1 valid key in the request");
}

export function validateFraudsterAttrRequest(params) {
  return validateRequestHas1Field(params, FRAUDSTER_FIELDS);
}

export function validatePasswordConfirmation(pass, confirmPass) {
  if (pass !== confirmPass) {
    throw new ValidationError("password and confirmation password dont match");
  }
}

export function validateFraudType(input) {
  const allowedFraudValues = new Set([
    "wire_fraud", "money_laundering", "creditcard_fraud",
    "check_fraud", "insurance_fraud", "identify_theft",
    "phishing", "embezzlement", "mortgage_fraud", "utility_scam"
  ]);
  if (!allowedFraudValues.has(input)) {
    throw new ValidationError("input does not match required fraud type");
  }
  return input;
}

export function fraudsterSearchWrappedValidation(name, id, ein, itin, ssn, email, phone) {

  if (name) {
    this.validateName(name);
  }

  if (id) {
    this.validateId(id);
  }

  if (ein) {
    this.validateEIN(ein);
  }

  if (itin) {
    this.validateITIN(itin);
  }

  if (ssn) {
    this.validateSSN(ssn);
  }

  if (email) {
    this.validateEmailFr(email);
  }

  if (phone) {
    this.validatePhoneNumberFr(phone);
  }


}

export function validateBody(body) {
  body = validateString(body, "review");
  if (body.length < 10 || body.length > 250) throw new ValidationError("review length must be between 10 and 250 characters");
  return body;
}

export function validateNickname(name) {
  name = validateString(name, "name");
  if (name.length < 2 || name.length > 20) throw new ValidationError("nickname length must be between 2 and 30");
  return name;
}