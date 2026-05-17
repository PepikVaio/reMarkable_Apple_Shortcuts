[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/PepikVaio/reMarkable_Apple_Shortcuts/tree/main/apple_Example)
[![cs](https://img.shields.io/badge/lang-cs-springgreen.svg)](https://github.com/PepikVaio/reMarkable_Apple_Shortcuts/blob/main/apple_Example/.language_cs/README_cs.md)


# Example!
> Ukázková zkratka pro demonstrační účely.
> <br>
> Zkratka slouží pouze jako šablona, pro vytvoření vlastní zkratky.

### Ke stažení
[![download](https://img.shields.io/badge/download-latest_release-slategray)](https://www.icloud.com/shortcuts/3736a78ba06945018420e0cd84c7dd2b)
<br>
[![download](https://img.shields.io/badge/download-latest_options-yellow)](https://www.icloud.com/shortcuts/97b103333ddc4bc0b2bb4a32478562ef)

<br>

## Help
> [!NOTE]
> - `latest_release` - Hlavní zkratka pro zamyšlenou funkci.
> - `latest_options` - Volitelná zkratka pro další nastavení.

<br>

## Nástroje
> [!NOTE]
> Pokud chcete v Apple Zkratkách pracovat s menu a přidat vlastní obrázek, je nutné jej nejprve převést do formátu Base64.
> - Apple Zkratky totiž v některých částech (např. dynamická menu, předávání dat mezi akcemi nebo API volání) neumí pracovat přímo se souborem obrázku jako takovým. Obrázek je proto potřeba převést do textové podoby, kterou lze snadno přenášet a ukládat.

### Jako script do terminálu
[![download](https://img.shields.io/badge/download-img2b64-red)](https://github.com/PepikVaio/reMarkable_Apple_Shortcuts/blob/main/apple_Example/.tools/img2b64)

- Stáhnout soubor
- Otevřít terminál
- Přesunout se do složky kde je stažený soubor pomocí příkazu `cd`
- Spustit příkazy

```
sudo mkdir -p /usr/local/bin
sudo mv img2b64.sh /usr/local/bin/img2b64
sudo chmod +x /usr/local/bin/img2b64
```

- Potom

```
img2b64 cesta_k_souboru.png
```

![image_01](https://github.com/PepikVaio/reMarkable_Apple_Shortcuts/blob/main/apple_Example/.images/tool_img2b64.png)

### Jako rychlé menu pro Mac OS
[![download](https://img.shields.io/badge/download-Copy_image_as_Base64-red)](https://github.com/PepikVaio/reMarkable_Apple_Shortcuts/blob/main/apple_Example/.tools/Copy%20image%20as%20Base64.zip)

- Stáhnout soubor
- Otevřít soubor - sám se nainstaluje

> [!NOTE]
> Po instalaci se soubor přesune do: `~/Library/Services/`

```
Klikni pravým tlačítkem na obrázek  
Vyber možnost „Rychlé akce“  
Klikni na „Copy image as Base64“
```

![image_02](https://github.com/PepikVaio/reMarkable_Apple_Shortcuts/blob/main/apple_Example/.images/tool_Copy_image_as_Base64.png)


