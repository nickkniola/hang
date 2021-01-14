set client_min_messages to warning;


-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";
 CREATE TABLE "Users" (
	"userId" serial NOT NULL,
	"firstName" TEXT NOT NULL,
	"lastName" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"password" TEXT NOT NULL,
	"profileImage" TEXT,
	"bio" TEXT,
	"interests" TEXT,
	"availabilityTypeId" integer,
	CONSTRAINT "Users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "Activities" (
	"activityId" serial NOT NULL,
	"googlePlacesLink" TEXT NOT NULL,
	"googleMapsLink" TEXT,
	"activityTypeId" integer NOT NULL,
	"externalGoogleMapsUrl" TEXT NOT NULL,
	"specificActivity" TEXT NOT NULL,
	"location" TEXT NOT NULL,
	"date" TEXT NOT NULL,
	"time" TEXT NOT NULL,
	"hostId" integer NOT NULL,
	"guestId" integer,
	CONSTRAINT "Activities_pk" PRIMARY KEY ("activityId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "availabilityTypes" (
	"availabilityTypeId" serial NOT NULL,
	"label" TEXT NOT NULL,
	CONSTRAINT "availabilityTypes_pk" PRIMARY KEY ("availabilityTypeId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "activityTypes" (
	"activityTypeId" serial NOT NULL,
	"label" TEXT NOT NULL,
	CONSTRAINT "activityTypes_pk" PRIMARY KEY ("activityTypeId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "Messages" (
	"messageId" serial NOT NULL,
	"messageContent" TEXT NOT NULL,
	"userId" integer NOT NULL,
	"partnerId" integer,
	"time" bigint,
	CONSTRAINT "Messages_pk" PRIMARY KEY ("messageId")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "Users" ADD CONSTRAINT "Users_fk0" FOREIGN KEY ("availabilityTypeId") REFERENCES "availabilityTypes"("availabilityTypeId");

ALTER TABLE "Activities" ADD CONSTRAINT "Activities_fk0" FOREIGN KEY ("activityTypeId") REFERENCES "activityTypes"("activityTypeId");

ALTER TABLE "Messages" ADD CONSTRAINT "Messages_fk0" FOREIGN KEY ("userId") REFERENCES "Users"("userId");
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_fk1" FOREIGN KEY ("partnerId") REFERENCES "Users"("userId");
