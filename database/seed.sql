-- ============================================================
-- GlobeTrotter - Seed Data (MySQL 8)
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
-- CITIES
-- ------------------------------------------------------------
INSERT INTO cities (id, name, country, region, description, cost_index, popularity, image_url) VALUES
(1, 'Kyoto', 'Japan', 'Asia', 'Ancient temples, quiet lantern-lit lanes and slow mornings in traditional machiya houses.', 2, 95,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNJqudxn6qIx_AOW1od1lWsNfPfy-HuzJzHmcSBvdWOyVcqSxqgMrFeu_DQkfxEYC3sGsLG5M5w7Xlex3E5Eq7mL5vmrm5IMGKvpodMLtXxTU9PfDHGRPoaHF5q-1L33ZNhDtR6POT0ygwd1WFPJkfbDZs9dbj-AOLCXTsO2h8WQaiOKsMyAcibLov-qcekxdgroENvbS7j7IyB1hLkJvtMv84txk31Gm--Uv4hM0R4hax0WeWxNSf'),
(2, 'Tokyo', 'Japan', 'Asia', 'Neon evenings balanced by serene shrines - a city that moves fast but rewards slowing down.', 3, 98,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFh-xQHD2nON4l9r4vytmG17EQ8x4tebG50G49qbMvyADl97R2T4ipUIkYyaBA-MgEn_9tCG94HwUM2GpBNSuKNOjURGa--90333C5GqV9sl5c5ENftufr3I5juUwQaozYMY4nmOFZr32H1ZBg584uyhZf_aOp5bytwPFqYje9sFM7RRsuKgq-F1kaZCqLXI0L3rGxKMq5FEnFRs9FhNYtMq1SGMgceHbiZkBVu3iPe2dd2hitg-G8'),
(3, 'Kanazawa', 'Japan', 'Asia', 'Kenrokuen Garden, gold-leaf crafts and Japan''s best-preserved samurai district.', 2, 72,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPd2qJOqey4oA400H7_z4yoaebvGousgmCMlvaidt_m9pRFY5FCWd8Ag0FYxxuzrO_W1ahZP9HE1QXf82NKgJAmdG4uuvr70PN-pzpJbnyqK3vCCITI56cZKDPLPLboHFjfCMfXA_aIwORRiT7sdQu1nzxohp-dgjnJtU3DIf4YmvEzc3p7o88pAMfr5_DgONxW5XXzVjoorAh9QTO2EFyfVBuH302GAdrBFeY2oKjawivPqhM7h8s'),
(4, 'Florence', 'Italy', 'Europe', 'Renaissance art, terra-cotta rooftops and long dinners in Chianti.', 3, 92,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH--FP7t-WaqbaKcBysD_XeYoTYgGJW9ML7ncbIoqHJxaArN7-cWOShbvrYwVHQU9ozP8uoLE53IiddsefuuKiOGHKiDwW3PsR0qvlpICd0Vs_0LkQ9JTO_pbMzJ1-fwSK2bWo-x6iEB5QpeeYLwgvwd9bI_3ehndNc9q7yj_-YcZEeHfugrp3bSEtOiWNKQTIVFJSRTCepRAQJv9jUBhUZvyckeYlodWDVtDM9VktoQH0U89jA7bu'),
(5, 'Amalfi', 'Italy', 'Europe', 'Cliffside lemon groves and pastel villages stacked above a calm Tyrrhenian sea.', 3, 88,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXiwXaquVM4FUg0mhACEPzZEF3a4drylVi6Ej62m2H5jk9oXPc7a4OXz6HJFDqLtdHR2GcPoSkELqXlUKJqMqlC0UbwOULDr0eR1iRFSV9GdmbjYtmY04CQexPbPdwGT2TTkPUgrKanXrKnQy2hxDpKpTVDFfbg0JDqdAjtt6_dVt1lDvX0LvdIwMwqEtvrLv-FvMspW2ZGdBnNBtbkmxZupK2N0wNcA3wiLAhKbqCsjzxDnfjInP_'),
(6, 'Tuscany', 'Italy', 'Europe', 'Golden-hour hills, cypress rows and farmhouse kitchens - the heart of slow travel.', 2, 86,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuB34bdo90quRcOfc7cvE8vbesgDgC1nNtbVDW9FGWOkc6dGj6AYJWN19IGlLXSmjBXfGvr47fRFYTbxZPlgoQnnU4SXcx-mwhJXhS3AB5Nr9LoTKVHhM4nt3_qEjle7pYIdzK_82L60CdaZnCyGkxtcnxIUBEpnJs7IloCJaSld2L0lm5-b_3zkFoVP3xce342yRbFxaJ1dyfeMLZ6ArMF8KV3Q0_g5PkabazqqLNzG7HGfKXW_QYcn'),
(7, 'Algarve', 'Portugal', 'Europe', 'Sandstone cliffs, hidden sea caves and quiet Atlantic beaches.', 2, 84,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZDp7EdYEJ3gZ4hOffolbVLF3mB_Zc0fEuTkHfHaOE-saI2fHkvAPm8LFj8H-bzlxXx5bRQE6l8181_SNeERqGayDpMwZq5lG5IersBkfgxvYYuUP1pzQYMj_gWgMfRNxexWdq9vknkdIAKNs8iaNJ2-Z0FAk-8_dlGA1AXOGPE_zqnUvkjJQVc7U91qBGJT6MKrRobFuSiCZFGxGO3ot_JTXzEcxouXZJb8FzhGrAXLdlc0_M4AXI'),
(8, 'Lisbon', 'Portugal', 'Europe', 'Trams climbing sun-washed hills, tiled facades and fado after dark.', 2, 90,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHNjWVbXIzxHDCfi-vLwILJB7zH2nvN85fzj6GqynDVr9m-StfJkJ5yFIxtwJYQqjH5149L8YuHNOsdTEJ7LV_nP5uwB-rAPBE4ECmW8DIOWQz0lf3jXZaMlo9OHQT3Xs38rjOcDIEmu0WiyoyiBHSvc9MjvjWbG-JB6DBTgdyY98ZCSuJc6zQKNPXPSVM-ta1M3z6P6GPPrrxIQ_chfGqsTUll5SygqpDjSWec3UPXxwuAUiHIZW4'),
(9, 'Provence', 'France', 'Europe', 'Lavender fields, stone villages and unhurried market mornings.', 2, 80,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuDD8jGtRm8wGBVxzeaA3JRPa4wzQCo6xwMchIGVtRVae0UebCRmRDQnjWWlDjJXJmeuGVdjqpNQnwOnkWJcj5Gl3MmFBqy3US1szOFUXnGxTISbPkVC9V3SHVqCL_25nDtOvufes0NUuFwPq-cSoMFYblvZwhLtmRVLupWJ9t9SmXED8B4oYxgJR_VGpYMgTL99tMzzV0i1ftU3hGLKtst7m_Hv8KTseim3vEfiiEfnyvatotMuy3ov'),
(10, 'Santorini', 'Greece', 'Europe', 'Whitewashed geometry above a deep blue caldera.', 3, 91,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_Snc9lEQq_xK9phNSGsREtK3J6Mi6XW25qMQaBfB7XEfft1MHpvpdtNEdjzefy-eMHwMSfNI1ggz18dJewRsFaqR8uXu7EjgMAkV4AjigtsZgTrEhrKroUh_LNpqzrnbPh0jsmb59ScXUATCj2SBLuFH7_UEZtKqfKpMaJKn0ZG_Sq5p880vbRjSYHX9tHtfJweyq8SDAFQ_ARcWtZy0BDN2wjuWKfA0o5oy4305bs_XPI_7fESIM'),
(11, 'Zermatt', 'Switzerland', 'Europe', 'Car-free alpine village beneath the Matterhorn.', 3, 75,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSlbFYErfiHFfYknPtkyFMnrH_PcrCb6KpOS6hXgcVo9zqs0krBVj3A6sseeyDmPCmKsbnFlq_RoouFNU1OKqWw3XT3NfaCYWIXe8srA2t1BS1ap6HTWVIlzZMJ0PnQrLuLTiouKnIpSZYB2FXbnX9ivXOld0OU9hAvbh0p9jBzOzfP1x9DUFyIF9Ux_Tp9QqrPtV4lGWf4bSgc773oe9WCgcRHnIfnmHmSdEDjVqFPsGEIElFz4Ay'),
(12, 'Bergen', 'Norway', 'Europe', 'Gateway to the fjords - misty mountains, wooden wharves, quiet water.', 3, 70,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuBC73OyvrT8G25S9zaAw5rjhdXTMDn6_fLNenxF-fntwntIzE_II4PAfqMamdWzsKt0BBSuiaMb82JFtClL8rRyRemglJG2MZlMhJKfLc0P35RZbORcoNFtYLN_vpGUx8ErFN0_plJUJNs08d3RDAGHVDz0AQVo_nUZtfxeZuTk7TVjP3vyUPPB3NhvfPDXWSF4zu5O32nMhCw76V-ja4JfzKfDZwlCFtrAdGrf0z4kveyblGTcPE6B');

-- ------------------------------------------------------------
-- ACTIVITIES (master catalog per city)
-- ------------------------------------------------------------
INSERT INTO activities (id, city_id, title, category, description, est_cost, duration_hours, image_url) VALUES
-- Kyoto (city_id 1)
(101, 1, 'Arashiyama Bamboo Grove Walk', 'outdoors', 'Walk the towering green corridor before the crowds arrive.', 15.00, 2.0,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuAv1jprWxe6vvxNvM8IQcskK9cld6UnBa0LvUXtPpOearGZVHkRbuqaD75rr_3LJN5TNkcjE5CSP71IvzkeWlUs6OpsJKepNrhsTxlggb5tfEfZOzBVHhscph-b2vVe4r2-mgZtJoMY1deJbIltNdPaMEA8LvE1ghjIZfqexo-2hqZTwInfBIvHUGl1puXALGNVYcUR4fb2VwZW3ZLrJCZL6VW1aaqgEajjOdyftDqXUfx9sDHZBppA'),
(102, 1, 'Traditional Tea Ceremony', 'culture', 'A quiet hour learning chanoyu in a century-old teahouse.', 40.00, 1.5, NULL),
(103, 1, 'Nishiki Market Food Walk', 'food', 'Sample pickles, tofu and tamagoyaki through Kyoto''s kitchen.', 35.00, 2.5, NULL),
(104, 1, 'Kinkaku-ji Golden Pavilion', 'culture', 'The gold-leafed temple reflected in its mirror pond.', 10.00, 1.5, NULL),
-- Tokyo (city_id 2)
(105, 2, 'teamLab Planets Digital Art', 'culture', 'Barefoot, water-mirror immersive art museum in Toyosu.', 25.00, 2.5, NULL),
(106, 2, 'Tsukiji Outer Market Breakfast', 'food', 'Tamago skewers, tuna bowls and knife shops at first light.', 30.00, 1.5, NULL),
(107, 2, 'Shibuya Crossing Evening Loop', 'outdoors', 'The world''s busiest crossing, then quieter backstreets of Cat Street.', 0.00, 2.0, NULL),
-- Kanazawa (city_id 3)
(108, 3, 'Kenrokuen Garden Morning', 'culture', 'One of Japan''s three great gardens, best at opening hour.', 10.00, 2.0, NULL),
(109, 3, 'Omicho Market Tasting', 'food', 'Seafood bowls and local sake in Kanazawa''s kitchen.', 25.00, 1.5, NULL),
(110, 3, 'Gold Leaf Craft Workshop', 'culture', 'Decorate your own lacquerware with Kanazawa gold leaf.', 30.00, 1.5, NULL),
-- Florence (city_id 4)
(111, 4, 'Uffizi Gallery Masterpieces', 'culture', 'Botticelli and Leonardo without the midday rush.', 25.00, 3.0, NULL),
(112, 4, 'Duomo Dome Climb', 'adventure', '463 steps up Brunelleschi''s dome for rooftop views.', 30.00, 2.0, NULL),
(113, 4, 'Tuscan Cooking Class', 'food', 'Handmade pici and tiramisu in a Santa Croce kitchen.', 80.00, 3.5, NULL),
(114, 4, 'Ponte Vecchio Sunset Stroll', 'relax', 'Goldsmith bridges and the Arvo river at golden hour.', 0.00, 1.0, NULL),
-- Amalfi (city_id 5)
(115, 5, 'Path of the Gods Hike', 'outdoors', 'Cliff trail from Bomerano to Nocelle high above the coast.',
 45.00, 4.0,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEP4kg7IidZJE4tSg3wcudxMkmE_7Z3XJ3jPM6yboioQ5Px6p7yG6QImRROG_LRSDfKIP8qoTuu6VYEnJecidA7-1wIu1n0Zc7GdABZAY9Ybqiy6n_BkEEbMpBh6wzvW2Ky3qP2m02sgEjvckPNoJiR8J9zj9xI0La4EgCiwmsFC8PdTVOiiyoDMOOBZAKZVj7Vt5B7XIe_08STyNK6hOYMTc1yy3Umul4PZprdmNC_CRO0CqdV1cF'),
(116, 5, 'Capri Day Boat Trip', 'adventure', 'Fast ferry to the Blue Grotto and Faraglioni rocks.', 95.00, 6.0, NULL),
(117, 5, 'Lemon Grove Tasting', 'food', 'Limencello, granita and lemon cake under the shade nets.', 20.00, 1.5, NULL),
-- Tuscany (city_id 6)
(118, 6, 'Chianti Wine Route Drive', 'food', 'Cellar tastings between Castellina and Radda.', 110.00, 5.0, NULL),
(119, 6, 'Siena Medieval Walk', 'culture', 'Il Campo, the cathedral and the contrada lanes.', 40.00, 3.0, NULL),
(120, 6, 'Agriturismo Farm Dinner', 'food', 'Long-table dinner with olive oil and pecorino producers.', 60.00, 3.0,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuAepeO4oOP5DCCDSKxRQtVhjHJeoJt5QH5O_rAatIBBGmGgDVOH2NGh0m4OXRAxbdegWdpag9D40yVYDanGww1zLf04fRMWtXGyX3GlEwwI335ehjBxDruW4ovxmObh9cqxSLp9lxkRDFdv35uL3bpGtMfC2exJ6wsC4UQBIKPUzu21rEGRTnmHcyIs7KRpXbQEzqoFI1zC-kIyyr1uceIvJqzNIQkqfiKO6RvKtIsNx50MeYMwVfDo'),
-- Algarve (city_id 7)
(121, 7, 'Benagil Sea Cave Kayak', 'adventure', 'Paddle into the famous domed cave at first light.', 55.00, 2.5, NULL),
(122, 7, 'Seven Hanging Valleys Walk', 'outdoors', 'Clifftop boardwalks from Praia da Marinha to Carvoeiro.',
 45.00, 3.5,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEP4kg7IidZJE4tSg3wcudxMkmE_7Z3XJ3jPM6yboioQ5Px6p7yG6QImRROG_LRSDfKIP8qoTuu6VYEnJecidA7-1wIu1n0Zc7GdABZAY9Ybqiy6n_BkEEbMpBh6wzvW2Ky3qP2m02sgEjvckPNoJiR8J9zj9xI0La4EgCiwmsFC8PdTVOiiyoDMOOBZAKZVj7Vt5B7XIe_08STyNK6hOYMTc1yy3Umul4PZprdmNC_CRO0CqdV1cF'),
(123, 7, 'Grilled Octopus Beach Dinner', 'food', 'Slow lunch with feet in the sand at Praia do Camilo.', 40.00, 2.0, NULL),
-- Lisbon (city_id 8)
(124, 8, 'Tram 28 & Fado Night', 'culture', 'Ride the yellow tram, then hear fado in Alfama.', 35.00, 3.0, NULL),
(125, 8, 'Pastel de Nata Bakery Crawl', 'food', 'Three bakeries, one morning, endless custard.', 15.00, 1.5, NULL),
(126, 8, 'Miradouro Sunset Circuit', 'relax', 'Viewpoint-hopping through Graça with a ginjinha.', 0.00, 2.0, NULL),
-- Provence (city_id 9)
(127, 9, 'Lavender Fields Cycling', 'outdoors', 'Pedal the Valensole plateau when lavender peaks.', 30.00, 3.0, NULL),
(128, 9, 'Avignon Producers Market', 'food', 'Les Halles morning: chèvre, olives, tapenade.', 25.00, 2.0, NULL),
(129, 9, 'Village Pottery Workshop', 'culture', 'Throw your own bowl in a Provencal studio.',
 80.00, 3.0,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5iRDcoJNiGHiC7GxbHWCJkUTn_q4fXbVePo3xot-QUe-oUCzK1F_OAN-z5TtlZ6XF0VD_Ap7N4zqgvDDNe4bjWGdFH6fQgtGqQpp3NLhxiqta0uM_A4ZSjpLaJQoXhGj4sfFzgYa2WDMNIF7FkocSh5Y0BW7rVbGi6h5uxnGed87sOpF8IBFjrr8ylRB5aGukaiJWijuubg4XZuLN29bOUwdf9Rmt34_VXRe-n1iOx-PqisjLKDg0'),
-- Santorini (city_id 10)
(130, 10, 'Oia Blue Hour Watch', 'relax', 'Find the quiet ledge before the sunset crowd.', 0.00, 1.5, NULL),
(131, 10, 'Caldera Catamaran Cruise', 'adventure', 'Swim stops at hot springs with onboard grill.', 120.00, 5.0, NULL),
(132, 10, 'Nea Kameni Volcano Hike', 'adventure', 'Walk the crater rim of the active volcanic islet.', 65.00, 3.0, NULL),
-- Zermatt (city_id 11)
(133, 11, 'Gornergrat Railway Summit', 'adventure', 'Cog railway to the Matterhorn viewpoint at 3089m.', 95.00, 4.0, NULL),
(134, 11, 'Stellisee Lake Rowing', 'outdoors', 'Glass-still alpine lake reflections at dawn.',
 35.00, 2.0,
 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVTd4Wra5mysaB21CfTytMdyoSdPcdsw6AnKDIuMXEvCcSm7CVfoOw32ZB8B5j4hLgT_1NC6FJnu77BOMdyyaciSCgwUpb_6DCWDNQeFOpEQ0BIBf-ZTdLrL4FHyqPnY7j6rqe23gkYB9z46tVTIhk5wNv-SaN3OFdg4j1i_Y4X-S8lzpiXX_VV1kA5lDJ1-x_jwJFjgv80x_TfcuOtWo2fK6i5GaOjudPHly3zMnOFKKV5PZRP6XX'),
(135, 11, 'Mountain Hut Cheese Dinner', 'food', 'Raclette by the fire at 2200m.', 55.00, 2.5, NULL),
-- Bergen (city_id 12)
(136, 12, 'Naeroyfjord Slow Cruise', 'outdoors', 'UNESCO fjord sailing past sheer cliff walls.', 85.00, 6.0, NULL),
(137, 12, 'Bryggen Hanseatic Wharf Walk', 'culture', 'Wooden trading houses and gallery courtyards.', 12.00, 1.5, NULL),
(138, 12, 'Floyen Forest Hike', 'outdoors', 'Funicular up, troll-forest trails down.', 0.00, 3.0, NULL);

-- ------------------------------------------------------------
-- TRIPS
-- ------------------------------------------------------------
INSERT INTO trips (id, user_id, name, description, cover_image_url, start_date, end_date, status, budget_total, share_slug, is_public) VALUES
(1, 1, 'Kyoto Autumn Retreat', 'Two weeks of temples, gardens and kaiseki dinners across Tokyo, Kanazawa and Kyoto in peak momiji season.',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuAv1jprWxe6vvxNvM8IQcskK9cld6UnBa0LvUXtPpOearGZVHkRbuqaD75rr_3LJN5TNkcjE5CSP71IvzkeWlUs6OpsJKepNrhsTxlggb5tfEfZOzBVHhscph-b2vVe4r2-mgZtJoMY1deJbIltNdPaMEA8LvE1ghjIZfqexo-2hqZTwInfBIvHUGl1puXALGNVYcUR4fb2VwZW3ZLrJCZL6VW1aaqgEajjOdyftDqXUfx9sDHZBppA',
 '2026-11-08', '2026-11-16', 'planned', 3000.00, NULL, 0),
(2, 1, 'Amalfi Coast Retreat', 'Slow coastal days: cliff hikes, boat trips and long seafood lunches.',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXiwXaquVM4FUg0mhACEPzZEF3a4drylVi6Ej62m2H5jk9oXPc7a4OXz6HJFDqLtdHR2GcPoSkELqXlUKJqMqlC0UbwOULDr0eR1iRFSV9GdmbjYtmY04CQexPbPdwGT2TTkPUgrKanXrKnQy2hxDpKpTVDFfbg0JDqdAjtt6_dVt1lDvX0LvdIwMwqEtvrLv-FvMspW2ZGdBnNBtbkmxZupK2N0wNcA3wiLAhKbqCsjzxDnfjInP_',
 '2026-09-14', '2026-09-20', 'planned', 2500.00, NULL, 0),
(3, 1, 'Swiss Alps Cabins', 'A winter week of cog railways, frozen lakes and fireside raclette.',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSlbFYErfiHFfYknPtkyFMnrH_PcrCb6KpOS6hXgcVo9zqs0krBVj3A6sseeyDmPCmKsbnFlq_RoouFNU1OKqWw3XT3NfaCYWIXe8srA2t1BS1ap6HTWVIlzZMJ0PnQrLuLTiouKnIpSZYB2FXbnX9ivXOld0OU9hAvbh0p9jBzOzfP1x9DUFyIF9Ux_Tp9QqrPtV4lGWf4bSgc773oe9WCgcRHnIfnmHmSdEDjVqFPsGEIElFz4Ay',
 '2026-02-02', '2026-02-08', 'completed', 2200.00, NULL, 0),
(4, 2, 'Tuscany Escape', 'Curated slow week between Florence and the Val d''Orcia - wineries, farm dinners and hill towns.',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuAepeO4oOP5DCCDSKxRQtVhjHJeoJt5QH5O_rAatIBBGmGgDVOH2NGh0m4OXRAxbdegWdpag9D40yVYDanGww1zLf04fRMWtXGyX3GlEwwI335ehjBxDruW4ovxmObh9cqxSLp9lxkRDFdv35uL3bpGtMfC2exJ6wsC4UQBIKPUzu21rEGRTnmHcyIs7KRpXbQEzqoFI1zC-kIyyr1uceIvJqzNIQkqfiKO6RvKtIsNx50MeYMwVfDo',
 '2026-05-10', '2026-05-16', 'planned', 2000.00, 'tuscanescape', 1);

-- ------------------------------------------------------------
-- TRIP STOPS
-- ------------------------------------------------------------
INSERT INTO trip_stops (id, trip_id, city_id, arrival_date, departure_date, position) VALUES
-- Trip 1: Tokyo -> Kanazawa -> Kyoto
(1, 1, 2, '2026-11-08', '2026-11-10', 0),
(2, 1, 3, '2026-11-10', '2026-11-12', 1),
(3, 1, 1, '2026-11-12', '2026-11-16', 2),
-- Trip 2: Amalfi base
(4, 2, 5, '2026-09-14', '2026-09-20', 0),
-- Trip 3: Zermatt
(5, 3, 11, '2026-02-02', '2026-02-08', 0),
-- Trip 4: Florence -> Tuscany
(6, 4, 4, '2026-05-10', '2026-05-13', 0),
(7, 4, 6, '2026-05-13', '2026-05-16', 1);

-- ------------------------------------------------------------
-- STOP ACTIVITIES (scheduled itinerary items)
-- ------------------------------------------------------------
INSERT INTO stop_activities (id, stop_id, activity_id, title, scheduled_date, start_time, duration_hours, est_cost, category, notes, position) VALUES
-- Trip 1 / Tokyo stop
(1, 1, 105, 'teamLab Planets Digital Art', '2026-11-08', '17:00:00', 2.5, 25.00, 'culture', 'Book the late slot - fewer kids.', 0),
(2, 1, 106, 'Tsukiji Outer Market Breakfast', '2026-11-09', '08:30:00', 1.5, 30.00, 'food', NULL, 0),
(3, 1, 107, 'Shibuya Crossing Evening Loop', '2026-11-09', '18:30:00', 2.0, 0.00, 'outdoors', NULL, 1),
-- Trip 1 / Kanazawa stop
(4, 2, 108, 'Kenrokuen Garden Morning', '2026-11-10', '09:00:00', 2.0, 10.00, 'culture', NULL, 0),
(5, 2, 109, 'Omicho Market Tasting', '2026-11-11', '09:30:00', 1.5, 25.00, 'food', 'Kaisendon at Morino-ya.', 0),
(6, 2, 110, 'Gold Leaf Craft Workshop', '2026-11-11', '14:00:00', 1.5, 30.00, 'culture', NULL, 1),
-- Trip 1 / Kyoto stop
(7, 3, 101, 'Arashiyama Bamboo Grove Walk', '2026-11-12', '07:30:00', 2.0, 15.00, 'outdoors', 'Arrive by 7:15 for empty paths.', 0),
(8, 3, 102, 'Traditional Tea Ceremony', '2026-11-13', '11:00:00', 1.5, 40.00, 'culture', 'Camellia House, booked.', 0),
(9, 3, 104, 'Kinkaku-ji Golden Pavilion', '2026-11-13', '15:00:00', 1.5, 10.00, 'culture', NULL, 1),
(10, 3, 103, 'Nishiki Market Food Walk', '2026-11-14', '10:00:00', 2.5, 35.00, 'food', NULL, 0),
(11, 3, NULL, 'Philosopher''s Path Momiji Walk', '2026-11-15', '09:00:00', 2.5, 0.00, 'outdoors', 'Peak leaf season - bring the good camera.', 0),
-- Trip 2 / Amalfi stop
(12, 4, 117, 'Lemon Grove Tasting', '2026-09-15', '11:00:00', 1.5, 20.00, 'food', NULL, 0),
(13, 4, 115, 'Path of the Gods Hike', '2026-09-16', '08:00:00', 4.0, 45.00, 'outdoors', 'Bus to Bomerano, walk down to Nocelle.', 0),
(14, 4, 116, 'Capri Day Boat Trip', '2026-09-18', '09:00:00', 6.0, 95.00, 'adventure', NULL, 0),
-- Trip 3 / Zermatt stop
(15, 5, 133, 'Gornergrat Railway Summit', '2026-02-03', '09:00:00', 4.0, 95.00, 'adventure', NULL, 0),
(16, 5, 134, 'Stellisee Lake Rowing', '2026-02-05', '08:00:00', 2.0, 35.00, 'outdoors', 'Frozen shoreline - rent spikes at hut.', 0),
(17, 5, 135, 'Mountain Hut Cheese Dinner', '2026-02-06', '19:00:00', 2.5, 55.00, 'food', 'Reserve the window table.', 0),
-- Trip 4 / Florence stop
(18, 6, 111, 'Uffizi Gallery Masterpieces', '2026-05-11', '09:30:00', 3.0, 25.00, 'culture', 'Timed entry tickets bought.', 0),
(19, 6, 112, 'Duomo Dome Climb', '2026-05-11', '15:00:00', 2.0, 30.00, 'adventure', NULL, 1),
(20, 6, 114, 'Ponte Vecchio Sunset Stroll', '2026-05-12', '18:30:00', 1.0, 0.00, 'relax', NULL, 0),
-- Trip 4 / Tuscany stop
(21, 7, 118, 'Chianti Wine Route Drive', '2026-05-14', '10:00:00', 5.0, 110.00, 'food', 'Designated driver rotates daily.', 0),
(22, 7, 119, 'Siena Medieval Walk', '2026-05-15', '09:30:00', 3.0, 40.00, 'culture', NULL, 0),
(23, 7, 120, 'Agriturismo Farm Dinner', '2026-05-15', '19:30:00', 3.0, 60.00, 'food', NULL, 1);

-- ------------------------------------------------------------
-- EXPENSES
-- ------------------------------------------------------------

-- Trip 1: Kyoto Autumn Retreat (expenses 2222 + activities 228 = 2450 spent / 3000 budget)
INSERT INTO expenses (trip_id, category, title, amount, expense_date) VALUES
(1, 'transport', 'International flights LHR-HND', 850.00, '2026-11-08'),
(1, 'transport', 'Japan Rail Pass (7-day)', 270.00, '2026-11-08'),
(1, 'stay', 'Hotel Ryumeikan Tokyo (2 nights)', 380.00, '2026-11-08'),
(1, 'stay', 'Ryokan Yuzuya Kyoto (4 nights)', 370.00, '2026-11-12'),
(1, 'meals', 'Tokyo dinners & konbini runs', 90.00, '2026-11-09'),
(1, 'meals', 'Kanazawa seafood & sake', 84.00, '2026-11-11'),
(1, 'meals', 'Kyoto kaiseki & cafes', 90.00, '2026-11-13'),
(1, 'other', 'Travel insurance', 88.00, '2026-11-01');

-- Trip 2: Amalfi Coast Retreat (expenses 1300 + activities 160 = 1460 spent / 2500 budget)
INSERT INTO expenses (trip_id, category, title, amount, expense_date) VALUES
(2, 'transport', 'Flights to Naples + ferry', 420.00, '2026-09-14'),
(2, 'stay', 'Casa Angelina Praiano (6 nights)', 640.00, '2026-09-14'),
(2, 'transport', 'SITA bus passes & ferries', 60.00, '2026-09-15'),
(2, 'meals', 'Coastal lunches & dinners', 180.00, '2026-09-16');

-- Trip 3: Swiss Alps Cabins (expenses 1380 + activities 185 = 1565 spent / 2200 budget)
INSERT INTO expenses (trip_id, category, title, amount, expense_date) VALUES
(3, 'transport', 'Swiss Travel Pass', 300.00, '2026-02-02'),
(3, 'stay', 'Chalet Z''mutten (6 nights)', 700.00, '2026-02-02'),
(3, 'meals', 'Groceries & mountain lunches', 260.00, '2026-02-04'),
(3, 'other', 'Ski gear rental', 120.00, '2026-02-03');

-- Trip 4: Tuscany Escape (expenses 1090 + activities 210 = 1300 spent / 2000 budget)
INSERT INTO expenses (trip_id, category, title, amount, expense_date) VALUES
(4, 'stay', 'Val d''Orcia agriturismo (6 nights)', 800.00, '2026-05-10'),
(4, 'transport', 'Car rental + fuel', 190.00, '2026-05-10'),
(4, 'meals', 'Market picnics & trattorias', 100.00, '2026-05-12');

-- ------------------------------------------------------------
-- SAVED DESTINATIONS (Elena's "Saved Horizons")
-- ------------------------------------------------------------
INSERT INTO saved_destinations (user_id, city_id) VALUES
(1, 6),
(1, 1),
(1, 10);
