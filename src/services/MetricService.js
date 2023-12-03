import { getNumOfUsers, getUserWithBadgeCount } from "../db/usersData.js";
import { getNumOfFraudsters, getFraudsterTrendingCount } from "../db/fraudstersData.js";
import { getNumOfReports, getTopFraudTypeAndCount } from "../db/reportsData.js";
import { getNumOfReviews } from "../db/reviewsData.js";

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
        let numReviews = await getNumOfReviews();
        let topFraudDetails = await getTopFraudTypeAndCount();
                
        return  {numUsers : userCnt, numUsersWithBadges: userCntWithBadge, numFraudsters: fraudstersCnt, numTrendingFraudsters: fraudsterCntTrending, numReports: reportCnt, numTopFraud: topFraudDetails.count, topFraudType: topFraudDetails.type, numReviews: numReviews };
      }


}

