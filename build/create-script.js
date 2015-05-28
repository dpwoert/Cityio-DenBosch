var IO = require('cityio');
var build = new IO.classes.Build();
build
    .add('classes.Cycle')
    .add('build.buildings')
    .add('build.areas')
    .add('build.roads')
    .add('FXlib.tiltShift')
    .export('cityio.js')
    .then(function(){
        console.log('updated cityio script');
    });
