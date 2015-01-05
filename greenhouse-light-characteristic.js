var util = require('util');
var bleno = require('bleno');
var greenhouse = require('./greenhouse');

function GreenhouseLightCharacteristic(greenhouse) {
  bleno.Characteristic.call(this, {
    uuid: '496e264d-6f74-696e-0131-000000000000',
    properties: ['read', 'notify', 'write'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'Gets or sets the type of greenhouse light state.'
      })
    ]
  });

  this.greenhouse = greenhouse;
}

util.inherits(GreenhouseLightCharacteristic, bleno.Characteristic);

GreenhouseLightCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG);
    console.log('ATTR NOT LONG');
  }
  else if (data.length !== 1) {
    callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
    console.log('ATTR INVALID LENGTH');
  }
  else {
    var command = data.readUInt8(0);
    console.log('Light Writted Value = ' + command);
    gpio.open(16, 'output', function(err) {
      gpio.read(16, function(err, value) {
        if (err) throw err;
        if (value === 1) {
          gpio.write(16, 1, function() {
            gpio.close(16);
          });
        } else {
          gpio.write(16, 0, function() {
            gpio.close(16);
          });
        }
      });
    });
    //this.greenhouse.light != this.greenhouse.light;
    callback(this.RESULT_SUCCESS);
  }
};

GreenhouseLightCharacteristic.prototype.onReadRequest = function(offset, callback) {
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG, null);
  }
  else {
    var data = new Buffer(1);
    data.writeUInt8(this.greenhouse.light, 0);
    callback(this.RESULT_SUCCESS, data);
  }
};

GreenhouseAccelCharacteristic.prototype.onSubscribe = function(maxValueSize, callback) {
    setInterval(function() {
      callback(new Buffer(new U8intArray([140, 140, 140])));
    }, 1500);
    setInterval(function() {
      callback(new Buffer(new U8intArray([10, 150, 140])));
    }, 2500);
  }

module.exports = GreenhouseLightCharacteristic;
