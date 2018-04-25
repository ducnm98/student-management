CREATE DATABASE IF NOT EXISTS `student_management`;
ALTER DATABASE `student_management` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `persons`(
    `personID`  VARCHAR(50)   NOT NULL, -- Is a Identify Card
    `firstName` VARCHAR(150)  NOT NULL,
    `lastName` VARCHAR(150)   NOT NULL,
    `gender` TINYINT(1),
    `dateOfBirth` DATE,
    `telephone` VARCHAR(11),
    `address` VARCHAR(100),
    `personsType` VARCHAR(20),
    PRIMARY KEY (`personID`)
);

CREATE TABLE `employees`(
    `employeeID` VARCHAR(50)  NOT NULL,
    `salary` FLOAT(12, 2),
    `contractStartDate` DATETIME,
    `contractDateEnd` DATETIME,
    `employeeType` VARCHAR(20),
    PRIMARY KEY (`employeeID`),
    CONSTRAINT fk_employees_persons FOREIGN KEY (`employeeID`) REFERENCES `persons`(`personID`)
);

CREATE TABLE `teachers`(
    `teacherID` VARCHAR(50)  NOT NULL,
    `subjectTeach` VARCHAR(50),
    `rank` INT(1),
    PRIMARY KEY (`teacherID`),
    CONSTRAINT fk_teachers_employees FOREIGN KEY (`teacherID`) REFERENCES `employees`(`employeeID`)
);

CREATE TABLE `supervisors`(
    `supervisorID` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`supervisorID`),
    CONSTRAINT fk_supervisors_employees FOREIGN KEY (`supervisorID`) REFERENCES `employees`(`employeeID`)
);

CREATE TABLE `students`(
    `studentID` VARCHAR(50)  NOT NULL,
    `startDate` DATE,
    `parentalName` VARCHAR(50),
    `parentalTelephone` VARCHAR(13),
    PRIMARY KEY (`studentID`),
    CONSTRAINT fk_students_persons FOREIGN KEY (`studentID`) REFERENCES `persons`(`personID`)
);

CREATE TABLE `rooms`(
    `roomID` VARCHAR(50)    NOT NULL,
    `capacity` INT(3),
    `status` TINYINT(1),
    PRIMARY KEY (`roomID`)
);

CREATE TABLE `academicYear` (
    `academicYearID` INT(4) NOT NULL,
    `academicYear` DATE,
    `semester` INT(2),
    PRIMARY KEY (`academicYearID`)
);

CREATE TABLE `classes`(
    `classID` VARCHAR(50)       NOT NULL,
    `roomID` VARCHAR(50)        NOT NULL,
    `mainTeacherID` VARCHAR(50) NOT NULL,
    `academicYearID` INT(4)     NOT NULL,
    `level` INT(2) DEFAULT 10,
    `noOfStudents` INT(3),
    PRIMARY KEY (`classID`),
    CONSTRAINT fk_classes_rooms FOREIGN KEY (`roomID`) REFERENCES `rooms`(`roomID`),
    CONSTRAINT fk_classes_teachers FOREIGN KEY (`mainTeacherID`) REFERENCES `teachers`(`teacherID`),
    CONSTRAINT fk_classsess_academicYearID FOREIGN KEY (`academicYearID`) REFERENCES `academicYear`(`academicYearID`)
);

CREATE TABLE `studiesAt`(
    `studentID` VARCHAR(50) NOT NULL,
    `classID` VARCHAR(50)   NOT NULL,
    PRIMARY KEY (`studentID`, `classID`),
    CONSTRAINT fk_studiesat_students FOREIGN KEY (`studentID`) REFERENCES `students`(`studentID`),
    CONSTRAINT fk_studiesat_classes FOREIGN KEY (`classID`) REFERENCES `classes`(`classID`)
);

CREATE TABLE `events`(
    `eventID` INT(20) NOT NULL AUTO_INCREMENT,
    `dispatcherID` VARCHAR(50) NOT NULL,
    `eventType` VARCHAR(20),
    `startTime` DATETIME,
    `endTime` DATETIME,
    `roomID` VARCHAR(50),
    `content` VARCHAR(200),
    PRIMARY KEY (`eventID`),
    CONSTRAINT fk_events_persons FOREIGN KEY (`dispatcherID`) REFERENCES `persons`(`personID`),
    CONSTRAINT fk_events_roomID FOREIGN key (`roomID`) REFERENCES `rooms`(`roomID`)
);

