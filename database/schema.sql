-- ============================================================
-- GlobeTrotter - Database Schema (MySQL 8)
-- Run: mysql -u root -p < database/schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS globetrotter
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE globetrotter;

-- Drop children first to respect foreign keys on re-run
DROP TABLE IF EXISTS saved_destinations;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS stop_activities;
DROP TABLE IF EXISTS trip_stops;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS users;

-- ------------------------------------------------------------
-- USERS & AUTH
-- ------------------------------------------------------------

CREATE TABLE users (
  id            INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100)     NOT NULL,
  email         VARCHAR(255)     NOT NULL,
  password_hash VARCHAR(255)     NOT NULL,
  avatar_url    VARCHAR(600)     NULL,
  language_pref VARCHAR(10)      NOT NULL DEFAULT 'en',
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE = InnoDB;

CREATE TABLE password_resets (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED  NOT NULL,
  token_hash CHAR(64)      NOT NULL,
  expires_at DATETIME      NOT NULL,
  used       TINYINT(1)    NOT NULL DEFAULT 0,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pr_user (user_id),
  KEY idx_pr_token (token_hash),
  CONSTRAINT fk_pr_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- DESTINATION CATALOG
-- ------------------------------------------------------------

CREATE TABLE cities (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name        VARCHAR(120)  NOT NULL,
  country     VARCHAR(80)   NOT NULL,
  region      ENUM('North India','South India','West India','East India','Northeast India','Central India') NOT NULL,
  description TEXT          NULL,
  cost_index  TINYINT UNSIGNED NOT NULL DEFAULT 2 COMMENT '1=budget, 2=moderate, 3=premium',
  popularity  SMALLINT UNSIGNED NOT NULL DEFAULT 50 COMMENT '0-100',
  image_url   VARCHAR(600)  NULL,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_city_country (name, country)
) ENGINE = InnoDB;

CREATE TABLE activities (
  id             INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  city_id        INT UNSIGNED  NOT NULL,
  title          VARCHAR(160)  NOT NULL,
  category       ENUM('outdoors','culture','food','adventure','relax') NOT NULL DEFAULT 'outdoors',
  description    TEXT          NULL,
  est_cost       DECIMAL(8,2)  NOT NULL DEFAULT 0.00,
  duration_hours DECIMAL(3,1)  NOT NULL DEFAULT 2.0,
  image_url      VARCHAR(600)  NULL,
  PRIMARY KEY (id),
  KEY idx_act_city (city_id),
  CONSTRAINT fk_act_city FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- TRIPS
-- ------------------------------------------------------------

CREATE TABLE trips (
  id              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id         INT UNSIGNED  NOT NULL,
  name            VARCHAR(160)  NOT NULL,
  description     TEXT          NULL,
  cover_image_url VARCHAR(2048) NULL,
  start_date      DATE          NOT NULL,
  end_date        DATE          NOT NULL,
  status          ENUM('draft','planned','completed') NOT NULL DEFAULT 'draft',
  budget_total    DECIMAL(10,2) NULL,
  share_slug      CHAR(12)      NULL,
  is_public       TINYINT(1)    NOT NULL DEFAULT 0,
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_trips_user (user_id),
  UNIQUE KEY uq_trips_slug (share_slug),
  CONSTRAINT fk_trips_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT chk_trip_dates CHECK (end_date >= start_date)
) ENGINE = InnoDB;

CREATE TABLE trip_stops (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  trip_id        INT UNSIGNED NOT NULL,
  city_id        INT UNSIGNED NOT NULL,
  arrival_date   DATE         NOT NULL,
  departure_date DATE         NOT NULL,
  position       SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  notes          VARCHAR(500) NULL,
  PRIMARY KEY (id),
  KEY idx_stops_trip (trip_id),
  KEY idx_stops_city (city_id),
  CONSTRAINT fk_stops_trip FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE,
  CONSTRAINT fk_stops_city FOREIGN KEY (city_id) REFERENCES cities (id),
  CONSTRAINT chk_stop_dates CHECK (departure_date >= arrival_date)
) ENGINE = InnoDB;

CREATE TABLE stop_activities (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  stop_id        INT UNSIGNED NOT NULL,
  activity_id    INT UNSIGNED NULL,
  title          VARCHAR(160) NOT NULL,
  scheduled_date DATE         NOT NULL,
  start_time     TIME         NULL,
  duration_hours DECIMAL(3,1) NOT NULL DEFAULT 2.0,
  est_cost       DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  category       ENUM('outdoors','culture','food','adventure','relax') NOT NULL DEFAULT 'outdoors',
  notes          TEXT         NULL,
  position       SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_sa_stop (stop_id),
  CONSTRAINT fk_sa_stop FOREIGN KEY (stop_id) REFERENCES trip_stops (id) ON DELETE CASCADE,
  CONSTRAINT fk_sa_activity FOREIGN KEY (activity_id) REFERENCES activities (id) ON DELETE SET NULL
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- BUDGET / EXPENSES
-- ------------------------------------------------------------

CREATE TABLE expenses (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  trip_id      INT UNSIGNED  NOT NULL,
  category     ENUM('transport','stay','meals','activities','other') NOT NULL DEFAULT 'other',
  title        VARCHAR(160)  NOT NULL,
  amount       DECIMAL(10,2) NOT NULL,
  expense_date DATE          NULL,
  PRIMARY KEY (id),
  KEY idx_expenses_trip (trip_id),
  CONSTRAINT fk_expenses_trip FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- SAVED DESTINATIONS ("Saved Horizons")
-- ------------------------------------------------------------

CREATE TABLE saved_destinations (
  id       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id  INT UNSIGNED NOT NULL,
  city_id  INT UNSIGNED NOT NULL,
  saved_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_city (user_id, city_id),
  CONSTRAINT fk_sd_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_sd_city FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE CASCADE
) ENGINE = InnoDB;
