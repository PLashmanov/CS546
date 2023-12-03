import { getNumOfUsers, getUserWithBadgeCount } from "../db/usersData.js";
import { getNumOfFraudsters, getFraudsterTrendingCount } from "../db/fraudstersData.js";
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
        let userCntWithBadge = await getUserWithBadgeCount();
        let fraudstersCnt = await getNumOfFraudsters();
        let fraudsterCntTrending = await getFraudsterTrendingCount()
        let reportCnt = await getNumOfReports();
        //TODO
        let numTopFraud = 50
        let topFraudType= "insurance_fraud"
        let numReviews = 55
        return  {numUsers : userCnt, numUsersWithBadges: userCntWithBadge, numFraudsters: fraudstersCnt, numTrendingFraudsters: fraudsterCntTrending, numReports: reportCnt, numTopFraud: numTopFraud, topFraudType: topFraudType, numReviews: numReviews };
      }


}