CREATE TABLE `roomRentails`(
    `roomRentalID` INT(20)  NOT NULL AUTO_INCREMENT,
    `recipientID` VARCHAR(50)   NOT NULL,
    `recipientType` VARCHAR(20),
    `dateOfRental` DATETIME,
    `approvalID` VARCHAR(50),
    `isReturned` TINYINT(1),
    `returnDate` DATETIME,
    PRIMARY KEY (`roomRentalID`),
    CONSTRAINT fk_roomrentals_persons FOREIGN KEY (`recipientID`) REFERENCES `persons`(`personID`),
	CONSTRAINT fk_roomrentals_employees FOREIGN KEY (`approvalID`) REFERENCES `employees`(`employeeID`)
);

CREATE TABLE `subjects`(
    `subjectID` VARCHAR(50) NOT NULL,
    `subjectName` VARCHAR(20),
    `teacherID` VARCHAR(50) NOT NULL,
    `semester` SMALLINT(2),
    `academicYearID` INT(4),
    PRIMARY KEY (`subjectID`, `teacherID`),
    CONSTRAINT fk_subjects_teachers FOREIGN KEY (`teacherID`) REFERENCES `teachers`(`teacherID`),
    CONSTRAINT fk_subjects_academicYearID FOREIGN KEY (`academicYearID`) REFERENCES `academicYear`(`academicYearID`)
);

CREATE TABLE `grades`(
    `gradeID` VARCHAR(50) NOT NULL,
    `studentID` VARCHAR(50) NOT NULL,
    `subjectID` VARCHAR(50) NOT NULL,
    `academicYearID` INT(4),
    `oralScore` FLOAT(2, 2),
    `fifteenMinutesScore` FLOAT(2, 2),
    `periodScore` FLOAT(2, 2),
    `finalScore` FLOAT(2, 2),
    PRIMARY KEY (`gradeID`),
    CONSTRAINT fk_grades_students FOREIGN KEY (`studentID`) REFERENCES `students`(`studentID`),
    CONSTRAINT fk_grades_subjects FOREIGN KEY (`subjectID`) REFERENCES `subjects`(`subjectID`),
    CONSTRAINT fk_grades_academicYearID FOREIGN KEY (`academicYearID`) REFERENCES `academicYear`(`academicYearID`)
);

CREATE TABLE `reportDetails` (
    `reportID` VARCHAR(50) NOT NULL,
    `creatorReportID` VARCHAR(50) NOT NULL,
    `reportTitle` VARCHAR(50),
    `createdAt` DATETIME,
    `content` VARCHAR(100),
    `reportType` VARCHAR(20),
    PRIMARY KEY (`reportID`),
    CONSTRAINT fk_reports_employees FOREIGN KEY (`creatorReportID`) REFERENCES `employees`(`employeeID`)
);

CREATE TABLE `reportClass` (
    `reportID` VARCHAR(50) NOT NULL,
    `classID` VARCHAR(50) NOT NULL,
    `numberOfExcellentStudents` INT(2),
    `numberOfGoodStudents` INT(2),
    `numberOfNormalStudents` INT(2),
    `numberOfWeakStudents` INT(2),
    `typeOfReport` VARCHAR(20),
    PRIMARY KEY (`reportID`, `classID`),
    CONSTRAINT FK_reportClass_classID FOREIGN KEY (`classID`) REFERENCES `classes`(`classID`)
);

CREATE TABLE `reportClassDetail` (
    `reportID` VARCHAR(50) NOT NULL,
    `subjectID` VARCHAR(50) NOT NULL,
    `studentID` VARCHAR(50) NOT NULL,
    `averagePoint` FLOAT(2, 2),
    PRIMARY KEY (`reportID`, `subjectID`, `studentID`),
    CONSTRAINT fk_reportClassDetail_reportID FOREIGN KEY (`reportID`) REFERENCES `reportClass`(`reportID`),
    CONSTRAINT fk_reportClassDetail_subjectID FOREIGN KEY (`subjectID`) REFERENCES `subjects`(`subjectID`),
    CONSTRAINT fk_reportClassDetail_studentID FOREIGN KEY (`studentID`) REFERENCES `students`(`studentID`)
);

CREATE TABLE `reportStudent` (
    `reportID` VARCHAR(50) NOT NULL,
    `studentID` VARCHAR(50) NOT NULL,
    `gradeID` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`reportID`, `studentID`),
    CONSTRAINT fk_reportStudent_studentID FOREIGN KEY (`studentID`) REFERENCES `students`(`studentID`)
);

