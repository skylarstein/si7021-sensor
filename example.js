'use strict';

const Si7021 = require('si7021-sensor');

// Si7021 constructor options object is optional, i2cBusNo defaults to 1
//
const si7021 = new Si7021({ i2cBusNo : 1 });

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
