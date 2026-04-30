-- Create tracks table
create table if not exists tracks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text not null,
  bpm         integer,
  key         text,
  key_mode    text,
  thumbnail   text,
  audio_src   text not null,
  duration    integer,
  tags        text[],
  created_at  timestamptz not null default now()
);

-- Seed existing tracks
insert into tracks (id, title, category, bpm, key, key_mode, thumbnail, audio_src, duration, tags, created_at) values
('36929fc0-bf42-45b3-970a-f220e684e3bd','Piso Baixo','brazil phonk',130,'F','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Piso%20Baixo.mp3',107,null,'2026-04-28T00:33:12.726Z'),
('378a4be2-e39e-4acf-ac2e-9a58fd24c2cb','Samba de ferro','brazil phonk',130,'F','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Samba%20de%20Ferro%20v2.mp3',121,array['World Cup'],'2026-04-28T00:27:31.020Z'),
('bac9b0b7-8325-4a1f-902c-032370d619a7','Samba de ferro v2','brazil phonk',126,'F','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Samba%20de%20Ferro.mp3',103,array['World Cup'],'2026-04-28T00:26:27.038Z'),
('422a1825-6f20-43cb-89ba-6a64d1395d2f','Maracatu Drift','brazil phonk',127,'F','major','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Maracatu%20Drift.mp3',128,null,'2026-04-28T00:14:26.283Z'),
('ad0f7b8f-a008-4c59-acb5-b176450a179f','Canarinho run v2','pop',128,'C#','major','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Canarinho%20Run%20v2.mp3',133,array['world cup'],'2026-04-28T00:10:32.291Z'),
('95693e98-6ab4-4b31-81a1-b53fbd0c98e9','Canarinho run','brazil phonk',127,'F#','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Canarinho%20Run.mp3',132,array['world cup'],'2026-04-28T00:08:40.084Z'),
('4d57a9e7-32ce-4637-83ee-9e808cc049e9','Gol de Ouro v2','brazil phonk',129,'F','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Gol%20de%20Ouro%20v2.mp3',82,array['world cup'],'2026-04-28T00:02:32.237Z'),
('3081796e-64ea-4d3d-b0d2-82e331d97cfb','Gol de Ouro','brazil phonk',130,'E','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Gol%20de%20Ouro.mp3',101,array['world cup'],'2026-04-28T00:02:05.152Z'),
('e1e27340-b792-46ac-9d4d-36261b1db80b','Maracatu','brazil phonk',127,'F','major','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Maracatu%20Drift.mp3',128,null,'2026-04-27T23:46:29.666Z'),
('71246a44-510e-4a20-b939-60b20dfb4372','Batuque na corda','pop',100,'E','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Batuque%20na%20Corda.mp3',149,null,'2026-04-27T23:44:49.794Z'),
('3dcda86d-147a-4e62-967f-e659763a61c1','Chama na pista','brazil phonk',132,'E','major','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Chama%20na%20Pista.mp3',148,null,'2026-04-27T23:39:27.773Z'),
('0e675855-f70d-407b-aa1c-90b0c7e3a92a','Motor na curva v2','reggaeton',100,'E','major','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Motor%20Na%20Curva%20v2.mp3',118,null,'2026-04-27T23:37:40.255Z'),
('cf549ac5-e36f-41be-903d-177aecbe508d','Motor na curva v1','brazil phonk',130,'A#','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Motor%20Na%20Curva.mp3',98,null,'2026-04-27T23:36:00.900Z'),
('1a60e960-16ee-4665-8e6b-fdead940357b','Trem do gelo','brazil phonk',100,'E','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Trem%20Do%20Gelo.mp3',113,null,'2026-04-27T23:34:47.802Z'),
('b6fd1406-7877-40c9-8cbe-039e07dad6b2','Chama na pista v2','brazil phonk',100,'E','major','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Chama%20na%20Pista%20v2.mp3',67,null,'2026-04-27T23:07:45.152Z'),
('6840a736-7593-4d2e-aa82-3561470ad1ec','Golazo in my veins','reggaeton',94,'F','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Golazo%20In%20My%20Veins.mp3',76,null,'2026-04-27T22:41:19.103Z'),
('bcb0c7ef-0add-4dbf-93dd-171415f0faea','Golaza v2','reggaeton',95,'F','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Golazo%20v2.mp3',144,null,'2026-04-27T22:40:26.009Z'),
('745581c3-1289-4589-8097-e5c4d53edbf2','Boi da rua horns','pop',125,'F','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Boi%20da%20Rua%20Horns.mp3',123,null,'2026-04-27T22:38:47.175Z'),
('91560f70-2d26-47bc-ad2f-f08ae1979912','Batuque arabic','brazil phonk',125,'E','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Batuque%20Mirage-arabic.mp3',163,null,'2026-04-27T22:36:41.639Z'),
('ee306f20-c559-4899-9431-c8b65e150650','Batuque mirage','brazil phonk',128,'E','major','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Batuque%20Mirage.mp3',140,null,'2026-04-27T22:35:22.111Z'),
('09430aed-3dc2-4e62-9ca4-d4c686823dfa','Gol de rua guitar','brazil phonk',130,'E','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Gol%20de%20Rua-guitar.mp3',146,null,'2026-04-27T22:34:01.800Z'),
('ccbfaa0c-83d0-4ba2-a1aa-3ac4335aeb0f','Joga Sax','brazil phonk',130,'F#','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Joga%20Joga%20v2.mp3',127,null,'2026-04-27T22:33:08.566Z'),
('cea2603d-dc90-41ce-bfbe-a7b77b8544a4','Gol de rua','brazil phonk',130,'F','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Gol%20de%20Rua.mp3',113,null,'2026-04-27T22:32:01.452Z'),
('a77120ba-ffd5-4e2b-ae3e-39529bd911ea','Joga joga','brazil phonk',132,'F#','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Joga%20Joga.mp3',92,null,'2026-04-27T22:30:55.692Z'),
('f9103eda-7966-4933-b3a6-427eb9c80f7d','Copa na rua','brazil phonk',130,'F','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Midnight%20Run%20in%20Rio.mp3',122,null,'2026-04-27T22:29:56.457Z'),
('272991cf-4694-4f0d-9404-02130639fdb7','Maraca boom','brazil phonk',97,'E','minor','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Maraca%20Boom.mp3',33,null,'2026-04-27T22:28:51.628Z'),
('16492d3a-44c4-4f16-b9b9-997858db1de6','Midnight in Rio','brazil phonk',130,'F#','major','/thumbnails/default.jpg','https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Midnight%20Run%20in%20Rio.mp3',122,null,'2026-04-27T16:11:33.214Z'),
('6dc00c02-1237-45c4-8dd3-871cf3c38de5','World cup beat 1','pop',94,'F','minor',null,'https://wonemdojxifkhvfvqxfh.supabase.co/storage/v1/object/public/audio/Golazo%20In%20My%20Veins.mp3',76,null,'2026-04-27T15:49:54.297Z')
on conflict (id) do nothing;
