delimiter ||
create procedure delete_pg(in id varchar(128))
begin
delete from Owner where PGID=id;
delete from messages where sender_id=id or reciever_id=id;
end ||
delimiter ;