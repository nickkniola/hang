--Sample data
insert into "availabilityTypes" ("label")
     values ('Weekends Morning'),
            ('Weekends Afternoon'),
            ('Weekends Evening'),
            ('Weekdays Morning'),
            ('Weekdays Afternoon'),
            ('Weekdays Evening');

insert into "Users" ("firstName", "lastName", "email", "password", "profileImage", "bio", "interests")
     values ('Kristy', 'San', 'ksan@mac.com', 'dsa432', 'server/public/images/kristy.png', 'I enjoy food and going to different restaurants.', 'food, Italian food, cuisine, hiking'),
     ('Demo', 'User', 'du@email.com', 'demouser', 'server/public/images/kristy.png', 'I am a demo user.', 'demoing');

insert into "activityTypes" ("label")
     values ('Food'),
            ('Sports'),
            ('Museum');

insert into "Activities" ("googlePlacesLink", "googleMapsLink", "activityTypeId", "specificActivity", "location", "date", "time", "hostId", "externalGoogleMapsUrl")
     values ('https://maps.googleapis.com/maps/api/place/textsearch/json?query=salad+restaurants+in+koreatown+los+angles+California&key=${process.env.GOOGLE_PLACES_API_KEY}', 'https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_PLACES_API_KEY}', 2, 'restaurant', 'sweetgreen', '2021-03-02', '1PM', 1, 'https://www.google.com/maps/embed');
