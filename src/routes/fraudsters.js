import {Router} from 'express';
import  {createUser} from '../db/usersData.js';
import * as fraudsterData from "../db/fraudstersData.js"
import * as reportData from "../db/reportsData.js"
import { ValidationError, BusinessError} from '../error/customErrors.js';
import * as validations from '../validations/Validations.js';
import {buildFraudsterRequest} from '../util/ObjectUtil.js'
import xss from 'xss';


const router = Router();


router
  .route('/:searchField/:searchValue')
  .get(async (req, res) => {

    // extract attribute
    let {name,id,ein,itin,ssn,email,phone} = buildFraudsterRequest(req.params);

    // validations
    try{
      validations.validateFraudsterAttrRequest(req.params)
      validations.fraudsterSearchWrappedValidation(name,id,ein,itin,ssn,email,phone)
    }catch(e){
      return res.status(400).send(e);
    }

    // do the request
    let fraudstersArr = []
    try {
        if (name){
          fraudstersArr =  await fraudsterData.findFraudstersByName(name);
        }else if (id){
          let fraudster = await fraudsterData.getFraudsterById(id);
          if (fraudster){
            fraudstersArr.push(fraudster)
          }
        }else{
          let fraudster = await fraudsterData.findFraudsterByKeyAttributes(ein, itin, ssn, email, phone)
          if (fraudster){
            fraudstersArr.push(fraudster)
          }
        }
        return res.json(fraudstersArr);
      } catch (e) {
        return res.status(500).send(e);
    }
  })
  
router.post('/report', async (req, res) => {
  try {
    if (req.session && req.session.user) {
        let { email, firstName, ein, ssn, phoneNumber, itin, date, fraudType } = req.body;
        email = xss(convertEmptyField(email));
        firstName = xss(convertEmptyField(firstName));
        ein = xss(convertEmptyField(ein));
        ssn = xss(convertEmptyField(ssn));
        phoneNumber = xss(convertEmptyField(phoneNumber));
        itin = xss(convertEmptyField(itin));
        date = xss(convertEmptyField(date));
        fraudType = xss(convertEmptyField(fraudType));
    
      const report = await reportData.createReport(
          req.session.user.id,  ein, itin, ssn, email, phoneNumber, firstName, fraudType
      )
      return res.status(200).json({ message: report});
      }
      else {
        return res.status(409).json({ error: "user not logged in"});
    }
  } catch (ex) {
      if (ex instanceof ValidationError) {
        return res.status(400).json({ error: ex.message });
      }
      else if (ex instanceof BusinessError) {
        return res.status(409).json({ error: ex.message });
      }
      return res.status(500).json({ error: ex.message });
  }
});

function convertEmptyField(value) {
  return value || null;
}


export default router;