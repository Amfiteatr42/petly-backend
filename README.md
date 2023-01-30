# pet-backend



post   /api/users/signup                userRegistration         without Token

get    /api/users/verify/:id/:code      verificateEmailToken     without Token

get    /api/users/login                 userLogin                without Token

get    /api/users/current               getInfoCurrentUser       need Token

patch  /api/users/update                updateUser               need Token       

patch  /api/users/refresh               refreshUser              need longToken

post   /api/users/favorite/:id          setFavoriteAds           need Token (:id - adsId)

delete /api/users/favorite/:id          removeFavoriteAds        need Token (:id - adsId)

=========================================================

get     /api/ads/                   getAllAds      without Token     
        примеры localhost:3333/api/ads/
                localhost:3333/api/ads/?categoryId=1
                localhost:3333/api/ads/?categoryId=1&page=1&limit=4
        в каждом случае будет работать

get     /api/ads/my                 getMyAds        need Token

get     /api/ads/ad/:id             getAdById       need Token

post    /api/ads/add                addAd           need Token

delete  /api/ads/remove/:id         removeAd        need Token

patch   /api/ads/update/:id         updateAd        need Token

get     /api/ads/search             НЕТ РЕШЕНИЯ     without Token




Пользователь

регистрация двухэтапная
1а
МЕТОД POST:  localhost:3333/api/users/signup
хедеров - нет
боди
{
    "email": "test@test.com",
    "password": "12345678",
    "userName": "test",
    "city": "New-York",
    "phone": "0380671000000"
}
ответ
{
    "message": "Hello, new freind!!!",
    "data": {
        "_id": 2,
        "email": "test@test.com"
    },
    "verificationEmailToken": "2215"
}
по задумке "verificationEmailToken": "2215" приходит в почту/телефон, но пока приходит с ответом

1б 
МЕТОД GET: localhost:3333/api/users/verify/2/2215 
в парамертрах  "_id": 2 и "verificationEmailToken": "2215"

