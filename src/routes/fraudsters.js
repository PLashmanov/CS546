import {Router} from 'express';
import  {createUser} from '../db/usersData.js';
import * as fraudsterData from "../db/fraudstersData.js"
import * as reportData from "../db/reportsData.js"
import { ValidationError, BusinessError} from '../error/customErrors.js';
import * as validations from '../validations/Validations.js';
import {buildFraudsterRequest} from '../util/ObjectUtil.js'


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
        let {name,ein,itin,ssn,email,phone} = buildFraudsterRequest(req.params);
        if (name){
          fraudstersArr =  await fraudsterData.findFraudstersByName(name);
        }else{

          let fraudster = await fraudsterData.findFraudsterByKeyAttributes(ein, itin, ssn, email, phone)
          if (fraudster){
            fraudstersArr.push(fraudster)
          }
        }
        return res.json(fraudstersArr);
      } catch (e) {
        return res.status(200).send(e);
    }
  })
  
router.post('/report', async (req, res) => {
  try {
    if (req.session && req.session.user) {
        let { email, firstName, ein, ssn, 
              phoneNumber, itin, date, fraudType } = req.body;
      
        email = convertEmptyField(email);
        firstName = convertEmptyField(firstName);
        ein = convertEmptyField(ein);
        ssn = convertEmptyField(ssn);
        phoneNumber = convertEmptyField(phoneNumber);
        itin = convertEmptyField(itin);
        date = convertEmptyField(date);
        fraudType = convertEmptyField(fraudType);
    
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