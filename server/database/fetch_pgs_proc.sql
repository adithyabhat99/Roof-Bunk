delimiter |
create procedure fetch_pgs(in Lat float(10,6),in Lng float(10,6),in num int,dis int,in g char(1))
begin 
select PGID,(6371*acos (
            cos ( radians(Lat) )
            * cos( radians( lat ) )
            * cos( radians( lng ) - radians(Lng) )
            + sin ( radians(Lat) )
            * sin( radians( lat ) ))) as distance,lat,lng,Pg_name,Gender from Owner having distance<dis and Gender=g
            order by distance limit num,10;
end |
delimiter ;