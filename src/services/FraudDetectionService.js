import dotenv from 'dotenv';
import pdf from 'pdf-parse-fork'
import * as fs from 'fs';
import {FraudValidation} from "fraudlabspro-nodejs";
import { createDetectionRecord } from "../db/detectionsData.js";
import random from 'random'
import { ChatGPTAPI } from 'chatgpt'

export class FraudDectionService {
    static instance = null;

    constructor() {

        this.chatGptPrompt = 'Please extract named enttities (email, last_name, first_name, address, city, state, zip_code, country and phone_number ) returning json in the following text:'
        this.useChatGPT = false;
        this.useFraudLab = false;
        this.isSimulated = true;
        this.isError = false;

        if (process.env.CHATGPT_KEY){
            this.useChatGPT = true;
            this.isSimulated = false;
            this.chatGptAPI = new ChatGPTAPI({
                apiKey: process.env.CHATGPT_KEY
            })
        }
        if (process.env.FRAUDLAB_KEY){
            this.useFraudLab = true;
            this.isSimulated = false;
            this.flp = new FraudValidation(process.env.FRAUDLAB_KEY);
        }
       
    }

    static getInstance() {
        if (!FraudDectionService.instance) {
            FraudDectionService.instance = new FraudDectionService();
        }
        return FraudDectionService.instance;
    }
    
    async extractEntitiesFromChatGPT(text) {

        let nerObj = {}
        if (!this.useChatGPT){
            return nerObj
        }
        try{
            const nerChatGPTResult = await this.chatGptAPI.sendMessage(this.chatGptPrompt + text);
            nerObj = JSON.parse(nerChatGPTResult.text);
        }catch (e){
            console.error("we got a bad response from chatgpt. We'll return a blank response to continue the pipeline. error: " + e)
            this.useChatGPT = false;
            this.isError = true;
        }
        return nerObj;
    }

     async constructFraudRequest(nerResult) {


        if (!this.useChatGPT || Object.keys(nerResult).length === 0){
            return {}
        }

        try{
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
        }catch(e){
            console.error("we got a problem parsing results from chatgpt. We'll return a blank response to continue the pipeline. error: " + e)
            this.isError = true;
            return {}
        }
    }
    
    async processPDF(pdfFilePath) {
        try {            

            let dataBuffer = fs.readFileSync(pdfFilePath);
            let pdfData = await pdf(dataBuffer).then(function (data) {
                return data.text;
            });
            return pdfData;
        } catch (error) {
            console.error("we got a problem processing the pdf. We'll return a blank string to continue the pipeline. error: " + e)
            this.isError = true;
            return ""
        } 
    }

    responseMessage(){
        if (this.useChatGPT && this.useFraudLab && !this.isError && !this.isSimulated ){
            return "We used chatgpt and fraudlabs to return these results."
        }else if (this.isSimulated && !this.isError){
            return "We simulated these fraud score results"
        }else if (this.isSimulated && this.isError){
            return "We had an error in either chatgpt or fraudlabs and simulated these fraud score results"
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
            return {isFraud: isFraud, fraudScore: fraudResult, fraudDetails: potentialFraudDetails, disclaimer: this.responseMessage() };

        } catch (error) {
             new Error('An error occurred while detecting fraud', error);
        } 
    }

    async simulateFraudScore(){
        this.isSimulated = true;
        return random.int(0,100);
    }
    async doFraudCheck(theParameters){

        // if we dont use fraudlabs or input params is blank, just simulate score
        if (!this.useFraudLab || Object.keys(theParameters).length === 0){
            let fraudResultSimulatedScore =  await this.simulateFraudScore();
            return fraudResultSimulatedScore;
        }
      
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
        try{
            let fraudResult = await doFraudCheckCall();
            return fraudResult.fraudlabspro_score;
        }catch(e){
            console.error("we got a bad response from fraudlabs. We'll return a simulated response to continue the pipeline. error: " + e)
            let fraudResultSimulatedScore =  await this.simulateFraudScore();
            this.useFraudLab = false;
            return fraudResultSimulatedScore;
        }
        
    }

}
