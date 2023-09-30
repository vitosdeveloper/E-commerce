Live version: https://vitos-e-commerce.netlify.app/

Server adress: https://e-commerce-back-end-fawn.vercel.app/api/ \
Server repo: https://github.com/vitosnatios/E-commerce-back-end

My linkedin: https://www.linkedin.com/in/vitosnatios/

E-mail: vitosdeveloper@gmail.com

# My Fictional E-commerce

This project wasnt made using any type of tutorial and its not part of any exercise or job.

My goal when starting this project was to test my knowledge and challenge myself with the various problems that arise during a real development.

## Technologies and languages used in the project

This project is using: \
-ReactJS. \
-NodeJS. \
-ExpressJS. \
-MongoDB. \
-Mongoose. \
-Javascript. \
-Html. \
-Css. \
-Some others...

## Details about the application

### `About every item to buy and its data:`

Every item has its stock number, whenever some user buys it, the quantity is taken from its stock, and the same quantity is added to how much it got bought from the store.

The itens can be placed on the favorite-bar by clicking on the heart emoti, can also be placed on the cart from its own page and also from the favorite page. The fav and cart info are saved on the browser LocalStorage, so, you can pick favorites or even get them into the car, but you can only buy them after logged in.

### `About pagination:`

Hard to make, but super functional. It detects how many itens the page is showing, then, it separates them by 6 itens per page, if the screen is showing less then 6 itens, it only shows the first page, and the site creates pages as the number of items grows, automatically.

### `About the login system:`

When the user registers, his password is automatically encrypted and stored in the database, when he logs in, the entered password is encrypted using the same method, then it is compared with the encrypted password that is in the database.
If the passwords match, the user receives the data needed to feed the site through a Jwt token that expires in one hour. Whenever the user makes any changes that affect their own data, a validation is done in the JWT on the serverside, as well as the user ID that is sent to the server is compared with the ID that is inside the JWT, to avoid any forgeries of credentials. Once fully validated, the server responds with a fresh JWT token that contains the user's updated information, such as purchased items or changed profile data.

### `About the user data:`

Every user data contains your login, encrypted password, items purchased, time of purchase, total price, unit price, gender, address and name.

### `About every item to buy:`

Every item has data about its img source, title, price, status (if its on sale or with normal price), its inventory and how many times has it been purchased.

### `About the search bar:`

It looks for items that start with the letters you typed, regardless of whether you typed in uppercase or lowercase letters.

## Thanks for your interest.

You can contact me anytime you want! I'm looking for job opportunities! \
Linkedin: https://www.linkedin.com/in/vitosnatios/ \
E-mail: vitosdeveloper@gmail.com
