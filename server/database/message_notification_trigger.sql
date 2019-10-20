delimiter |
create trigger message_notify after insert on messages
for each row 
if new.sender_type='S' then 
    insert into pg_notifications values(new.reciever_id,now(),'message','There is a new message for you');
else 
    insert into student_notifications values(new.reciever_id,now(),'message','There is a new message for you');
end if|
delimiter ;