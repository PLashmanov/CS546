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

        const nerChatGPTResult = await this.chatGptAPI.sendMessage('Please extract named enttities (email, last_name, first_name, address, city, state, zip_code, country and phone_number ) returning json in the following text:' + text);
        const nerObj = JSON.parse(nerChatGPTResult.text);
        return nerObj;
    }

     async constructFraudRequest(nerResult) {

        let email = nerResult.email;
        let phone_number = nerResult.phone_number
        let last_name = nerResult.last_name;
        let first_name = nerResult.first_name
        let address = nerResult.address
        let city = nerResult.city
        let state = nerResult.state
        let zip_code = nerResult.zip_code
        let country = nerResult.country

        let params = {
            billing: {
                    last_name: last_name,
                    first_name: first_name,
                    address: address,
                    city: city,
                    state: state,
                    zip_code: zip_code,
                    country: country,
                    phone: phone_number,
                    email: email,
            },
            shipping: {
                last_name: last_name,
                first_name: first_name,
                address: address,
                city: city,
                state: state,
                zip_code: zip_code,
                country: country,
            },
            order: {
                order_id: undefined,
                currency: undefined,
                amount: undefined,
                quantity:undefined,
                order_memo: undefined,
                department: undefined,
                payment_gateway: undefined,
                payment_mode: undefined,
                bin_no: undefined,
                avs_result: undefined,
                cvv_result: undefined,
            },
            items: undefined,
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
            let fraudRequest = await this.constructFraudRequest(potentialFraudDetails);
            // do fraud check
            let fraudResult = await this.doFraudCheck(fraudRequest); //random.int(0,100) //await this.doFraudCheck();
            // if over 70 from fraud check score, its fraud y'all!
            let isFraud = (fraudResult > 70) ? true: false;
            // submit metric for reporting dashboard
            let detectFraudRecord = await createDetectionRecord(isFraud,fraudResult,potentialFraudDetails);
            return {isFraud: isFraud, fraudScore: fraudResult, fraudDetails: potentialFraudDetails};

        } catch (error) {
             new Error('An error occurred while detecting fraud', error);
        } 
    }
    async doFraudCheck(theParameters){
      
        const doFraudCheckCall = async () => {
            return await new Promise((resolve, reject) => {
                this.flp.validate(theParameters, (err, data) => {
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

