var startIO = function(){

    //get element
    var element = document.getElementById('canvas');

    //create projection
    var center = new IO.classes.Geo(5.246658, 51.679408);
    var projection = new IO.classes.Projection(center, 22);

    //create 3d world
    var world = new IO.classes.World(element, projection, ['tiltShift','blurredMenu']);

    //tilt shift
    world.FX.setBlur(5, 0.55, 1.4);

    //get map data
    var buildingsMap = new IO.classes.Map('maps/buildings.topojson','collection');
    var roadsMap = new IO.classes.Map('maps/streets.topojson','collection');
    var areasMap = new IO.classes.Map('maps/areas.topojson','collection');

    //create layers
    var buildings = new IO.classes.Layer3D(world);
    var roads = new IO.classes.Layer3D(world);
    var areas = new IO.classes.Layer3D(world);

    //cycle between day & night
    var cycle = new IO.classes.Cycle(world);
    cycle.addLight(world.hemisphere, 0.8, 0.2);

    //buildings viz
    buildings
        .data(buildingsMap)
        .options({
            colors: ['#f9f9f9', '#e8e8e8', '#dbdbdb', '#dfa5a1', '#e87364'],
            height: function(properties){
                return properties.height;
            },
            groups: function(groups, properties){
                if(properties.no2 < 35){
                    return groups[0];
                }
                else if(properties.no2 > 35 && properties.no2 < 38.5){
                    return groups[1];
                }
                else if(properties.no2 > 38.5 && properties.no2 < 40.5){
                    return groups[2];
                }
                else if(properties.no2 > 40.5 && properties.no2 < 42.5){
                    return groups[3];
                }
                else if(properties.no2 > 42.5){
                    return groups[4];
                }
                else {
                    return groups[0];
                }
            }
        })
        .build(IO.build.buildings);

    //roads - day + night
    roads
        .data(roadsMap)
        .options({
            color: '#ff0000',
            maxSegments: 10,
            height: function(properties, index){
                return Math.pow( (properties.day[index] - 50), 1.3);
            }
        })
        .build(IO.build.soundRoads, {time: 'day'})
        .build(IO.build.soundRoads, {time: 'night'});

    //rails - day + night
    roads
        .data(roadsMap)
        .options({
            color: '#ff0000',
            maxSegments: 10,
            height: function(properties, index){
                return Math.pow( (properties.day[index] - 50), 1.3);
            }
        })
        .build(IO.build.soundRoads, {time: 'day'})
        .build(IO.build.soundRoads, {time: 'night'});

    //areas (grass, water, neighborhoods)
    areas
        .data(areasMap)
        .options({
            colors: ['#DDDDDD', '#81c6f6', '#80c146'],
            night: ['#333333', '#11485f', '#254F0B'],
            groups: function(groups, properties){
                if(properties.tags.natural === "water"){
                    return groups[1];
                }
                // else if(properties.tags.landuse === "grass"){
                else if(properties.tags.leasure === "park"){
                    return groups[2];
                } else {
                    return groups[0];
                }
            }
        })
        .build(IO.build.areas)

    //create background
    var bg = $('#intro').triangleBg();

    //create progress loader
    var $loader = $('#intro .loader');
    var $indicator = $('#intro .loader .indicator');
    var maxWidth = $loader.width();

    //create dropdown
    $('.menu-item-dropdown').dropdown();

    //preloader status
    world.events.addEventListener('preloader', function(evt){

        if( evt.state === 'downloading' ){
            $loader.addClass('downloading').removeClass('rendering start loaded');
        }
        else if( evt.state === 'rendering' ){
            $loader.addClass('rendering').removeClass('downloading start loaded');
        }
        else if( evt.state === 'loaded' ){
            $loader.addClass('loaded').removeClass('downloading rendering start');
        }

    });

    //procent update
    world.events.addEventListener('preloader-update', function(evt){

        var progress = evt.progress;
        var width = maxWidth * progress;

        $indicator.css('width', width);

    });

    //load & start
    $loader.click(function(){

        if(world.preloader.state === 'idle'){

            world
                .load([buildings, areas, roads])
                .then(function(){

                    // world.start();

                    var goTo = new IO.classes.Geo(5.246658, 51.679408).setAltitude(300);
                    var lookAt = new IO.classes.Geo(5.246658, 51.89408).setAltitude(100);
                    var flyAround = new IO.classes.Geo(5.30299, 51.68965).setAltitude(300);

                    //rotate camera
                	world.camera
                		.gotoGeo(goTo)
                		.lookAtGeo(lookAt);

                	//start with flying around
                	world.camera.flyAround(flyAround, 500);

                })
                .catch(function(e){
                    console.stack(e);
                });

        } else if(world.preloader.state === 'loaded') {

            bg.destroy();
            $('#intro').hide().remove();

            world.start();

        }

    });

    //switch camera points
    $('.camera-switch').click(function(){

        var point = $(this).attr('rel');

        switch(point){

            case '1':
                var flyAround = new IO.classes.Geo(5.30585, 51.68476).setAltitude(100);
                world.camera.flyAround(flyAround, 100);
            break;

            case '2':
                var goTo = new IO.classes.Geo(5.29774, 51.68793).setAltitude(200)
                var lookAt= new IO.classes.Geo(5.29976, 51.68809).setAltitude(10);
                world.camera.animateTo([goTo, lookAt]);
            break;

        }

    });

    //switch between day/night
    $('.menu-item-toggle').click(function(){

        console.log('switch');

        _cycle = cycle.getTime();

        //reverse
        _cycle = _cycle === 0 ? 1 : 0;
        cycle.setTime(_cycle);

        //update toggle
        $(this).find('span').toggleClass('selected');


    });

};

//when DOM is ready load CityIO
document.addEventListener("DOMContentLoaded", startIO);
