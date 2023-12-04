import pdf from 'pdf-parse-fork'
import * as fs from 'fs';
import {FraudValidation} from "fraudlabspro-nodejs";
import { createDetectionRecord } from "../db/detectionsData.js";
import random from 'random'
import { ChatGPTAPI } from 'chatgpt'

export class FraudDectionService {
    static instance = null;

    constructor() {
        this.flp = new FraudValidation('OSJYSQ9YRJ39SJKJ1VNUXBXZRTIUQSXV');
        this.chatGptAPI = new ChatGPTAPI({
            apiKey: "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"
        })
    }

    static getInstance() {
        if (!FraudDectionService.instance) {
            FraudDectionService.instance = new FraudDectionService();
        }
        return FraudDectionService.instance;
    }
    
    async extractEntitiesFromChatGPT(text) {
/*         const api = new ChatGPTAPI({
            apiKey: "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"
        }) */

        const nerChatGPTResult = await this.chatGptAPI.sendMessage('Please extract named enttities returning json in the following text:' + text);
        const nerObj = JSON.parse(nerChatGPTResult.text);
        return nerObj;
    }

    async constructFraudRequest(nerResult) {

        let email = nerResult.named_entities.EMAIL[0];
        let last_name = nerResult.named_entities.PERSON.split()[1];
        let first_name = nerResult.named_entities.PERSON.split()[0];
        let address = nerResult.named_entities.ADDRESS[1];
        let city = nerResult.named_entities.LOCATION[1];
        let state = nerResult.named_entities.LOCATION[2];
        let zip_code = nerResult.named_entities.LOCATION[3];
        let country = nerResult.named_entities.LOCATION[4];

        let params = {
            billing: {
                    last_name: last_name,
                    first_name: first_name,
                    address: address,
                    city: city,
                    state: state,
                    zip_code: zip_code,
                    country: country,
                    phone: phone,
                    email: email
            },
            flp_checksum: ''
        };
        
        return params;
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
            // get text from pdf        
            let fileData =  await this.processPDF(file);
            // extract key value pairs from chatgpt ner
            let potentialFraudDetails = await this.extractEntitiesFromChatGPT(fileData);
            // construct fraud score request
            let fraudRequest = this.constructFraudRequest(potentialFraudDetails);
            let fraudResult = random.int(0,100) //await this.doFraudCheck();
            let isFraud = (fraudResult > 70) ? true: false;
            let detectFraudRecord = await createDetectionRecord(isFraud,fraudResult,potentialFraudDetails);
            return {isFraud: isFraud, fraudScore: fraudResult, fraudDetails: potentialFraudDetails};

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