хедеров - нет
боди - нет
ответ
{
    "message": "Verification successful",
    "data": {
        "_id": 2,
        "email": "test@test.com",
        "userName": "test",
        "city": "New-York",
        "phone": "0380671000000"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjc0OTMxMTc4fQ.I9kaulBObpq4MOHq4raD3iTwanceICRkB5S9Zs2XOvM",
    "longToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjc0OTMxMTc4fQ.I9kaulBObpq4MOHq4raD3iTwanceICRkB5S9Zs2XOvM"
}
token - для текущих запросов
longToken - для рефреша
По задумке токен умирает через 1 час и при ответе "неавтроризован" фронт отправляет рефреш с longToken

2.
Авторизация
МЕТОД GET: localhost:3333/api/users/login
хедеров - нет
боди

{
    "email": "test@test.com",
    "password": "12345678"
 }

 ответ

 {
    "message": "Authorization is successful",
    "data": {
        "_id": 2,
        "email": "test@test.com",
        "userName": "test",
        "city": "New-York",
        "phone": "0380671000000"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjc0OTk3OTMyfQ.M6JRm96MLgXda_EvORAd3KDOVOnXNSQkE1v-c-2jano",
    "longToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjc0OTk3OTMyfQ.M6JRm96MLgXda_EvORAd3KDOVOnXNSQkE1v-c-2jano"
}
3. 
текущий пользователь (не знаю зачем)
МЕТОД GET: localhost:3333/api/users/current
хедер Authorization: Bearer <token>
боди - нет
ответ
{
    "message": "Current user",
    "data": {
        "_id": 1,
        "email": "selutin@gmail.com",
        "userName": "RomaXXX",
        "city": "Odessa-Mama",
        "phone": "0380671234567"
    }
}

4. 
любое изменение в данных пользователя
МЕТОД PATCH: localhost:3333/api/users/update
хедер Authorization: Bearer <token>
боди
{
    "userName": "Roma",
    "city": "Odessa"
}
пишем только то что меняем!!!!
ответ
{
    "message": "Info updated",
    "data": {
        "_id": 1,
        "email": "selutin@gmail.com",
        "userName": "Roma",
        "city": "Odessa",
        "phone": "0380671234567"
    }
} 
возвращает пользователя с изменениями

5.
рефреш
МЕТОД PATCH:  localhost:3333/api/users/refresh
хедер Authorization: Bearer <longToken>
боди - нет
ответ
{
    "message": "Tokens updated",
    "data": {
        "_id": 2,
        "email": "test@test.com",
        "userName": "test",
        "city": "New-York",
        "phone": "0380671000000"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjc1MDExNTc2fQ.w6XdT-iiAGaprYxXx5tm7t3eMX6xbSLezYDVg7it0cU",
    "longToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjc1MDExNTc2fQ.w6XdT-iiAGaprYxXx5tm7t3eMX6xbSLezYDVg7it0cU"
}
обновляются все токены. Старые больше не действуют
При неверном longToken - нужна авторизация

КАТЕГОРИИ ОБЬЯВ.
Двигаемся к ОЛХ!!!! НО МЕДЛЕНО

1 добавление МЕТОД POST:localhost:3333/api/adscategory/add
2. изменение МЕТОД PATCH: localhost:3333/api/adscategory/update/2
это пока вам на фронте не надо

3. получение всего списка
МЕТОД GET: localhost:3333/api/adscategory
хедер  - нет
боди - нет
АВТОРИЗАЦИЯ НЕ НУЖНА ДАННЫЕ ДОСТУПНЫ
ответ
{
    "message": "List of category",
    "data": [
        {
            "_id": 1,
            "nameCategory": "sell",
            "__v": 0
        },
        {
            "_id": 2,
            "nameCategory": "lost or found",
            "__v": 0
        },
        {
            "_id": 3,
            "nameCategory": "in good hands",
            "__v": 0
        }
    ]
}

ЖИВОТНЫЕ ПОЛЬЗОВАТЕЛЯ

1. Получить список
МЕТОД GET: localhost:3333/api/userspets/add
хедер Authorization: Bearer <token>
боди нет

ответ

{
    "message": "Success",
    "data": [
        {
            "_id": 5,
            "imgURL": "",
            "name": "Sharik",
            "dateOfBirth": "2020-02-09T22:00:00.000Z",
            "breed": "Layka",
            "comment": "Fury dog"
        },
        {
            "_id": 6,
            "imgURL": "",
            "name": "Drug",
            "dateOfBirth": "2020-02-09T22:00:00.000Z",
            "breed": "balonka",
            "comment": "Stuped dog"
        }
    ]
}
только авторизированного пользователя!!!!

2. 
добавление МЕТОД POST: localhost:3333/api/userspets/add
хедер Authorization: Bearer <token>
боди
{
  "name": "Drug",
  "dateOfBirth": "02.10.2020",
  "breed": "balonka",
  "comment": "Stuped dog"

}
ответ
{
    "message": "Pet added",
    "data": {
        "_id": 6,
        "imgURL": "",
        "name": "Drug",
        "dateOfBirth": "2020-02-09T22:00:00.000Z",
        "breed": "balonka",
        "comment": "Stuped dog",
        "userId": 2,
        "__v": 0
    }
}
Заметил, что много вернул, потом поправлю


3. 
удаление МЕТОД DELETE: localhost:3333/api/userspets/remove/6 (ид животины)
хедер Authorization: Bearer <token>
боди нет

ответ
{
    "message": "Delete success",
    "data": {
        "_id": 6,
        "imgURL": "",
        "name": "Drug",
        "dateOfBirth": "2020-02-09T22:00:00.000Z",
        "breed": "balonka",
        "comment": "cute dog",
        "userId": 2,
        "__v": 0
    }
}
Заметил, что много вернул, потом поправлю. Возвращается весь удаленный обьект

4
обновление МЕТОД PATCH: localhost:3333/api/userspets//update/:id (ид животины)
хедер Authorization: Bearer <token>
боди {
        "name": "Druzok",
        "breed": "bolonka"
    }

ответ
{
    "message": "Update success",
    "data": {
        "_id": 6,
        "imgURL": "",
        "name": "Druzok",
        "dateOfBirth": "2020-02-09T22:00:00.000Z",
        "breed": "bolonka",
        "comment": "Stuped dog",
        "userId": 2,
        "__v": 0
    }
}

ОГОЛОШЕННЯ

1.
Получить весь список
МЕТОД GET: localhost:3333/api/ads
хедер нет
боди нет
ответ
{
    "message": "Success",
    "data": [
        {
            "_id": 1,
            "title": "New ad",
            "dateofbirth": "2020-12-31T22:00:00.000Z",
            "breed": "booldog",
            "price": 10
        },
        {
            "_id": 2,
            "title": "Lost poison snake",
            "dateofbirth": "2020-12-31T22:00:00.000Z",
            "breed": "cobra",
            "price": 0
        },
        {
            "_id": 3,
            "title": "Wife is worse animal",
            "dateofbirth": "1999-12-31T22:00:00.000Z",
            "breed": "gadina",
            "price": 0
        }
    ]
}

2. добавить

МЕТОД POST: localhost:3333/api/ads/add
хедер Authorization: Bearer <token>

боли 
{
    "category": 3,
    "title": "Wife is worse animal",
    "petname": "Snake",
    "dateofbirth": "01.01.2000",
    "breed": "gadina",
    "price": "0",
    "comments": "give in good nands, in any hands"
}
ответ
{
    "message": "Ad added",
    "data": {
        "_id": 3,
        "category": 3,
        "userId": "2",
        "title": "Wife is worse animal",
        "petname": "Snake",
        "dateofbirth": "1999-12-31T22:00:00.000Z",
        "breed": "gadina",
        "price": 0,
        "comments": "give in good nands, in any hands",
        "__v": 0
    }
}
