'use strict';

const Si7021 = require('si7021-sensor');

// The Si7021 constructor options are optional.
// Defaults are i2cBusNo 1, i2cAddress 0x40.
// 
const options = { i2cBusNo   : 1,
                  i2cAddress : Si7021.SI7021_DEFAULT_I2C_ADDRESS() };

const si7021 = new Si7021(options);

si7021.reset()
  .then(result => readSensorData())
  .catch(err => console.error(`Si7021 reset failed: ${err} `));

const readSensorData = () => {
  si7021.readSensorData()
    .then(data => console.log(`data = ${JSON.stringify(data, null, 2)}`))
    .catch(err => console.log(`Si7021 read error: ${err}`));
  setTimeout(readSensorData, 2000);
}
