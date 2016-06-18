/**
 * memoru.maps.js
 *
 * Memory settings for different Yaesu HT models.
 * 
 * Fields in memory maps:
 *
 * modelId: first 5 bytes of memory dump
 * modelName: radio model
 * metadataAddr: APRS beacon metadata address
 * metadataSize: APRS beacon metadata size in bytes
 * beaconContentAddr: APRS beacon content address
 * beaconHeaderSize: length of beacon header stored
 * beaconDataSize: length of beacon data stored
 * beacons: number of beacons stored
 */
var MEMORY_MAPS = {
    /* Yaesu VX-8DR/DE */
    'AH29D': {
        modelId: 'AH29D',
        modelName: 'Yaesu VX-8DR/E',
        metadataAddr: 0xC24A,
        metadataSize: 24,
        beaconContentAddr: 0xC6FA,
        beaconHeaderSize: 14,
        beaconDataSize: 146,
        beacons: 50
    },
    /* Yaesu VX-8R/E */
    'AH029': {
        modelId: 'AH029',
        modelName: 'Yaesu VX-8R/E',
        metadataAddr: 0xC24A,
        metadataSize: 24,
        beaconContentAddr: 0xC60A,
        beaconHeaderSize: 14,
        beaconDataSize: 194,
        beacons: 50
    },
    /* Yaesu FT-1DR */
    /*
    'AH44M': {
        modelId: 'AH44M',
        modelName: 'Yaesu FT-1DR',
        metadataAddr: 0xFECA,
        metadataSize: 24,
        beaconContentAddr: 0x1064A,
        beaconHeaderSize: 14,
        beaconDataSize: 134,
        beacons: 60
    },
    */
}