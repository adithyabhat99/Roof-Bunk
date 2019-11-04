delimiter |
create procedure fetch_pgs2(in L float(10,6),in Ln float(10,6),in num int,dis int,in g char(1),p_name varchar(30))
begin 
select PGID,(6371*acos (
            cos ( radians(L) )
            * cos( radians( lat ) )
            * cos( radians( lng ) - radians(Ln) )
            + sin ( radians(L) )
            * sin( radians( lat ) ))) as distance,lat,lng,Pg_name,Gender from Owner having distance<dis and Gender=g and (upper(Pg_name) like concat(concat('%',upper(p_name)),'%'))
            order by distance limit num,10;
end |
delimiter ;