import { getNumOfUsers } from "../db/usersData.js";
import { getNumOfFraudsters } from "../db/fraudstersData.js";
import { getNumOfReports } from "../db/reportsData.js";

export class MetricService {
    static instance = null;

    static getInstance() {
        if (!MetricService.instance) {
            MetricService.instance = new MetricService();
        }
        return MetricService.instance;
    }
    async getMetrics() {

        let userCnt = await getNumOfUsers();
        //TODO
        let userCntWithBadge = 0;
        let fraudstersCnt = await getNumOfFraudsters();
        //TODO
        let fraudsterCntTrending = 0;
        let reportCnt = await getNumOfReports();
        //TODO
        let reportTop5 = await this.getType5Fraud();

        return  {numUsers : userCnt, numUsersWithBadges: userCntWithBadge, numFraudsters: fraudstersCnt, numTrendingFraudsters: fraudsterCntTrending, numReports: reportCnt,  top5FraudTypes: reportTop5};
      }
      async getType5Fraud() {
        return [ {type: 'wire_fraud', cnt: 5},{type: 'creditcard_fraud', cnt: 4} ,{type: 'check_fraud', cnt: 3} ,{type: 'insurance_fraud', cnt: 2} ,{type: 'identify_theft', cnt: 1} ]
      }

}

