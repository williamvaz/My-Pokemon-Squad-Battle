import os
import requests

# Lista com ID + URLs Normal/Shiny
extra_images = [
 {
    "ID": "1216",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0493-bug.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0493-bug.png?w=640&ssl=1"
  },
  {
    "ID": "1217",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0493-dark.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0493-dark.png?w=640&ssl=1"
  },
  {
    "ID": "1218",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0493-dragon.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0493-dragon.png?w=640&ssl=1"
  },
  {
    "ID": "1219",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0493-electric.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0493-electric.png?w=640&ssl=1"
  },
  {
    "ID": "1220",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0493-fairy.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0493-fairy.png?w=640&ssl=1"
  },
  {
    "ID": "1221",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0493-fighting.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0493-fighting.png?w=640&ssl=1"
  },
  {
    "ID": "1222",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0493-fire.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0493-fire.png?w=640&ssl=1"
  },
  {
    "ID": "1223",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0493-flying.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0493-flying.png?w=640&ssl=1"
  },
  {
    "ID": "1224",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0493-ghost.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0493-ghost.png?w=640&ssl=1"
  },
  {
    "ID": "1225",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0493-grass.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0493-grass.png?w=640&ssl=1"
  },
  {
    "ID": "1226",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0493-ground.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0493-ground.png?w=640&ssl=1"
  },
  {
    "ID": "1227",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0493-ice.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0493-ice.png?w=640&ssl=1"
  },
  {
    "ID": "1228",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0493-poison.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0493-poison.png?w=640&ssl=1"
  },
  {
    "ID": "1229",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0493-psychic.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0493-psychic.png?w=640&ssl=1"
  },
  {
    "ID": "1230",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0493-rock.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0493-rock.png?w=640&ssl=1"
  },
  {
    "ID": "1231",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0493-steel.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0493-steel.png?w=640&ssl=1"
  },
  {
    "ID": "1232",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0493-water.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0493-water.png?w=640&ssl=1"
  },
  {
    "ID": "1233",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-b.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-b.png?w=640&ssl=1"
  },
  {
    "ID": "1234",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-c.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-c.png?w=640&ssl=1"
  },
  {
    "ID": "1235",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-d.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-d.png?w=640&ssl=1"
  },
  {
    "ID": "1236",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-e.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-e.png?w=640&ssl=1"
  },
  {
    "ID": "1237",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-f.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-f.png?w=640&ssl=1"
  },
  {
    "ID": "1238",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-g.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-g.png?w=640&ssl=1"
  },
  {
    "ID": "1239",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-h.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-h.png?w=640&ssl=1"
  },
  {
    "ID": "1240",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-i.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-i.png?w=640&ssl=1"
  },
  {
    "ID": "1241",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-j.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-j.png?w=640&ssl=1"
  },
  {
    "ID": "1242",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-k.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-k.png?w=640&ssl=1"
  },
  {
    "ID": "1243",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-l.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-l.png?w=640&ssl=1"
  },
  {
    "ID": "1244",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-m.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-m.png?w=640&ssl=1"
  },
  {
    "ID": "1245",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-n.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-n.png?w=640&ssl=1"
  },
  {
    "ID": "1246",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-o.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-o.png?w=640&ssl=1"
  },
  {
    "ID": "1247",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-p.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-p.png?w=640&ssl=1"
  },
  {
    "ID": "1248",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-q.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-q.png?w=640&ssl=1"
  },
  {
    "ID": "1249",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-r.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-r.png?w=640&ssl=1"
  },
  {
    "ID": "1250",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-s.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-s.png?w=640&ssl=1"
  },
  {
    "ID": "1251",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-t.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-t.png?w=640&ssl=1"
  },
  {
    "ID": "1252",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-u.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-u.png?w=640&ssl=1"
  },
  {
    "ID": "1253",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-v.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-v.png?w=640&ssl=1"
  },
  {
    "ID": "1254",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-w.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-w.png?w=640&ssl=1"
  },
  {
    "ID": "1255",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-x.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-x.png?w=640&ssl=1"
  },
  {
    "ID": "1256",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-y.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-y.png?w=640&ssl=1"
  },
  {
    "ID": "1257",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-z.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-z.png?w=640&ssl=1"
  },
  {
    "ID": "1258",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-ep.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-ep.png?w=640&ssl=1"
  },
  {
    "ID": "1259",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0201-qm.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0201-qm.png?w=640&ssl=1"
  },
  {
    "ID": "1260",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-archipelago.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-archipelago.png?w=640&ssl=1"
  },
  {
    "ID": "1261",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-continental.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-continental.png?w=640&ssl=1"
  },
  {
    "ID": "1262",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-elegant.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-elegant.png?w=640&ssl=1"
  },
  {
    "ID": "1263",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-garden.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-garden.png?w=640&ssl=1"
  },
  {
    "ID": "1264",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-highplains.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-highplains.png?w=640&ssl=1"
  },
  {
    "ID": "1265",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-icy.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-icy.png?w=640&ssl=1"
  },
  {
    "ID": "1266",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-jungle.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-jungle.png?w=640&ssl=1"
  },
  {
    "ID": "1267",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-marine.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-marine.png?w=640&ssl=1"
  },
  {
    "ID": "1268",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-modern.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-modern.png?w=640&ssl=1"
  },
  {
    "ID": "1269",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-monsoon.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-monsoon.png?w=640&ssl=1"
  },
  {
    "ID": "1270",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-ocean.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-ocean.png?w=640&ssl=1"
  },
  {
    "ID": "1271",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-polar.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-polar.png?w=640&ssl=1"
  },
  {
    "ID": "1272",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-river.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-river.png?w=640&ssl=1"
  },
  {
    "ID": "1273",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-sandstorm.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-sandstorm.png?w=640&ssl=1"
  },
  {
    "ID": "1274",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-savanna.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-savanna.png?w=640&ssl=1"
  },
  {
    "ID": "1275",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-sun.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-sun.png?w=640&ssl=1"
  },
  {
    "ID": "1276",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-tundra.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-tundra.png?w=640&ssl=1"
  },
  {
    "ID": "1277",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-pokeball.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-pokeball.png?w=640&ssl=1"
  },
  {
    "ID": "1278",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0666-fancy.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0666-fancy.png?w=640&ssl=1"
  },
  {
    "ID": "1279",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0668-f.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0668-f.png?w=640&ssl=1"
  },
  {
    "ID": "1280",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0669-yellow.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0669-yellow.png?w=640&ssl=1"
  },
  {
    "ID": "1281",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0669-orange.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0669-orange.png?w=640&ssl=1"
  },
  {
    "ID": "1282",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0669-blue.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0669-blue.png?w=640&ssl=1"
  },
  {
    "ID": "1283",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0669-white.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0669-white.png?w=640&ssl=1"
  },
  {
    "ID": "1284",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0670-yellow.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0670-yellow.png?w=640&ssl=1"
  },
  {
    "ID": "1285",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0670-orange.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0670-orange.png?w=640&ssl=1"
  },
  {
    "ID": "1286",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0670-blue.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0670-blue.png?w=640&ssl=1"
  },
  {
    "ID": "1287",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0670-white.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0670-white.png?w=640&ssl=1"
  },
  {
    "ID": "1288",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0671-yellow.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0671-yellow.png?w=640&ssl=1"
  },
  {
    "ID": "1289",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0671-orange.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0671-orange.png?w=640&ssl=1"
  },
  {
    "ID": "1290",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0671-blue.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0671-blue.png?w=640&ssl=1"
  },
  {
    "ID": "1291",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0671-white.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0671-white.png?w=640&ssl=1"
  },
  {
    "ID": "1292",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0676-heart.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0676-heart.png?w=640&ssl=1"
  },
  {
    "ID": "1293",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0676-star.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0676-star.png?w=640&ssl=1"
  },
  {
    "ID": "1294",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0676-diamond.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0676-diamond.png?w=640&ssl=1"
  },
  {
    "ID": "1295",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0676-debutante.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0676-debutante.png?w=640&ssl=1"
  },
  {
    "ID": "1296",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0676-matron.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0676-matron.png?w=640&ssl=1"
  },
  {
    "ID": "1297",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0676-dandy.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0676-dandy.png?w=640&ssl=1"
  },
  {
    "ID": "1298",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0676-lareine.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0676-lareine.png?w=640&ssl=1"
  },
  {
    "ID": "1299",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0676-kabuki.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0676-kabuki.png?w=640&ssl=1"
  },
  {
    "ID": "1300",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0676-pharaoh.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0676-pharaoh.png?w=640&ssl=1"
  },
  {
    "ID": "1301",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0716-active.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0716-active.png?w=640&ssl=1"
  },
  {
    "ID": "1302",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0773-fire.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0773-fire.png?w=640&ssl=1"
  },
  {
    "ID": "1303",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0773-water.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0773-water.png?w=640&ssl=1"
  },
  {
    "ID": "1304",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0773-electric.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0773-electric.png?w=640&ssl=1"
  },
  {
    "ID": "1305",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0773-grass.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0773-grass.png?w=640&ssl=1"
  },
  {
    "ID": "1306",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0773-ice.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0773-ice.png?w=640&ssl=1"
  },
  {
    "ID": "1307",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0773-fighting.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0773-fighting.png?w=640&ssl=1"
  },
  {
    "ID": "1308",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0773-poison.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0773-poison.png?w=640&ssl=1"
  },
  {
    "ID": "1309",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0773-ground.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0773-ground.png?w=640&ssl=1"
  },
  {
    "ID": "1310",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0773-flying.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0773-flying.png?w=640&ssl=1"
  },
  {
    "ID": "1311",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0773-psychic.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0773-psychic.png?w=640&ssl=1"
  },
  {
    "ID": "1312",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0773-bug.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0773-bug.png?w=640&ssl=1"
  },
  {
    "ID": "1313",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0773-rock.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0773-rock.png?w=640&ssl=1"
  },
  {
    "ID": "1314",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0773-ghost.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0773-ghost.png?w=640&ssl=1"
  },
  {
    "ID": "1315",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0773-dragon.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0773-dragon.png?w=640&ssl=1"
  },
  {
    "ID": "1316",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0773-dark.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0773-dark.png?w=640&ssl=1"
  },
  {
    "ID": "1317",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0773-steel.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0773-steel.png?w=640&ssl=1"
  },
  {
    "ID": "1318",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0773-fairy.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0773-fairy.png?w=640&ssl=1"
  },
  {
    "ID": "1319",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-vanillaberry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-berry.png?w=640&ssl=1"
  },
  {
    "ID": "1320",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-vanillalove.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-love.png?w=640&ssl=1"
  },
  {
    "ID": "1321",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-vanillastar.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-star.png?w=640&ssl=1"
  },
  {
    "ID": "1322",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-vanillaclover.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-clover.png?w=640&ssl=1"
  },
  {
    "ID": "1323",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-vanillaflower.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-flower.png?w=640&ssl=1"
  },
  {
    "ID": "1324",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-vanillaribbon.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-ribbon.png?w=640&ssl=1"
  },
  {
    "ID": "1325",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-rubystrawberry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869.png?w=640&ssl=1"
  },
  {
    "ID": "1326",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-rubyberry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-berry.png?w=640&ssl=1"
  },
  {
    "ID": "1327",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-rubylove.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-love.png?w=640&ssl=1"
  },
  {
    "ID": "1328",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-rubystar.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-star.png?w=640&ssl=1"
  },
  {
    "ID": "1329",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-rubyclover.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-clover.png?w=640&ssl=1"
  },
  {
    "ID": "1330",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-rubyflower.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-flower.png?w=640&ssl=1"
  },
  {
    "ID": "1331",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-rubyribbon.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-ribbon.png?w=640&ssl=1"
  },
  {
    "ID": "1332",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-matchastrawberry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869.png?w=640&ssl=1"
  },
  {
    "ID": "1333",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-matchaberry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-berry.png?w=640&ssl=1"
  },
  {
    "ID": "1334",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-matchalove.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-love.png?w=640&ssl=1"
  },
  {
    "ID": "1335",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-matchastar.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-star.png?w=640&ssl=1"
  },
  {
    "ID": "1336",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-matchaclover.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-clover.png?w=640&ssl=1"
  },
  {
    "ID": "1337",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-matchaflower.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-flower.png?w=640&ssl=1"
  },
  {
    "ID": "1338",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-matcharibbon.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-ribbon.png?w=640&ssl=1"
  },
  {
    "ID": "1339",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-mintstrawberry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869.png?w=640&ssl=1"
  },
  {
    "ID": "1340",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-mintberry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-berry.png?w=640&ssl=1"
  },
  {
    "ID": "1341",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-mintlove.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-love.png?w=640&ssl=1"
  },
  {
    "ID": "1342",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-mintstar.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-star.png?w=640&ssl=1"
  },
  {
    "ID": "1343",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-mintclover.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-clover.png?w=640&ssl=1"
  },
  {
    "ID": "1344",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-mintflower.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-flower.png?w=640&ssl=1"
  },
  {
    "ID": "1345",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-mintribbon.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-ribbon.png?w=640&ssl=1"
  },
  {
    "ID": "1346",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-lemonstrawberry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869.png?w=640&ssl=1"
  },
  {
    "ID": "1347",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-lemonberry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-berry.png?w=640&ssl=1"
  },
  {
    "ID": "1348",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-lemonlove.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-love.png?w=640&ssl=1"
  },
  {
    "ID": "1349",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-lemonstar.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-star.png?w=640&ssl=1"
  },
  {
    "ID": "1350",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-lemonclover.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-clover.png?w=640&ssl=1"
  },
  {
    "ID": "1351",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-lemonflower.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-flower.png?w=640&ssl=1"
  },
  {
    "ID": "1352",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-lemonribbon.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-ribbon.png?w=640&ssl=1"
  },
  {
    "ID": "1353",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-saltedstrawberry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869.png?w=640&ssl=1"
  },
  {
    "ID": "1354",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-saltedberry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-berry.png?w=640&ssl=1"
  },
  {
    "ID": "1355",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-saltedlove.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-love.png?w=640&ssl=1"
  },
  {
    "ID": "1356",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-saltedstar.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-star.png?w=640&ssl=1"
  },
  {
    "ID": "1357",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-saltedclover.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-clover.png?w=640&ssl=1"
  },
  {
    "ID": "1358",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-saltedflower.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-flower.png?w=640&ssl=1"
  },
  {
    "ID": "1359",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-saltedribbon.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-ribbon.png?w=640&ssl=1"
  },
  {
    "ID": "1360",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-swirlstrawberry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869.png?w=640&ssl=1"
  },
  {
    "ID": "1361",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-swirlberry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-berry.png?w=640&ssl=1"
  },
  {
    "ID": "1362",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-swirllove.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-love.png?w=640&ssl=1"
  },
  {
    "ID": "1363",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-swirlstar.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-star.png?w=640&ssl=1"
  },
  {
    "ID": "1364",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-swirlclover.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-clover.png?w=640&ssl=1"
  },
  {
    "ID": "1365",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-swirlflower.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-flower.png?w=640&ssl=1"
  },
  {
    "ID": "1366",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-swirlribbon.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-ribbon.png?w=640&ssl=1"
  },
  {
    "ID": "1367",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-caramelstrawberry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869.png?w=640&ssl=1"
  },
  {
    "ID": "1368",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-caramelberry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-berry.png?w=640&ssl=1"
  },
  {
    "ID": "1369",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-caramellove.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-love.png?w=640&ssl=1"
  },
  {
    "ID": "1370",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-caramelstar.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-star.png?w=640&ssl=1"
  },
  {
    "ID": "1371",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-caramelclover.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-clover.png?w=640&ssl=1"
  },
  {
    "ID": "1372",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-caramelflower.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-flower.png?w=640&ssl=1"
  },
  {
    "ID": "1373",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-caramelribbon.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-ribbon.png?w=640&ssl=1"
  },
  {
    "ID": "1374",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-rainbowstrawberry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869.png?w=640&ssl=1"
  },
  {
    "ID": "1375",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-rainbowberry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-berry.png?w=640&ssl=1"
  },
  {
    "ID": "1376",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-rainbowlove.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-love.png?w=640&ssl=1"
  },
  {
    "ID": "1377",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-rainbowstar.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-star.png?w=640&ssl=1"
  },
  {
    "ID": "1378",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-rainbowclover.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-clover.png?w=640&ssl=1"
  },
  {
    "ID": "1379",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-rainbowflower.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-flower.png?w=640&ssl=1"
  },
  {
    "ID": "1380",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0869-rainbowribbon.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0869-ribbon.png?w=640&ssl=1"
  }
]

# Criar pastas
os.makedirs("imgs/normal_extras", exist_ok=True)
os.makedirs("imgs/shiny_extras", exist_ok=True)

def download_image(url, path):
    try:
        r = requests.get(url, timeout=15)
        if r.status_code == 200:
            with open(path, "wb") as f:
                f.write(r.content)
            print(f"✅ Baixado: {path}")
        else:
            print(f"❌ Erro {r.status_code}: {url}")
    except Exception as e:
        print(f"⚠️ Falha: {url} -> {e}")

# Loop para baixar
for item in extra_images:
    poke_id = item["ID"].zfill(4)  # sempre 4 dígitos
    
    # Normal
    if item["Normal"]:
        filename = f"{poke_id}.png"
        path = os.path.join("imgs/normal_extras", filename)
        download_image(item["Normal"], path)
    
    # Shiny
    if item["Shine"]:
        filename = f"{poke_id}-shiny.png"
        path = os.path.join("imgs/shiny_extras", filename)
        download_image(item["Shine"], path)

print("🏁 Concluído! Confira imgs/normal_extras e imgs/shiny_extras.")
