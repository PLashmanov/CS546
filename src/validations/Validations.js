import * as deepEmailValidator from 'deep-email-validator';
import {ObjectId} from 'mongodb';
import validator from 'validator';
import {parsePhoneNumberFromString } from 'libphonenumber-js'; 

export  const  isValidEmailAddress = async (userEmail) => {
  const result = await deepEmailValidator.validate({
    email: userEmail,
    validateRegex: true,          
    validateMx: false,            
    validateTypo: true,          
    validateDisposable: false,    
    validateSMTP: true, });  
  return result.valid;
}

export const getMongoID = (id)=> {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    throw new Error("must be a valid id");
  }
  try {
    return new ObjectId(id.trim());
  } catch (error) {
    throw new Error("invalid mongo id");
  }
}

export const isArray = (arr)=> {
  return arr !== undefined && arr !== null && Array.isArray(arr);
}

function validateString(str, name) {
  if(!str) throw new Error(`provide ${name}`);
  if(typeof str !== 'string') throw new Error(`${name} must be string`);
  str = str.trim();
  if(str.length === 0) throw new Error(`${name} cannot be an empty string`);
  return str;
}
export function validateId(id) {
  id = validateString(id, "id");
  if(!ObjectId.isValid(id)) throw new Error(`invalid object id`);
  return id;
};

export function validateEIN(ein) {
  if(ein === null) return 'N/A';
  if(typeof ein === 'string' && ein.trim() === 'N/A') return ein;
  if(typeof ein !== 'string') throw new Error(`ein must be string`);
  ein = ein.trim();
  if (ein.length === 0) {
      ein = "N/A";
      return ein;
  }
 if (!validator.matches(ein, /^\d{2}-\d{7}$/)) {
  throw new Error(`Invalid EIN`);
}
 return ein;
}

export function validateSSN(ssn) {
  if(ssn === null) return 'N/A';
  if(typeof ssn === 'string' && ssn.trim() === 'N/A') return ssn;
  if(typeof ssn !== 'string') throw new Error(`ssn must be string`);
  ssn = ssn.trim();
  if (ssn.length === 0) {
      ssn = "N/A";
      return ssn;
  }
  if (!validator.matches(ssn, /^(?!666|000|9\d\d)\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/)) {
   throw new Error(`Invalid SSN`);
}
  return ssn;
}

export function validateITIN(itin) {
  if(itin === null) return 'N/A';
  if(typeof itin === 'string' && itin.trim() === 'N/A') return itin;
  if(typeof itin !== 'string') throw new Error(`itin must be string`);
  itin = itin.trim();
  if (itin.length === 0) {
      itin = "N/A";
      return itin;
  }
  if(!validator.matches(itin, /^9\d{2}-\d{2}-\d{4}$/)) throw new Error(`error: Invalid ITIN`);
  return itin;
}

export function validateEmail(email) {
  email = validateString(email, "Email");
  var validFormat = /^(?=.{1,64}@.{4,64}$)(?=.{6,100}$)([a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*)@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})$/;
  if (!email.match(validFormat)) throw new Error(`invalid email address`);
  return email;

  //validator email function doesn't screen this out: "abc-@gmail.com" ??
}

export function validateEmailFr(email) {
  if(email === null) return 'N/A';
  if(typeof email === 'string' && email.trim() === 'N/A') return email;
  if(typeof email !== 'string') throw new Error(`email must be string`);
  email = email.trim();
  if (email.length === 0) {
      email = "N/A";
      return email;
  }
  var validFormat = /^(?=.{1,64}@.{4,64}$)(?=.{6,100}$)([a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*)@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})$/;
  if (!email.match(validFormat)) throw new Error(`Error: invalid email address`);
  return email;
}

export function validatePhoneNumber(phone) {
  phone = validateString(phone, "Phone number");
  const phoneNumber = parsePhoneNumberFromString(phone);
  if(!phoneNumber|| !phoneNumber.isValid()) throw new Error(`Invalid phone number`);
  return phone;
}
//FIXME: update if format changes
export function validatePhoneNumberFr(phone) {
  if(phone === null) return 'N/A';
  if(typeof phone === 'string' && phone.trim() === 'N/A') return phone;
  if(typeof phone !== 'string') throw new Error(`phone must be string`);
  phone = phone.trim();
  if (phone.length === 0) {
      phone = "N/A";
      return phone;
  }
  const phoneNumber = parsePhoneNumberFromString(phone);
  if(!phoneNumber|| !phoneNumber.isValid()) throw new Error(`Error: Invalid phone number`);
  return phone;
}

export function validateState(state) {
  state = state.trim().toUpperCase();
  if (state.length !== 2) throw new Error(`wrong state`);
  const states = 
  ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];
  if (!states.includes(state)) throw new Error(`not a valid state`);
  return state;
}

