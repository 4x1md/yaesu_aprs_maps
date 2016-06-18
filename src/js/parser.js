/**
 * parser.js
 *
 * Yaesu HT memory dump parser class.
 */

/**
 * Parser constructor.
 */
function Parser() {
    this.coordRegex = /(\d{2})(\d{2}[.]\d{2})([NS]).(\d{3})(\d{2}[.]\d{2})([EW])/;
    this.messageRegex = /\x03\x70(.*?)(?:\x0D|$)/;
    this.lastModel = null;
}

/**
 * Receives raw memory data as byte array, parses it and returns array of
 * APRS beacon messages. If radio model is not recognized, empty array is
 * returned.
 */
Parser.prototype.parseMemory = function (rawData) {
    res = [];
    var modelId = String.fromCharCode.apply(null, rawData.slice(0, 5));
    memoryMap = MEMORY_MAPS[modelId];

    if (!memoryMap) {
        alert('Unknown radio model!');
        return res;
    }

    var beaconDataSize = memoryMap.beaconHeaderSize + memoryMap.beaconDataSize;
    for (var n = 0; n < memoryMap.beacons; n++) {
        var addr;
        var rawMetadata;
        var rawMessage;

        addr = memoryMap.metadataAddr + memoryMap.metadataSize * n;
        rawMetadata = rawData.slice(addr, addr + memoryMap.metadataSize);

        addr = memoryMap.beaconContentAddr + beaconDataSize * n;
        rawMessage = rawData.slice(addr, addr + beaconDataSize);

        var beacon = this.parseBeacon(memoryMap, rawMetadata, rawMessage);
        if (beacon.isValid) {
            res.push(beacon);
        }
    }
    this.lastRadioModel = memoryMap.modelName;
    return res;
}

/**
 * Parses single beacon messages.
 * Receives memory map for detected radio model, raw metadata as bye array
 * and raw beacon message as bye array.
 */
Parser.prototype.parseBeacon = function(memoryMap, rawMetadata, rawMessage) {
    var beacon = {};

    /* If metadata is empty, isValid is set to false and no processing is done. */
    beacon.isValid = this.isMetadataValid(rawMetadata, memoryMap.metadataSize);
    if (!beacon.isValid) return beacon;

    /* Extract packet data. */
    beacon.dateTime = this.getDateFromMetadata(rawMetadata);
    var packetLen = rawMetadata[20] * 0xFF + rawMetadata[21];

    /* Callsigns */
    var callsign;
    var ssid;

    callsign = this.decodeCallsign(rawMessage.slice(0, 6)).trim();
    ssid = ((rawMessage[6] >> 1) - 0x30) & 0x0F;
    beacon.destCallsign = this.generateCallsign(callsign, ssid);
    beacon.destUrl = this.generateUrl(beacon.destCallsign);

    callsign = this.decodeCallsign(rawMessage.slice(7, 13)).trim();
    ssid = ((rawMessage[13] >> 1) - 0x30) & 0x0F;
    beacon.srcCallsign = this.generateCallsign(callsign, ssid);
    beacon.srcUrl = this.generateUrl(beacon.srcCallsign);

    /* Message body */
    var body = rawMessage.slice(memoryMap.beaconHeaderSize, packetLen);
    for (i = 0; i < body.length; i++) {
        body[i] &= 0x7F;
    }

    var msgBody = String.fromCharCode.apply(null, body);

    beacon.message = null;
    var match = this.messageRegex.exec(msgBody);
    if (match) {
        beacon.message = match[1];
    }

    /* Location */
    beacon.lon = 0.0;
    beacon.lat = 0.0;
    match = this.coordRegex.exec(msgBody);
    if (match) {
        beacon.lat = this.locationToDecimalDeg(match[1], match[2], match[3]);
        beacon.lon = this.locationToDecimalDeg(match[4], match[5], match[6]);
    }

    return beacon;
}

/**
 * Converts degrees, minutes and direction to decimal degrees format.
 * Receives degrees, minutes and direction (N/S or E/W).
 */
Parser.prototype.locationToDecimalDeg = function (deg, min, direction) {
    var res = 0.0;
    res += parseFloat(deg);
    res += (parseFloat(min) / 60);
    res = (direction == 'W' || direction == 'S') ? -res : res;
    return res;
}

/**
 * Converts a BCD byte to two symbols string.
 */
Parser.prototype.bcdToString = function (bcd) {
    var res = "";
    res += ((bcd & 0xF0) >> 4);
    res += (bcd & 0x0F);
    return res;
}

/**
 * Converts a BCD byte to integer value.
 */
Parser.prototype.bcdToDecimal = function (bcd) {
    return ((bcd & 0xF0) >> 4) * 10 + (bcd & 0x0F);
}

/**
 * Gets beacon reception date and time from raw metadata.
 */
Parser.prototype.getDateFromMetadata = function (metadata) {
    /* Date (bytes 0..2) */
    var res = "20" + this.bcdToString(metadata[0]);
    res += "-" + this.bcdToString(metadata[1]);
    res += "-" + this.bcdToString(metadata[2]);
    /* Time (bytes 4..5) */
    res += " ";
    res += this.bcdToString(metadata[4]) + ":" + this.bcdToString(metadata[5]);
    return res;
}

/**
 * Checks if beacon's metadata is valid.
 * 
 * Array of 0xFF bytes only represents empty and thus invalid metadata.
 * Returns true if it is valid, and false if not.
 */
Parser.prototype.isMetadataValid = function (metadata, size) {
    /* If metadata is empty, it is filled with 0xFF bytes. */
    var mult = 0xFF;
    for (var i = 0; i < size && mult == 0xFF; i++) {
        mult &= metadata[i];
    }
    var res = (mult == 0xFF) ? false : true;
    return res;
}

/**
 * Generates call sign string from callsign and APRS SSID.
 */
Parser.prototype.generateCallsign = function (callsign, ssid) {
    var res = callsign;
    res += (ssid > 0) ? "-" + ssid : "";
    return res;
}

/**
 * Generates url to APRS website from given callsign.
 */
Parser.prototype.generateUrl = function (callsign) {
    var res = "http://aprs.fi/#!mt=roadmap&z=12&call=a%2F" + callsign;
    return res;
}

/**
 * Decodes callsign from array of bytes.
 *
 * Each symbol in raw data is moved one bit left i.e. multiplied by two.
 * The function takes each symbol, moves all bits one bit right and converts
 * resulting array to string.
 */
Parser.prototype.decodeCallsign = function (array) {
    for (i = 0; i < array.length; i++) {
        array[i] = (array[i] >> 1);
    }
    var res = String.fromCharCode.apply(null, array);
    return res;
}
