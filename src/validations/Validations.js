import * as deepEmailValidator from 'deep-email-validator';


async function isValidEmailAddress(userEmail) {
  const result = await deepEmailValidator.validate({
    email: userEmail,
    validateRegex: true,          
    validateMx: false,            
    validateTypo: true,          
    validateDisposable: false,    
    validateSMTP: true, });  
  return result.valid;
}

export { isValidEmailAddress };