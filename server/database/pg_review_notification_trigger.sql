delimiter |
create trigger notify_pg after insert on reviews
for each row
begin
insert into pg_notifications(PGID,ndate,type1,message) values(new.PGID,now(),'review','There is a new review posted to your PG!');
end |
delimiter ;