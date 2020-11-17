CREATE TABLE `CreatedLocks` (
	`Lock_ID` INT(10) NOT NULL AUTO_INCREMENT,
	`User_ID` INT(10) NOT NULL COMMENT 'User ID of the user that created the lock',
	`Lock_Type` TINYINT(1) NOT NULL DEFAULT '0' COMMENT '0 for fixed. 1 for variable',
	`Lock_Name` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`Disabled` TINYINT(1) NOT NULL COMMENT 'Whether the lock can be loaded or not. Yes or No',
	`Fixed_Length` INT(10) NULL DEFAULT NULL COMMENT 'This is the number of seconds the lock lasts. It will only be set if the lock is a fixed lock, otherwise it will be null',
	`Variable_Max_Greens` INT(10) NULL DEFAULT NULL,
	`Variable_Max_Reds` INT(10) NULL DEFAULT NULL,
	`Variable_Max_Freezes` INT(10) NULL DEFAULT NULL,
	`Variable_Max_Doubles` INT(10) NULL DEFAULT NULL,
	`Variable_Max_Stickies` INT(10) NULL DEFAULT NULL,
	`Variable_Max_AddRed` INT(10) NULL DEFAULT NULL,
	`Variable_Max_RemoveRed` INT(10) NULL DEFAULT NULL,
	`Variable_Max_RandomRed` INT(10) NULL DEFAULT NULL,
	`Variable_Min_Greens` INT(10) NULL DEFAULT NULL,
	`Variable_Min_Reds` INT(10) NULL DEFAULT NULL,
	`Variable_Min_Freezes` INT(10) NULL DEFAULT NULL,
	`Variable_Min_Doubles` INT(10) NULL DEFAULT NULL,
	`Variable_Min_Stickies` INT(10) NULL DEFAULT NULL,
	`Variable_Min_AddRed` INT(10) NULL DEFAULT NULL,
	`Variable_Min_RemoveRed` INT(10) NULL DEFAULT NULL,
	`Variable_Min_RandomRed` INT(10) NULL DEFAULT NULL,
	PRIMARY KEY (`Lock_ID`) USING BTREE
)
COMMENT='This holds the locks created by keyholders or for yourself. When a lock is loaded, a new instance will be created a different table. '
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
AUTO_INCREMENT=5
;
