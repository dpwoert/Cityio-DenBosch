IO.FXlib.blurredMenu = function(scene, camera, renderer, world){

    //check
    if(!this.composer){
        console.warn('composer not found');
        return false;
    }

    var shaderVert = {

    	uniforms: {

    		"tDiffuse": { type: "t", value: null },
    		"v":        { type: "f", value: 1.0 / 512.0 },
    		"r":        { type: "f", value: 0.35 },
    		"threshold":{ type: "f", value: 0.15 },
    		"color":    { type: "c", value: new THREE.Color(0xff0000) }

    	},

    	vertexShader: [

    		"varying vec2 vUv;",

    		"void main() {",

    			"vUv = uv;",
    			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    		"}"

    	].join("\n"),

    	fragmentShader: [

    		"uniform sampler2D tDiffuse;",
    		"uniform float v;",
    		"uniform float r;",
    		"uniform float threshold;",
    		"uniform vec3 color;",

    		"varying vec2 vUv;",

    		"void main() {",

                "if (vUv.y < threshold){",

        			"vec4 sum = vec4( 0.0 );",

        			"float vv = 0.001;",

        			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * vv ) ) * 0.051;",
        			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * vv ) ) * 0.0918;",
        			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * vv ) ) * 0.12245;",
        			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * vv ) ) * 0.1531;",
        			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",
        			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * vv ) ) * 0.1531;",
        			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * vv ) ) * 0.12245;",
        			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * vv ) ) * 0.0918;",
        			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * vv ) ) * 0.051;",

        			"gl_FragColor = sum;",
        			// "gl_FragColor = mix(sum, vec4(color,1), 0.2);",

                "}",

                "else {",

                    "gl_FragColor = texture2D( tDiffuse, vUv );",

                "}",

    		"}"

    	].join("\n")

    };

    //listen to resize
    world.events.addEventListener('resize', function(evt){

        var height = 100;
        var bottom = evt.size.height;
        var top = bottom - height;
        var threshold = 1 - (top / bottom);
        this.blurredMenu.uniforms.threshold.value = threshold;

        console.log('resize blurred menu')

    }.bind(this));

    //init
    this.blurredMenu = new ShaderPass(shaderVert);
    this.composer.addPass(this.blurredMenu);

};
