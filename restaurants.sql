--
-- PostgreSQL database dump
--

-- Dumped from database version 10.15 (Ubuntu 10.15-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.15 (Ubuntu 10.15-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: vagrant
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    user_id integer,
    meetup_id integer,
    "timestamp" timestamp without time zone,
    text text
);


ALTER TABLE public.comments OWNER TO vagrant;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: vagrant
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO vagrant;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vagrant
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: vagrant
--

CREATE TABLE public.favorites (
    user_id integer,
    restaurant_id character varying
);


ALTER TABLE public.favorites OWNER TO vagrant;

--
-- Name: meetups; Type: TABLE; Schema: public; Owner: vagrant
--

CREATE TABLE public.meetups (
    id integer NOT NULL,
    name character varying,
    date timestamp without time zone,
    capacity integer,
    attendees_count integer,
    description text,
    image_url character varying,
    status character varying(10),
    restaurant_id character varying,
    host_id integer
);


ALTER TABLE public.meetups OWNER TO vagrant;

--
-- Name: meetups_id_seq; Type: SEQUENCE; Schema: public; Owner: vagrant
--

CREATE SEQUENCE public.meetups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.meetups_id_seq OWNER TO vagrant;

--
-- Name: meetups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vagrant
--

ALTER SEQUENCE public.meetups_id_seq OWNED BY public.meetups.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: vagrant
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    sender_id integer,
    recipient_id integer,
    body text,
    "timestamp" timestamp without time zone
);


ALTER TABLE public.messages OWNER TO vagrant;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: vagrant
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.messages_id_seq OWNER TO vagrant;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vagrant
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: vagrant
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    name character varying,
    user_id integer,
    "timestamp" timestamp without time zone,
    payload_json text,
    status character varying(10)
);


ALTER TABLE public.notifications OWNER TO vagrant;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: vagrant
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO vagrant;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vagrant
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: restaurants; Type: TABLE; Schema: public; Owner: vagrant
--

CREATE TABLE public.restaurants (
    id character varying NOT NULL,
    name character varying,
    cuisine character varying,
    address character varying,
    longitude double precision,
    latitude double precision,
    image_url character varying
);


ALTER TABLE public.restaurants OWNER TO vagrant;

--
-- Name: user_meetups; Type: TABLE; Schema: public; Owner: vagrant
--

CREATE TABLE public.user_meetups (
    user_id integer,
    meetup_id integer
);


ALTER TABLE public.user_meetups OWNER TO vagrant;

--
-- Name: users; Type: TABLE; Schema: public; Owner: vagrant
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying,
    fname character varying,
    lname character varying,
    email character varying,
    password_hash character varying,
    image_url character varying,
    about text
);


