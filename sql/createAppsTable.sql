CREATE TABLE `Apps` (
	`App_ID` INT(10) NOT NULL AUTO_INCREMENT,
	`Name` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`API_Key` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`API_Secret` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	PRIMARY KEY (`App_ID`) USING BTREE
)
COMMENT='This table holds details of the different apps that use the API. It holds the keys required to authenticate as well as the '
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;