import {Router} from 'express';
import * as fraudsterData from "../db/fraudstersData.js"
import * as reportData from "../db/reportsData.js"
import { ValidationError, BusinessError} from '../error/customErrors.js';
import * as validations from '../validations/Validations.js';
import {buildFraudsterRequest,defaultFraudsterRequest,flattenArray, evalLookupRequest} from '../util/ObjectUtil.js'
import xss from 'xss';



const router = Router();

router.post('/lookup', async (req, res) => {

    let {name,id,ein,itin,ssn,email,phone} = evalLookupRequest(req.body)

    // validations
    try{
      name = xss(name)
      id = xss(id)
      ein = xss(ein)
      itin = xss(itin)
      ssn = xss(ssn)
      id = xss(id)
      email = xss(email)
      phone = xss(phone)
      validations.fraudsterSearchWrappedValidation(name,id,ein,itin,ssn,email,phone)
    }catch(e){

      return res.render('lookup', { 
        isError: true,
        error: e,
        title: 'Search for Fraudster',
        userLoggedIn: req.session && req.session.isLoggedIn,
      })
      
    }
 
     // do the request
     let fraudstersArr = []
     try {
         if (name && name != 'N/A'){
           fraudstersArr =  await fraudsterData.findFraudstersByName(name);
         }else if (id && id != 'N/A'){
           let fraudster = await fraudsterData.getFraudsterById(id);
           if (fraudster){
             fraudster.id = fraudster._id.toString()
             fraudstersArr.push(fraudster)
           }
         }else{
           let fraudster = await fraudsterData.findFraudsterByKeyAttributes(ein, itin, ssn, email, phone)
           if (fraudster){
             fraudstersArr.push(fraudster)
           }
         }
         fraudstersArr = flattenArray(fraudstersArr)
         res.render('lookup', { 
          hasResults: (fraudstersArr.length > 0) ? true: false,
          resultCount: fraudstersArr.length,
          results: fraudstersArr,
          title: 'Search for Fraudster',
          userLoggedIn: req.session && req.session.isLoggedIn,
      });
    } catch (e) {
      
      return res.render('lookup', { 
        isError: true,
        error: e,
        title: 'Search for Fraudster',
        userLoggedIn: req.session && req.session.isLoggedIn,
      })
    }
});

  
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