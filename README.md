# Pyton Prisma

Woraphong Somphpong

## using it
~~~
cp env.simple .env    ## ถ้ามีการแก้ไข .env ต้อง docker compose -f db.yml down and up again 
ocker compose -f db.yml up -d
~~~

## Prisma
~~~bash
npx prisma generate
npx prisma push db
npx prisma studio
~~~~~