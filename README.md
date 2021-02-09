# hang

Pair up with people in your location based on common interests in a variety of activities. The only app which makes plans for you!

## Technologies Used

- React.js
- Node.js
- Express.js
- JavaScript ES6
- PostgreSQL
- Socket.IO
- Semantic UI
- CSS3

## Live Demo

Try the application live at [https://hang-web-app.herokuapp.com](https://hang-web-app.herokuapp.com)

## Features
- User can pair with another user for a selected activity
- User can pair with another user for a random activity
- User can accept/reject suggested activity with suggested partner
- User can view a list of all matches/activities
- User can send/receive live messages with partners they pair with

## Preview
![Hang](server/public/images/preview.gif)

## Development

### Getting Started
Note: Requires Google Places API Key and PostgreSQL.

1. Clone the repository.

    ```shell
    git clone https://github.com/nickkniola/hang.git
    cd hang
    ```

2. Install dependencies.

    ```shell
    npm install
    npx node-pre-gyp rebuild -C ./node_modules/argon2
    ```

3. Start PostgreSQL server.

    ```shell
    sudo service postgresql start
    pgweb --db=Hang
    ```

4. Start client/server in another terminal.

    ```shell
    npm run dev
    ```

5. Create .env file with the following text:

    ```
    PORT=3001
    DEV_SERVER_PORT=3000
    TOKEN_SECRET=<enterTokenSecret>
    DATABASE_URL=postgres://<enterUsername>:<enterPassword>@localhost/Hang
    GOOGLE_PLACES_API_KEY=<enterGooglePlacesAPIKey>
    ```

6. Visit http://localhost:3000 in browser