ALTER TABLE public.users OWNER TO vagrant;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: vagrant
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO vagrant;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vagrant
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: meetups id; Type: DEFAULT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.meetups ALTER COLUMN id SET DEFAULT nextval('public.meetups_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: vagrant
--

COPY public.comments (id, user_id, meetup_id, "timestamp", text) FROM stdin;
1	8	2	2021-03-15 19:59:17.528134	Can't wait for this fancy dinner ❤️
2	11	5	2021-03-15 20:26:52.100855	Hi everyone! Can't wait!
3	11	5	2021-03-15 20:26:56.067372	So yummy!
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: vagrant
--

COPY public.favorites (user_id, restaurant_id) FROM stdin;
1	MvAo0hj9FXOeNL5PwBZ0fQ
1	L5vSeC_sa3TUQW_lticqyA
1	HHtpR0RslupSQ99GIIwW5A
1	47OC_X6KkiDDQ4jwoCUjFg
1	2hGIxgprREdBieylltWaRQ
2	1U9_ZNruMLf4EL0pMoxb_w
2	DGyoVB9PdI9_jw0CNi_OPg
2	PTFxtXS47ZVRCdZIrEWvGw
2	ofFgj0sd8iDQunY00hhDVQ
2	4KfQnlcSu4bbTqnvGdGptw
3	__I9HmtBMV4dDkEgT22V4g
3	wGl_DyNxSv8KUtYgiuLhmA
3	PsY5DMHxa5iNX_nX0T-qPA
3	uEeWn6sPq-giWvfE9uhQ7A
3	n6L5VIGunR51-D55C-eYeQ
4	47OC_X6KkiDDQ4jwoCUjFg
4	n6L5VIGunR51-D55C-eYeQ
4	2XQm-uFcTS7oc8MFP-8olA
4	xDwEMq8kgT0eQepn90Jkvg
4	KkAVX3Wb7E3lP5F_f_8pXg
5	2hGIxgprREdBieylltWaRQ
5	n6L5VIGunR51-D55C-eYeQ
5	GXu3PD4IPsxIHpo011aydg
5	gqVl3RprESEqkIPeJH0yOg
5	ciEDsTWhajcdL3KuJqBRlw
6	m3xdxV8YNH5uh1N01xdnLA
6	QZQGRJZ4bZCmNoXjs3z1XQ
6	8kck3-K4zYKTJbJko0JlXQ
6	mSMZJj2pFvttWLpcDmgrEA
6	ciEDsTWhajcdL3KuJqBRlw
7	8dUaybEPHsZMgr1iKgqgMQ
7	8kck3-K4zYKTJbJko0JlXQ
7	uEeWn6sPq-giWvfE9uhQ7A
7	PDhfVvcVXgBinZf5I6s1KQ
7	DyXoC_NhJW0Xx5j_OPQRHQ
8	gqVl3RprESEqkIPeJH0yOg
8	CYttYTEiQuhSfo3SEh79fA
8	4KfQnlcSu4bbTqnvGdGptw
8	PsY5DMHxa5iNX_nX0T-qPA
8	eYXwVR4mMAjzkJnm5wneHQ
9	akXf1BdFZjQb2fO8Ca7FtA
9	CYttYTEiQuhSfo3SEh79fA
9	n6L5VIGunR51-D55C-eYeQ
9	76smcUUGRvq3k1MVPUXbnA
9	1U9_ZNruMLf4EL0pMoxb_w
10	DyXoC_NhJW0Xx5j_OPQRHQ
10	gqVl3RprESEqkIPeJH0yOg
10	hqQoVK0vadOX7_4gN1sh3g
10	8dUaybEPHsZMgr1iKgqgMQ
11	8kck3-K4zYKTJbJko0JlXQ
11	wGl_DyNxSv8KUtYgiuLhmA
11	HHtpR0RslupSQ99GIIwW5A
11	lJAGnYzku5zSaLnQ_T6_GQ
11	Xg-FyjVKAN70LO4u4Z1ozg
11	ri7UUYmx21AgSpRsf4-9QA
11	76smcUUGRvq3k1MVPUXbnA
11	eYXwVR4mMAjzkJnm5wneHQ
11	M0JTO3oyu6gxh1mfFjU-dA
11	PsY5DMHxa5iNX_nX0T-qPA
11	2XQm-uFcTS7oc8MFP-8olA
11	f-m7-hyFzkf0HSEeQ2s-9A
11	ttarnopezxmp2ROB1N2PaA
11	SGRmnarrNuVEsAjYdEoA0w
11	gqVl3RprESEqkIPeJH0yOg
11	hqQoVK0vadOX7_4gN1sh3g
11	PTFxtXS47ZVRCdZIrEWvGw
11	KkAVX3Wb7E3lP5F_f_8pXg
11	mSMZJj2pFvttWLpcDmgrEA
11	8dUaybEPHsZMgr1iKgqgMQ
11	n6L5VIGunR51-D55C-eYeQ
11	m3xdxV8YNH5uh1N01xdnLA
11	__I9HmtBMV4dDkEgT22V4g
11	MvAo0hj9FXOeNL5PwBZ0fQ
11	L5vSeC_sa3TUQW_lticqyA
11	GXu3PD4IPsxIHpo011aydg
11	1U9_ZNruMLf4EL0pMoxb_w
11	PDhfVvcVXgBinZf5I6s1KQ
11	47OC_X6KkiDDQ4jwoCUjFg
11	xDwEMq8kgT0eQepn90Jkvg
11	QZQGRJZ4bZCmNoXjs3z1XQ
11	ciEDsTWhajcdL3KuJqBRlw
11	DyXoC_NhJW0Xx5j_OPQRHQ
11	4KfQnlcSu4bbTqnvGdGptw
11	uEeWn6sPq-giWvfE9uhQ7A
11	ofFgj0sd8iDQunY00hhDVQ
11	2hGIxgprREdBieylltWaRQ
11	DGyoVB9PdI9_jw0CNi_OPg
11	akXf1BdFZjQb2fO8Ca7FtA
11	CYttYTEiQuhSfo3SEh79fA
11	reXWH9Wo0ZTOuQsTMNOSxg
11	J7_-faNq_Ag9qTOlDn81Pw
11	wxzx3duu1c0CcomzEOvfOQ
2	WavvLdfdP6g8aZTtbBQHTw
4	WavvLdfdP6g8aZTtbBQHTw
10	WavvLdfdP6g8aZTtbBQHTw
8	WavvLdfdP6g8aZTtbBQHTw
11	WavvLdfdP6g8aZTtbBQHTw
\.


--
-- Data for Name: meetups; Type: TABLE DATA; Schema: public; Owner: vagrant
--

COPY public.meetups (id, name, date, capacity, attendees_count, description, image_url, status, restaurant_id, host_id) FROM stdin;
3	Yummy Dessert	2022-02-05 14:00:00	10	0	Let's get ice cream ice cream ice cream.	/v1615838621/u5i7lbjwjqaut1ql7ioz.jpg	ACTIVE	wGl_DyNxSv8KUtYgiuLhmA	11
4	Chill Dinner	2021-02-10 19:00:00	5	0	How about some weekday Thai Food?\nThere's outdoor dining here.	/v1615838719/jq6icfnziiq5rljwbf6n.jpg	ACTIVE	8kck3-K4zYKTJbJko0JlXQ	11
2	Fancy Dinner	2022-01-08 17:00:00	5	0	Let's have a FaNcY dInNeR at Gary Danko...\nVery fancy one indeed!	/v1615839366/fancy_qg7fw1.jpg	ACTIVE	WavvLdfdP6g8aZTtbBQHTw	11
5	Brunch Time	2022-02-12 12:00:00	5	3	Brunch and Mimosas	/v1615839068/vqkf9wdlb8j6gruxaoyn.jpg	ACTIVE	n6L5VIGunR51-D55C-eYeQ	4
6	Happy Hour	2021-01-06 17:00:00	5	0	This is a buzzy, casual eatery for Hawaiian, Indian & Chinese dishes in a brick-walled space with booths.	/v1615839750/fftug015wkcafrxmzkl6.jpg	ACTIVE	KkAVX3Wb7E3lP5F_f_8pXg	4
7	Vegan Japanese	2021-03-12 18:30:00	6	0	Let's try vegan Japanese food and sushi.\nI've never had that before!	/v1615840055/salb82md8udwham5j1dt.jpg	ACTIVE	CYttYTEiQuhSfo3SEh79fA	11
8	Afternoon Cakes!	2021-04-10 14:00:00	5	1	I usually need a cake break from work around 2pm. Let's get cake!	/v1615841049/iay3favk9o6mgmb3xhgn.jpg	ACTIVE	DyXoC_NhJW0Xx5j_OPQRHQ	10
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: vagrant
--

COPY public.messages (id, sender_id, recipient_id, body, "timestamp") FROM stdin;
1	11	4	Hi Ice Bear!	2021-03-15 20:27:22.080345
2	4	11	Hi peppa pig, you are tall!	2021-03-15 20:27:40.784301
3	4	8	Hello you live with me.	2021-03-15 20:27:58.55181
4	4	10	Hi Grizz my brother.	2021-03-15 20:28:09.762903
5	1	11	Hi peppa pig are you really 4 years old?	2021-03-15 20:29:03.994537
6	1	11	You are tall but also a preschooler.	2021-03-15 20:29:12.359222
7	11	5	Oh hi tonton you are so cute cat!	2021-03-15 20:29:35.284146
8	11	5	Really cutie cat you are!	2021-03-15 20:29:41.93292
9	5	11	Hi peppa and you are a pig!\nI really am a cute cat... I do know!	2021-03-15 20:30:07.746978
10	11	2	Hi pusheen cat you are a little chubby cat.	2021-03-15 20:30:50.127476
11	2	11	NO! I am a very pretty cat.	2021-03-15 20:31:08.915849
13	2	11	NO! I am in shape cat!!!!!	2021-03-15 20:32:03.874247
12	11	2	You are pretty cat, but also chubby cat too.	2021-03-15 20:31:36.951115
14	11	5	I really like cute cats!	2021-03-15 20:35:26.836348
15	11	4	Thank you, I am only 4 years old!	2021-03-15 20:35:46.052126
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: vagrant
--

COPY public.notifications (id, name, user_id, "timestamp", payload_json, status) FROM stdin;
2	meetup_cancelled	2	2021-03-15 19:51:37.36339	{"message": "Your meetup at Gary Danko has been cancelled.", "link": "Go to meetup.", "url": "/meetup/1"}	UNREAD
4	meetup_cancelled	8	2021-03-15 19:51:37.401148	{"message": "Your meetup at Gary Danko has been cancelled.", "link": "Go to meetup.", "url": "/meetup/1"}	UNREAD
6	new_meetup	2	2021-03-15 19:57:46.8477	{"message": "There is a new event at Gary Danko.", "link": "Go to meetup.", "url": "/meetup/2"}	UNREAD
8	new_meetup	8	2021-03-15 19:57:46.868524	{"message": "There is a new event at Gary Danko.", "link": "Go to meetup.", "url": "/meetup/2"}	UNREAD
9	new_meetup	10	2021-03-15 19:57:46.879122	{"message": "There is a new event at Gary Danko.", "link": "Go to meetup.", "url": "/meetup/2"}	UNREAD
10	new_meetup	3	2021-03-15 20:01:54.451599	{"message": "There is a new event at Bi-Rite Creamery.", "link": "Go to meetup.", "url": "/meetup/3"}	UNREAD
11	new_meetup	6	2021-03-15 20:03:32.979446	{"message": "There is a new event at Farmhouse Kitchen Thai Cuisine.", "link": "Go to meetup.", "url": "/meetup/4"}	UNREAD
12	new_meetup	7	2021-03-15 20:03:32.998673	{"message": "There is a new event at Farmhouse Kitchen Thai Cuisine.", "link": "Go to meetup.", "url": "/meetup/4"}	UNREAD
13	new_meetup	3	2021-03-15 20:09:21.124199	{"message": "There is a new event at Foreign Cinema.", "link": "Go to meetup.", "url": "/meetup/5"}	UNREAD
14	new_meetup	5	2021-03-15 20:09:21.139023	{"message": "There is a new event at Foreign Cinema.", "link": "Go to meetup.", "url": "/meetup/5"}	UNREAD
15	new_meetup	9	2021-03-15 20:09:21.152779	{"message": "There is a new event at Foreign Cinema.", "link": "Go to meetup.", "url": "/meetup/5"}	UNREAD
16	new_meetup	11	2021-03-15 20:09:21.167595	{"message": "There is a new event at Foreign Cinema.", "link": "Go to meetup.", "url": "/meetup/5"}	UNREAD
18	meetup_changed	8	2021-03-15 20:12:55.785478	{"message": "Your meetup at Gary Danko has been changed.", "link": "Go to meetup.", "url": "/meetup/2"}	UNREAD
19	meetup_changed	10	2021-03-15 20:12:55.799586	{"message": "Your meetup at Gary Danko has been changed.", "link": "Go to meetup.", "url": "/meetup/2"}	UNREAD
20	new_meetup	11	2021-03-15 20:20:42.948341	{"message": "There is a new event at Liholiho Yacht Club.", "link": "Go to meetup.", "url": "/meetup/6"}	UNREAD
21	new_meetup	8	2021-03-15 20:25:47.638504	{"message": "There is a new event at Shizen Vegan Sushi Bar & Izakaya.", "link": "Go to meetup.", "url": "/meetup/7"}	UNREAD
22	new_meetup	9	2021-03-15 20:25:47.649449	{"message": "There is a new event at Shizen Vegan Sushi Bar & Izakaya.", "link": "Go to meetup.", "url": "/meetup/7"}	UNREAD
23	new_message	4	2021-03-15 20:27:22.103498	{"message": "You have a new message from peppa.", "link": "Go to messages.", "url": "/messages"}	READ
24	new_message	11	2021-03-15 20:27:40.809953	{"message": "You have a new message from icebear.", "link": "Go to messages.", "url": "/messages"}	UNREAD
25	new_message	8	2021-03-15 20:27:58.586572	{"message": "You have a new message from icebear.", "link": "Go to messages.", "url": "/messages"}	UNREAD
26	new_message	10	2021-03-15 20:28:09.787506	{"message": "You have a new message from icebear.", "link": "Go to messages.", "url": "/messages"}	UNREAD
27	new_message	11	2021-03-15 20:29:04.033712	{"message": "You have a new message from balloonicorn.", "link": "Go to messages.", "url": "/messages"}	UNREAD
28	new_message	11	2021-03-15 20:29:12.378821	{"message": "You have a new message from balloonicorn.", "link": "Go to messages.", "url": "/messages"}	UNREAD
29	new_message	5	2021-03-15 20:29:35.311428	{"message": "You have a new message from peppa.", "link": "Go to messages.", "url": "/messages"}	UNREAD
30	new_message	5	2021-03-15 20:29:41.95873	{"message": "You have a new message from peppa.", "link": "Go to messages.", "url": "/messages"}	UNREAD
31	new_message	11	2021-03-15 20:30:07.770916	{"message": "You have a new message from tonton.", "link": "Go to messages.", "url": "/messages"}	UNREAD
32	new_message	2	2021-03-15 20:30:50.167478	{"message": "You have a new message from peppa.", "link": "Go to messages.", "url": "/messages"}	UNREAD
33	new_message	11	2021-03-15 20:31:08.961894	{"message": "You have a new message from pusheen.", "link": "Go to messages.", "url": "/messages"}	UNREAD
34	new_message	2	2021-03-15 20:31:36.986766	{"message": "You have a new message from peppa.", "link": "Go to messages.", "url": "/messages"}	UNREAD
35	new_message	11	2021-03-15 20:32:03.931526	{"message": "You have a new message from pusheen.", "link": "Go to messages.", "url": "/messages"}	UNREAD
36	new_message	5	2021-03-15 20:35:26.866811	{"message": "You have a new message from peppa.", "link": "Go to messages.", "url": "/messages"}	UNREAD
38	new_meetup	7	2021-03-15 20:42:21.209714	{"message": "There is a new event at Schubert's Bakery.", "link": "Go to meetup.", "url": "/meetup/8"}	UNREAD
39	new_meetup	11	2021-03-15 20:42:21.224523	{"message": "There is a new event at Schubert's Bakery.", "link": "Go to meetup.", "url": "/meetup/8"}	UNREAD
37	new_message	4	2021-03-15 20:35:46.077563	{"message": "You have a new message from peppa.", "link": "Go to messages.", "url": "/messages"}	READ
7	new_meetup	4	2021-03-15 19:57:46.857411	{"message": "There is a new event at Gary Danko.", "link": "Go to meetup.", "url": "/meetup/2"}	READ
\.


--
-- Data for Name: restaurants; Type: TABLE DATA; Schema: public; Owner: vagrant
--

COPY public.restaurants (id, name, cuisine, address, longitude, latitude, image_url) FROM stdin;
8kck3-K4zYKTJbJko0JlXQ	Farmhouse Kitchen Thai Cuisine	Thai	710 Florida St\nSan Francisco, CA 94110	-122.4114188698492	37.7601928839327954	https://s3-media3.fl.yelpcdn.com/bphoto/5LqW8X5GqbAp_DtRrcx4_Q/o.jpg
wGl_DyNxSv8KUtYgiuLhmA	Bi-Rite Creamery	Ice Cream & Frozen Yogurt	3692 18th St\nSan Francisco, CA 94110	-122.425717000000006	37.7615910000000028	https://s3-media2.fl.yelpcdn.com/bphoto/iPNJKlOQ7-eyqa4Yv2r2BA/o.jpg
HHtpR0RslupSQ99GIIwW5A	Marufuku Ramen SF	Ramen	1581 Webster St\nSte 235\nSan Francisco, CA 94115	-122.431842000000003	37.7850139999999968	https://s3-media4.fl.yelpcdn.com/bphoto/ouK2VmW0SrI70jsJpTxJhw/o.jpg
WavvLdfdP6g8aZTtbBQHTw	Gary Danko	American (New)	800 N Point St\nSan Francisco, CA 94109	-122.420580000000001	37.8058699999999988	https://s3-media3.fl.yelpcdn.com/bphoto/nOMXkkvswV02iBDlyVlgVQ/o.jpg
lJAGnYzku5zSaLnQ_T6_GQ	Brenda's French Soul Food	Breakfast & Brunch	652 Polk St\nSan Francisco, CA 94102	-122.419043442957005	37.7829016035273	https://s3-media3.fl.yelpcdn.com/bphoto/sNIJnePGDenUOyewsD8tLg/o.jpg
Xg-FyjVKAN70LO4u4Z1ozg	Hog Island Oyster Co	Seafood	1 Ferry Bldg\nShop 11\nSan Francisco, CA 94111	-122.393303000000003	37.7958309999999997	https://s3-media3.fl.yelpcdn.com/bphoto/TW9FgV_Ufqd15t_ARQuz1A/o.jpg
ri7UUYmx21AgSpRsf4-9QA	Tartine Bakery & Cafe	Bakeries	600 Guerrero St\nSan Francisco, CA 94110	-122.424310000000006	37.7613100000000017	https://s3-media2.fl.yelpcdn.com/bphoto/nPUUXYVVa3CHJh5yzH8Xnw/o.jpg
76smcUUGRvq3k1MVPUXbnA	Mitchell's Ice Cream	Ice Cream & Frozen Yogurt	688 San Jose Ave\nSan Francisco, CA 94110	-122.422791000000004	37.7442210000000031	https://s3-media2.fl.yelpcdn.com/bphoto/xBdlIh2tJUz8zr4ajXwKfg/o.jpg
eYXwVR4mMAjzkJnm5wneHQ	Burma Superstar	Burmese	309 Clement St\nSan Francisco, CA 94118	-122.462539672852003	37.7827873229979971	https://s3-media4.fl.yelpcdn.com/bphoto/Rt-zOS-uNY0cafsq1UeoDw/o.jpg
M0JTO3oyu6gxh1mfFjU-dA	San Tung	Chinese	1031 Irving St\nSan Francisco, CA 94122	-122.469008000000002	37.7636930000000035	https://s3-media4.fl.yelpcdn.com/bphoto/pvWRWivkeyGy7g7UF9Me1g/o.jpg
PsY5DMHxa5iNX_nX0T-qPA	Kokkari Estiatorio	Greek	200 Jackson St\nSan Francisco, CA 94111	-122.399660999999995	37.796996	https://s3-media2.fl.yelpcdn.com/bphoto/7StMTfE2srlcIu2opeTb3g/o.jpg
2XQm-uFcTS7oc8MFP-8olA	B Patisserie	Bakeries	2821 California St\nSan Francisco, CA 94115	-122.440882000000002	37.7878729999999976	https://s3-media2.fl.yelpcdn.com/bphoto/_wEj1VAMXp4tcO-MvO8e0g/o.jpg
f-m7-hyFzkf0HSEeQ2s-9A	Fog Harbor Fish House	Seafood	39 Pier\nSte A-202\nSan Francisco, CA 94133	-122.410229999999999	37.8088499999999996	https://s3-media2.fl.yelpcdn.com/bphoto/2eAtP1SJy21JTvQWxaQSng/o.jpg
ttarnopezxmp2ROB1N2PaA	Nopa	American (New)	560 Divisadero St\nSan Francisco, CA 94117	-122.437460000000002	37.7748300000000015	https://s3-media3.fl.yelpcdn.com/bphoto/Li0xXDEM78GMG1xCYgYYaA/o.jpg
SGRmnarrNuVEsAjYdEoA0w	El Farolito	Mexican	2779 Mission St\nSan Francisco, CA 94110	-122.418120000000002	37.7526500000000027	https://s3-media1.fl.yelpcdn.com/bphoto/gcC2Uwtu5raP13D3jWYm0Q/o.jpg
gqVl3RprESEqkIPeJH0yOg	Zazie	Breakfast & Brunch	941 Cole St\nSan Francisco, CA 94117	-122.450113799999997	37.7652440000000027	https://s3-media3.fl.yelpcdn.com/bphoto/uuRvEU-cqPk-XlDbFAQjKg/o.jpg
hqQoVK0vadOX7_4gN1sh3g	Saigon Sandwich	Vietnamese	560 Larkin St\nSan Francisco, CA 94102	-122.417318022036994	37.7831519576567985	https://s3-media3.fl.yelpcdn.com/bphoto/lE_HHijKAKt08JIeRHVh7w/o.jpg
PTFxtXS47ZVRCdZIrEWvGw	Golden Boy Pizza	Pizza	542 Green St\nSan Francisco, CA 94133	-122.408072899999993	37.799795600000003	https://s3-media1.fl.yelpcdn.com/bphoto/F8OxoXdS51h2VfU9Je2cNQ/o.jpg
KkAVX3Wb7E3lP5F_f_8pXg	Liholiho Yacht Club	Bars	871 Sutter St\nSan Francisco, CA 94109	-122.414580000000001	37.788179999999997	https://s3-media3.fl.yelpcdn.com/bphoto/DXivotp5hwFovHx8Mk8-Lg/o.jpg
mSMZJj2pFvttWLpcDmgrEA	Tony's Pizza Napoletana	Pizza	1570 Stockton St\nSan Francisco, CA 94133	-122.409053979377006	37.8003315377661977	https://s3-media3.fl.yelpcdn.com/bphoto/rrBlePEDLrbD27VVE0Ze2A/o.jpg
8dUaybEPHsZMgr1iKgqgMQ	Sotto Mare Oysteria & Seafood	Seafood	552 Green St\nSan Francisco, CA 94133	-122.408339999999995	37.7997900000000016	https://s3-media3.fl.yelpcdn.com/bphoto/o3hIcGLMxV_5ynxEjGWGrw/o.jpg
n6L5VIGunR51-D55C-eYeQ	Foreign Cinema	Breakfast & Brunch	2534 Mission St\nSan Francisco, CA 94110	-122.419250000000005	37.7563699999999969	https://s3-media3.fl.yelpcdn.com/bphoto/cw5y2LSOIE-EVNjKK_d7SQ/o.jpg
m3xdxV8YNH5uh1N01xdnLA	Golden Gate Bakery	Bakeries	1029 Grant Ave\nSan Francisco, CA 94133	-122.407030000000006	37.7963299999999975	https://s3-media3.fl.yelpcdn.com/bphoto/wfAJQhnqJ5xHGXc1agSeHA/o.jpg
__I9HmtBMV4dDkEgT22V4g	Little Star Pizza	Pizza	846 Divisadero St\nSan Francisco, CA 94117	-122.437979999999996	37.7775299999999987	https://s3-media4.fl.yelpcdn.com/bphoto/ItjzBdECIqvNSoAS_06Z-w/o.jpg
MvAo0hj9FXOeNL5PwBZ0fQ	Mama's On Washington Square	Breakfast & Brunch	1701 Stockton St\nSan Francisco, CA 94133	-122.409582831578817	37.801547644800749	https://s3-media4.fl.yelpcdn.com/bphoto/PRg2NidGi57Z82PM2BXThA/o.jpg
L5vSeC_sa3TUQW_lticqyA	Chapeau	French	126 Clement St\nSan Francisco, CA 94118	-122.460660000000004	37.7832700000000017	https://s3-media4.fl.yelpcdn.com/bphoto/YZlompWLhv188CJmHKxBzQ/o.jpg
GXu3PD4IPsxIHpo011aydg	Bob's Donuts & Pastry Shop	Bakeries	1621 Polk St\nSan Francisco, CA 94109	-122.421199999999999	37.7918829999999986	https://s3-media2.fl.yelpcdn.com/bphoto/YBvfnl74agPgoVYSTceLGA/o.jpg
1U9_ZNruMLf4EL0pMoxb_w	Arsicault Bakery	Bakeries	397 Arguello Blvd\nSan Francisco, CA 94118	-122.459306999999995	37.7834289999999982	https://s3-media1.fl.yelpcdn.com/bphoto/NVwMbeFwFMpIw7jFRSYQfw/o.jpg
PDhfVvcVXgBinZf5I6s1KQ	The Codmother Fish & Chips	British	496 Beach St\nSan Francisco, CA 94133	-122.417093771758005	37.8072702557488967	https://s3-media3.fl.yelpcdn.com/bphoto/osXjBhqQa3XCw3FvHDk78g/o.jpg
47OC_X6KkiDDQ4jwoCUjFg	Humphry Slocombe Ice Cream	Ice Cream & Frozen Yogurt	2790A Harrison St\nSan Francisco, CA 94110	-122.412199999999999	37.7527899999999974	https://s3-media1.fl.yelpcdn.com/bphoto/N9XikmqttZy5StpPxkJing/o.jpg
xDwEMq8kgT0eQepn90Jkvg	Arizmendi Bakery	Bakeries	1331 9th Ave\nSan Francisco, CA 94122	-122.466499099999993	37.7633882000000014	https://s3-media3.fl.yelpcdn.com/bphoto/YbigZ7FEJmzhuXD7mNunPg/o.jpg
QZQGRJZ4bZCmNoXjs3z1XQ	State Bird Provisions	Tapas/Small Plates	1529 Fillmore St\nSan Francisco, CA 94115	-122.433004999999994	37.7837400000000017	https://s3-media2.fl.yelpcdn.com/bphoto/ckOXfbcgSrAcHOG86zEKuQ/o.jpg
ciEDsTWhajcdL3KuJqBRlw	Espetus Churrascaria	Steakhouses	1686 Market St\nSan Francisco, CA 94102	-122.422131667494	37.7733327504927985	https://s3-media4.fl.yelpcdn.com/bphoto/F9G1pFFitfi9F4rJw_nrpQ/o.jpg
DyXoC_NhJW0Xx5j_OPQRHQ	Schubert's Bakery	Bakeries	521 Clement St\nSan Francisco, CA 94118	-122.464929999999995	37.7826700000000031	https://s3-media2.fl.yelpcdn.com/bphoto/0WNCjnU84Ug5xBdpqi_G4A/o.jpg
4KfQnlcSu4bbTqnvGdGptw	Beretta	Italian	1199 Valencia St\nSan Francisco, CA 94110	-122.420610999999994	37.7538690000000017	https://s3-media1.fl.yelpcdn.com/bphoto/OnjVYibgMoQRyRNuqZGCIA/o.jpg
uEeWn6sPq-giWvfE9uhQ7A	Dottie's True Blue Cafe	American (Traditional)	28 6th St\nSan Francisco, CA 94103	-122.409839630126996	37.7817050429594019	https://s3-media1.fl.yelpcdn.com/bphoto/DP_jjHEs6WbdowWFum7UaQ/o.jpg
ofFgj0sd8iDQunY00hhDVQ	Garden Creamery	Ice Cream & Frozen Yogurt	3566 20th St\nSan Francisco, CA 94110	-122.420434999999998	37.7586900000000014	https://s3-media2.fl.yelpcdn.com/bphoto/VUfUgl5k7kAfmzjeb95_UA/o.jpg
2hGIxgprREdBieylltWaRQ	Limoncello	Sandwiches	1400 Sutter St\nSan Francisco, CA 94109	-122.423591369312007	37.7873184067081027	https://s3-media2.fl.yelpcdn.com/bphoto/GNMz7gMIMgmBZr4WAYUQsw/o.jpg
DGyoVB9PdI9_jw0CNi_OPg	Suppenküche	German	525 Laguna St\nSan Francisco, CA 94102	-122.426391601562003	37.776260375976598	https://s3-media4.fl.yelpcdn.com/bphoto/HAumhGEjTcqstgie00Fjag/o.jpg
akXf1BdFZjQb2fO8Ca7FtA	Philz Coffee	Coffee & Tea	3101 24th St\nSan Francisco, CA 94110	-122.414263665459998	37.7523971028309973	https://s3-media4.fl.yelpcdn.com/bphoto/9WWeOcQAxrxp5lPaLEzVjA/o.jpg
CYttYTEiQuhSfo3SEh79fA	Shizen Vegan Sushi Bar & Izakaya	Sushi Bars	370 14th St\nSan Francisco, CA 94103	-122.421682000000004	37.7683260000000018	https://s3-media4.fl.yelpcdn.com/bphoto/-1BWnyjrsDmTmXH_3wZl_w/o.jpg
reXWH9Wo0ZTOuQsTMNOSxg	Fable	American (New)	558 Castro St\nSan Francisco, CA 94114	-122.435089000000005	37.7599579999999975	https://s3-media4.fl.yelpcdn.com/bphoto/jvUXnqVkkgQNMlKBC-5TOQ/o.jpg
J7_-faNq_Ag9qTOlDn81Pw	Starbelly	Comfort Food	3583 16th St\nSan Francisco, CA 94114	-122.432563400000006	37.7640743999999984	https://s3-media2.fl.yelpcdn.com/bphoto/G1SweY3VbKx_BqAws9RytA/o.jpg
wxzx3duu1c0CcomzEOvfOQ	The Front Porch	Southern	65 29th St\nSte A\nSan Francisco, CA 94110	-122.422034999999994	37.7438000000000002	https://s3-media1.fl.yelpcdn.com/bphoto/0fmMVyqSKOMIqtkQksUTUQ/o.jpg
cL0q9S4bqwpbAN9ZKh-Zeg	Nara Restaurant & Sake Bar	Japanese	518 Haight St\nSan Francisco, CA 94117	-122.430675700307006	37.7721665317965005	https://s3-media1.fl.yelpcdn.com/bphoto/7zzlpJKaC9bndjuo2UIr6g/o.jpg
GwX6aZd2-ojVZtZMMvkbbA	Sushi Urashima	Japanese	149 Noe St\nSan Francisco, CA 94114	-122.43308083094837	37.7668417453940748	https://s3-media1.fl.yelpcdn.com/bphoto/bhKuIDC4l4wRtpHtP2faew/o.jpg
\.


--
-- Data for Name: user_meetups; Type: TABLE DATA; Schema: public; Owner: vagrant
--

COPY public.user_meetups (user_id, meetup_id) FROM stdin;
10	2
8	2
6	4
4	2
11	5
5	5
2	5
11	6
11	8
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: vagrant
--

COPY public.users (id, username, fname, lname, email, password_hash, image_url, about) FROM stdin;
1	balloonicorn	Balloonicorn	Sprinkles	balloonicorn@username.com	pbkdf2:sha256:150000$OlmGahP9$5cb53fe79e9111a8e3b67608d834f3a8cd0bf81c575268e7049dacc124e46653	/v1615591768/users/unicorn_vnpp4e.png	Hi, I am balloonicorn. I am a special balloon unicorn who is super fun and friendly. I love riding on rainbows and meeting new people. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
2	pusheen	Pusheen	Whiskers	pusheen@username.com	pbkdf2:sha256:150000$L3Sd6rc6$d248badf8b8d4e9bd1f0b5f1255ba683b2b950d88211efdc8997d8e736332511	/v1615592165/users/pusheen_rfspkv.jpg	I am a very pretty cat as you can see from my username and my photo. Aren't I a pretty cat? I love fish, yum, and sushi! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
3	hellokitty	Hello	Kitty	hellokitty@username.com	pbkdf2:sha256:150000$cHk1H1tL$d9eb8b4d19c93286034b6e1764ff15b8360169362be973353603fd98e1ccd2e9	/v1615592497/users/hello-kitty_qdzjc1.jpg	I am the very beloved Sanrio character Hello Kitty. While I have no mouth, that is ok! I can still eat nom nom nom nom nom. Here are some more filler words about me lorem ipsum catum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
4	icebear	Ice	Bear	icebear@username.com	pbkdf2:sha256:150000$ftk1ST9J$efdf5553a4931d45155b5d83c8444fc965c1c99c48fc118da36ada81bdcd8ae6	/v1615521074/users/icebear_k1i2pj.jpg	Hi I'm Ice Bear of We Bare Bears. I live in San Francisco! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
5	tonton	Tonton	Friend	tonton@username.com	pbkdf2:sha256:150000$JarIsNdI$06a7598ea35b52c291b428dce3ac5701f256a76a08a097ddaad92ea08172fcc5	/v1615592396/users/tonton_rk25cm.jpg	I am someone from tonton friends, I don't know who I am other than that. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
6	totoro	Totoro	Yourneighbor	totoro@username.com	pbkdf2:sha256:150000$IwHLzR9B$ddedeb50f999ee0d26cba0dc95df2debbe0b7c0406a5b69bb48e0744ff973298	/v1615521074/users/totoro_pgkffp.jpg	I am your neighbor Totoro! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
7	lisasimpson	Lisa	Simpson	lisasimpson@username.com	pbkdf2:sha256:150000$wzwzdz7f$412fd6ea6aad80c02a1383a324cc2a96ee12d82da3fdcd397c42c43f48789f9d	/v1615521075/users/lisa_hqqw3e.png	I'm Lisa Simpson and I am very intelligent and forward thinkig for my age. My mom said I needed to make new friends. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
8	panda	Panda	Bear	panda@username.com	pbkdf2:sha256:150000$4SUvPAfT$f872958c60a4a46dde2716d54ed38dffba089cf6f293a18412a8411510ed1f05	/v1615521074/users/panda_rmamfi.jpg	Hi I'm Panda of We Bare Bears. I love Boba and I also live in San Francisco! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
9	snoopy	Snoopy	Dog	snoopy@username.com	pbkdf2:sha256:150000$ss6vbDrF$ac69cdceac8ff9cbccbac036c254bf1a942536e915eca90b385b8a260f73ea2f	/v1615521074/users/snoopy_qauu99.jpg	I'm the beloved Snoopy of course! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
10	grizz	Grizzly	Bear	grizz@username.com	pbkdf2:sha256:150000$O0IQVRJg$e48c9d4919b63eb0ae81203528dc72b9d7b4fc59f8aef2a7f3f4ac6201828d81	/v1615521074/users/grizz_v96kcx.jpg	I'm Grizz! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
11	peppa	Peppa	Pig	peppa@username.com	pbkdf2:sha256:150000$M1q44ckM$60ccce2ce58e61047a959f7b1ad0aaf9a9601c888d89fb39751a1f92fdfac5e0	/v1615521074/users/peppa_fyctla.jpg	I'm Peppa Pig. I eat a halal diet of course, and apparently I am over 7 feet tall! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
\.


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vagrant
--

SELECT pg_catalog.setval('public.comments_id_seq', 3, true);


--
-- Name: meetups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vagrant
--

SELECT pg_catalog.setval('public.meetups_id_seq', 8, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vagrant
--

SELECT pg_catalog.setval('public.messages_id_seq', 15, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vagrant
--

SELECT pg_catalog.setval('public.notifications_id_seq', 39, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vagrant
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: meetups meetups_pkey; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.meetups
    ADD CONSTRAINT meetups_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: restaurants restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: comments comments_meetup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_meetup_id_fkey FOREIGN KEY (meetup_id) REFERENCES public.meetups(id);


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: favorites favorites_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id);


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: meetups meetups_host_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.meetups
    ADD CONSTRAINT meetups_host_id_fkey FOREIGN KEY (host_id) REFERENCES public.users(id);


--
-- Name: meetups meetups_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.meetups
    ADD CONSTRAINT meetups_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id);


--
-- Name: messages messages_recipient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.users(id);


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_meetups user_meetups_meetup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.user_meetups
    ADD CONSTRAINT user_meetups_meetup_id_fkey FOREIGN KEY (meetup_id) REFERENCES public.meetups(id);


--
-- Name: user_meetups user_meetups_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.user_meetups
    ADD CONSTRAINT user_meetups_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

