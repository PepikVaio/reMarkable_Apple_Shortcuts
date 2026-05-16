[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/PepikVaio/reMarkable_Apple_Shortcuts/tree/main/apple_Example)
[![cs](https://img.shields.io/badge/lang-cs-springgreen.svg)](https://github.com/PepikVaio/reMarkable_Apple_Shortcuts/blob/main/apple_Example/.language_cs/README_cs.md)
[![supported: iPhone](https://img.shields.io/badge/iPhone-supported-blueviolet)](https://www.apple.com/cz/iphone/)


# Example!
> Example shortcut for demonstration purposes.
> <br>
> This shortcut serves only as a template for creating your own shortcut.

### Download
[![download](https://img.shields.io/badge/download-latest_release-slategray)]()

<br>

## Tools
> [!NOTE]
> If you want to work with menus in Apple Shortcuts and add a custom image, you first need to convert it to Base64 format.
> - Apple Shortcuts cannot directly handle image files in some parts (e.g. dynamic menus, passing data between actions, or API calls). Therefore, the image must be converted into a text format that can be easily transferred and stored.

### As a terminal script
[![download](https://img.shields.io/badge/download-img2b64-red)](https://github.com/PepikVaio/reMarkable_Apple_Shortcuts/blob/main/apple_Example/.tools/img2b64)

- Download the file
- Open terminal
- Navigate to the folder where the file was downloaded using the ```cd``` command
- Run the commands

```
sudo mkdir -p /usr/local/bin
sudo mv img2b64.sh /usr/local/bin/img2b64
sudo chmod +x /usr/local/bin/img2b64
```

- Then

```
img2b64 path_to_file.png
```

![image_01](https://github.com/PepikVaio/reMarkable_Apple_Shortcuts/blob/main/apple_Example/.images/tool_img2b64.png)

### As a macOS Quick Action menu
[![download](https://img.shields.io/badge/download-Copy_image_as_Base64-red)](https://github.com/PepikVaio/reMarkable_Apple_Shortcuts/blob/main/apple_Example/.tools/Copy%20image%20as%20Base64.zip)

- Download the file
- Open it - it will install automatically

> [!WARNING]
> After installation, the file is moved to: ```~/Library/Services/```

```
Right-click on the image  
Select "Quick Actions"  
Click "Copy image as Base64"
```

![image_02](https://github.com/PepikVaio/reMarkable_Apple_Shortcuts/blob/main/apple_Example/.images/tool_Copy_image_as_Base64.png)
