import json
import os
import requests

# Carregar pokemons.json
with open("pokemons.json", "r", encoding="utf-8") as f:
    pokemons = json.load(f)

base_url = "https://i0.wp.com/pokemythology.net/conteudo/imgs/home/"
shiny_url = base_url + "shiny/"

# Criar pastas
os.makedirs("imgs/normal", exist_ok=True)
os.makedirs("imgs/shiny", exist_ok=True)

# Apagar arquivos antigos (se quiser sempre começar do zero)
for folder in ["imgs/normal", "imgs/shiny"]:
    for file in os.listdir(folder):
        os.remove(os.path.join(folder, file))

# Abrir log de erros
error_log = open("errors.log", "w", encoding="utf-8")

def get_form(name):
    if "Mega Charizard X" in name:
        return "Mega X"
    elif "Mega Charizard Y" in name:
        return "Mega Y"
    elif "Mega" in name:
        return "Mega"
    elif "Alolan" in name:
        return "Alolan"
    elif "Galarian" in name:
        return "Galarian"
    elif "Hisuian" in name:
        return "Hisuian"
    elif "Paldean" in name:
        return "Paldean"
    elif "Partner" in name:
        return "Partner"
    elif "Combat Breed" in name:
        return "Combat"
    elif "Blaze Breed" in name:
        return "Blaze"
    elif "Aqua Breed" in name:
        return "Aqua"
    else:
        return ""

def normalize_name(name, dex):
    n = str(dex).zfill(4)
    if "Mega Charizard X" in name:
        return f"{n}-megax"
    elif "Mega Charizard Y" in name:
        return f"{n}-megay"
    elif "Mega" in name:
        return f"{n}-mega"
    elif "Alolan" in name:
        return f"{n}-alolan"
    elif "Galarian" in name:
        return f"{n}-galarian"
    elif "Hisuian" in name:
        return f"{n}-hisuian"
    elif "Paldean" in name:
        return f"{n}-paldean"
    elif "Partner" in name:
        return f"{n}-partner"
    elif "Combat Breed" in name:
        return f"{n}-combat"
    elif "Blaze Breed" in name:
        return f"{n}-blaze"
    elif "Aqua Breed" in name:
        return f"{n}-aqua"
    else:
        return n

def download_image(url, path):
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            with open(path, "wb") as f:
                f.write(r.content)
            print(f"✅ Baixado: {path}")
            return True
        else:
            msg = f"❌ Erro {r.status_code}: {url}\n"
            print(msg.strip())
            error_log.write(msg)
            return False
    except Exception as e:
        msg = f"⚠️ Falha: {url} -> {e}\n"
        print(msg.strip())
        error_log.write(msg)
        return False

result = []

for p in pokemons:
    dex = p.get("Pokedex", "0")
    name = p.get("Name", "")
    form = get_form(name)
    dex_formatted = normalize_name(name, dex)

    for shiny_flag, folder in [(False, "normal"), (True, "shiny")]:
        url = (shiny_url if shiny_flag else base_url) + f"{dex_formatted}.png?w=640&ssl=1"
        filename = f"{str(p['ID']).zfill(4)}{'-shiny' if shiny_flag else ''}.png"
        filepath = os.path.join("imgs", folder, filename)

        if download_image(url, filepath):
            result.append({
                "ID": str(p["ID"]).zfill(4),
                "Pokedex": str(dex).zfill(4),
                "Name": name.replace("Alolan ", "").replace("Galarian ", "").replace("Hisuian ", "").replace("Paldean ", ""),
                "Form": form,
                "Shiny": "Yes" if shiny_flag else "No",
                "Type 1": p.get("Type 1", ""),
                "Type 2": p.get("Type 2", "")
            })

# Fechar log
error_log.close()

# Salvar JSON final
with open("pokemons_images.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=4)

print("🏁 Concluído! Arquivo 'pokemons_images.json' gerado. Confira 'errors.log' para erros.")
