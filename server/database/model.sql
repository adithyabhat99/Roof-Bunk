delimiter |

create PROCEDURE createTables()
BEGIN
    #creating student table
    create table if not exists Student
    (
    UID varchar(128) primary key,
    Name varchar(20) NOT NULL,
    Contact_number varchar(128) NOT NULL UNIQUE KEY,
    Email varchar(128) NOT NULL UNIQUE KEY,
    Password varchar(255) NOT NULL,
    Photo varchar(128),
    Gender char(1) NOT NULL,
    DOB date NOT NULL,
    OTP int(4) NOT NULL,
    EOTP int(4) NOT NULL,
    EVerified tinyint(1) default 0, #value is 1 if email is verified 
    Verified tinyint(1) default 0, #value 1 is se if phone is verified
    constraint check_student_gender check (Gender='M' or Gender='F' or Gender='O')
    );
    #creating table for the PG owner
    create table if not exists Owner
    (
        PGID varchar(128) primary key,
        Pg_name varchar(30) NOT NULL,
        Owner_name varchar(30) NOT NULL,
        Contact varchar(128) NOT NULL UNIQUE KEY,
        Email varchar(128) NOT NULL UNIQUE KEY,
        Password varchar(255) NOT NULL,
        OTP int(4) NOT NULL,
        EOTP int(4) NOT NULL,
        Description text,
        Verified tinyint(1) default 0, #value is 1 if phone is verified
        EVerified tinyint(1) default 0, #value is 1 if email is verified 
        lat FLOAT(10,6) not null,
        lng FLOAT(10,6) not null,
        Gender char(1) NOT NULL,
        Bathroom tinyint(1) default 1,#Enter 1 for attatched bathroom facilities else 0
        Wifi tinyint(1) default 0,#Enter 1 for Wifi facilities else 0
        AC tinyint(1) default 0,#Enter 1 for AC facilities else 0
        Meals tinyint(1) default 1,#Enter 1 for Meals facilities else 0
        Laundry tinyint(1) default 0,#Enter 1 for Laundry facilities else 0
        Maid tinyint(1) default 1,#Enter 1 for maid facilities else 0
        students_preffered tinyint(1) default 1, #Enter 1 if you prefer students else 0
        constraint check_pg_gender check (Gender='M' or Gender='F' or Gender='O')
    );
    #table containing the description of the rooms(There can be different type1s of rooms in a PG)
    create table if not exists Room
    (
        PGID varchar(128),
        foreign key(PGID) references Owner(PGID) on delete cascade,
        Empty1 int(3), 
        Type1 int(1), 
        Price int(5),
        CONSTRAINT ID_TYPE1 primary key(PGID,Type1)
    );
    create table if not exists PG_Pictures 
    (
        PGID varchar(128),
        foreign key(PGID) references Owner(PGID) on delete cascade,
        photo varchar(128) not null unique
    );
    create table if not exists reviews 
    ( 
        UID varchar(128), 
        foreign key(UID) references Student(UID) on delete cascade, 
        PGID varchar(128), 
        foreign key(PGID) references Owner(PGID) on delete cascade, 
        review text not null, 
        rating int not null, 
        rdate datetime not null,
        CONSTRAINT rid primary key(UID,PGID) 
    );
    create table if not exists pg_notifications 
    ( 
        id int primary key auto_increment,
        PGID varchar(128),  
        foreign key(PGID) references Owner(PGID) on delete cascade,  
        ndate datetime not null, 
        type1 varchar(10) not null,
        message text not null,
        read_status tinyint(1) default 0
    );
    create table if not exists student_notifications 
    ( 
        id int primary key auto_increment,
        UID varchar(128),  
        foreign key(UID) references Student(UID) on delete cascade,  
        ndate datetime not null, 
        type1 varchar(10) not null,
        message text not null,
        read_status tinyint(1) default 0
    );
    create table if not exists messages 
    ( 
        id int primary key auto_increment,
        sender_type1 char(1) not null, # 'P' for pg and 'S' for student
        sender_id varchar(128) not null, 
        reciever_id varchar(128) not null, 
        message varchar(255) not null,
        mdate datetime not null,
        constraint check_type1 check (sender_type1='P' or sender_type1='S')
    );
END |

delimiter ;