function validateZip(zip) {
  zip = zip.trim();

  if (zip.length !== 5) throw new Error(`wrong zip`);
  let numbers = ['0','1','2','3','4','5','6','7','8','9'];
  for(let x of zip) {
      if(!numbers.includes(x)) throw new Error(`wrong zip`);
  }
  return zip;
}
  //FIXME: check at the end if we use this function, if not, delete
  export function validateAddress(address) { //attributes:streetAddress, city, state, zip
  if(!address) throw `Error: enter address`;
  if(typeof address !== 'object') throw new Error(`eventLocation must be an object`);
  if(!address.streetAddress || !address.city || !address.state || !address.zip) throw new Error(`address does not have all the attrributes needed`);
  if(typeof address.streetAddress !== 'string' || typeof address.city !== 'string' || typeof address.state !== 'string'
  || typeof address.zip !== 'string') throw new Error(`All address inputs must be strings`);
  if(address.streetAddress.trim().length === 0 || address.city.trim().length === 0 || address.state.trim() === 0
  || address.zip.trim().length === 0) throw new Error(`All address inputs must be non-empty strings`);
  if(address.streetAddress.trim().length < 3) throw new Error(`Street address must be at least 3 characters long`);
  if(address.city.trim().length < 3) throw new Error(`City must be at least 3 characters long`);
  address.state = validateState(address.state);
  address.zip = validateZip(address.zip);
  return address;
}

export function validateAddressFr(address) {
  if(address === null) return 'N/A';
  if(typeof address === 'string' && address.trim() === 'N/A') return `N/A`;
  if(typeof address === 'string' && address.trim().length === 0) return `N/A`;
  if(typeof address !== 'object') throw new Error(`address must be an object`);
  if(!address.streetAddress || !address.city || !address.state || !address.zip) throw new Error(`address does not have all the attrributes needed`);
  if(typeof address.streetAddress !== 'string' || typeof address.city !== 'string' || typeof address.state !== 'string'
  || typeof address.zip !== 'string') throw new Error(`All address inputs must be strings`);
  if(address.streetAddress.trim().length === 0 || address.city.trim().length === 0 || address.state.trim() === 0
  || address.zip.trim().length === 0) throw new Error(`All address inputs must be non-empty strings`);
  if(address.streetAddress.trim().length < 3) throw new Error(`Street address must be at least 3 characters long`);
  if(address.city.trim().length < 3) throw new Error(`City must be at least 3 characters long`);
  address.state = validateState(address.state);
  address.zip = validateZip(address.zip);

  return address;
}

export function validateName(name, Name) {
  name = validateString(name, Name).toUpperCase();
  if (name.length < 2 || name.length > 20) throw new Error(`name length must be between 2 and 30 characters long`);
  return name;
}

export function validateNameFr(name) {
  if(name === null) return 'N/A';
  if(typeof name === 'string' && name.trim() === 'N/A') return name;
  if(typeof name !== 'string') throw new Error(`name must be string`);
  name = name.trim();
  if (name.length === 0) return 'N/A';
  if (name.length < 2 || name.length > 20) throw new Error(`name length must be between 2 and 30 characters long`);
  return name;
}

export function validateCompanyName(companyName) {
  if (companyName === undefined) throw new Error(`companyName is missing`);
  if(typeof companyName !== 'string') throw new Error(`companyName must be a string`);
  companyName = companyName.trim();
  if(companyName.length === 0) {
      return 'N/A';
  }
  if (companyName.length < 3 || companyName.length > 50) throw new Error(`company name must be between 3 and 50 characters`);
  return companyName.toUpperCase();
}

export function validateCity(city) {
  city = validateString(city, "city").toUpperCase();
  if(city.length < 3 || city.length > 50) throw new Error(`City must be between 3 and 50 characters long`);
  return city;
}

export function validateText50Char(text) {
  if(text === null) return 'N/A';
  if(typeof text === 'string' && text.trim().length === 0) return 'N/A';
  if(typeof text !== 'string') throw new Error(`text must be string`);
  text = text.trim();
  if (text.length < 10 || text.length > 50) throw new Error(`text length must be between 10 and 50 characters`);
  return text;
}

export function validateReportIds(reportIds) {
  if (!reportIds) throw `reportIds missing`;
  if (!Array.isArray(reportIds)) throw new Error(`reportIds must be an array`);
  if (reportIds.length > 0) {
      for(let i in reportIds) {
          if (!validateId(reportIds[i])) throw new Error(`one ore more report IDs are invalid IDs`);
     }
  }
}    

export function validateNotifications (notifications) {
  if (notifications === undefined) throw new Error(`notifications must be provided`);
  if (typeof notifications !== 'boolean') throw new Error(`notifications must be boolean type`);
  return notifications;
}

//FIXME: create
export function validateType(type) {

  return type;
}

export async function validatePassword(password) {
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