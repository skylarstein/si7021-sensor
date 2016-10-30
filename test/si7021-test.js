'use strict';

process.env.NODE_ENV = 'test';

const chai   = require('chai');
const Si7021 = require('../Si7021.js');
const expect = chai.expect;

describe('si7021-sensor', () => {
  it('it should communicate with the device', () => {
    let si7021 = new Si7021();
    expect(si7021).to.be.an.instanceof(Si7021);
    return si7021.reset().then((result) => {
      expect(result).to.not.be.equal(0);
    });
  });

  it('it should receive valid sensor data', (done) => {
    let si7021 = new Si7021();
    expect(si7021).to.be.an.instanceof(Si7021);
    si7021.reset()
      .then((result) => {
        expect(result).to.not.be.equal(0);

        si7021.readSensorData()
          .then((data) => {
            console.log(`Si7021 sensor data: ${JSON.stringify(data)}`);
            expect(data).to.have.all.keys('temperature_C', 'humidity');
            expect(data.temperature_C).to.be.within(-40, 85);
            expect(data.humidity).to.be.within(0, 100);
            done();
          })
          .catch((err) => {
            done(err);
          });
      })
      .catch((err) => {
        done(err)
      });
  });
});
