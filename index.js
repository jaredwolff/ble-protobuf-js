var noble     = require('noble-mac');
var protobuf  = require('./command.pb.js');

// UUIDs for Protobuf Service
const protobuf_uuid          = "0000f5108d456280f64dff5fb31a0972";
const protobuf_char_uuid     = "f511";

// UUIDs to scan for
const service_uuids = { protobuf_uuid };
const char_uuids    = { protobuf_char_uuid };

// Default device name
const device_name   = "Nordic_Buttonles";

// Main characteristic
var protobuf_char        = null;

// Discovery callback
noble.on('discover', function(peripheral) {

  console.log('peripheral with ID ' + peripheral.id + ' found with name: ' + peripheral.advertisement.localName );
  var advertisement = peripheral.advertisement;

  if( advertisement.localName == device_name ) {
    // Stop scanning
    noble.stopScanning();

    // Set a callback if things disconnect
    peripheral.on('disconnect', function() {
      // Reset charcterisitcs on disconnect
      protobuf_char = null;

      noble.startScanning();
    });

    // Check out the services
    peripheral.connect(function(error) {

      console.log("connected to " + device_name);

      peripheral.discoverServices(service_uuids, function(error, services) {

        services.some(function(service) {

          service.discoverCharacteristics(char_uuids, function(error, characteristics) {

            characteristics.some(function(characteristic) {

              // Check if we have the uuid for protobuf
              if( characteristic.uuid == protobuf_char_uuid ) {

                // Set char
                protobuf_char = characteristic;

                // Handler
                protobuf_char.on('data',(data, isNotification) => {

                  var response = protobuf.event.decode(data);

                  if( response.type != protobuf.event.event_type.response ){
                    console.log("invalid resonse!");
                    return;
                  }

                  console.log("Recieved: " + response.message);

                });

                // setup command
                var event = protobuf.event.create();
                event.type = protobuf.event.event_type.command;
                event.message = "This is";

                // make sure it's valid
                var err = protobuf.event.verify(event);
                if( err != null ) {
                  console.log("verify failed: " + err);
                  return;
                }

                // encode into raw bytes
                var payload = protobuf.event.encode(event).finish();

                // wite to char
                protobuf_char.write(payload,false,(error)=>{

                  // Return error if error
                  if( error ) {
                    console.log("error: %s",error);
                    return;
                  }

                  console.log("Sent: " + event.message);

                  // Read the response
                  protobuf_char.read(null);
                });

              }

            });
          });
        });
      });
    });
  }
});

// Callback for state change
noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    console.log("scanning");
    noble.startScanning();
  } else {
    console.log("stop scanning");
    noble.stopScanning();
  }
});

// Main function used to run the code.
var main = function(){
  console.log("example started");
}

// If run directly from the command line, this gets triggered
if (require.main === module) {
  main();
}