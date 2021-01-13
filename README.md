# hang

Pair up with people in your location based on your common interests in a variety of activities. The only app which makes plans for you!

## Technologies Used

- JavaScript ES6
- React.js
- Node.js
- Express.js
- PostgreSQL
- Semantic UI
- CSS3

## Live Demo

Try the application live at [https://hang-web-app.herokuapp.com](https://hang-web-app.herokuapp.com)

## Features
- User can pair with another user for a selected activity
- User can pair with another user for a random activity
- User can accept/reject suggested activity with suggested partner
- User can send/receive messages with partners they pair with

## Preview
![Hang](server/public/images/preview.gif)

## Development

### Getting Started

1. Clone the repository.

    ```shell
    git clone https://github.com/nickkniola/hang.git
    cd hang
    ```

2. Install dependencies.

    ```npm install
    ```

3. Start PostgreSQL server

    ```sudo service postgresql start
    pgweb --db=Hang
    ```

4. Start webpack

  ```npm run build
  ```

5. Visit http://localhost:3000 in browser
