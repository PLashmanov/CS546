// move to util

 const FRAUDSTER_FIELDS = ['name','ein','itin','ssn','email','phone']

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
    return getFieldAndVal(params,FRAUDSTER_FIELDS);
  }