CREATE TABLE `ROLES` (
    `roleID` INT(10) NOT NULL AUTO_INCREMENT,
    `isAdmin` TINYINT(1) DEFAULT 0,
    `viewStudents` TINYINT(1) DEFAULT 0,
    `controlStudents` TINYINT(1) DEFAULT 0,
    `viewClasses` TINYINT(1) DEFAULT 0,
    `controlClasses` TINYINT(1) DEFAULT 0,
    `viewSubjects` TINYINT(1) DEFAULT 0,
    `controlSubjects` TINYINT(1) DEFAULT 0,
    `viewTeachers` TINYINT(1) DEFAULT 0,
    `controlTeachers` TINYINT(1) DEFAULT 0,
    `viewEmployees` TINYINT(1) DEFAULT 0,
    `controlEmployees` TINYINT(1) DEFAULT 0,
    `viewGrades` TINYINT(1) DEFAULT 0,
    `controlGrades` TINYINT(1) DEFAULT 0,
    `viewEvents` TINYINT(1) DEFAULT 0,
    `controlEvents` TINYINT(1) DEFAULT 0,
    `viewReports` TINYINT(1) DEFAULT 0,
    `controlReports` TINYINT(1) DEFAULT 0,
    `rentailRooms` TINYINT(1) DEFAULT 0,
    `approveRooms` TINYINT(1) DEFAULT 0,
    PRIMARY KEY (`roleID`)
);

CREATE TABLE `users` (
    `userID` INT(10) NOT NULL AUTO_INCREMENT,
    `personID` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50),
    `password` VARCHAR(100),
    `roleID` INT(10) NOT NULL,
    PRIMARY KEY (`userID`, `personID`),
    CONSTRAINT fk_users_persons FOREIGN KEY (`personID`) REFERENCES `persons`(`personID`),
    CONSTRAINT fk_users_roles FOREIGN KEY (`roleID`) REFERENCES `roles`(`roleID`)
);

CREATE TABLE `loginActivity` (
    `loginActivityID` INT(10) NOT NULL AUTO_INCREMENT,
    `userID` INT NOT NULL,
    `logInDate` DATETIME DEFAULT NOW(),
    `logOutDate` DATETIME,
    PRIMARY KEY (`loginActivityID` ,`userID`),
    CONSTRAINT fk_loginactivities_users FOREIGN KEY (`userID`) REFERENCES `users`(`userID`)
);

INSERT INTO `roles` VALUES ('1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1');
INSERT INTO `persons` VALUES('1', 'Michael', 'John', '1', '2018-04-18 00:00:00', '0932680505', 'abc', 'employee');
INSERT INTO `employees` VALUES ('1', '125125125.12', '2018-04-10 00:00:00', NULL, NULL);
INSERT INTO `users` (`userID`, `personID`, `email`, `password`, `roleID`) VALUES ('1', '1', 'ducnm.john98@gmail.com', '$2a$12$9T0Wrc.4QpSMmerRZjcrOOnBdgNxhbPVHFvGaOW9KeIP9qzrnnhBq', '1');

DELIMITER $$
CREATE PROCEDURE findRole(personID varchar(50)) 
BEGIN 
    SELECT * FROM roles
    WHERE roles.roleID IN (SELECT U.roleID FROM users U WHERE U.personID = personID);
END;
 $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE findPersonInfo(personID varchar(50)) 
BEGIN 
    SELECT * FROM persons
    WHERE persons.personID = personID;
END;
 $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE findUsers(personID varchar(50)) 
BEGIN 
    SELECT * FROM users
    WHERE users.personID = personID;
END;
 $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE findPersonDetail(personID varchar(50)) 
BEGIN 
    DECLARE typeOfPerson VARCHAR(20);
    SELECT P.personsType INTO typeOfPerson FROM persons P WHERE P.personID = personID;
    IF (typeOfPerson = 'employee')
    THEN BEGIN
        SELECT *
        FROM persons INNER JOIN employees
        ON persons.personID = employees.employeeID
        WHERE persons.personID = personID;
    END;
    ELSE BEGIN
        SELECT *
        FROM persons INNER JOIN students
        ON persons.personID = students.studentID
        WHERE persons.personID = personID;
    END;
    END IF;
END;
 $$
DELIMITER ;