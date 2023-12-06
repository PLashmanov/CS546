import dotenv from 'dotenv';
import pdf from 'pdf-parse-fork'
import * as fs from 'fs';
import { createDetectionRecord } from "../db/detectionsData.js";
import random from 'random'
import { ChatGPTAPI } from 'chatgpt'

export class FraudDectionService {
    static instance = null;

    
    constructor() {

        this.chatGptPrompt = 'Please extract named enttities (email, last_name, first_name, address, city, state, zip_code, country and phone_number ) returning json in the following text:'
        this.chatGptFraudScorePrompt = 'Please review the text and give a fraud score based on the text from 1-100. put the score in json{fraud_Score=fraudScore , reason= }  where the fraud_score key should contain the fraud score and the reason key should have the reason for the fraud score. Be very strict and do a thorough analysis based on the attributes in this text to detect. Anything that seems suspicious should be noted even if it isnt obvious and put findings in the reason attribute: '
        //this.reset();
        /*  this.useChatGPT = false;
        this.isSimulated = true;
        this.isError = false;

        if (process.env.CHATGPT_KEY){
            this.useChatGPT = true;
            this.isSimulated = false;
            this.chatGptAPI = new ChatGPTAPI({
                apiKey: process.env.CHATGPT_KEY
            })
        } */

    }

    static getInstance() {
        if (!FraudDectionService.instance) {
            FraudDectionService.instance = new FraudDectionService();
        }
        FraudDectionService.instance.reset();
        return FraudDectionService.instance;
    }
    
    reset(){

        this.useChatGPT = false;
        this.isSimulated = true;
        this.isError = false;
        if (process.env.CHATGPT_KEY){
            this.useChatGPT = true;
            this.isSimulated = false;
            this.chatGptAPI = new ChatGPTAPI({
                apiKey: process.env.CHATGPT_KEY
            })
        }
    }

    async chatGPTFraudScore(text) {

        let chatgptFraudScoreResponse = {}
        if (!this.useChatGPT){
            return await this.simulateFraudScore();
        }
        try{
            const chatGPTResult = await this.chatGptAPI.sendMessage(this.chatGptFraudScorePrompt + text);
            chatgptFraudScoreResponse = JSON.parse(chatGPTResult.text);
        }catch (e){
            console.error("we got a bad response from chatgpt. We'll return a simulated score. error: " + e)
            this.useChatGPT = false;
            this.isError = true;
            chatgptFraudScoreResponse = await this.simulateFraudScore();
        }
        return chatgptFraudScoreResponse;
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

    logProcessMessage(){
        let processMessage  = ""
        if (this.useChatGPT && this.useFraudLab && !this.isError && !this.isSimulated ){
            processMessage = "We used chatgpt to return these results."
        }else if (this.isSimulated && !this.isError){
            processMessage =  "We simulated these fraud score results"
        }else if (this.isSimulated && this.isError){
            processMessage = "We had an error in either chatgpt and simulated these fraud score results"
        }
        console.log(processMessage)
    }

    async detectFraud(file) {
        try {    
            // get text from pdf        
            let fileData =  await this.processPDF(file);

            // fraudscore and reason from chatgpt
            let fraudResult = await this.chatGPTFraudScore(fileData);

            // if over 70 from fraud check score, its fraud y'all!
            let fraudScore = fraudResult.fraudScore
            let isFraud = (fraudScore> 70) ? true: false;

            // submit metric for reporting dashboard
            let detectFraudRecord = await createDetectionRecord(isFraud,fraudResult.fraudScore,fraudResult.reason);

            this.logProcessMessage();
            return {isFraud: isFraud, fraudScore: fraudScore, fraudDetails: fraudResult.reason };

        } catch (error) {
            console.error(e)
            new Error('An error occurred while detecting fraud', error);
        } 
    }

    async simulateFraudScore(){
        this.isSimulated = true;
        return {'fraudScore': random.int(0,100), 'reason': 'The provided details show inconsistencies and potential red flags. The mismatch in the country (stated as China) compared to the address in West Palm Beach, FL, USA is a significant anomaly. Additionally, the use of an email with China as the country and the request to bypass the account application form may indicate a potential attempt to manipulate the account opening process. While the language is generally polite, these discrepancies raise concerns, warranting further scrutiny and verification' };
    }
    
}

