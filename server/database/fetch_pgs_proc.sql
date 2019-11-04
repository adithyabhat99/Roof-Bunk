delimiter |
create procedure fetch_pgs(in L float(10,6),in Ln float(10,6),in num int,dis int,in g char(1))
begin 
select (6371*acos (
            cos ( radians(L) )
            * cos( radians( lat ) )
            * cos( radians( lng ) - radians(Ln) )
            + sin ( radians(L) )
            * sin( radians( lat ) ))) as distance,lat,lng,Pg_name,Gender,PGID from Owner having Gender=g and distance<dis
            order by distance limit num,10;
end |
delimiter ;