delimiter |
create trigger message_notify after insert on messages
for each row 
if new.sender_type1='S' then 
    insert into pg_notifications(PGID,ndate,type1,message) values(new.reciever_id,now(),'message','There is a new message for you');
else 
    insert into student_notifications(UID,ndate,type1,message) values(new.reciever_id,now(),'message','There is a new message for you');
end if|
delimiter ; 