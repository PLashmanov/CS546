

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

  const getFieldAndValAndFlatten = (arr,fieldArr) =>{

    let flattenedArr = []
    arr.forEach( (element) => {

      for (const [key, value] of Object.entries(element)) {
        if (['eins','itins','ssns','emails','phones','names'].includes(key)){
          element[key] = value.toString()
        }
      }
      flattenedArr.push(element);
    });
  
    return flattenedArr
  }

  export const buildFraudsterRequest = (params ) =>{
    return getFieldAndVal(params,validations.FRAUDSTER_FIELDS);
  }

  export const defaultFraudsterRequest = ( ) =>{
    let fieldValueObj = {}
    validations.FRAUDSTER_FIELDS.forEach( (fieldName) => {
      fieldValueObj[fieldName] = 'N/A'
    });
  
    return fieldValueObj
  }


  export const flattenArray = (arr ) =>{
    return getFieldAndValAndFlatten(arr,validations.FRAUDSTER_FIELDS);
  }


  export const evalLookupRequest = (body) =>{

     let lookupRequestObj = defaultFraudsterRequest()
     // extract attribute
     //let {name,id,ein,itin,ssn,email,phone} = defaultFraudsterRequest()
     // field and value xss
     let searchCriteria=(body['search-criteria'].toLowerCase())
     let searchQuery= (body['search-query'])
     if (searchCriteria === 'name'){
        //name = searchQuery;
        lookupRequestObj['name'] = searchQuery;
     }else if (searchCriteria === 'id'){
        //id = searchQuery;
        lookupRequestObj['id'] = searchQuery;
     }else if (searchCriteria === 'ein'){
      //ein = searchQuery;
      lookupRequestObj['ein'] = searchQuery;
     }else if (searchCriteria === 'itin'){
      //itin = searchQuery;
      lookupRequestObj['itin'] = searchQuery;
     }else if (searchCriteria === 'ssn'){
      //ssn = searchQuery;
      lookupRequestObj['ssn'] = searchQuery;
     }else if (searchCriteria=== 'email'){
      //email = searchQuery;
      lookupRequestObj['email'] = searchQuery;
     }else if (searchCriteria === 'phone'){
      //phone = searchQuery;
      lookupRequestObj['phone'] = searchQuery;
     }else{
      throw new Error ("Failed to parsse lookup")
     }
     return lookupRequestObj

  }