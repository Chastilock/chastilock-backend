const { LoadedLock } = require('../models');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

//Not Tested yet
async function getLockeeRating(UserID) {
    const RatingsSearch = await LoadedLock.findAll({
        where: {
            Lockee: UserID,
            Unlocked: true,
            [Op.not]: {
                Lockee_Rating: null
            }
        }
    });

    if(RatingsSearch.length < 5) {
        return 0;
    } else {
        let totalRatings = 0;
        RatingsSearch.forEach(Rating => {
            totalRatings = totalRatings + Rating.Lockee_Rating;
        });
        const averageRating = totalRatings / RatingsSearch.length;
        return averageRating.toFixed(2);
    }

}

async function getKeyholderRating(UserID) {
    const RatingsSearch = await LoadedLock.findAll({
        where: {
            Keyholder: UserID,
            Unlocked: true,
            [Op.not]: {
                Keyholder_Rating: null
            }
        }
    });

    if(RatingsSearch.length < 5) {
        return 0;
    } else {
        let totalRatings = 0;
        RatingsSearch.forEach(Rating => {
            totalRatings = totalRatings + Rating.Lockee_Rating;
        });
        const averageRating = totalRatings / RatingsSearch.length;
        return averageRating.toFixed(2);
    }
}
module.exports = {
    getLockeeRating,
    getKeyholderRating
}