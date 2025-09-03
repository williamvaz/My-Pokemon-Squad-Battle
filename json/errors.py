import os
import requests

# Lista com ID + URLs Normal/Shiny
extra_images = [
    {
    "ID": "431",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0351-sunny.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0351-sunny.png?w=640&ssl=1"
  },
  {
    "ID": "432",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0351-rainy.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0351-rainy.png?w=640&ssl=1"
  },
  {
    "ID": "433",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0351-snowy.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0351-snowy.png?w=640&ssl=1"
  },
  {
    "ID": "472",
    "Normal": "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/382_f2.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/10077.png"
  },
  {
    "ID": "474",
    "Normal": "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/383_f2.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/10078.png"
  },
  {
    "ID": "479",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0386-attack.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0386-attack.png?w=640&ssl=1"
  },
  {
    "ID": "480",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0386-defense.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0386-defense.png?w=640&ssl=1"
  },
  {
    "ID": "481",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0386-speed.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0386-speed.png?w=640&ssl=1"
  },
  {
    "ID": "508",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0412-sandy.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0412-sandy.png?w=640&ssl=1"
  },
  {
    "ID": "509",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0412-trash.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0412-trash.png?w=640&ssl=1"
  },
  {
    "ID": "511",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0413-sandy.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0413-sandy.png?w=640&ssl=1"
  },
  {
    "ID": "512",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0413-trash.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0413-trash.png?w=640&ssl=1"
  },
  {
    "ID": "584",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0479-heat.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0479-heat.png?w=640&ssl=1"
  },
  {
    "ID": "585",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0479-wash.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0479-wash.png?w=640&ssl=1"
  },
  {
    "ID": "586",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0479-frost.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0479-frost.png?w=640&ssl=1"
  },
  {
    "ID": "587",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0479-fan.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0479-fan.png?w=640&ssl=1"
  },
  {
    "ID": "588",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0479-mow.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0479-mow.png?w=640&ssl=1"
  },
  {
    "ID": "593",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0483-origin.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0483-origin.png?w=640&ssl=1"
  },
  {
    "ID": "595",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0484-origin.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0484-origin.png?w=640&ssl=1"
  },
  {
    "ID": "599",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0487-origin.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0487-origin.png?w=640&ssl=1"
  },
  {
    "ID": "605",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0492-sky.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0492-sky.png?w=640&ssl=1"
  },
  {
    "ID": "667",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0550-blue.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0550-blue.png?w=640&ssl=1"
  },
  {
    "ID": "668",
    "Normal": "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/550_f3.png",
    "Shine": "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/550_f3.png"
  },
  {
    "ID": "675",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0555-zen.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0555-zen.png?w=640&ssl=1"
  },
  {
    "ID": "677",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0555-zengalarian.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0555-zengalarian.png?w=640&ssl=1"
  },
  {
    "ID": "769",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0641-therian.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0641-therian.png?w=640&ssl=1"
  },
  {
    "ID": "771",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0642-therian.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0642-therian.png?w=640&ssl=1"
  },
  {
    "ID": "775",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0645-therian.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0645-therian.png?w=640&ssl=1"
  },
  {
    "ID": "777",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0646-white.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0646-white.png?w=640&ssl=1"
  },
  {
    "ID": "778",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0646-black.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0646-black.png?w=640&ssl=1"
  },
  {
    "ID": "782",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0648-pirouette.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0648-pirouette.png?w=640&ssl=1"
  },
  {
    "ID": "793",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0658-ash.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0658-ash.png?w=640&ssl=1"
  },
  {
    "ID": "814",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0678-f.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0678-f.png?w=640&ssl=1"
  },
  {
    "ID": "818",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0681-blade.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0681-blade.png?w=640&ssl=1"
  },
  {
    "ID": "865",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0718-10.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0718-10.png?w=640&ssl=1"
  },
  {
    "ID": "866",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0718-complete.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0718-complete.png?w=640&ssl=1"
  },
  {
    "ID": "870",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0720-unbound.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0720-unbound.png?w=640&ssl=1"
  },
  {
    "ID": "893",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0741-pompom.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0741-pompom.png?w=640&ssl=1"
  },
  {
    "ID": "894",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0741-pau.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0741-pau.png?w=640&ssl=1"
  },
  {
    "ID": "895",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0741-sensu.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0741-sensu.png?w=640&ssl=1"
  },
  {
    "ID": "901",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0745-midnight.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0745-midnight.png?w=640&ssl=1"
  },
  {
    "ID": "902",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0745-dusk.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0745-dusk.png?w=640&ssl=1"
  },
  {
    "ID": "904",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0746-school.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0746-school.png?w=640&ssl=1"
  },
  {
    "ID": "933",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0774-red.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0774-red.png?w=640&ssl=1"
  },
  {
    "ID": "960",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0800-dusk.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0800-dusk.png?w=640&ssl=1"
  },
  {
    "ID": "961",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0800-dawn.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0800-dawn.png?w=640&ssl=1"
  },
  {
    "ID": "962",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0800-ultra.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0800-ultra.png?w=640&ssl=1"
  },
  {
    "ID": "1012",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0849-lowkey.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0849-lowkey.png?w=640&ssl=1"
  },
  {
    "ID": "1039",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0875-noice.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0875-noice.png?w=640&ssl=1"
  },
  {
    "ID": "1043",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0877-hangry.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0877-hangry.png?w=640&ssl=1"
  },
  {
    "ID": "1055",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0888-sword.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0888-sword.png?w=640&ssl=1"
  },
  {
    "ID": "1057",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0889-shield.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0889-shield.png?w=640&ssl=1"
  },
  {
    "ID": "1059",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/10190.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/10190.png"
  },
  {
    "ID": "1062",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0892-rapid.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0892-rapid.png?w=640&ssl=1"
  },
  {
    "ID": "1069",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0898-ice.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0898-ice.png?w=640&ssl=1"
  },
  {
    "ID": "1070",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0898-shadow.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0898-shadow.png?w=640&ssl=1"
  },
  {
    "ID": "1074",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/10272.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/10272.png"
  },
  {
    "ID": "1076",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0902-f.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0902-f.png?w=640&ssl=1"
  },
  {
    "ID": "1080",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0905-therian.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0905-therian.png?w=640&ssl=1"
  },
  {
    "ID": "1092",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0916-f.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0916-f.png?w=640&ssl=1"
  },
  {
    "ID": "1102",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0925-three.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0925-three.png?w=640&ssl=1"
  },
  {
    "ID": "1109",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0931-blue.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0931-blue.png?w=640&ssl=1"
  },
  {
    "ID": "1110",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0931-yellow.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0931-yellow.png?w=640&ssl=1"
  },
  {
    "ID": "1111",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0931-white.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0931-white.png?w=640&ssl=1"
  },
  {
    "ID": "1145",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0964-hero.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0964-hero.png?w=640&ssl=1"
  },
  {
    "ID": "1160",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0978-droopy.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0978-droopy.png?w=640&ssl=1"
  },
  {
    "ID": "1161",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0978-stretchy.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0978-stretchy.png?w=640&ssl=1"
  },
  {
    "ID": "1166",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0982-three.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0982-three.png?w=640&ssl=1"
  },
  {
    "ID": "1184",
    "Normal": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/0999-roaming.png?w=640&ssl=1",
    "Shine": "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/shiny/0999-roaming.png?w=640&ssl=1"
  },
  {
    "ID": "1196",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1011.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/1011.png"
  },
  {
    "ID": "1197",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1012.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/1012.png"
  },
  {
    "ID": "1198",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1013.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/1013.png"
  },
  {
    "ID": "1199",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1014.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/1014.png"
  },
  {
    "ID": "1200",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1015.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/1015.png"
  },
  {
    "ID": "1201",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1016.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/1016.png"
  },
  {
    "ID": "1202",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1017.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/1017.png"
  },
  {
    "ID": "1203",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1017.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1017.png"
  },
  {
    "ID": "1204",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1017.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1017.png"
  },
  {
    "ID": "1205",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1017.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1017.png"
  },
  {
    "ID": "1206",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1018.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/1018.png"
  },
  {
    "ID": "1207",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1019.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/1019.png"
  },
  {
    "ID": "1208",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1020.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/1020.png"
  },
  {
    "ID": "1209",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1021.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/1021.png"
  },
  {
    "ID": "1210",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1022.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/1022.png"
  },
  {
    "ID": "1211",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1023.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/1023.png"
  },
  {
    "ID": "1212",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1024.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/1024.png"
  },
  {
    "ID": "1213",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/10276.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/10276.png"
  },
  {
    "ID": "1214",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/10277.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/10277.png"
  },
  {
    "ID": "1215",
    "Normal": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/1025.png",
    "Shine": "https://www.pokeevo.net/dex/files/dmNucnhiYw==/sprites/pokemon/other/home/shiny/1025.png"
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
