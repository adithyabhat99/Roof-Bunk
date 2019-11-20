delimiter ||
create procedure delete_stud(in id varchar(128))
begin
delete from Student where UID=id;
delete from messages where sender_id=id or reciever_id=id;
end ||
delimiter ;