-- ============================================================
-- GlobeTrotter - Seed Data (MySQL 8) - India Edition
-- Demo login: test@test.com / test1234
-- Run AFTER schema.sql: mysql -u root -p < database/seed.sql
-- ============================================================

USE globetrotter;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE saved_destinations;
TRUNCATE TABLE expenses;
TRUNCATE TABLE stop_activities;
TRUNCATE TABLE trip_stops;
TRUNCATE TABLE activities;
TRUNCATE TABLE trips;
TRUNCATE TABLE password_resets;
TRUNCATE TABLE cities;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- USERS (password for both: test1234)
-- ------------------------------------------------------------
INSERT INTO users (id, name, email, password_hash, avatar_url, language_pref) VALUES
(1, 'Elena Rossi', 'test@test.com', '$2a$10$qKTm3CcQZxkdhvR3XHGS8O2.GsU1su5GcduaDyqix.kznYH.jkD6m',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfqkcR-sZMrjPWQuBzXitDg6NUWEB7qiIgGU4r1sI4tL39yA9wYpgHQf-0NKvhvwbLngdYAuvf7kKll2pzpGpgZFnuiq3w8kOcO6nfNfkDjSftSq4cQvexDrNMH3N6jBVC4OvE5ZmwHJSHIaVGKzO7PVQRtBR2GODktwS7btHzXgE5sfeXaiMkYC2ju4zYBJdqc7c9e-EBqCKrTRo1hZ_Egra_Z6TpaWoyfRyK6MNW9XfI3mNLUUT3', 'it'),
(2, 'Sarah Jenkins', 'sarah@test.com', '$2a$10$qKTm3CcQZxkdhvR3XHGS8O2.GsU1su5GcduaDyqix.kznYH.jkD6m',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7EwD-pYnlpHkRY0R8Ww1V7x-ceNlB_k03BEppRSpeQk5JAJ9u-s736LBMDDd51WGkhqa71Xty3Y5jV0OX_UEoIIIk1wrvdvKksqTIcqpWCsI0ohJ-Xnrz_6kys8lb4gxlSK48ZZXwujrta4YBuEITxqdpLfPvWuSu0kQppXvHVJfgmBQHjbjP2vUzSEX_Uq4BB_MVVa7rquo9W0fyUiVrtqQmjMsuBR3u-tq7qBLjS4jQi4eRrfuz', 'en');

-- ------------------------------------------------------------
-- CITIES (India)
-- ------------------------------------------------------------
INSERT INTO cities (id, name, country, region, description, cost_index, popularity, image_url) VALUES
(1, 'Agra', 'India', 'North India', 'Home of the Taj Mahal - marble perfection at dawn and Mughal forts along the Yamuna.', 1, 98,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg'),
(2, 'Jaipur', 'India', 'West India', 'The Pink City - hilltop forts, palace courtyards and bazaars of block-print and gems.', 1, 95,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/1280px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg'),
(3, 'Goa', 'India', 'West India', 'Beach shacks, spice-scented churches and slow sundowners along the Arabian Sea.', 2, 93,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Baga_Beach%2C_Calangute%2C_Goa.jpg/1280px-Baga_Beach%2C_Calangute%2C_Goa.jpg'),
(4, 'Alleppey', 'India', 'South India', 'Kerala''s backwaters - houseboat nights gliding past paddy fields and coconut palms.', 2, 90,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Alappuzha_Boat_Beauty_W.jpg/1280px-Alappuzha_Boat_Beauty_W.jpg'),
(5, 'Varanasi', 'India', 'North India', 'One of the world''s oldest living cities - ghats, oil lamps and dawn on the Ganges.', 1, 89,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Dasaswamedh_ghat-varanasi_india-andres_larin.jpg/1280px-Dasaswamedh_ghat-varanasi_india-andres_larin.jpg'),
(6, 'Amritsar', 'India', 'North India', 'The Golden Temple''s shimmering sarovar, langar for thousands and warm Punjabi kitchens.', 1, 87,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amrithsar_7.jpg/1280px-The_Golden_Temple_of_Amrithsar_7.jpg'),
(7, 'Udaipur', 'India', 'West India', 'White palaces rising from Lake Pichola - Rajasthan''s most romantic city.', 2, 85,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evening_view%2C_City_Palace%2C_Udaipur.jpg/1280px-Evening_view%2C_City_Palace%2C_Udaipur.jpg'),
(8, 'Leh-Ladakh', 'India', 'North India', 'High-altitude desert monasteries, turquoise lakes and endless Himalayan passes.', 3, 83,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Leh_City_seen_from_Shanti_Stupa.JPG/1280px-Leh_City_seen_from_Shanti_Stupa.JPG'),
(9, 'Manali', 'India', 'North India', 'Cedar forests, snow adventures in Solang and cafe culture in Old Manali.', 2, 80,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Manali_City.jpg/1280px-Manali_City.jpg'),
(10, 'Kochi', 'India', 'South India', 'Chinese fishing nets at sunset, Kathakali drums and layers of spice-trade history.', 1, 78,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Kochi%2C_Fishing_nets_at_sunset%2C_Kerala%2C_India.jpg/1280px-Kochi%2C_Fishing_nets_at_sunset%2C_Kerala%2C_India.jpg'),
(11, 'Darjeeling', 'India', 'East India', 'Toy trains through tea gardens and Kanchenjunga glowing at first light.', 1, 75,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/DarjeelingTrainFruitshop_%282%29.jpg/1280px-DarjeelingTrainFruitshop_%282%29.jpg'),
(12, 'Mumbai', 'India', 'West India', 'Gateway arches, Marine Drive sunsets and the restless energy of the maximum city.', 2, 73,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg/1280px-Mumbai_03-2016_30_Gateway_of_India.jpg');

-- ------------------------------------------------------------
-- ACTIVITIES (master catalog per city, prices in INR)
-- ------------------------------------------------------------
INSERT INTO activities (id, city_id, title, category, description, est_cost, duration_hours, image_url) VALUES
-- Agra (city_id 1)
(101, 1, 'Taj Mahal Sunrise Visit', 'culture', 'Beat the queues at the East Gate and watch the marble glow at first light.', 150.00, 3.0,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg'),
(102, 1, 'Agra Fort & Mehtab Bagh Tour', 'culture', 'Mughal halls above the Yamuna, then sunset views of the Taj from the riverside garden.', 200.00, 4.0, NULL),
(103, 1, 'Mughlai Street Food Walk', 'food', 'Petha, chaat and kebabs through Sadar Bazaar''s old lanes.', 350.00, 2.0, NULL),
(104, 1, 'Marble Inlay Workshop', 'culture', 'Try pietra dura inlay with a family of third-generation artisans.', 400.00, 1.5, NULL),
-- Jaipur (city_id 2)
(105, 2, 'Amber Fort Hilltop Explore', 'culture', 'Sheesh Mahal mirrors and a jeep ride up the ramparts before the heat.', 200.00, 3.5, NULL),
(106, 2, 'Hawa Mahal & Old City Bazaar Walk', 'culture', 'Pink facades, bangle lanes and lassi at the famous Lassiwala counter.', 150.00, 2.5, NULL),
(107, 2, 'Rajasthani Thali Rooftop Dinner', 'food', 'Dal baati churma served brass-thali style overlooking Hawa Mahal.', 600.00, 2.0, NULL),
(108, 2, 'Block Printing Workshop in Sanganer', 'culture', 'Print your own scarf with hand-carved teak blocks.', 700.00, 2.0, NULL),
-- Goa (city_id 3)
(109, 3, 'Palolem Beach Kayaking', 'adventure', 'Morning paddles along the crescent bay when the sea is glassy.', 500.00, 2.0, NULL),
(110, 3, 'Old Goa Churches Heritage Walk', 'culture', 'Bom Jesus Basilica to Se Cathedral on foot through Latin quarters.', 0.00, 3.0, NULL),
(111, 3, 'Beach Shack Seafood Dinner', 'food', 'Grilled kingfish and sol kadhi with toes in the sand.', 900.00, 2.0, NULL),
(112, 3, 'Dudhsagar Falls Jeep Safari', 'adventure', 'Four-wheel drive through mollem forest to the four-tiered falls.', 1200.00, 6.0, NULL),
-- Alleppey (city_id 4)
(113, 4, 'Houseboat Overnight Backwater Cruise', 'relax', 'A kettuvallam glides through Kuttanad - lunch onboard, stars overhead.', 6500.00, 20.0,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Alappuzha_Boat_Beauty_W.jpg/1280px-Alappuzha_Boat_Beauty_W.jpg'),
(114, 4, 'Village Canoe Tour', 'outdoors', 'Narrow canals where buses cannot go - duck farms and toddy palms.', 450.00, 2.5, NULL),
(115, 4, 'Toddy Shop Local Lunch', 'food', 'Karimeen fry and red rice under a thatched roof.', 250.00, 1.5, NULL),
-- Varanasi (city_id 5)
(116, 5, 'Ganga Aarti at Dashashwamedh Ghat', 'culture', 'Fire lamps, conch shells and drumbeats as the river turns gold.', 0.00, 1.5, NULL),
(117, 5, 'Dawn Boat Ride Past the Ghats', 'outdoors', 'Row quietly past 84 ghats while the city wakes.', 300.00, 2.0, NULL),
(118, 5, 'Sarnath Buddhist Circuit', 'culture', 'Where the Buddha first taught - stupas, museum and mulagandha kuti.', 250.00, 4.0, NULL),
(119, 5, 'Kachori & Lassi Breakfast Crawl', 'food', 'Fried kachori sabzi, then thick lassi in clay kulhads.', 150.00, 1.5, NULL),
-- Amritsar (city_id 6)
(120, 6, 'Golden Temple Langar Experience', 'culture', 'Serve and share a free community meal for 50,000 people daily.', 0.00, 2.0, NULL),
(121, 6, 'Wagah Border Retreat Ceremony', 'culture', 'High-kicking border ceremony at sunset - reach early for seats.', 300.00, 5.0, NULL),
(122, 6, 'Amritsari Kulcha Trail', 'food', 'Blistered stuffed kulchas with chole at three legendary dhabas.', 200.00, 2.0, NULL),
-- Udaipur (city_id 7)
(123, 7, 'Lake Pichola Sunset Boat Ride', 'relax', 'Circle Jag Mandir as Aravalli hills turn purple.', 400.00, 1.5, NULL),
(124, 7, 'City Palace Complex Tour', 'culture', 'Peacock mosaics and mirrored chambers above the lake.', 300.00, 3.0, NULL),
(125, 7, 'Rajasthani Cooking Class with Lake View', 'food', 'Learn gatte ki sabzi and laal maas from a home chef.', 1200.00, 3.0, NULL),
-- Leh-Ladakh (city_id 8)
(126, 8, 'Pangong Tso Day Drive', 'adventure', 'Cross Chang La pass to the lake that shifts seven blues.', 1800.00, 12.0, NULL),
(127, 8, 'Shanti Stupa Sunset Walk', 'outdoors', 'Panoramic dusk over Leh town and the Stok range.', 0.00, 1.5, NULL),
(128, 8, 'Thiksey Monastery Morning Prayers', 'culture', 'Sit in on horns and chants at the mini-Potala of Ladakh.', 100.00, 2.5, NULL),
-- Manali (city_id 9)
(129, 9, 'Solang Valley Paragliding', 'adventure', 'Tandem flights over snow slopes and pine ridges.', 1500.00, 2.0, NULL),
(130, 9, 'Hadimba Temple Cedar Forest Walk', 'outdoors', 'Pagoda shrine hidden among centuries-old deodars.', 0.00, 2.0, NULL),
(131, 9, 'Old Manali Cafe Hop', 'food', 'Israeli honey cake to wood-fired pizza across the bridge.', 500.00, 2.5, NULL),
-- Kochi (city_id 10)
(132, 10, 'Chinese Fishing Nets Sunset Walk', 'culture', 'Cantilever nets at work along Fort Kochi''s promenade.', 0.00, 1.5, NULL),
(133, 10, 'Kathakali Performance Evening', 'culture', 'Watch the green-faced makeup ritual, then the dance-drama.', 400.00, 2.0, NULL),
(134, 10, 'Syrian Christian Food Tour', 'food', 'Appam with stew, meen pollichathu and plum cake legacies.', 800.00, 2.5, NULL),
-- Darjeeling (city_id 11)
(135, 11, 'Toy Train Joyride to Ghum', 'culture', 'Steam era loop line to India''s highest railway station.', 1600.00, 3.5, NULL),
(136, 11, 'Tiger Hill Kanchenjunga Sunrise', 'outdoors', 'First light on the world''s third-highest peak.', 500.00, 3.0, NULL),
(137, 11, 'Momo & Darjeeling Tea Tasting', 'food', 'Steamed momos with clear soup, then first-flush flights.', 250.00, 1.5, NULL),
-- Mumbai (city_id 12)
(138, 12, 'Gateway of India & Colaba Heritage Walk', 'culture', 'Indo-Saracenic icons, art deco lanes and Irani cafes.', 350.00, 3.0, NULL),
(139, 12, 'Marine Drive Evening Stroll', 'relax', 'The Queen''s Necklace glittering after dark.', 0.00, 1.5, NULL),
(140, 12, 'Mumbai Street Food Night Tour', 'food', 'Vada pav, sev puri and pav bhaji across five stalls.', 600.00, 2.5, NULL);

-- ------------------------------------------------------------
-- TRIPS
-- ------------------------------------------------------------
INSERT INTO trips (id, user_id, name, description, cover_image_url, start_date, end_date, status, budget_total, share_slug, is_public) VALUES
(1, 1, 'Royal Rajasthan & the Taj', 'Nine days of forts, palaces and Mughal Agra - Jaipur, Udaipur and the Taj Mahal in one royal loop.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/1280px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg',
 '2026-11-08', '2026-11-16', 'planned', 55000.00, NULL, 0),
(2, 1, 'Kerala Backwater Escape', 'Slow week across Kochi and the Alappuzha backwaters - Kathakali nights, houseboats and toddy-shop lunches.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Alappuzha_Boat_Beauty_W.jpg/1280px-Alappuzha_Boat_Beauty_W.jpg',
 '2026-09-14', '2026-09-20', 'planned', 38000.00, NULL, 0),
(3, 1, 'Himachal Winter Break', 'Snow days between Old Manali cafes and Solang slopes.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Manali_City.jpg/1280px-Manali_City.jpg',
 '2026-02-02', '2026-02-08', 'completed', 28000.00, NULL, 0),
(4, 2, 'Golden Triangle Express', 'Classic first-India loop - Delhi arrival, Agra for the Taj, then Jaipur''s pink bazaars.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg',
 '2026-05-10', '2026-05-16', 'planned', 32000.00, 'goldtriangle', 1);

-- ------------------------------------------------------------
-- TRIP STOPS
-- ------------------------------------------------------------
INSERT INTO trip_stops (id, trip_id, city_id, arrival_date, departure_date, position) VALUES
-- Trip 1: Jaipur -> Udaipur -> Agra
(1, 1, 2, '2026-11-08', '2026-11-11', 0),
(2, 1, 7, '2026-11-11', '2026-11-13', 1),
(3, 1, 1, '2026-11-13', '2026-11-16', 2),
-- Trip 2: Kochi -> Alleppey
(4, 2, 10, '2026-09-14', '2026-09-16', 0),
(5, 2, 4, '2026-09-16', '2026-09-20', 1),
-- Trip 3: Manali base
(6, 3, 9, '2026-02-02', '2026-02-08', 0),
-- Trip 4: Agra -> Jaipur
(7, 4, 1, '2026-05-10', '2026-05-13', 0),
(8, 4, 2, '2026-05-13', '2026-05-16', 1);

-- ------------------------------------------------------------
-- STOP ACTIVITIES (scheduled itinerary items)
-- ------------------------------------------------------------
INSERT INTO stop_activities (id, stop_id, activity_id, title, scheduled_date, start_time, duration_hours, est_cost, category, notes, position) VALUES
-- Trip 1 / Jaipur stop
(1, 1, 106, 'Hawa Mahal & Old City Bazaar Walk', '2026-11-08', '09:30:00', 2.5, 150.00, 'culture', NULL, 0),
(2, 1, 105, 'Amber Fort Hilltop Explore', '2026-11-09', '09:00:00', 3.5, 200.00, 'culture', 'Jeep up, walk down.', 0),
(3, 1, 107, 'Rajasthani Thali Rooftop Dinner', '2026-11-09', '19:30:00', 2.0, 600.00, 'food', NULL, 1),
(4, 1, 108, 'Block Printing Workshop in Sanganer', '2026-11-10', '10:00:00', 2.0, 700.00, 'culture', NULL, 0),
-- Trip 1 / Udaipur stop
(5, 2, 123, 'Lake Pichola Sunset Boat Ride', '2026-11-11', '17:30:00', 1.5, 400.00, 'relax', NULL, 0),
(6, 2, 124, 'City Palace Complex Tour', '2026-11-12', '09:30:00', 3.0, 300.00, 'culture', NULL, 0),
(7, 2, 125, 'Rajasthani Cooking Class with Lake View', '2026-11-12', '16:00:00', 3.0, 1200.00, 'food', NULL, 1),
-- Trip 1 / Agra stop
(8, 3, 101, 'Taj Mahal Sunrise Visit', '2026-11-14', '06:00:00', 3.0, 150.00, 'culture', 'Buy East Gate tickets online.', 0),
(9, 3, 102, 'Agra Fort & Mehtab Bagh Tour', '2026-11-14', '15:00:00', 4.0, 200.00, 'culture', NULL, 1),
(10, 3, 103, 'Mughlai Street Food Walk', '2026-11-15', '11:00:00', 2.0, 350.00, 'food', NULL, 0),
(11, 3, 104, 'Marble Inlay Workshop', '2026-11-15', '15:00:00', 1.5, 400.00, 'culture', NULL, 1),
-- Trip 2 / Kochi stop
(12, 4, 132, 'Chinese Fishing Nets Sunset Walk', '2026-09-14', '17:45:00', 1.5, 0.00, 'culture', NULL, 0),
(13, 4, 134, 'Syrian Christian Food Tour', '2026-09-15', '11:00:00', 2.5, 800.00, 'food', NULL, 0),
(14, 4, 133, 'Kathakali Performance Evening', '2026-09-15', '19:00:00', 2.0, 400.00, 'culture', NULL, 1),
-- Trip 2 / Alleppey stop
(15, 5, 113, 'Houseboat Overnight Backwater Cruise', '2026-09-17', '12:00:00', 20.0, 6500.00, 'relax', 'Board by noon; lunch onboard.', 0),
(16, 5, 114, 'Village Canoe Tour', '2026-09-18', '07:30:00', 2.5, 450.00, 'outdoors', NULL, 0),
(17, 5, 115, 'Toddy Shop Local Lunch', '2026-09-19', '12:30:00', 1.5, 250.00, 'food', NULL, 0),
-- Trip 3 / Manali stop
(18, 6, 129, 'Solang Valley Paragliding', '2026-02-03', '10:00:00', 2.0, 1500.00, 'adventure', 'Winter flights depend on wind.', 0),
(19, 6, 130, 'Hadimba Temple Cedar Forest Walk', '2026-02-04', '09:30:00', 2.0, 0.00, 'outdoors', NULL, 0),
(20, 6, 131, 'Old Manali Cafe Hop', '2026-02-05', '11:00:00', 2.5, 500.00, 'food', NULL, 0),
-- Trip 4 / Agra stop
(21, 7, 101, 'Taj Mahal Sunrise Visit', '2026-05-11', '06:00:00', 3.0, 150.00, 'culture', NULL, 0),
(22, 7, 102, 'Agra Fort & Mehtab Bagh Tour', '2026-05-11', '15:00:00', 4.0, 200.00, 'culture', 'Timed entry booked.', 1),
(23, 7, 103, 'Mughlai Street Food Walk', '2026-05-12', '11:00:00', 2.0, 350.00, 'food', NULL, 0),
-- Trip 4 / Jaipur stop
(24, 8, 105, 'Amber Fort Hilltop Explore', '2026-05-14', '09:00:00', 3.5, 200.00, 'culture', NULL, 0),
(25, 8, 108, 'Block Printing Workshop in Sanganer', '2026-05-14', '15:00:00', 2.0, 700.00, 'culture', NULL, 1),
(26, 8, 107, 'Rajasthani Thali Rooftop Dinner', '2026-05-15', '19:30:00', 2.0, 600.00, 'food', NULL, 0);

-- ------------------------------------------------------------
-- EXPENSES (amounts in INR)
-- ------------------------------------------------------------

-- Trip 1: Royal Rajasthan & the Taj (expenses 40400 + activities 4650 = 45050 spent / 55000 budget)
INSERT INTO expenses (trip_id, category, title, amount, expense_date) VALUES
(1, 'transport', 'Flights Bengaluru-Jaipur & return from Delhi', 12500.00, '2026-11-08'),
(1, 'transport', 'Private car with driver (Rajasthan loop)', 9500.00, '2026-11-09'),
(1, 'stay', 'Heritage haveli in Jaipur (3 nights)', 7200.00, '2026-11-08'),
(1, 'stay', 'Lake-view hotel in Udaipur (2 nights)', 6400.00, '2026-11-11'),
(1, 'stay', 'Hotel near Taj Ganj, Agra (3 nights)', 4800.00, '2026-11-13');

-- Trip 2: Kerala Backwater Escape (expenses 22800 + activities 8400 = 31200 spent / 38000 budget)
INSERT INTO expenses (trip_id, category, title, amount, expense_date) VALUES
(2, 'transport', 'Flights to Kochi (return)', 9800.00, '2026-09-14'),
(2, 'stay', 'Fort Kochi boutique stay (2 nights)', 5200.00, '2026-09-14'),
(2, 'stay', 'Kettuvallam houseboat + lakeside resort', 7800.00, '2026-09-16');

-- Trip 3: Himachal Winter Break (expenses 21000 + activities 2000 = 23000 spent / 28000 budget)
INSERT INTO expenses (trip_id, category, title, amount, expense_date) VALUES
(3, 'transport', 'Volvo bus Delhi-Manali (return)', 2800.00, '2026-02-02'),
(3, 'stay', 'Old Manali cottage (6 nights)', 10800.00, '2026-02-02'),
(3, 'meals', 'Cafes, dhabas & bakery runs', 4200.00, '2026-02-04'),
(3, 'other', 'Snow gear rental & room heaters', 3200.00, '2026-02-03');

-- Trip 4: Golden Triangle Express (expenses 24000 + activities 2200 = 26200 spent / 32000 budget)
INSERT INTO expenses (trip_id, category, title, amount, expense_date) VALUES
(4, 'transport', 'Trains Delhi-Agra-Jaipur-Delhi', 3600.00, '2026-05-10'),
(4, 'stay', 'Taj-view hotel in Agra (3 nights)', 8200.00, '2026-05-10'),
(4, 'stay', 'Boutique haveli in Jaipur (3 nights)', 8600.00, '2026-05-13'),
(4, 'meals', 'Food walks & rooftop dinners', 3600.00, '2026-05-12');

-- ------------------------------------------------------------
-- SAVED DESTINATIONS (Elena's "Saved Horizons")
-- ------------------------------------------------------------
INSERT INTO saved_destinations (user_id, city_id) VALUES
(1, 7),
(1, 8),
(1, 4);
