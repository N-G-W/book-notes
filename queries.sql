-- create book notes table
create table notes(
id serial primary key, 
title text,
date_read text, 
review text,
overview text,
notes text
);

-- add new book with notes to database
insert into notes(title, date_read, review, overview, notes)
values ('Book title 1', '20025-01-01', '10', 'This was a great book', 'This was a great book. Read it multiple times. Gets better every single time.')
returning *

-- read all the books from the database
select * 
from notes

-- update a book with a particular id
update notes set title='${req.body.title}', date_read='${req.body.date_read}',
review='${req.body.review}', overview='${req.body.notes}', notes='${req.body.notes}' 
where notes.id = 1
returning *