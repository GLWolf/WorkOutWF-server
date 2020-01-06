BEGIN;

TRUNCATE
  users,
  day_time_user
  RESTART IDENTITY CASCADE;

-- INSERT INTO blogful_users (user_name, full_name, nickname, password)
-- VALUES
--   ('dunder', 'Dunder Mifflin', null, 'password'),
--   ('b.deboop', 'Bodeep Deboop', 'Bo', 'bo-password'),
--   ('c.bloggs', 'Charlie Bloggs', 'Charlie', 'charlie-password'),
--   ('s.smith', 'Sam Smith', 'Sam', 'sam-password'),
--   ('lexlor', 'Alex Taylor', 'Lex', 'lex-password'),
--   ('wippy', 'Ping Won In', 'Ping', 'ping-password');

-- bcrypt.hash('test-string', 1).then(hash => console.log({ hash }))

-- const pws = ['bo-password','charlie-password','sam-password','lex-password','ping-password']

INSERT INTO users (user_name, full_name, nickname, email, password)
VALUES
  ('dunder', 'Dunder Mifflin', null, '123@test.com', '$2a$06$Rf8tk2zpgu838fG.i.L8.e1jAZaotbcMD1dMdAYD8lp3.lDGbMRcm'),
  ('b.deboop', 'Bodeep Deboop', 'Bo', '2312@test.com', '$2a$05$2fapJ/wLx5Zq5xGcDo6XvOtcWIT2lCRpvObQ0rABm.aja8CjwAHbu'),
  ('c.bloggs', 'Charlie Bloggs', 'Charlie', 'fun@fun.com', '$2a$05$JqDRpIDOKM3bEQawXCVttetuRiLSnw98RWl/Obxc48UMIm.MWeCfi'),
  ('s.smith', 'Sam Smith', 'Sam', 'okay@okay.com', '$2a$05$Epoz3dQc7j.dmuTsBsGsq./sjXYK.CiRFPSJ/rh5vySVuaZawykRy'),
  ('lexlor', 'Alex Taylor', 'Lex', 'youre@e.com', '$2a$05$J.cTxgvbaWJH4qBGavWXJOZzh3e3gI8/otCVGlbC3.5aftQBhJ0pC'),
  ('wippy', 'Ping Won In', 'Ping', 'imadestuff@stuff.com', '$2a$05$u4.0ZEu6B4PIQNaFwyeKEOcjah2SdOftxBbYT.YgYBmG5AoyPIaVq');

INSERT INTO day_time_user (user_id, day_id, time_id)
VALUES
(1, 1, 1);

COMMIT;
