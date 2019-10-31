create view top_rated as select reviews.PGID,Pg_name,avg(rating) from reviews inner join Owner on reviews.PGID=Owner.PGID group by reviews.PGID order by avg(rating) desc;