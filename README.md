# CSocial

CSocial is a private social network aimed at college departments and similar workplaces.

## Installation

Download or clone the repo and run npm install command to install the required packages. 

```bash
npm install
```

## Usage

Create a .env file and add the MongoDB connection string as CNXN = 'yourcnnstring'
Also, add port number as 3000.

Example:

```node
CNXNSTR=mongodb+srv://yourconnectionstr
PORT=3000
```

## Screenshots & features

* LiveSearch for posts
* Create new posts
* Edit Posts
* Delete Posts
* Posts render Markdown correctly to format the post body
* Every user input is sanitized to prevent any malicious code injection.
* Server-side validation for security reasons. 
* MVC arcitecture is followed throughout.

[LIVE DEMO](https://csocial141.herokuapp.com/)

### LiveSearch

[![Image from Gyazo](https://i.gyazo.com/93f25e18d263da42863e735d1fd198c2.gif)](https://gyazo.com/93f25e18d263da42863e735d1fd198c2)

### UserScreen

[![Image from Gyazo](https://i.gyazo.com/f24876c46efea83c1bf9ddd40c3fb558.png)](https://gyazo.com/f24876c46efea83c1bf9ddd40c3fb558)

### Post Editor

[![Image from Gyazo](https://i.gyazo.com/db5d4ee6d43a28fe39ed956e0aa48676.png)](https://gyazo.com/db5d4ee6d43a28fe39ed956e0aa48676)

### Post View

[![Image from Gyazo](https://i.gyazo.com/3e48483e152c0184c8238a7afc81f9b2.png)](https://gyazo.com/3e48483e152c0184c8238a7afc81f9b2)


## Todo

* Implement followers system (partly done. Ongoing Exams) 
* Implement chat using socket.io


## Made for CodeCause coding challenge
[MIT](https://choosealicense.com/licenses/mit/)

