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

## New Hw8 create new branch 2-create-prisma-orm
#edit prisma schema.prisma   renabe User To Profile  Dont forget start Docker
~~~bash
npx prisma migrate dev --name rename_user_to_profile
npx prisma generate
npx prisma push db
npx prisma studio
~~~
