$.fn.triangleBg = function(){

    var width = window.innerWidth;
    var height = window.innerHeight;

    var createGradient = function(){

        //get canvas object
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        //set dimensions
        canvas.width = 500;
        canvas.height = 500;

        //create gradient
        var gradient = context.createLinearGradient(0, 0, 0, 500);
        gradient.addColorStop(0, '#ff0000');
        gradient.addColorStop(1, '#000000');

        context.globalAlpha = 0.75;
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, 500, 500);

        context.fillStyle = gradient;
        context.fillRect(0, 0, 500, 500);

        return canvas;

    };

    var createTexture = function(element){

        //create video
        var texture = new THREE.Texture( element );
    	texture.min_filter = THREE.LinearFilter;
    	texture.mag_filter = THREE.LinearFilter;

        var material = new THREE.MeshBasicMaterial({ map: texture });

        // The bg plane shouldn't care about the z-buffer.
        material.depthTest = false;
        material.depthWrite = false;

        return material;

    };

    var generateUV = function(geometry){

        geometry.computeBoundingBox();

        var max = geometry.boundingBox.max;
        var min = geometry.boundingBox.min;

        // var max = new THREE.Vector3(width,height,0);
        // var min = new THREE.Vector3(0,0,0);

        var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
        var range = new THREE.Vector2(max.x - min.x, max.y - min.y);

        geometry.faceVertexUvs[0] = [];
        var faces = geometry.faces;

        for (i = 0; i < geometry.faces.length ; i++) {

            var v1 = geometry.vertices[faces[i].a];
            var v2 = geometry.vertices[faces[i].b];
            var v3 = geometry.vertices[faces[i].c];

            geometry.faceVertexUvs[0].push([
                new THREE.Vector2( ( v1.x + offset.x ) / range.x , ( v1.y + offset.y ) / range.y ),
                new THREE.Vector2( ( v2.x + offset.x ) / range.x , ( v2.y + offset.y ) / range.y ),
                new THREE.Vector2( ( v3.x + offset.x ) / range.x , ( v3.y + offset.y ) / range.y )
            ]);

        }

        geometry.uvsNeedUpdate = true;

    }

    //select dom elements
    var $this = $(this);
    var video = $this.find('video')[0];
    var $container = $this.find('.background');

    //setup scene
    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.z = 1;

    //background texture
    var bg = new THREE.Mesh(
        new THREE.PlaneGeometry(width, width),
        createTexture(video)
    );

    //overlay
    var geom = new THREE.Geometry();

    var v1 = new THREE.Vector3(0,-height,0);
    var v2 = new THREE.Vector3(width,0,0);
    var v3 = new THREE.Vector3(0,0,0);

    geom.vertices.push(v1);
    geom.vertices.push(v2);
    geom.vertices.push(v3);

    geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geom.computeFaceNormals();
    generateUV(geom);

    var gradient = createGradient();
    // var triangle = new THREE.Mesh( geom, new THREE.MeshBasicMaterial({ color: '#ff0000' }) );
    var triangle = new THREE.Mesh( geom, createTexture(gradient) );

    triangle.position.x -= width / 2;
    triangle.position.y += height / 2;

    triangle.material.blending = THREE.MultiplyBlending;
    triangle.material.transparent = true;
    triangle.material.opacity = 0.5;
    triangle.material.side = THREE.DoubleSide;
    triangle.dynamic = true;
    triangle.material.map.needsUpdate = true;

    //add objects to scene
    scene.add(bg);
    scene.add(triangle);

    //create renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0x000000);
    $container.append(renderer.domElement);

    //add list
	var render = new IO.classes.RenderManager();

    //render
    render.add('main', function(){

        renderer.render(scene, camera);

        //update video
        if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
    		if ( bg.material.map ) bg.material.map.needsUpdate = true;
    	}

    });

    //start!
    render.start();

    //resize
    $(window).on('resize.triangle', function(){

        //todo

    });

    //destroy handler
    this.destroy = function(){

        IO.tools.destroyGroup(scene);

        bg = undefined;
        triangle = undefined;
        $this = undefined;
        $container = undefined;
        video = undefined;

        render.clear();
        $(window).off('resize.triangle');

    };

    //chainable
    return this;

};
