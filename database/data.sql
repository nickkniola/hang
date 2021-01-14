--Sample data
insert into "availabilityTypes" ("label")
     values ('Weekends Morning'),
            ('Weekends Afternoon'),
            ('Weekends Evening'),
            ('Weekdays Morning'),
            ('Weekdays Afternoon'),
            ('Weekdays Evening');

insert into "Users" ("firstName", "lastName", "email", "password", "profileImage", "bio", "interests")
     values ('Kristy', 'San', 'ksan@mac.com', 'dsa432', 'images/kristy.png', 'I enjoy food and going to different restaurants.', 'food, Italian food, cuisine, hiking'),
 ('Test', 'User', 'testuser@email.com', '$argon2i$v=19$m=4096,t=3,p=1$vfhqtEAkDbtAsA/34zrnNQ$at7uLXHuL+OhQ/R2y3uesRag53hA2MgmerpPeG0ENbI', ' ', ' ', ' ');

insert into "activityTypes" ("label")
     values ('Food'),
            ('Sports'),
            ('Museum');

insert into "Activities" ("googlePlacesLink", "googleMapsLink", "activityTypeId", "specificActivity", "location", "date", "time", "hostId", "externalGoogleMapsUrl", "guestId")
     values ('https://maps.googleapis.com/maps/api/place/textsearch/json?query=salad+restaurants+in+koreatown+los+angles+California&key=${process.env.GOOGLE_PLACES_API_KEY}', 'https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_PLACES_API_KEY}', 1, 'restaurant', 'sweetgreen', '2021-03-02', '1PM', 2, 'https://www.google.com/maps/place/sweetgreen/@34.0981721,-118.3249043,17z/data=!3m1!4b1!4m5!3m4!1s0x80c2bf37dfdcdc19:0x3fab073841200064!8m2!3d34.0981721!4d-118.3227156', 1);

insert into "Messages" ("messageContent", "userId", "partnerId", "time")
     values ('Hello. Are you ready to meet at sweetgreen?', 1, 2, 1610652610723);
