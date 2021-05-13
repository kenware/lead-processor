import moment from 'moment';
import Handler from '../utils/handler';
import { getLeadWithStatus } from '../utils/params';
import dynamoDbClient from '../models';
import logger from '../utils/logger';

/**
 * This crone job automatically releases any assigned
 * lead that is more than 130sec if the user does not refresh the browser
 * when the session expires or the user logs out of the application before
 * session expires
 */
const RealeaseInprogressLead = async () => {
    let allData = true;
    let params = getLeadWithStatus('InProgress', null);

    while(allData) {
        let data = await dynamoDbClient.query(params).promise();
        for (let item of data.Items) {
            if (item.timestamp) {
                const start = moment(item.timestamp, 'YYYY.MM.DD HH:mm:ss');
                if (moment().diff(start, 'seconds') >= 130) {
                    logger.info('Release lead with Inprogress status from the user');
                    await Handler.releaseInprogressLead(item.emailLeadId);
                }

            }
        }
        if (data.LastEvaluatedKey) {
            // there are more Inprogress data ie have exceeded 1mb
            params.ExclusiveStartKey = data.LastEvaluatedKey;
        }else {
            allData = false;
        };
    };
};
export default RealeaseInprogressLead;
