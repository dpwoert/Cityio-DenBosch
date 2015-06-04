$.fn.triangleBg = function(){

    var width = window.innerWidth;
    var height = window.innerHeight;

    //select dom elements
    var $this = $(this);
    var video = $this.find('video')[0];
    var $container = $this.find('.background');

    //setup scene
    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.z = 1;

    //create video
    texture = new THREE.Texture( video );
	texture.min_filter = THREE.LinearFilter;
	texture.mag_filter = THREE.LinearFilter;

    //background texture
    var bg = new THREE.Mesh(
        new THREE.PlaneGeometry(width, width),
        new THREE.MeshBasicMaterial({ map: texture })
    );

    // The bg plane shouldn't care about the z-buffer.
    bg.material.depthTest = false;
    bg.material.depthWrite = false;

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

    var triangle = new THREE.Mesh( geom, new THREE.MeshBasicMaterial({ color: 0xff0000 }) );
    triangle.position.x -= width / 2;
    triangle.position.y += height / 2;

    triangle.material.blending = THREE.MultiplyBlending;
    triangle.material.transparent = true;

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
    		if ( texture ) texture.needsUpdate = true;
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
