import pdf from 'pdf-parse-fork'
import * as fs from 'fs';
import {FraudValidation} from "fraudlabspro-nodejs";

export class FraudDectionService {
    static instance = null;

    constructor() {
        this.flp = new FraudValidation('OSJYSQ9YRJ39SJKJ1VNUXBXZRTIUQSXV');
    }

    static getInstance() {
        if (!FraudDectionService.instance) {
            FraudDectionService.instance = new FraudDectionService();
        }
        return FraudDectionService.instance;
    }
    
    async processPDF(pdfFilePath) {
        try {            

            let dataBuffer = fs.readFileSync(pdfFilePath);
            let pdfData = await pdf(dataBuffer).then(function (data) {
                return data.text;
            });

            return pdfData;

        } catch (error) {
             new Error('An error occurred while processing the PDF:', error);
        } 
    }
    async detectFraud(file) {
        try {            

            let fileData =  await this.processPDF(file);
            let fraudDetails = {}
            let fraudResult = await this.doFraudCheck();

            return {isFraud: (fraudResult > 70) ? true: false, fraudScore: fraudResult, fraudDetails: fraudDetails};

        } catch (error) {
             new Error('An error occurred while detecting fraud', error);
        } 
    }
    async doFraudCheck(potentialFraud){

        let params = {
            ip: '146.112.62.105',
            billing: {
                    last_name: 'Henderson',
                    first_name: 'Hector',
                    address: '1766 Powder House Road',
                    city: 'West Palm Beach',
                    state: 'FL',
                    zip_code: '33401',
                    country: 'US',
                    phone: '561-628-8674',
                    email: 'hh5566@gmail.com',
                },
                shipping: {
                    last_name: 'John',
                    first_name: 'Doe',
                    address: '4469 Chestnut Street',
                    city: 'Tampa',
                    state: 'FL',
                    zip_code: '33602',
                    country: 'US',
                },
                order: {
                    order_id: '67398',
                    currency: 'USD',
                    amount: '79.89',
                    quantity: 1,
                    order_memo: 'Online shop',
                    department: 'Online Store',
                    payment_gateway: 'stripe',
                    payment_mode: 'creditcard',
                    bin_no: '455655',
                    avs_result: 'Y',
                    cvv_result: 'M',
                },
                items: [{
                    sku: '10001',
                    quantity: 1,
                    type: 'physical'
            }],
                username: 'hh5566',
                flp_checksum: ''
        };


        const doFraudCheckCall = async () => {
            return await new Promise((resolve, reject) => {
                this.flp.validate(params, (err, data) => {
                    if (!err) {
                        resolve(data)
                    }else{
                        reject(err)
                    }
                });
        })}

        let fraudResult = await doFraudCheckCall();
        return fraudResult.fraudlabspro_score;
    }

}

