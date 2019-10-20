delimiter |
create procedure fetch_pgs(in Lat float(10,6),in Lng float(10,6),in num int,dis int)
begin 
select PGID from Owner having (6371*acos (
            cos ( radians(Lat) )
            * cos( radians( lat ) )
            * cos( radians( lng ) - radians(Lng) )
            + sin ( radians(Lat) )
            * sin( radians( lat ) )))<dis 
            order by (6371*acos (
            cos ( radians(Lat) )
            * cos( radians( lat ) )
            * cos( radians( lng ) - radians(Lng) )
            + sin ( radians(Lat) )
            * sin( radians( lat ) ))) limit num,10;
end |
delimiter ;