# si7021-sensor

Welcome to si7021-sensor, a Node.js I2C driver for the Si7021 Temperature and Humidity Sensor. Adafruit has a [Si7021 breakout board](https://www.adafruit.com/product/3251), and [here is the datasheet](https://cdn-learn.adafruit.com/assets/assets/000/035/931/original/Support_Documents_TechnicalDocs_Si7021-A20.pdf).

This module uses [i2c-bus](https://github.com/fivdi/i2c-bus) which should provide access with Node.js on Linux boards like the Raspberry Pi Zero, 1, 2, or 3, BeagleBone, BeagleBone Black, or Intel Edison.

Since si7021-sensor needs to talk directly to the I2C bus and requires access to /dev/i2c, you will typically need run Node with elevated privileges.

si7021-sensor plays well with Node.js 4.x and 6.x

## Example Code

```
const Si7021 = require('si7021-sensor');

// The Si7021 constructor options are optional.
// Defaults are i2cBusNo 1, i2cAddress 0x40.
// 
const options = { i2cBusNo   : 1,
                  i2cAddress : Si7021.SI7021_DEFAULT_I2C_ADDRESS() };

const si7021 = new Si7021(options);

const readSensorData = () => {
  si7021.readSensorData()
    .then((data) => {
      console.log(`data = ${JSON.stringify(data, null, 2)}`);
      setTimeout(readSensorData, 2000);
    })
    .catch((err) => {
      console.log(`Si7021 read error: ${err}`);
      setTimeout(readSensorData, 2000);
    });
}

si7021.reset()
  .then((result) => readSensorData())
  .catch((err) => console.error(`Si7021 reset failed: ${err} `));
```

##Example Output

```
> sudo node example.js          
data = {
  "humidity": 43.030303955078125,
  "temperature_C": 26.220090332031255
}
```
##Example Wiring

For an example of I2C setup on a Raspberry Pi, take a look at my [pi-weather-station project](https://github.com/skylarstein/pi-weather-station).
