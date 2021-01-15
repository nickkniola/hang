require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const pg = require('pg');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const errorMiddleware = require('./error-middleware');
const authorizationMiddleware = require('./authorization-middleware');
const ClientError = require('./client-error');
const path = require('path');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(staticMiddleware);
app.use(express.json());

app.post('/api/auth/sign-up', (req, res, next) => {
  argon2
    .hash(req.body.password)
    .then(hashedPassword => {
      const sql = `
        insert into "Users" ("firstName", "lastName", "email", "password", "profileImage")
             values ($1, $2, $3, $4, $5)
          returning "userId"
      `;
      const params = [req.body.firstName, req.body.lastName, req.body.email, hashedPassword, '/images/placeholder-user.jpg'];
      return db.query(sql, params);
    })
    .then(result => {
      const payload = result.rows[0];
      const token = jwt.sign(payload, process.env.TOKEN_SECRET);
      res.status(201).json({ token, user: payload });
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "userId",
           "password"
      from "Users"
     where "email" = $1
  `;
  const params = [email];
  db.query(sql, params)
    .then(result => {
      const user = result.rows[0];
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const userId = user.userId;
      const hashedPassword = user.password;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.status(201).json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

app.post('/api/activities', (req, res, next) => {
  let preferredActivity = req.body.preferredActivity;
  let activityType = req.body.activityType;
  const userId = req.body.userId;
  const neighborhood = req.body.neighborhood.split(' ').join('+');
  const city = req.body.city.split(' ').join('+');
  const state = req.body.state.split(' ').join('+');
  if (!activityType) {
    const activityTypes = ['Food', 'Museum', 'Sports'];
    const randomIndex = Math.floor(Math.random() * 3);
    activityType = activityTypes[randomIndex];
    preferredActivity = activityTypes[randomIndex];
  } else {
    preferredActivity = req.body.preferredActivity.split(' ').join('+');
  }
  const sql = `
    select *
      from "Activities"
      join "activityTypes" using ("activityTypeId")
      join "Users" on "hostId" = "userId"
      where "Activities"."guestId" is NULL AND "Activities"."hostId" != $1
      and "googlePlacesLink" ilike '%' || $2 || '%'
      and "googlePlacesLink" ilike '%' || $3 || '%'
      and "label" = $4
      order by random();
  `;
  const params = [userId, city, state, activityType];
  db.query(sql, params)
    .then(result => {
      if (result.rows.length) {
        res.json({ activityObject: result.rows[0], activityType: activityType });
        return;
      }
      const requestSearchText = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${preferredActivity}+${activityType}+in+${neighborhood}+${city}+${state}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
      return fetch(requestSearchText)
        .then(response => response.json())
        .then(data => {
          const arr = data.results;
          const locationsFiltered = arr.filter(location => location.business_status === 'OPERATIONAL' && location.rating >= 4);
          if (locationsFiltered.length === 0) {
            res.json({});
            return;
          }
          const location = locationsFiltered[Math.floor(Math.random() * locationsFiltered.length)];
          const googlePlacesLink = requestSearchText.split('&key=')[0];
          return fetch(`https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_PLACES_API_KEY}&placeid=${location.place_id}`)
            .then(response => response.json())
            .then(data => res.json({ responseLocation: location, activityType: activityType, mapUrl: data.result.url, googlePlacesLink: googlePlacesLink }));
        });
    })
    .catch(err => next(err));
});

app.post('/api/activity', (req, res, next) => {
  const activityType = req.body.activityType;
  let activityTypeId = null;
  if (activityType === 'Food') {
    activityTypeId = 1;
  } else if (activityType === 'Sports') {
    activityTypeId = 2;
  } else if (activityType === 'Museum') {
    activityTypeId = 3;
  }
  const sql = `
    insert into "Activities" ("googlePlacesLink", "activityTypeId", "specificActivity", "location", "date", "time", "hostId", "externalGoogleMapsUrl", "googleMapsLink")
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         returning *;
  `;
  const params = [req.body.googlePlacesLink, activityTypeId, req.body.preferredActivity, req.body.responseLocation.name, req.body.date, '1PM', req.body.userId, req.body.externalGoogleMapsUrl, 'https://www.google.com/maps/embed'];
  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows);
    })
    .catch(err => next(err));
});

app.put('/api/activities/:activityId', (req, res, next) => {
  const sql = `
    update "Activities"
       set "guestId" = $1
     where "activityId" = $2
 returning *;
  `;
  const params = [req.body.userId, req.body.activityObject.activityId];
  db.query(sql, params)
    .then(result => res.status(201).json(result.rows))
    .catch(err => next(err));
});

app.get('/api/matches/:userId', (req, res, next) => {
  const userId = parseInt(req.params.userId);
  const sql = `
    select *
      from "Activities"
      join "Users" on "hostId" = "userId" or "guestId" = "userId"
      join "activityTypes" using ("activityTypeId")
     where ("Activities"."hostId" = $1 or "Activities"."guestId" = $1)
       and ("Activities"."hostId" is not NULL and "Activities"."guestId" is not NULL)
       and ("userId" != $1)
  order by "date"
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      const arrOfMatches = [];
      for (let i = 0; i < result.rows.length; i++) {
        const userId = result.rows[i].userId;
        const arr = arrOfMatches.filter(match => match.userId === userId);
        if (!arr[0]) {
          arrOfMatches.push(result.rows[i]);
        }
      }
      res.status(200).json({ activities: result.rows, matches: arrOfMatches });
    })
    .catch(err => next(err));
});

app.get('/api/messages/:userId/:partnerId', (req, res, next) => {
  const userId = parseInt(req.params.userId);
  const partnerId = parseInt(req.params.partnerId);
  const sql = `
    select *
      from "Messages"
     where ("userId" = $1 or "partnerId" = $1)
       and ("userId" = $2 or "partnerId" = $2)
  order by "messageId";
  `;
  const params = [userId, partnerId];
  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err));
});

io.on('connection', socket => {
  let roomId = 0;
  const userId = socket.handshake.query.userId;
  const partnerId = socket.handshake.query.partnerId;
  if (parseInt(userId) < parseInt(partnerId)) {
    roomId = parseInt(userId + partnerId);
  } else {
    roomId = parseInt(partnerId + userId);
  }
  socket.join(roomId);
  socket.on('send-message', data => {
    io.sockets.to(roomId).emit('message', { senderUserId: parseInt(userId), message: data.message });
    const date = new Date();
    const timeUTC = date.getTime();
    const sql = `
      insert into "Messages" ("messageContent", "userId", "partnerId", "time")
          values ($1, $2, $3, $4)
          returning *;
    `;
    const params = [data.message, data.userId, data.partnerId, timeUTC];
    db.query(sql, params)
      .catch(err => console.error(err));
  });
});

app.use((req, res) => {
  res.sendFile('/index.html', {
    root: path.join(__dirname, 'public')
  });
});

app.use(errorMiddleware);

http.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
