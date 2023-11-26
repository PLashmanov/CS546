import { faker } from '@faker-js/faker';
import random from 'random'
// stash
export const seed_config = {

    "users" : {
        "default":[
            {
                email: 'john@gmail.com',
                firstName: 'Bernadette',
                lastName: 'Tromp',
                companyName: 'Rosenbaum and Sons',
                phoneNumber: '+12018478921',
                hashedPassword: 'pFPyfWNX_G2ePa0',
                numofReports: 0,
                badge: false,
                notifications: false
            },
            {
                email: 'fo@yahoo.com',
                firstName: 'Langly',
                lastName: 'Nomo',
                companyName: 'Bonds and Sons',
                phoneNumber: '+12128478921',
                hashedPassword: 'pFPyfWNX_G2ePa0',
                numofReports: 0,
                badge: false,
                notifications: false
            }
            ],
        "simulate_count": 10,
    },
    "fraudsters" : {
        "default": [
            {
                eins: [ '05-0474378', '45-8926953' ],
                itins: [ '489-50-0604', '362-40-5582' ],
                ssns: [ '484-72-4631', '380-16-0835' ],
                emails: [ 'Kallie.OConnell@hotmail.com', 'Kitty_Bergstrom@gmail.com' ],
                phones: [ '(951) 699-0113 x9654', '229.803.4447 x2495' ],
                names: [ 'Alana Stark', 'Ewell Ankunding' ],
                users: [],
                numReports: 0,
                trending: false
              },
              {
                eins: [ '44-0133778', '62-9536597' ],
                itins: [ '085-07-1973', '986-96-0155' ],
                ssns: [ '263-73-1328', '136-56-5867' ],
                emails: [ 'Lexie32@hotmail.com', 'Alda85@yahoo.com' ],
                phones: [ '(811) 534-3253', '(835) 362-1639' ],
                names: [ 'Leonel Funk', 'Elody Hodkiewicz' ],
                users: [],
                numReports: 0,
                trending: false
              }
            ],
        "simulate_count": 5000
    },
    "reports" : {
        "simulate_type": {"embezzlement": .4}
    },
    "types": ["wire_fraud","money_laundering","check_fraud","creditcard_fraud","insurance_fraud","identity_theft","phishing","embezzlement","mortgage_fraud","utility_scam"]
}

const randomNumber = (base,high) =>{
    return faker.helpers.rangeToNumber({ min: base, max: high }) 
}

function ranTo9() { 
    return String(randomNumber(0,9));
}

function ran1To9() { 
    return String(randomNumber(1,9));
}

function ran2To9() { 
    return String(randomNumber(2,9));
}

const randomEIN = () => {
    return ranTo9() + ranTo9() + "-" + ranTo9() + ranTo9() + ranTo9() + ranTo9() + ranTo9()+ ranTo9() + ranTo9()
}


const randomSSNOrItin = () => {
    return ranTo9() + ranTo9() + ranTo9() + "-" + ranTo9() + ranTo9() + "-" + ranTo9() + ranTo9() + ranTo9()+ ranTo9()
}

const randomAreadCode = () => {
    return ['212','201','401', '551'][randomNumber(0,2)]
}

const randomPhone = () => {
    return "+1" + randomAreadCode () + "" + ran2To9() + ran1To9() + ran1To9() + "" + ran1To9() + ran1To9() + ran1To9()+ ran1To9()
}


export const generateUsers = seed_config.users.default.map((user) =>{ 
    return createUser(user.email,user.firstName,user.lastName,user.companyName,user.phoneNumber,user.hashedPassword,user.numofReports,user.badge,user.notifications)  
});

export const generateFraudsters = seed_config.fraudsters.default.map((fraudster) =>{ 
    return createFraudster(fraudster.eins,fraudster.itins,fraudster.ssns,fraudster.emails,fraudster.phones,fraudster.names,fraudster.users,fraudster.numReports,fraudster.updateDate,fraudster.trending)  
});

export const generateRamdomFraudsters = faker.helpers.multiple(createFraudster, {
    count: seed_config.fraudsters.simulate_count,
});

export const generateRamdomUsers = faker.helpers.multiple(createUser, {
    count: seed_config.users.simulate_count,
});

export function trimIfNeeded(toTrim,num){

    let trimmed = "";
    if (toTrim.length < num){
        return toTrim;
    }else{
        for (var i = 0; i < num; i++) {
            trimmed +=toTrim.charAt(i);
        }
    }
    return trimmed;
}

export function createUser(email, firstName, lastName, companyName, phoneNumber, hashedPassword) {
    return {
      email: ( (email != null )? email : faker.internet.email()),
      firstName: ( (firstName != null ) && (typeof firstName != 'number') && (firstName != 0) ? firstName : faker.person.firstName()),
      lastName: ( (lastName != null )? lastName : faker.person.lastName()),
      companyName: ( (companyName != null )? companyName : faker.company.name()),
      phoneNumber: ( (phoneNumber != null )? phoneNumber : randomPhone()),
      hashedPassword: trimIfNeeded("@" + ranTo9() + ranTo9() + faker.internet.password(),15),
      numofReports: 0,
      badge: false,
      notifications: false,
    };
  }

  export function createFraudster(eins, itins, ssns, emails, phones, names, users, numReports,trending) {
    return {
      eins: ( (eins != null )? eins : [randomEIN(),randomEIN()]),
      itins:  ( ( (itins != null) && (typeof itins != 'number') && (itins != 0)  )? itins : [randomSSNOrItin(), randomSSNOrItin()]),
      ssns: ( (ssns != null )? ssns : [randomSSNOrItin(), randomSSNOrItin()]),
      emails: ( (emails != null )? emails : [faker.internet.email(), faker.internet.email()]),
      phones: ( (phones != null )? phones : [faker.phone.number(),faker.phone.number()]),
      names: ( (names != null )? names : [ faker.person.firstName()+ " " + faker.person.lastName(),faker.person.firstName()+ " " + faker.person.lastName() ]),
      users: ( (users != null )? users : []), 
      numReports: 0,
      trending: false
    };
  }