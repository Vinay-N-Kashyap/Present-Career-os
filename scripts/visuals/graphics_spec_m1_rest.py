# scripts/visuals/graphics_spec_m1_rest.py
# Course 15: 3D Interactive Graphics & Avatar Animation (course-3d-graphics)
# Month 1: Days 16-30 (Blocks 4-6) - 60 Quests Total

GRAPHICS_M1_PART2 = [
  # =========================================================================
  # BLOCK 4: THREE.JS SCENE GRAPHS & MESH ARCHITECTURE (Days 16-20)
  # =========================================================================
  {
    "day": 16,
    "month": 1,
    "blockNum": 4,
    "title": "Three.js Core Architecture: Scene Graph Hierarchy, Object3D Transforms & Matrix Caching",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Scene Graph Architecture (Hierarchical Transforms & Matrix Updates)",
    "spokenGoal": "Transition from raw WebGL to the industry-standard 3D framework: Three.js. Deconstruct the Three.js Scene Graph: a tree of Object3D nodes (Meshes, Groups, Cameras, Lights) where child transformations (position, rotation, scale) are defined relative to their parent. Understand Local Matrix (`matrix`) versus World Matrix (`matrixWorld`). Confront the performance cost of automatic matrix updates: why leaving `matrixAutoUpdate = true` on 5,000 static objects wastes 8 milliseconds of CPU time every frame recalculating identical matrices, and master manual matrix caching with `matrixAutoUpdate = false` and `updateMatrixWorld()`. ",
    "conceptInvariant": "Hierarchical Coordinate Invariant: A child object's world transformation is the recursive product of all ancestor transformation matrices: matrixWorld = parent.matrixWorld &times; child.matrix; transforming a parent node translates, rotates, and scales all descendants automatically.",
    "failureMode": "Leaving 'matrixAutoUpdate = true' on a static 3D city scene with 15,000 buildings; V8 burns 14ms per frame traversing the scene graph tree to recalculate static matrices, dropping the application from 60 FPS to 22 FPS on the CPU.",
    "tryItFriction": "Construct a Hierarchical Solar System in Three.js in TypeScript: create Sun -> EarthPivot -> Earth -> Moon nodes using Object3D; configure orbits with parent-child nesting; disable matrixAutoUpdate on static star background meshes; and prove that Moon orbits Earth while Earth simultaneously orbits Sun with zero manual trigonometry.",
    "socraticHints": [
      "Why does rotating the parent 'EarthPivot' node cause the child 'Earth' mesh to orbit around the Sun instead of spinning on its own axis?",
      "Because the child Earth mesh is positioned at offset (x=10, y=0, z=0) relative to EarthPivot! When EarthPivot rotates at the origin, that offset swings in a circle around the parent's pivot point!",
      "To make Earth spin on its own axis, rotate the child Earth mesh directly."
    ],
    "situationalPuzzle": {
      "scenario": "A 3D character holds a sword attached as a child of the hand bone mesh. An engineer wants to know the sword's tip position in global world space to calculate a hit-box collision. The engineer reads: 'sword.position'. The value returns (0, 0.5, 0), which is just the local offset inside the hand! How does Three.js extract the true global 3D coordinates of a nested child object?",
      "options": [
        "Add the character's position to the sword's position manually.",
        "World Vector Extraction via 'getWorldPosition()': Because 'position' is strictly local to the parent hand, the engineer must call 'sword.getWorldPosition(targetVector)'! This internally multiplies the local position by the accumulated 'sword.matrixWorld', extracting the true global coordinates in world space.",
        "Detach the sword from the hand bone.",
        "Three.js does not support world coordinates."
      ],
      "answerIdx": 1,
      "debrief": "In hierarchical scene graphs, 'position', 'rotation', and 'scale' properties are strictly local to the parent node. To determine where an object physically exists in the world, you must query the computed world transform using 'getWorldPosition()', 'getWorldQuaternion()', or inspect 'matrixWorld'."
    },
    "quests": [
      {
        "id": "cg-m1-d16-q1",
        "name": "Scene Graph Tree Matrix Accumulation Mathematics",
        "type": "concept",
        "desc": "Prove by induction that a leaf node at depth N in a scene graph inherits the product of N affine transformation matrices."
      },
      {
        "id": "cg-m1-d16-q2",
        "name": "matrixAutoUpdate CPU Overhead & Cache Profiler",
        "type": "detective",
        "desc": "Benchmark CPU frame times across 10,000 objects in Three.js with matrixAutoUpdate enabled versus disabled with static freezing."
      },
      {
        "id": "cg-m1-d16-q3",
        "name": "Hierarchical Kinematic Robot Arm in Three.js",
        "type": "mastery",
        "desc": "Build a multi-joint robotic arm using nested Object3D nodes with forward kinematics and world position tracking."
      },
      {
        "id": "cg-m1-d16-q4",
        "name": "3 AM SRE: Stuttering Virtual Showroom from Matrix Recalculation",
        "type": "incident",
        "desc": "Resolve a high-severity customer lag issue where 8,000 static product meshes triggered continuous tree-traversal matrix recalculations."
      }
    ]
  },
  {
    "day": 17,
    "month": 1,
    "blockNum": 4,
    "title": "Geometries & BufferGeometry: Custom Attributes, Index Buffers & Draw Ranges",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Geometry Engineering (Three.js BufferGeometry & Memory Optimization)",
    "spokenGoal": "Build and optimize raw 3D meshes: master Three.js BufferGeometry. Understand how BufferGeometry wraps WebGL VBOs using typed arrays (`Float32BufferAttribute`, `Uint16BufferAttribute`). Compare non-indexed geometry (where a cube requires 36 duplicate vertices) against Indexed Geometry (using an Index Buffer to define triangles by vertex index, reducing the cube to just 8 unique vertices and slashing VRAM by 60%). Master surface normal generation (`computeVertexNormals`), bounding spheres (`computeBoundingSphere`), and dynamic draw ranges (`setDrawRange`) for real-time particle and procedural geometry updates.",
    "conceptInvariant": "Index Buffer Reusability Invariant: In shared-surface meshes, an Index Buffer (Element Array Buffer) allows multiple triangles sharing edge vertices to reference the exact same vertex attributes, slashing vertex shader invocation count and reducing VRAM bandwidth by up to 66%.",
    "failureMode": "Modifying vertex positions in a BufferGeometry's Float32Array every frame without setting 'positionAttribute.needsUpdate = true'; Three.js never re-uploads the buffer to the GPU, leaving the mesh completely frozen on screen.",
    "tryItFriction": "Construct a Dynamic Procedural Terrain Mesh in Three.js in TypeScript: create a custom BufferGeometry grid with an index buffer; compute vertex normals dynamically; update vertex heights in a wave animation; set needsUpdate=true on the position attribute; and verify smooth shading.",
    "socraticHints": [
      "Why must you call 'geometry.computeVertexNormals()' after procedurally updating vertex positions?",
      "Because vertex positions moved! If you do not recompute the normals, the lighting on the deformed mesh will reflect light as if the surface were still completely flat!",
      "computeVertexNormals() recalculates smooth face-averaged normal vectors for every vertex."
    ],
    "situationalPuzzle": {
      "scenario": "A 3D developer creates a dynamic rope simulation using a BufferGeometry line with 1,000 vertices. As the rope moves, the developer allocates a brand-new Float32Array and creates a new BufferAttribute every frame: 'rope.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));'. After 2 minutes of simulation, the browser tab freezes and crashes with an out-of-memory error. What caused the memory leak?",
      "options": [
        "Three.js does not support ropes.",
        "GPU Buffer Allocation Leak: Creating a new BufferAttribute every frame allocates a BRAND-NEW WebGL Buffer on the GPU without deleting the old one! Allocating 60 new GPU buffers per second rapidly leaks gigabytes of VRAM until the driver crashes! The correct approach is allocating the buffer ONCE, mutating its internal array in-place, and setting 'position.needsUpdate = true'.",
        "The rope had too many physics calculations.",
        "The browser window was closed."
      ],
      "answerIdx": 1,
      "debrief": "Never re-create BufferAttribute or BufferGeometry instances inside a render loop. Buffer allocation on the GPU is expensive and leaks VRAM unless explicitly disposed. Allocate the buffer once at maximum capacity, update existing array elements, and set 'needsUpdate = true'."
    },
    "quests": [
      {
        "id": "cg-m1-d17-q1",
        "name": "Indexed vs Non-Indexed Mesh VRAM Compression Math",
        "type": "concept",
        "desc": "Calculate exact byte savings for a 100x100 quad grid mesh using Uint16 index buffers versus duplicate triangle vertex attributes."
      },
      {
        "id": "cg-m1-d17-q2",
        "name": "GPU Buffer Allocation Leak Detector",
        "type": "detective",
        "desc": "Track WebGL buffer counts using renderer.info.memory.geometries to detect un-disposed BufferGeometry allocations."
      },
      {
        "id": "cg-m1-d17-q3",
        "name": "Procedural Dynamic Ribbon & Wave Mesh in Three.js",
        "type": "mastery",
        "desc": "Implement a high-performance procedural mesh updating 5,000 vertices in-place with dynamic normal recomputation and draw ranges."
      },
      {
        "id": "cg-m1-d17-q4",
        "name": "3 AM SRE: Memory Leak in Real-Time 3D Telemetry Graph",
        "type": "incident",
        "desc": "Fix a production monitoring dashboard where recreating BufferGeometry every second crashed browser tabs during 24-hour monitoring shifts."
      }
    ]
  },
  {
    "day": 18,
    "month": 1,
    "blockNum": 4,
    "title": "Materials & Lighting in Three.js: MeshStandardMaterial, Directional, Point & Spot Lights",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Lighting Architecture (Material Models & Lighting Topologies)",
    "spokenGoal": "Illuminate the 3D scene with physical accuracy: master Three.js Materials and Lighting. Compare material models: unlit `MeshBasicMaterial`, gouraud-shaded `MeshLambertMaterial`, shiny `MeshPhongMaterial`, and the physically accurate `MeshStandardMaterial` and `MeshPhysicalMaterial`. Master light sources: AmbientLight (omnidirectional base color), DirectionalLight (parallel rays simulating sunlight), PointLight (omnidirectional light with inverse-square distance decay), and SpotLight (cone angle and penumbra). Tune PBR properties: metalness (dielectric vs metal), roughness (mirror vs matte), and clearcoat.",
    "conceptInvariant": "Physical Light Attenuation Invariant: In physically accurate rendering, point and spot light intensity must decay with the inverse square of the distance (decay = 2.0); setting linear decay (decay = 1.0) violates conservation of energy and washes out scene illumination.",
    "failureMode": "Adding 25 PointLights to a Three.js scene with MeshStandardMaterial; each light forces another calculation pass across all forward-rendered meshes, driving shader instruction count to thousands and collapsing mobile frame rates to 5 FPS.",
    "tryItFriction": "Construct a Multi-Light PBR Studio Scene in Three.js: set up a 3-point lighting rig (Key Directional Light, Fill Point Light with decay=2, Back Spot Light with soft penumbra); create a metallic sphere and a rough dielectric sphere; configure tone mapping (`renderer.toneMapping = THREE.ACESFilmicToneMapping`); and adjust light exposure.",
    "socraticHints": [
      "Why does a metallic material (metalness = 1.0) look completely black in Three.js if there is no environment map or directional light?",
      "Because true metals have ZERO diffuse reflection! They reflect light purely through specular mirror reflections! If there is no environment map or bright light to reflect, a metal surface reflects only black emptiness!",
      "Always provide an environment map (IBL) when using high metalness."
    ],
    "situationalPuzzle": {
      "scenario": "A 3D configurator renders a red car body using MeshStandardMaterial. The 3D artist complains: 'The red color looks washed-out, pastel, and faded, even though the hex color is #FF0000.' The developer adds more lights, but it only gets brighter and more washed-out. What color management setting in Three.js was overlooked?",
      "options": [
        "The monitor is broken.",
        "Color Space Misalignment (Linear vs sRGB): Three.js renders in Linear-sRGB color space. If 'renderer.outputColorSpace' is not set to 'THREE.SRGBColorSpace', or texture colors are not flagged with 'texture.colorSpace = THREE.SRGBColorSpace', the browser outputs linear values directly to an sRGB display, causing severe gamma washout! Enabling sRGB color space restores deep, vibrant, rich reds.",
        "MeshStandardMaterial cannot render red.",
        "Red light requires 120Hz."
      ],
      "answerIdx": 1,
      "debrief": "Color management is critical in 3D graphics. GPUs calculate lighting in linear color space to maintain correct mathematics, but displays expect gamma-corrected sRGB output. Configuring 'renderer.outputColorSpace = THREE.SRGBColorSpace' ensures correct gamma conversion and prevents washed-out pastel renders."
    },
    "quests": [
      {
        "id": "cg-m1-d18-q1",
        "name": "Inverse-Square Light Attenuation Formula Derivation",
        "type": "concept",
        "desc": "Derive the mathematical formula for light intensity falloff I = I0 / (1 + distance^2) and compare against linear decay."
      },
      {
        "id": "cg-m1-d18-q2",
        "name": "Forward Rendering Multi-Light Performance Profiler",
        "type": "detective",
        "desc": "Measure GPU fragment shader cycle cost when adding 1 to 20 concurrent dynamic point lights in forward-rendered Three.js."
      },
      {
        "id": "cg-m1-d18-q3",
        "name": "Physically Based 3-Point Lighting Studio Rig",
        "type": "mastery",
        "desc": "Build an interactive Three.js lighting studio with Key, Fill, and Rim lights, ACES Filmic tone mapping, and sRGB color calibration."
      },
      {
        "id": "cg-m1-d18-q4",
        "name": "3 AM SRE: Washed-Out Colors on E-Commerce Luxury Product Launch",
        "type": "incident",
        "desc": "Resolve a high-visibility marketing bug where luxury leather handbags appeared faded and chalky due to unconfigured sRGB output color space."
      }
    ]
  },
  {
    "day": 19,
    "month": 1,
    "blockNum": 4,
    "title": "Shadow Map Mathematics: Shadow Cameras, Bias, PCF Filtering & Peter Panning Artifacts",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Shadow Architecture (Shadow Mapping Algorithms & Depth Artifact Elimination)",
    "spokenGoal": "Cast realistic shadows in 3D space: master Shadow Map Mathematics. Understand how the GPU creates shadows: a two-pass rendering pipeline. Pass 1: Render the entire scene from the light's point of view into an off-screen depth texture (the Shadow Map). Pass 2: Render the scene from the camera's point of view, transform every fragment into the light's clip space, and compare the fragment's depth against the depth stored in the shadow map! Confront the two classic shadow bugs: Shadow Acne (false self-shadowing moire bands) and Peter Panning (shadows detaching from feet). Master Shadow Bias, Normal Bias, and Percentage-Closer Filtering (PCF).",
    "conceptInvariant": "Shadow Bias Equilibrium Invariant: Shadow bias must be set large enough to eliminate shadow acne caused by depth quantization, but small enough to prevent 'Peter Panning' (the physical detachment of a shadow from the base of an object); normal bias must be preferred over constant depth bias.",
    "failureMode": "Setting shadow.bias = 0.05 to eliminate acne on a 3D character; the massive bias pushes the shadow 10 centimeters away, making the character appear to float in mid-air (Peter Panning).",
    "tryItFriction": "Configure High-Quality Shadows in Three.js in TypeScript: enable 'renderer.shadowMap.enabled = true'; set shadowMap.type to 'THREE.PCFSoftShadowMap'; configure a DirectionalLight with tight shadow camera frustum bounds (left, right, top, bottom); adjust shadow.bias and shadow.normalBias to achieve glitch-free contact shadows under a 3D character's feet.",
    "socraticHints": [
      "What is 'Shadow Acne' and why does it occur?",
      "Shadow Acne happens because the shadow map resolution is finite! A single shadow map texel covers a slope of multiple fragments. Half the fragments end up slightly BEHIND the depth stored in the shadow texel, causing the surface to falsely shadow itself in ugly striped bands!",
      "Applying a tiny normalBias pushes the depth test outward along the surface normal, eliminating acne."
    ],
    "situationalPuzzle": {
      "scenario": "A 3D open-world game features a 2048x2048 shadow map on the main sun DirectionalLight. The shadows look extremely blocky and pixelated, with jagged staircase edges. The developer suggests: 'Upgrade the shadow map to 16384x16384!' Why does a 16K shadow map crash mobile devices, and what camera technique fixes shadow resolution without increasing texture size?",
      "options": [
        "16K textures are illegal on the web.",
        "Frustum Tightly Bounded Tuning vs Cascaded Shadow Maps: A 16K depth texture consumes 1GB of VRAM and destroys fill rate! The shadows are blocky because the light's shadow camera frustum covers a gigantic 1,000-meter area. By tightening the light's shadow camera bounds (left, right, top, bottom) to wrap tightly around ONLY the visible player area, all 2048 texels concentrate where the player looks, yielding razor-sharp shadows with zero extra VRAM!",
        "Disable shadows to save electricity.",
        "Directional lights do not cast shadows."
      ],
      "answerIdx": 1,
      "debrief": "Shadow map resolution is directly tied to the physical area covered by the light's projection frustum. Fitting the shadow camera tightly to the active viewing zone maximizes texel density per square meter, producing sharp shadows without blowing VRAM budgets on massive textures."
    },
    "quests": [
      {
        "id": "cg-m1-d19-q1",
        "name": "Percentage-Closer Filtering (PCF) Kernel Formulation",
        "type": "concept",
        "desc": "Explain how PCF averages multiple depth comparison results across a 3x3 or 5x5 sampling kernel to produce soft penumbra shadow edges."
      },
      {
        "id": "cg-m1-d19-q2",
        "name": "Shadow Acne vs Peter Panning Bias Profiler",
        "type": "detective",
        "desc": "Plot shadow detachment distance and surface acne frequency as a function of depth bias and normal bias on curved geometry."
      },
      {
        "id": "cg-m1-d19-q3",
        "name": "Optimized DirectionalLight Shadow Rig in Three.js",
        "type": "mastery",
        "desc": "Build an automated shadow camera manager in Three.js that dynamically fits light orthographic bounds to the active camera frustum."
      },
      {
        "id": "cg-m1-d19-q4",
        "name": "3 AM SRE: Floating Avatars in Virtual Metaverse Auditorium",
        "type": "incident",
        "desc": "Resolve a high-visibility virtual world bug where excessive shadow bias made 500 audience avatars appear to levitate off the floor."
      }
    ]
  },
  {
    "day": 20,
    "month": 1,
    "blockNum": 4,
    "title": "Milestone 4: Three.js Interactive Scene Graph & Dynamic Shadow Engine",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Production Capstone (Scene Graphs, Lighting & Dynamic Shadows)",
    "spokenGoal": "Architect, construct, and defend Milestone 4: the Three.js Interactive Scene Graph & Dynamic Shadow Engine. Build a production-grade 3D environment in TypeScript using Three.js. Architect a complex hierarchical scene graph (animated characters, vehicles with rotating wheels, interactive buildings); implement a 3-point PBR lighting rig with tightly bounded directional shadow maps; configure PCFSoftShadowMap with calibrated normal bias for zero shadow acne and zero Peter Panning; maintain 60 FPS performance; and integrate orbit camera controls with smooth damping.",
    "conceptInvariant": "Shadow Frustum Optimization Invariant: The directional shadow camera frustum must dynamically encompass strictly the active scene bounding box, guaranteeing maximum shadow texel density and zero floating-point depth waste across all camera zoom levels.",
    "failureMode": "Failing the milestone defense when the evaluator pans the camera across the scene, and shadows vanish or flicker violently due to loose shadow camera clipping planes and unhandled matrix updates.",
    "tryItFriction": "Compile and run Milestone 4: render an interactive 3D architectural scene with moving mechanical elements; cast crisp, soft shadows from an animated crane onto the ground; toggle between day and night lighting rigs; and verify that CPU frame time remains < 5ms and GPU frame time < 10ms.",
    "socraticHints": [
      "Why should you use 'OrbitControls.enableDamping = true' in interactive 3D web applications?",
      "Damping adds physical inertia to camera movement! Instead of camera rotation stopping abruptly the microsecond the user lifts their mouse, damping smoothly decelerates the camera, creating a silky, high-end production feel!",
      "Remember to call controls.update() inside the animation loop when damping is enabled."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 4 evaluation, the evaluator inspects your Three.js render loop: 'function animate() { requestAnimationFrame(animate); crane.rotation.y += 0.01; renderer.render(scene, camera); }'. The evaluator asks: 'What happens to the crane's rotation speed on a 144Hz gaming monitor compared to a 60Hz office laptop?' What is the critical timing defect?",
      "options": [
        "The crane rotates at the same speed.",
        "Frame-Rate Dependent Animation Defect: On a 60Hz monitor, requestAnimationFrame fires 60 times/sec (rotation = 0.6 rad/s). On a 144Hz monitor, it fires 144 times/sec (rotation = 1.44 rad/s)! The crane spins more than TWICE as fast on high-refresh displays! The fix is Delta-Time scaling using THREE.Clock: 'const delta = clock.getDelta(); crane.rotation.y += speed * delta;'.",
        "Three.js automatically caps all monitors to 60Hz.",
        "Gaming monitors cannot render Three.js."
      ],
      "answerIdx": 1,
      "debrief": "Never update animations using fixed per-frame increments. Frame rates vary from 30Hz on low-end phones to 144Hz+ on gaming monitors. Multiplying velocities by delta time (seconds elapsed since last frame) guarantees identical, deterministic physical speeds on all screens."
    },
    "quests": [
      {
        "id": "cg-m1-d20-q1",
        "name": "Delta-Time Frame-Rate Independent Kinematics Formulation",
        "type": "concept",
        "desc": "Prove algebraically that integrating velocity with variable delta time yields identical spatial trajectory displacement across 30, 60, and 120 FPS."
      },
      {
        "id": "cg-m1-d20-q2",
        "name": "Shadow Camera Frustum Bounding Box Tightener",
        "type": "detective",
        "desc": "Use CameraHelper to visualize shadow camera frustum bounds and optimize orthographic extents to match scene geometry."
      },
      {
        "id": "cg-m1-d20-q3",
        "name": "Interactive Scene Graph & Dynamic Shadow Engine Build",
        "type": "mastery",
        "desc": "Implement the complete Three.js application featuring multi-level hierarchical node animation, soft PCF shadows, and delta-timed kinematics."
      },
      {
        "id": "cg-m1-d20-q4",
        "name": "Milestone 4 Defense: Refresh Rate & Shadow Frustum Chaos Lab",
        "type": "incident",
        "desc": "Defend the Three.js engine before a senior evaluator panel under simulated 144Hz display rates and aggressive shadow camera zoom-ins."
      }
    ]
  },

  # =========================================================================
  # BLOCK 5: PHYSICALLY BASED RENDERING (PBR) & ADVANCED LIGHTING (Days 21-25)
  # =========================================================================
  {
    "day": 21,
    "month": 1,
    "blockNum": 5,
    "title": "Physically Based Rendering (PBR) Physics: The Cook-Torrance Microfacet Model & Energy Conservation",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Advanced Shading Architecture (PBR Theory & Cook-Torrance BRDF)",
    "spokenGoal": "Understand how Pixar, Unreal Engine, and modern AAA games achieve photorealism: master Physically Based Rendering (PBR). Deconstruct the physics of light-matter interaction: the Law of Conservation of Energy (a surface can never reflect more light than it receives: Diffuse + Specular <= 1.0). Explore the Bidirectional Reflectance Distribution Function (BRDF). Master the Cook-Torrance Microfacet specular model: modeling rough surfaces as collections of microscopic optical mirrors (microfacets). Analyze the metallic vs dielectric workflow: why non-metals have colored diffuse and white specular reflection, while metals have zero diffuse reflection and tint specular highlights with their base color.",
    "conceptInvariant": "Energy Conservation Invariant: In physically based rendering, the sum of diffuse reflection energy and specular reflection energy must never exceed the incoming light irradiance: kD * diffuse + kS * specular <= 1.0, where kD = (1.0 - kS) * (1.0 - metallic).",
    "failureMode": "Adding diffuse and specular light components together in a custom shader without energy conservation; adding bright highlights causes surfaces to emit more light than hits them, creating blown-out white radioactive glow artifacts.",
    "tryItFriction": "Implement the Cook-Torrance BRDF formulation in a custom GLSL fragment shader: calculate diffuse Lambertian reflection; calculate the Cook-Torrance specular term; enforce energy conservation using the Fresnel term (kS) to scale the remaining diffuse light (kD); and render photorealistic metallic and dielectric spheres.",
    "socraticHints": [
      "Why do conductors (metals) have zero diffuse reflection in the PBR metallic-roughness model?",
      "Because metals have free conduction electrons! Any light that penetrates into the metal is immediately absorbed by electrons—none of it scatters back out as diffuse light! All light that escapes is reflected directly off the surface as specular reflection!",
      "Dielectrics (plastics, wood, stone) absorb little light, allowing it to scatter sub-surface and re-emerge as diffuse color."
    ],
    "situationalPuzzle": {
      "scenario": "A graphics programmer builds a custom PBR shader. On a plastic red ball (metallic=0.0, baseColor=red), the highlight from a white light bulb appears pink/red. The art director complains that real plastic reflects the white light bulb as a crisp WHITE highlight, not red. What mistake was made in the specular color calculation?",
      "options": [
        "The light bulb was colored red.",
        "Dielectric Specular Tint Error: Dielectrics (non-metals, metallic=0) have monochromatic specular reflectance (F0 ~ 0.04 across all wavelengths). Their specular highlights reflect the exact color of the incoming LIGHT (white), completely independent of the base material color! Only metals (metallic=1) tint their specular highlights with their base albedo color. Multiplying dielectric specular by base color is physically incorrect!",
        "Plastic does not have specular highlights.",
        "The red ball requires a normal map."
      ],
      "answerIdx": 1,
      "debrief": "Dielectric surfaces (plastics, ceramics, skin, liquids) have constant, untinted specular reflectance (~0.04) that reflects the light's color directly without tint. Only metals tint specular reflections with their base color."
    },
    "quests": [
      {
        "id": "cg-m1-d21-q1",
        "name": "Cook-Torrance Specular BRDF Mathematical Formulation",
        "type": "concept",
        "desc": "Deconstruct the Cook-Torrance equation: f_specular = (D * G * F) / (4 * (N &bull; V) * (N &bull; L)) and derive each term's physical role."
      },
      {
        "id": "cg-m1-d21-q2",
        "name": "PBR Energy Conservation Violation Profiler",
        "type": "detective",
        "desc": "Calculate total reflected radiance across hemisphere angles to detect shaders where kD + kS exceeds 1.0."
      },
      {
        "id": "cg-m1-d21-q3",
        "name": "Custom Cook-Torrance PBR Shader in GLSL",
        "type": "mastery",
        "desc": "Implement a pure GLSL 3.00 es fragment shader executing the complete Cook-Torrance BRDF with roughness and metalness uniforms."
      },
      {
        "id": "cg-m1-d21-q4",
        "name": "3 AM SRE: Radioactive Glow Artifact in Virtual Car Configurator",
        "type": "incident",
        "desc": "Resolve a high-profile visual defect where metallic car paint blew out into blinding white pixels under multi-light showroom setups."
      }
    ]
  },
  {
    "day": 22,
    "month": 1,
    "blockNum": 5,
    "title": "Microfacet Distribution (GGX), Geometric Shadowing (Smith) & Schlick's Fresnel",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Advanced Mathematical Shading (D, G, F Terms of the PBR Pipeline)",
    "spokenGoal": "Dissect the three mathematical pillars of the Cook-Torrance BRDF: D, G, and F terms. 1) The Normal Distribution Function (D-Term: Trowbridge-Reitz / GGX): calculating the statistical fraction of microfacets exactly aligned with the halfway vector H, producing realistic specular lobes with long, soft falloff tails. 2) The Geometry Function (G-Term: Smith's Schlick-GGX): calculating the probability that microfacets shadow or occlude each other at grazing angles. 3) The Fresnel Equation (F-Term: Schlick's approximation): calculating the percentage of light reflected versus refracted based on the viewing angle.",
    "conceptInvariant": "GGX Microfacet Alignment Invariant: The GGX normal distribution function D(H) models microfacet slope orientation; as roughness approaches zero, D(H) approaches an infinite Dirac delta spike (mirror reflection); as roughness approaches 1, microfacets scatter uniformly across the entire hemisphere.",
    "failureMode": "Allowing roughness to reach exactly 0.0 in the GGX formula: alpha = roughness^2 = 0.0; the denominator (pi * (N&bull;H * (alpha^2 - 1) + 1)^2) evaluates to zero, causing division-by-zero NaNs that turn the entire screen into black pixels.",
    "tryItFriction": "Implement the complete D, G, and F functions in GLSL: code DistributionGGX(), GeometrySmith(), and FresnelSchlick(); clamp roughness to a minimum safe epsilon (0.001) to eliminate division by zero; and render a grid of 25 spheres sweeping across Roughness (0.0 to 1.0) and Metalness (0.0 to 1.0).",
    "socraticHints": [
      "Why is alpha defined as 'roughness * roughness' in the GGX distribution instead of just using raw roughness directly?",
      "Pioneered by Disney in their Principled BRDF: human perception of roughness is non-linear! Squaring the roughness parameter makes the visual transition of the specular highlight feel significantly more linear and intuitive to 3D artists!",
      "It spreads specular sharpness evenly across the 0.0 to 1.0 slider range."
    ],
    "situationalPuzzle": {
      "scenario": "A graphics engineer notices that when viewing a 3D sphere from a steep grazing angle (looking at the extreme outer silhouette), the GGX specular highlight dims to completely black instead of remaining bright. The shader calculates the Cook-Torrance denominator as: '4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0)'. When dot(N, V) approaches 0.0, the calculation explodes. What is the standard numerical safeguard?",
      "options": [
        "Disable grazing angle rendering.",
        "Denominator Epsilon Clamping: At grazing angles, dot(N, V) approaches 0.0, causing the Cook-Torrance denominator to divide by near-zero! Graphics engines add a small epsilon: 'max(4.0 * dot(N, V) * dot(N, L), 0.0001)'. Furthermore, Smith's geometry function naturally cancels out the N&bull;V and N&bull;L terms in the denominator when implemented in its height-correlated form!",
        "Multiply the denominator by 100.",
        "Change the camera FOV."
      ],
      "answerIdx": 1,
      "debrief": "Numerical stability is vital in real-time shaders. At grazing angles, dot(N, V) approaches zero. Clamping the denominator to a tiny epsilon (0.0001) or using the height-correlated Smith-GGX formulation prevents division-by-zero explosions."
    },
    "quests": [
      {
        "id": "cg-m1-d22-q1",
        "name": "Trowbridge-Reitz GGX Normal Distribution Derivation",
        "type": "concept",
        "desc": "Derive the mathematical formula D(H) = alpha^2 / (pi * ((N&bull;H)^2 * (alpha^2 - 1) + 1)^2) and prove normalization over the hemisphere."
      },
      {
        "id": "cg-m1-d22-q2",
        "name": "Smith Geometric Masking-Shadowing Error Disassembler",
        "type": "detective",
        "desc": "Trace how Smith's separable vs height-correlated formulations affect energy loss at extreme grazing angles."
      },
      {
        "id": "cg-m1-d22-q3",
        "name": "25-Sphere PBR Roughness-Metalness Matrix Showcase",
        "type": "mastery",
        "desc": "Build an interactive WebGL 2.0 demo rendering a 5x5 matrix of spheres varying from 0.0 to 1.0 in roughness and metalness."
      },
      {
        "id": "cg-m1-d22-q4",
        "name": "3 AM SRE: Division-by-Zero NaN Blackout in Mobile PBR Viewport",
        "type": "incident",
        "desc": "Triage an emergency incident where setting roughness=0 on a polished gold watch model turned all pixels pitch black due to NaN propagation."
      }
    ]
  },
  {
    "day": 23,
    "month": 1,
    "blockNum": 5,
    "title": "Image-Based Lighting (IBL): Radiance Environment Maps, Irradiance Maps & HDR Pipelines",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Photorealistic Environment Lighting (Image-Based Lighting & Split-Sum Approximation)",
    "spokenGoal": "Light objects with the rich complexity of real-world photography: master Image-Based Lighting (IBL). Understand why direct lights alone look artificial: real objects are bathed in ambient light bouncing from every angle of the surrounding environment! Deconstruct Epic Games' Split-Sum Approximation for real-time IBL: 1) Diffuse Irradiance Map (pre-convolving the HDR environment into a blurry map representing total incoming ambient light from the hemisphere); 2) Pre-filtered Specular Radiance Map (storing the environment at varying blur levels inside successive Mipmap levels, where Mip 0 = mirror reflection and Mip 5 = rough matte reflection); and 3) The 2D BRDF Integration LUT (pre-calculating Fresnel and geometric attenuation).",
    "conceptInvariant": "Split-Sum Independence Invariant: Real-time Image-Based Lighting splits the rendering equation integral into two independent pre-computed lookups: the pre-filtered radiance environment map (sampled based on reflection direction and roughness) multiplied by the 2D BRDF LUT (sampled by N&bull;V and roughness).",
    "failureMode": "Sampling an SDR (Standard Dynamic Range, 8-bit PNG) environment map for IBL instead of an HDR/EXR floating-point map; the maximum brightness is clamped to 1.0, making the sun look as dim as a lightbulb and destroying realistic specular glints.",
    "tryItFriction": "Integrate an HDR Environment Map (.hdr / RGBE format) into Three.js: load the HDR file using RGBELoader; convert to a pre-filtered radiance cubemap using PMREMGenerator (Prefiltered Mipmapped Radiance Environment Map); assign to scene.environment; and observe photorealistic reflections on polished metal and matte plastic.",
    "socraticHints": [
      "Why must environment maps for lighting be stored in High Dynamic Range (HDR) floating-point formats rather than standard PNGs?",
      "Because real-world physical light spans massive dynamic ranges! The sun is tens of thousands of times brighter than a white wall! An 8-bit PNG clamps all values to [0, 255] (1.0), destroying the intense contrast needed to create blinding specular highlights!",
      "HDR/EXR formats store true physical floating-point radiance values (> 100.0)."
    ],
    "situationalPuzzle": {
      "scenario": "A 3D developer loads a 40MB raw 8K .hdr environment map directly into Three.js on every page load. On mobile phones, loading takes 12 seconds and frequently crashes with memory allocation errors. What is the standard production asset pipeline optimization for IBL environment maps?",
      "options": [
        "Delete the background completely.",
        "Offline Pre-Filtering to KTX2 / PMREM Downsampling: Never ship raw 8K uncompressed HDR files to web clients! Downscale the environment map to 1K or 2K (ambient lighting does not need 8K pixel detail). Pre-filter the radiance and irradiance cubemaps offline into compressed KTX2 Basis Universal cubemaps, reducing file size from 40MB down to < 1.5MB and eliminating runtime PMREM generation delay!",
        "Convert the HDR file into a low-quality GIF.",
        "Mobile phones do not support lighting."
      ],
      "answerIdx": 1,
      "debrief": "Shipping massive raw HDR files to mobile web browsers destroys performance. Downscaling HDR maps to 1K/2K and pre-filtering them into compressed KTX2 cubemaps delivers identical lighting quality at a fraction of the network bandwidth and zero runtime GPU pre-filtering latency."
    },
    "quests": [
      {
        "id": "cg-m1-d23-q1",
        "name": "Epic Games Split-Sum IBL Integral Approximation Derivation",
        "type": "concept",
        "desc": "Derive the mathematical split of the radiance integral into pre-filtered environment map and 2D BRDF integration LUT."
      },
      {
        "id": "cg-m1-d23-q2",
        "name": "PMREM Roughness Mipmap Interpolation Profiler",
        "type": "detective",
        "desc": "Inspect cubemap mip levels in Three.js PMREMGenerator to verify that roughness smoothly maps from Mip 0 to Mip N."
      },
      {
        "id": "cg-m1-d23-q3",
        "name": "HDR Image-Based Lighting Pipeline in Three.js",
        "type": "mastery",
        "desc": "Implement an end-to-end IBL pipeline loading RGBE HDR maps, generating PMREM cubemaps, and tuning environment intensity."
      },
      {
        "id": "cg-m1-d23-q4",
        "name": "3 AM SRE: 40MB Raw HDR Asset Causes Mobile Out-of-Memory Crashes",
        "type": "incident",
        "desc": "Resolve a mobile e-commerce launch disaster where uncompressed 8K HDR environment maps triggered mobile browser tab crashes."
      }
    ]
  },
  {
    "day": 24,
    "month": 1,
    "blockNum": 5,
    "title": "Post-Processing Pipelines: Framebuffers (FBO), Tone Mapping (ACES Filmic) & Bloom Shaders",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Cinematic Rendering & Framebuffer Architecture (Post-Processing & Tone Mapping)",
    "spokenGoal": "Give your 3D scenes cinematic Hollywood visual quality: master Post-Processing Pipelines and Framebuffer Objects (FBO). Understand off-screen rendering: instead of rendering directly to the screen, render the 3D scene into an off-screen Framebuffer texture. Feed that texture into full-screen 2D image processing shaders: 1) Tone Mapping (ACES Filmic: mapping high-dynamic range values > 1.0 down to displayable [0,1] screen values with rich contrast and highlight roll-off); 2) Unreal Bloom (extracting bright highlights, downsampling through a Gaussian blur pyramid, and additive blending to create realistic lens glow); and 3) Color Grading.",
    "conceptInvariant": "Linear-Space Post-Processing Invariant: All lighting calculations and post-processing passes (bloom, blur, depth of field) must operate in Linear Color Space; Tone Mapping and Gamma Correction (sRGB conversion) must strictly be applied as the very final pass before writing to the physical screen.",
    "failureMode": "Applying Bloom after Tone Mapping and Gamma Correction; the non-linear sRGB colors distort the blur mathematics, causing blown-out neon halos and muddy, saturated artifacts.",
    "tryItFriction": "Construct a Custom Post-Processing Pipeline in Three.js using EffectComposer: render a glowing neon sci-fi scene into an HDR render target (HalfFloatType); add UnrealBloomPass with configurable threshold and radius; apply ACESFilmicToneMapping; and observe intense glowing highlights with cinematic color grading.",
    "socraticHints": [
      "Why is ACES Filmic Tone Mapping vastly superior to simple Reinhard Tone Mapping (color / (color + 1.0))?",
      "Reinhard compresses brightness but desaturates colors and turns bright highlights into a dull, flat gray! ACES Filmic mimics real photographic celluloid film: it preserves rich color saturation in midtones and produces a gorgeous, smooth highlight roll-off into warm whites!",
      "It makes 3D scenes look cinematic rather than clinical."
    ],
    "situationalPuzzle": {
      "scenario": "A 3D developer implements Unreal Bloom on an off-screen render target in Three.js. However, the 3D scene has anti-aliasing disabled. The glowing objects have ugly jagged stair-stepped edges that glow intensely. The developer tries setting 'antialias: true' on the WebGLRenderer, but the off-screen render target still has zero anti-aliasing! Why didn't renderer.antialias fix the render target?",
      "options": [
        "Bloom disables anti-aliasing.",
        "Off-Screen Render Target MSAA Isolation: The browser's native hardware Multi-Sample Anti-Aliasing (MSAA) only applies to the DEFAULT canvas framebuffer! When rendering to an off-screen WebGLRenderTarget (FBO), hardware MSAA is bypassed by default. The fix is configuring WebGLRenderTarget with 'samples: 4' (WebGL 2.0 Multisampled Renderbuffers) or adding an FXAA / SMAA post-processing pass!",
        "Three.js does not support anti-aliasing.",
        "The monitor resolution was too low."
      ],
      "answerIdx": 1,
      "debrief": "Native canvas anti-aliasing does not automatically propagate to off-screen Framebuffer Objects (FBOs). In WebGL 2.0, off-screen render targets must explicitly enable multisampling ('samples: 4') or apply a screen-space anti-aliasing shader (FXAA / SMAA) in the post-processing stack."
    },
    "quests": [
      {
        "id": "cg-m1-d24-q1",
        "name": "ACES Filmic Tone Mapping S-Curve Mathematical Formulation",
        "type": "concept",
        "desc": "Derive the rational polynomial approximation of the ACES S-curve: f(x) = (x*(a*x+b)) / (x*(c*x+d)+e) and analyze highlight rolloff."
      },
      {
        "id": "cg-m1-d24-q2",
        "name": "Dual-Filtering Progressive Bloom Pyramid Profiler",
        "type": "detective",
        "desc": "Measure GPU fill rate and memory bandwidth across successive 1/2, 1/4, 1/8 downsample/upsample blur passes."
      },
      {
        "id": "cg-m1-d24-q3",
        "name": "Cinematic EffectComposer Post-Processing Pipeline",
        "type": "mastery",
        "desc": "Build a modular Three.js post-processing stack with MSAA render targets, Unreal Bloom, vignette, and ACES tone mapping."
      },
      {
        "id": "cg-m1-d24-q4",
        "name": "3 AM SRE: Blown-Out Neon Artifacts in Virtual Concert Stream",
        "type": "incident",
        "desc": "Resolve a high-visibility live streaming bug where applying gamma correction before bloom created blinding, radioactive pixel blowouts."
      }
    ]
  },
  {
    "day": 25,
    "month": 1,
    "blockNum": 5,
    "title": "Milestone 5: Production Physically Based Rendering (PBR) & Post-Processing Engine",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Production Capstone (Full PBR Pipeline & Cinematic Post-Processing)",
    "spokenGoal": "Architect, construct, and defend Milestone 5: the Production Physically Based Rendering (PBR) & Post-Processing Engine. Build a photorealistic 3D showroom in TypeScript using Three.js and custom GLSL shaders. Feature high-detail 3D models with full PBR texture maps (Albedo, Normal, Roughness, Metalness, Ambient Occlusion), pre-filtered HDR Image-Based Lighting via PMREM, dynamic soft shadows with normal bias, and an off-screen post-processing pipeline integrating Multisample Anti-Aliasing (MSAA), Unreal Bloom, and ACES Filmic Tone Mapping at a rock-solid 60 FPS.",
    "conceptInvariant": "Photorealistic Coherence Invariant: The rendering pipeline must maintain strict physical energy conservation and linear-space color accuracy from texture sampling through IBL reflections and post-processing, producing photorealistic results across all lighting conditions.",
    "failureMode": "Failing the milestone defense when the evaluator increases bloom intensity and the framerate drops from 60 FPS to 25 FPS due to allocating un-downsampled full-resolution blur buffers on an integrated GPU.",
    "tryItFriction": "Deploy and test Milestone 5: interact with a luxury sports car model in the 3D showroom; rotate the HDR environment map; tweak material roughness and metalness live; toggle post-processing bloom on and off; and demonstrate that GPU frame time remains < 12 milliseconds on standard laptops.",
    "socraticHints": [
      "Why is Ambient Occlusion (AO) still necessary in a Physically Based Rendering pipeline with Image-Based Lighting?",
      "Because pre-filtered environment maps assume open, un-occluded space! Under car wheels, inside creases, and between adjacent fingers, ambient light cannot physically reach the surface! The Ambient Occlusion map attenuates diffuse ambient light in crevices, adding vital depth and grounded realism.",
      "Without AO, objects appear to float without physical contact."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 5 defense, the evaluator inspects your post-processing pipeline. When bloom is turned on, the text in the 2D UI overlay (HTML/Canvas drawn over the 3D viewport) glows and becomes unreadable. The evaluator asks: 'How do you prevent 2D UI elements from being blurred and bloomed by the 3D post-processing pipeline?' What is the correct architectural pattern?",
      "options": [
        "Make all UI text black.",
        "Render Pipeline Pass Ordering / UI Layer Separation: Post-processing must be applied strictly to the 3D scene framebuffer FIRST! The 2D UI overlay must be rendered in a separate pass AFTER all post-processing effects (bloom, tone mapping, blur) have completed, compositing the crisp UI directly onto the final screen canvas (or using an HTML DOM overlay entirely outside WebGL).",
        "Turn off bloom.",
        "UI text cannot coexist with 3D graphics."
      ],
      "answerIdx": 1,
      "debrief": "2D UI elements and text must never pass through 3D post-processing pipelines. Separating the rendering into an off-screen 3D pass (with bloom/tone mapping) and compositing UI elements in a clean final overlay pass ensures UI elements remain sharp, legible, and uncorrupted."
    },
    "quests": [
      {
        "id": "cg-m1-d25-q1",
        "name": "Complete PBR & Post-Processing Pipeline Architecture Blueprint",
        "type": "concept",
        "desc": "Produce the comprehensive multi-pass rendering blueprint detailing G-Buffer/Render Targets, IBL sampling, Bloom downsampling, and final composite."
      },
      {
        "id": "cg-m1-d25-q2",
        "name": "Post-Processing VRAM Allocation & Fill-Rate Profiler",
        "type": "detective",
        "desc": "Measure total GPU memory bandwidth and render target allocations across multiple EffectComposer post-processing passes."
      },
      {
        "id": "cg-m1-d25-q3",
        "name": "Production PBR Showroom & Bloom Engine Build",
        "type": "mastery",
        "desc": "Implement the complete photorealistic 3D showroom in TypeScript with full PBR materials, HDR IBL reflections, and ACES tone mapping."
      },
      {
        "id": "cg-m1-d25-q4",
        "name": "Milestone 5 Defense: Extreme Lighting & Performance Chaos Lab",
        "type": "incident",
        "desc": "Defend the PBR engine before a senior evaluator panel under simulated multi-light stress testing, bloom saturation, and mobile GPU emulation."
      }
    ]
  },

  # =========================================================================
  # BLOCK 6: PERFORMANCE OPTIMIZATION, WEBGPU & MONTH 1 CAPSTONE (Days 26-30)
  # =========================================================================
  {
    "day": 26,
    "month": 1,
    "blockNum": 6,
    "title": "3D Graphics Performance Profiling: Draw Calls, VRAM Leaks & InstancedMesh Optimization",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "High-Scale Rendering Optimization (GPU Instancing & VRAM Lifecycle)",
    "spokenGoal": "Render 50,000 animated objects at 60 FPS: master GPU Instancing and WebGL Performance Profiling. Understand why traditional draw loops die: calling `scene.add(mesh)` 10,000 times creates 10,000 separate draw calls that choke the CPU driver. Master `THREE.InstancedMesh`: rendering tens of thousands of identical geometries with distinct positions, rotations, colors, and scales in a SINGLE draw call using hardware instanced vertex attributes (`gl.drawElementsInstanced`). Master the Three.js Memory Lifecycle: why removing an object from the scene does NOT free GPU memory, and implement recursive resource disposal (`geometry.dispose()`, `material.dispose()`, `texture.dispose()`).",
    "conceptInvariant": "GPU Resource Disposal Invariant: Removing an Object3D from the Three.js scene graph only severs JavaScript tree references; to free GPU VRAM, software must explicitly invoke 'dispose()' on all underlying Geometries, Materials, and Textures, otherwise VRAM remains permanently leaked.",
    "failureMode": "Repeatedly loading and unloading 3D models in an SPA without calling 'geometry.dispose()' and 'texture.dispose()'; after viewing 10 products, browser VRAM usage reaches 2.4GB and crashes the browser tab.",
    "tryItFriction": "Build an Instanced Forest in Three.js in TypeScript: create a single THREE.InstancedMesh with 20,000 tree instances; populate individual 4x4 transformation matrices in an InstancedBufferAttribute; animate wind sway using vertex shader instance offsets; and verify that total draw calls remain exactly 1 at 60 FPS.",
    "socraticHints": [
      "Why does 'scene.remove(mesh)' fail to free VRAM in Three.js?",
      "Because the WebGL buffers and textures allocated on the GPU reside in GPU memory independent of the scene graph! JavaScript garbage collection cannot communicate with the GPU driver to delete WebGL buffers!",
      "You must explicitly call mesh.geometry.dispose() and mesh.material.dispose() to trigger gl.deleteBuffer() and gl.deleteTexture()."
    ],
    "situationalPuzzle": {
      "scenario": "A 3D simulation renders 30,000 moving asteroids in space. An engineer creates 30,000 individual Mesh objects. The frame rate is 4 FPS. The engineer rewrites the code using a single THREE.InstancedMesh(geometry, material, 30000). The frame rate skyrockets from 4 FPS to 60 FPS immediately. How did InstancedMesh achieve a 15x performance multiplier with the exact same number of polygons?",
      "options": [
        "InstancedMesh makes asteroids smaller.",
        "Draw Call Consolidation & GPU Hardware Instancing: Instead of issuing 30,000 separate draw calls (which stalled the CPU with 30,000 driver context switches), InstancedMesh uploads an array of 30,000 transformation matrices into an instanced vertex buffer and issues a SINGLE draw call (gl.drawElementsInstanced). The GPU hardware duplicates the geometry across thousands of parallel cores instantly with near-zero CPU overhead!",
        "The GPU turned off physics.",
        "Asteroids do not require lighting."
      ],
      "answerIdx": 1,
      "debrief": "GPU Instancing is the ultimate weapon for rendering crowds, forests, particles, and repeated objects. Consolidating tens of thousands of individual draw calls into a single instanced draw call completely eliminates CPU driver bottlenecks."
    },
    "quests": [
      {
        "id": "cg-m1-d26-q1",
        "name": "GPU Instanced Vertex Attribute Memory Layout Math",
        "type": "concept",
        "desc": "Calculate byte stride and attribute divisor mechanics (glVertexAttribDivisor = 1) for instanced 4x4 matrix buffers."
      },
      {
        "id": "cg-m1-d26-q2",
        "name": "Recursive Three.js VRAM Memory Leak Detector",
        "type": "detective",
        "desc": "Implement a memory auditing function traversing the scene graph and tracking un-disposed textures and buffer geometries."
      },
      {
        "id": "cg-m1-d26-q3",
        "name": "50,000-Entity Instanced Asteroid Field Engine",
        "type": "mastery",
        "desc": "Develop a Three.js simulation rendering 50,000 dynamic moving asteroids using InstancedMesh with custom per-instance colors and matrices."
      },
      {
        "id": "cg-m1-d26-q4",
        "name": "3 AM SRE: 3D Product Catalog Out-of-Memory Tab Crashes",
        "type": "incident",
        "desc": "Triage a retail client's web app crashing after users browsed multiple 3D furniture models due to un-disposed texture buffers."
      }
    ]
  },
  {
    "day": 27,
    "month": 1,
    "blockNum": 6,
    "title": "Frustum Culling & Level of Detail (LOD): Bounding Volumes, Octrees & Distance Switching",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Spatial Partitioning & Scene Scalability (Frustum Culling & Dynamic LOD)",
    "spokenGoal": "Never render what the camera cannot see: master Frustum Culling and Level of Detail (LOD). Deconstruct the Camera View Frustum: 6 geometric clipping planes (Left, Right, Bottom, Top, Near, Far). Learn how the GPU tests object Bounding Volumes (Axis-Aligned Bounding Boxes - AABB and Bounding Spheres) against the 6 frustum planes to discard off-screen meshes before issuing draw calls. Implement hierarchical spatial partitioning using Octrees (recursively subdividing 3D space into 8 octants to accelerate visibility testing from O(N) to O(log N)). Master Level of Detail (`THREE.LOD`): rendering high-poly meshes up close (50,000 tris) and swapping to low-poly models (500 tris) at a distance.",
    "conceptInvariant": "Camera Frustum Rejection Invariant: Any 3D object whose bounding volume resides entirely outside the negative half-space of any of the 6 camera frustum planes must be immediately culled from the draw list, preventing wasted vertex transformations on off-screen geometry.",
    "failureMode": "Disabling frustum culling ('mesh.frustumCulled = false') across an entire 100,000-building virtual city; even when looking at a blank wall, the GPU transforms 50,000,000 vertices of the city behind the camera, dropping frame rate to 8 FPS.",
    "tryItFriction": "Implement an Automated Dynamic LOD System in Three.js in TypeScript: create 3 meshes for a 3D asset (High: 20k tris, Med: 4k tris, Low: 300 tris); add them to a THREE.LOD object with distance thresholds (0m, 25m, 75m); populate a massive terrain; fly the camera through the scene; and prove that polygon count drops by 85% with zero perceptible visual degradation.",
    "socraticHints": [
      "Why is testing a Bounding Sphere against the 6 frustum planes significantly faster than testing an Axis-Aligned Bounding Box (AABB)?",
      "Because testing a Bounding Sphere requires only calculating the dot product distance from the sphere center to the plane and comparing with the radius (1 dot product per plane)! An AABB requires testing 8 corner vertices against the plane!",
      "Bounding spheres provide ultra-fast initial rejection."
    ],
    "situationalPuzzle": {
      "scenario": "A 3D character has long waving hair animated by a vertex displacement shader. When the character walks to the edge of the screen, the hair suddenly pops out of existence, even though part of the hair is clearly still visible in the viewport! When the character moves back toward the center, the hair pops back in. What caused the premature culling?",
      "options": [
        "The hair was culled by the hair salon.",
        "Outdated Bounding Sphere from Vertex Shader Displacement: Frustum culling is evaluated on the CPU using the mesh's static Bounding Sphere! The vertex shader displaced the hair vertices outward by 1 meter, but the CPU-side bounding sphere remained at its original small size. When the small bounding sphere exited the camera frustum, the CPU culled the entire mesh, unaware that displaced vertices were still visible! The fix is calling 'geometry.computeBoundingSphere()' or expanding the bounding sphere radius manually.",
        "Three.js does not support hair.",
        "The camera near plane was too far."
      ],
      "answerIdx": 1,
      "debrief": "CPU frustum culling relies on bounding volumes calculated from the original un-displaced vertex buffer. When vertex shaders procedurally displace geometry (waves, wind, skeletal bone movement), developers must manually expand the mesh's bounding sphere to prevent premature culling at viewport edges."
    },
    "quests": [
      {
        "id": "cg-m1-d27-q1",
        "name": "6-Plane Camera Frustum Hesse Normal Form Math",
        "type": "concept",
        "desc": "Extract the 6 frustum planes from the combined View-Projection matrix in Hesse Normal Form (Ax + By + Cz + D = 0)."
      },
      {
        "id": "cg-m1-d27-q2",
        "name": "Octree Spatial Subdivision Query Profiler",
        "type": "detective",
        "desc": "Benchmark spatial frustum culling query latency across 50,000 objects comparing linear O(N) iteration against an Octree O(log N) tree."
      },
      {
        "id": "cg-m1-d27-q3",
        "name": "Hierarchical Dynamic LOD Engine in Three.js",
        "type": "mastery",
        "desc": "Implement an automated LOD manager with hysteresis thresholds to prevent popping artifacts during camera zoom transitions."
      },
      {
        "id": "cg-m1-d27-q4",
        "name": "3 AM SRE: Popping Geometry Artifacts in Virtual Stadium Tour",
        "type": "incident",
        "desc": "Resolve a high-visibility visual glitch where stadium roof canopies vanished prematurely at screen edges due to un-expanded bounding spheres."
      }
    ]
  },
  {
    "day": 28,
    "month": 1,
    "blockNum": 6,
    "title": "WebGPU Architecture Foundations: Adapters, Devices, Command Buffers & WGSL Shaders",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Next-Generation Graphics Architecture (WebGPU vs WebGL & Compute Shaders)",
    "spokenGoal": "Step into the future of web graphics: master WebGPU. Understand why WebGL (based on 1990s OpenGL) is being superseded: global state machine bottlenecks, driver overhead, single-threaded dispatch, and lack of general-purpose compute shaders. Deconstruct WebGPU: designed directly for modern GPU hardware (Direct3D 12, Metal, Vulkan). Master core concepts: `GPUAdapter` (physical graphics hardware), `GPUDevice` (logical connection), `GPUQueue` (command execution), `GPUCommandEncoder` (recording command buffers), `GPURenderPipeline` (immutable pre-compiled pipeline states), and the WebGPU Shading Language (WGSL).",
    "conceptInvariant": "Immutable Pipeline State Invariant: Unlike WebGL's mutable global state machine, WebGPU render pipelines (GPURenderPipeline) are completely immutable; all shader stages, blend modes, depth states, and vertex layouts are compiled upfront, guaranteeing zero driver recompilation stutters during rendering.",
    "failureMode": "Attempting to modify shader uniforms or blend modes on an active WebGPU render pipeline at runtime; WebGPU requires creating distinct immutable pipeline states or binding dynamic uniforms via Bind Groups (GPUBindGroup).",
    "tryItFriction": "Construct a Bare-Metal WebGPU Triangle in TypeScript: request a GPUAdapter and GPUDevice; configure the canvas context with 'navigator.gpu'; compile a WGSL vertex and fragment shader; create a GPURenderPipeline; record a command buffer with GPUCommandEncoder; submit to device.queue; and render a native WebGPU triangle.",
    "socraticHints": [
      "What is the single biggest architectural advantage of WebGPU over WebGL?",
      "WebGPU supports Compute Shaders (GPU General Purpose Computing - GPGPU) and eliminates the CPU driver bottleneck! You can run physics simulations, AI neural nets, and particle systems directly on thousands of GPU cores without any canvas rendering overhead!",
      "Commands are recorded in lightweight buffers that can be generated across multiple web workers."
    ],
    "situationalPuzzle": {
      "scenario": "A 3D particle simulation simulates 500,000 particles. In WebGL, particle positions are calculated on the CPU in JavaScript and uploaded to the GPU every frame, maxing out the CPU and running at 14 FPS. An engineer rewrites the simulation in WebGPU using a Compute Shader. The frame rate leaps to 60 FPS with 0% CPU usage. How did WebGPU compute shaders achieve this?",
      "options": [
        "WebGPU uses more RAM.",
        "Zero-Copy GPU Compute Execution: In WebGPU, the compute shader executes directly on GPU cores, reading and mutating a GPUStorageBuffer containing all 500,000 particle positions! The subsequent render pass binds that EXACT SAME storage buffer to draw the particles without a single byte ever traveling across the PCIe bus to the CPU! Zero CPU work, zero bus transfer latency.",
        "Compute shaders turn off physics.",
        "The particles were deleted."
      ],
      "answerIdx": 1,
      "debrief": "WebGPU compute shaders enable true GPGPU on the web. Simulating physics, particles, or AI directly in GPU memory and passing the result straight to the render pipeline without CPU readback eliminates the PCIe memory bus bottleneck entirely."
    },
    "quests": [
      {
        "id": "cg-m1-d28-q1",
        "name": "WebGPU vs WebGL Architectural Comparison Matrix",
        "type": "concept",
        "desc": "Compare WebGL 2.0 and WebGPU across pipeline mutability, multithreading capability, compute shaders, and driver overhead."
      },
      {
        "id": "cg-m1-d28-q2",
        "name": "WGSL vs GLSL Shader Syntax & Memory Model Inspector",
        "type": "detective",
        "desc": "Translate a Cook-Torrance lighting shader from GLSL into WebGPU Shading Language (WGSL), mapping structs, bindings, and entry points."
      },
      {
        "id": "cg-m1-d28-q3",
        "name": "Native WebGPU Rendering Pipeline in TypeScript",
        "type": "mastery",
        "desc": "Build an end-to-end WebGPU application with GPUCommandEncoder, immutable GPURenderPipeline, and WGSL vertex/fragment shading."
      },
      {
        "id": "cg-m1-d28-q4",
        "name": "3 AM SRE: WebGPU Fallback Blackout on Legacy Browser Fleet",
        "type": "incident",
        "desc": "Implement a seamless automated fallback harness that gracefully downgrades from WebGPU to WebGL 2.0 when GPU adapters are unavailable."
      }
    ]
  },
  {
    "day": 29,
    "month": 1,
    "blockNum": 6,
    "title": "Production 3D Asset Pipelines: glTF 2.0 / GLB, Draco Mesh Compression & KTX2 Textures",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Asset Architecture (glTF Specification & Next-Gen Asset Compression)",
    "spokenGoal": "Ship AAA 3D assets over web networks at lightning speed: master the glTF 2.0 asset ecosystem (the 'JPEG of 3D'). Deconstruct the glTF JSON and GLB binary format: accessors, bufferViews, buffers, meshes, skins, materials, and animations. Master next-generation asset compression: Google Draco (compressing vertex geometry by up to 90% via edge-breaker quantization), Meshopt (optimizing vertex cache locality and compression), and KTX2 / Basis Universal (transcoding compressed GPU textures like ASTC, BC7, and ETC directly into VRAM without CPU decompression).",
    "conceptInvariant": "GPU Direct Transcoding Invariant: KTX2 / Basis Universal textures must be transcoded directly on the client into the GPU's native hardware compression format (BC7 for desktop, ASTC for mobile, ETC2 for Android), bypassing CPU PNG/JPEG decompression and reducing VRAM usage by 75%.",
    "failureMode": "Deploying an uncompressed 85MB 3D model with raw PNG textures; over mobile 4G networks, the model takes 28 seconds to download and 6 seconds to decompress, resulting in an 80% user abandonment rate on e-commerce product pages.",
    "tryItFriction": "Build an Optimized glTF Pipeline in Three.js in TypeScript: configure GLTFLoader with DRACOLoader (WASM Draco decoder) and KTX2Loader (Basis Universal transcoder); load a heavily compressed 3D character asset; benchmark download size (shrunk from 45MB down to 3.8MB); and verify instant loading.",
    "socraticHints": [
      "Why is a PNG image terrible for GPU memory even if it has a small file size on disk?",
      "Because GPUs CANNOT sample compressed PNG or JPEG files directly! The browser CPU must completely decompress the PNG into raw uncompressed RGBA8 bitmaps in RAM (a 2048x2048 PNG is 16MB in VRAM)! KTX2/Basis textures stay compressed in VRAM, using only 4MB!",
      "Basis Universal transcodes directly into native GPU hardware compressed formats."
    ],
    "situationalPuzzle": {
      "scenario": "A 3D avatar platform optimizes assets using Draco geometry compression. File size drops from 20MB to 2MB. However, on low-end Android mobile phones, when a character spawns, the entire browser tab freezes for 1.8 seconds. Profiling shows the CPU main thread pegged in JavaScript. What caused the 1.8-second freeze during Draco loading?",
      "options": [
        "The phone battery was low.",
        "Main-Thread WebAssembly Geometry Decompression: Draco decompression is CPU-intensive! If DRACOLoader runs its WASM decoder on the main JavaScript thread, it blocks the event loop, freezing animations and UI for 1.8 seconds! The fix is configuring DRACOLoader with dedicated Web Workers ('dracoLoader.setWorkerLimit(4)'), moving decompression completely off the main thread.",
        "Draco does not support Android.",
        "The 3D model had too many materials."
      ],
      "answerIdx": 1,
      "debrief": "Geometry decompression algorithms (Draco) are computationally heavy. Running decompression on the main browser thread causes severe UI jank. Configuring loader worker pools offloads decompression to background Web Workers, keeping the 60 FPS main thread perfectly smooth."
    },
    "quests": [
      {
        "id": "cg-m1-d29-q1",
        "name": "glTF 2.0 Binary (GLB) Chunk Layout Specification",
        "type": "concept",
        "desc": "Diagram the 12-byte header, JSON chunk (0x4E4F534A), and binary BIN chunk (0x004E4942) structure of the GLB specification."
      },
      {
        "id": "cg-m1-d29-q2",
        "name": "Basis Universal GPU Texture Compression Transcoder Profiler",
        "type": "detective",
        "desc": "Measure VRAM memory footprint and upload times for 2K PNG vs 2K KTX2 (transcoded to BC7 on desktop and ASTC on mobile)."
      },
      {
        "id": "cg-m1-d29-q3",
        "name": "Worker-Accelerated Draco & KTX2 glTF Loading Pipeline",
        "type": "mastery",
        "desc": "Implement a production-grade 3D asset manager in TypeScript utilizing Web Workers for non-blocking Draco and KTX2 loading."
      },
      {
        "id": "cg-m1-d29-q4",
        "name": "3 AM SRE: 28-Second Asset Load Kills Conversion on Product Launch",
        "type": "incident",
        "desc": "Optimize an uncompressed 85MB 3D product asset down to 4.2MB using Draco and Basis Universal to rescue an e-commerce marketing campaign."
      }
    ]
  },
  {
    "day": 30,
    "month": 1,
    "blockNum": 6,
    "title": "Capstone 1: ApexRender Real-Time WebGL/WebGPU 3D Interactive Graphics Engine Capstone Viva Gate",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Month 1 Master Capstone & Viva Voce (Comprehensive 3D Graphics Engine Defense)",
    "spokenGoal": "The Month 1 Master Capstone and Comprehensive Viva Voce Gate: stand before the Senior 3D Graphics & Engine Architecture Board to present, demonstrate, and defend ApexRender. Demonstrate the complete synthesis of all 30 days of 3D graphics engineering: raw WebGL 2.0 shader compilation and context loss recovery, custom 4x4 matrix math pipelines, interleaved BufferGeometry layouts, Cook-Torrance PBR shading with GGX microfacet distribution, HDR Image-Based Lighting with pre-filtered cubemaps, PCF dynamic soft shadows with normal bias, GPU instancing rendering 20,000 objects in 1 draw call, Web Workers Draco/KTX2 asset streaming, and cinematic post-processing bloom and ACES tone mapping.",
    "conceptInvariant": "Master 3D Graphics Synthesis Invariant: An enterprise real-time 3D engine must guarantee constant 60 FPS rendering under high-complexity scenes, maintain zero VRAM memory leaks across model lifecycle changes, and deliver photorealistic visual fidelity that adheres strictly to physical energy conservation.",
    "failureMode": "Failing the viva defense when the senior panel injects a sudden WebGL context loss, zooms into grazing shadow boundaries, and opens 10 consecutive models, and the candidate cannot explain where VRAM buffers were leaked or why their shader divided by zero.",
    "tryItFriction": "Deliver the live end-to-end demonstration and oral defense: render a complex interactive 3D environment with 20,000 instanced dynamic entities and full PBR materials; trigger synthetic context loss and prove 100% glitch-free recovery; demonstrate seamless Draco asset loading with zero main-thread stutters; and defend your architectural choices under rigorous panel cross-examination.",
    "socraticHints": [
      "What is the single most critical hallmark of a Principal 3D Graphics Engineer?",
      "The rigorous understanding of the entire hardware-software vertical stack: knowing how every high-level Three.js call translates into WebGL driver commands, GPU memory bandwidth transactions, SIMD shader warps, and physical display pixels!",
      "A true graphics architect optimizes memory, eliminates draw calls, and designs for cross-platform GPU silicon constraints."
    ],
    "situationalPuzzle": {
      "scenario": "During your Month 1 Capstone defense, the examiner panel executes three simultaneous stress tests: 1) Resizes the viewport to 4K resolution; 2) Spawns 20,000 moving entities; 3) Injects simulated WebGL context loss. How does ApexRender survive without dropping below 60 FPS or crashing?",
      "options": [
        "The browser crashes and closes.",
        "Comprehensive Engine Architecture Resilience: 1) Resolution scaling adjusts pixel ratio dynamically to maintain fill-rate budgets; 2) The 20,000 entities are drawn in a single draw call via GPU InstancedMesh; 3) The autonomous context loss watchdog prevents default teardown, caches asset descriptors, and re-instantiates the WebGPU/WebGL pipeline within 300ms, resuming 60 FPS rendering seamlessly.",
        "All materials revert to wireframe.",
        "The examiner fails the candidate."
      ],
      "answerIdx": 1,
      "debrief": "This represents the pinnacle of web graphics engineering. When GPU instancing, optimized shader math, resilient context lifecycles, and efficient asset pipelines are architected together, the 3D application is rock-solid across any device or operating condition."
    },
    "quests": [
      {
        "id": "cg-m1-d30-q1",
        "name": "ApexRender Master 3D Architecture Blueprint",
        "type": "concept",
        "desc": "Produce the comprehensive multi-tier 3D engine architectural blueprint detailing pipeline passes, VBO layouts, PBR math, and memory lifecycles."
      },
      {
        "id": "cg-m1-d30-q2",
        "name": "GPU Fill-Rate & VRAM Leak Automated Penetration Audit",
        "type": "detective",
        "desc": "Execute automated performance audits verifying zero un-disposed GPU buffers, constant 60 FPS frame rates, and draw call batching."
      },
      {
        "id": "cg-m1-d30-q3",
        "name": "ApexRender Production 3D Graphics Engine Build",
        "type": "mastery",
        "desc": "Deploy and verify the complete working 3D engine in TypeScript integrating WebGL 2.0/WebGPU, Cook-Torrance PBR, HDR IBL, and InstancedMesh."
      },
      {
        "id": "cg-m1-d30-q4",
        "name": "Month 1 Capstone Viva Voce & Live Graphics Chaos Defense",
        "type": "incident",
        "desc": "Defend the entire 30-day graphics architecture before the Senior 3D Graphics Board under live 4K stress testing and oral cross-examination."
      }
    ]
  }
]
