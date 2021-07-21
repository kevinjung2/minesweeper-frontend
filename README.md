# Minesweeper API

This is the frontend half of a minesweeper clone I made.

* note: index.php is only to allow hosting on heroku. If you want to try the app there check out:
https://kevins-minesweeper.herokuapp.com

## to run this on your local machine
  First head to https://github.com/kevinjung2/minesweeper-backend and follow the instructions in the readme. If you already have the backend server running then continue below


 Fork and clone this repository to your machine:

 ```
  git clone git@github.com:{YOUR-GITHUBNAME-HERE}/minesweeper-frontend.git
 ```

Next open index.html in your browser:

  * Mac:

 ```
  open index.html
 ```

 * Linux:

```
 xdg-open index.html
```

 * Important!!

 this frontend makes calls to the backend api hosted on heroku. Running this locally with require you to change the fetch requests in the frontend to the localhost port you are running the server at (default: localhost/3000). It will also require changing the cors settings in the backend files (/config/initializers/cors.rb), if youre just running it locally you'll be safe changing the orgins to accept all requests with '*'. After these changes you will be able to run the app locally.
