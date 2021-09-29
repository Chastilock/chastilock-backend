const { ChastikeyImport } = require("../models");
const { Op } = require("sequelize")

const deleteExpiredImports = async function() {
    const CurrentDateAndTime = new Date();
    
    ChastikeyImport.destroy({
        where: {
            [Op.and]: [
                {
                    Expires: {
                        [Op.lt]: CurrentDateAndTime
                    }
                },
                {
                    Complete: {
                        [Op.eq]: null
                    }
                    
                }
            ] 
        }
    });
}
module.exports = deleteExpiredImports;
deleteExpiredImports();