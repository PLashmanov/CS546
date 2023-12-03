
import pdf from 'pdf-parse-fork'
import * as fs from 'fs';

export class DectionService {
    static instance = null;

    static getInstance() {
        if (!DectionService.instance) {
            DectionService.instance = new DectionService();
        }
        return DectionService.instance;
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
            console.log(fileData)

        } catch (error) {
             new Error('An error occurred while detecting fraud', error);
        } 
    }

}

