

 import * as validations from '../validations/Validations.js';

 const getFieldAndVal = (params,fieldArr) =>{

    let fieldValueObj = {}
    fieldArr.forEach( (fieldName) => {
      fieldValueObj[fieldName] = null
      if (params.searchField == fieldName){
        fieldValueObj[fieldName] = params.searchValue
      }
    });
  
    return fieldValueObj
  }

  export const buildFraudsterRequest = (params ) =>{
    return getFieldAndVal(params,validations.FRAUDSTER_FIELDS);
  }
