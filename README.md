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
## change name User to Profile
~~~bash
npx prisma migrate dev --name rename_user_to_profile
npx prisma generate
npx prisma push db
npx prisma studio
~~~~

## หลังจาก แก้ไข schma.prisma แล้วทำการ reset ทำให้ database หายหมด ต้อง 
npx prisma migrate dev --name init_profile_table  // สร้างง table ใหม่
~~~~~~~
