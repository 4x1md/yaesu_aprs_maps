# Yaesu VX-8DR/DE APRS Beacons Map

Yaesu VX-8DR/DE memory parser which puts incoming APRS beacon messages on Google map.

## Overview

![APRS beacons map](https://raw.githubusercontent.com/4x1md/yaesu_aprs_maps/master/images/aprs_map_0.png)

I live in Israel where [tropospheric propagation](https://en.wikipedia.org/wiki/Tropospheric_propagation) over the Mediterranean sea occurs very often. When it occurs, VHF QSOs with Greece and even with more distant countries become possible. I usually use [William Hepburn's Worldwide Tropospheric Ducting Forecast](http://www.dxinfocentre.com/tropo_eur.html) for propagation predictions and for actual propagation monitoring I use the APRS capability of my Yaesu VX-8DE transceiver. Often, when the propagation opens I receive APRS beacons from all over Greece and even from Bulgaria.

![APRS beacon from Bulgaria](https://raw.githubusercontent.com/4x1md/yaesu_aprs_maps/master/images/aprs_map_1.png)

I thought that it would be nice not only to idenitfy the source of the received beacons by their call sign but also to put them on a map. At first, I attempted to create a VX-8 memory parser using Python. I contacted [Robert Terzi W2RCT](https://github.com/rct) who guided me through [the source code of Chirp](https://github.com/tylert/chirp.hg)
and helped to find the relevant information about the memeory of the HT. After having understood how to extract the received APRS beacons from HT's memory I wrote the JavaScript version of the parser and created a WEB project which parses the memory and shows beacons list and their map.

![APRS beacon from Bulgaria](https://raw.githubusercontent.com/4x1md/yaesu_aprs_maps/master/images/aprs_map_2.png)

## Working version

Working version of the project is located here:

[https://4x1md.github.io/yaesu_aprs_maps/](https://4x1md.github.io/yaesu_aprs_maps/)

All you need is a memory image file of your VX-8R/DR. Chirp's ```*.img``` files will work fine.

## Plans for future develompent

1. [ ] An option for manually entering current position.
2. [ ] Support for additional Yaesu HT models.

## Links
1. [Yaesu VX-8DR/DE APRS Beacons Map](https://4x1md.github.io/yaesu_aprs_maps/)
2. [Chirp repository](https://github.com/tylert/chirp.hg): [Yaesu VX-8 driver](https://github.com/tylert/chirp.hg/blob/master/chirp/drivers/vx8.py) - memory maps for bot VX-8R and VX-8DR.
3. [Chirp repository](https://github.com/tylert/chirp.hg): [Yaesu VX-8R Image](https://github.com/tylert/chirp.hg/blob/master/tests/images/Yaesu_VX-8_R.img) used for testing the VX-8R parser.
4. [William Hepburn's Worldwide Tropospheric Ducting Forecast](http://www.dxinfocentre.com/tropo_eur.html)

## Questions? Suggestions? Bug reports?

You are more than welcome to contact me with any questions, suggestions or propositions regarding this project. You can:

1. Visit [my QRZ.COM page](https://www.qrz.com/db/4X1MD)
2. Visit [my Facebook profile](https://www.facebook.com/Dima.Meln)
3. Write me an email to iosaaris =at= gmail dot com

## How to Support or Say Thanks

If you like this project, or found here some useful information and want to say thanks, or encourage me to do more, you can buy me a coffee!

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Q5Q4ITR7J)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/4x1md)

You can aslo make a donation with PayPal:

[!["Donate with PayPal"](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/donate/?hosted_button_id=NZZWZFH5ZBCCU)

---

**73 de 4X1MD ex 4X5DM**

![73's](https://raw.githubusercontent.com/4x1md/yaesu_aprs_maps/master/images/vx8_73.jpg)
