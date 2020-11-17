CREATE TABLE `Users` (
	`User_ID` INT(10) NOT NULL AUTO_INCREMENT,
	`UUID` CHAR(128) NULL DEFAULT NULL COMMENT 'Unique GUID for the user. They can log in with this if they haven\'t set an email address and password' COLLATE 'utf8mb4_0900_ai_ci',
	`Email` VARCHAR(256) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`Password` CHAR(60) NULL DEFAULT NULL COLLATE 'latin1_bin',
	`Username` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`Created` TIMESTAMP NULL DEFAULT NULL,
	`Keyholder` TINYINT(3) NULL DEFAULT NULL COMMENT 'Yes or No',
	`Lockee` TINYINT(3) NULL DEFAULT NULL COMMENT 'Yes or No',
	PRIMARY KEY (`User_ID`) USING BTREE
)
COMMENT='This table holds data about each user (how they login etc)'
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
AUTO_INCREMENT=2
;
