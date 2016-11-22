/*
  Si7021.js

  I2C driver for the Silicon Labs Si7021 Temperature and Humidity Sensor
*/

'use strict';

class Si7021 {

  constructor(options) {
    const i2c = require('i2c-bus');
    this.i2cBus = i2c.openSync((options && options.hasOwnProperty('i2cBusNo')) ? options.i2cBusNo : 1);

    this.SI7021_ADDRESS                 = 0x40;
    this.SI7021_RESET_CMD               = 0xFE;
    this.SI7021_READRHT_REG_CMD         = 0xE7;
    this.SI7021_MEASURE_TEMP_NOHOLD_CMD = 0xF3;
    this.SI7021_MEASURE_HUM_NOHOLD_CMD  = 0xF5;
    this.SI7021_USER_REG_DEFAULT        = 0x3A;
  }

  reset() {
    return new Promise((resolve, reject) => {
      // Issue reset, wait for completion, verify
      //
      this.i2cBus.writeByte(this.SI7021_ADDRESS, this.SI7021_RESET_CMD, 0, (err) => {
        if(err) {
          return reject(err);
        }

        setTimeout(() => {
          this.i2cBus.readByte(this.SI7021_ADDRESS, this.SI7021_READRHT_REG_CMD, (err, userRegister) => {
            if(err) {
              return reject(err);
            }

            if(userRegister !== this.SI7021_USER_REG_DEFAULT) {
              return reject(`User register returned 0x${userRegister.toString(16)}. Expected 0x${this.SI7021_USER_REG_DEFAULT.toString(16)} after reset.`);
            }

            return resolve(userRegister);
          });
        }, 50);
      });
    });
  }

  readSensorData() {
    return new Promise((resolve, reject) => {
      // Request temperature, wait, read
      //
      this.i2cBus.writeByte(this.SI7021_ADDRESS, this.SI7021_MEASURE_TEMP_NOHOLD_CMD, 0, (err) => {
        if(err) {
          return reject(err);
        }

        setTimeout(() => {
          this.i2cBus.i2cRead(this.SI7021_ADDRESS, 3, new Buffer(3), (err, bytesRead, data) => {
            if(err) {
              return reject(err);
            }

            const temperature_C = (((((data[0] << 8) | data[1]) * 175.72) / 65536) - 46.85);
            //const checksum_T = data[2];

            // Request humidity, wait, read
            //
            this.i2cBus.writeByte(this.SI7021_ADDRESS, this.SI7021_MEASURE_HUM_NOHOLD_CMD, 0, (err) => {
              if(err) {
                return reject(err);
              }

              setTimeout(() => {
                this.i2cBus.i2cRead(this.SI7021_ADDRESS, 3, new Buffer(3), (err, bytesRead, data) => {
                  if(err) {
                    return reject(err);
                  }

                  const humidity   = (((((data[0] << 8) | data[1]) * 125) / 65536) - 6);
                  //const checksum_H = data[2];

                  return resolve({
                    humidity      : humidity,
                    temperature_C : temperature_C
                  });
                });
              }, 25);
            });
          });
        }, 25);
      });
    });
  }
}

module.exports = Si7021;
