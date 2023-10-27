import * as deepEmailValidator from 'deep-email-validator';
import { ObjectId } from 'mongodb';

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


export const  getMongoID = (id)=> {
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

