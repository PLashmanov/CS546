import {Router} from 'express';
import  {createUser} from '../db/usersData.js';
import * as fraudsterData from "../db/fraudstersData.js"
import * as reportData from "../db/reportsData.js"
import { ValidationError, BusinessError} from '../error/customErrors.js';
import * as validations from '../validations/Validations.js';


// move to util
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

const router = Router();


router
  .route('/:searchField/:searchValue')
  .get(async (req, res) => {

    // input validation
    try{
      validations.validateFraudsterAttrRequest(req.params)
      // to do validation on all input types
    }catch(e){
      return res.status(400).send(e);
    }

    // do the request
    let fraudstersArr = []
    try {
        let {ein,itin,ssn,email,phone} = getFieldAndVal(req.params,['ein','itin','ssn','email','phone'])
        let fraudsterId = await fraudsterData.fraudsterExists(ein, itin, ssn, email, phone)
        if (fraudsterId){
          const theFraudster = await fraudsterData.getFraudsterById(fraudsterId)
          fraudstersArr.push(theFraudster)
        }
        return res.json(fraudstersArr);
      } catch (e) {
        return res.status(200).send(e);
    }
  })
  

export default router;