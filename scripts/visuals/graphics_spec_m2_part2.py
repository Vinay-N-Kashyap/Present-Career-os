# scripts/visuals/graphics_spec_m2_part2.py
# Course 15: 3D Interactive Graphics & Avatar Animation (course-3d-graphics)
# Month 2: Days 46-60 (Blocks 10-12) - 60 Quests Total

GRAPHICS_M2_PART2 = [
  # =========================================================================
  # BLOCK 10: REAL-TIME 3D PHYSICS & CHARACTER CONTROLLERS (Days 46-50)
  # =========================================================================
  {
    "day": 46,
    "month": 2,
    "blockNum": 10,
    "title": "Rigid Body Physics on the Web: Rapier WASM, Collision Shapes & Simulation Stepping",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Rigid Body Dynamics (WASM Physics Engines & Collider Geometries)",
    "spokenGoal": "Integrate real-time Newtonian mechanics into 3D web environments. Evaluate the landscape of WebGL physics engines: legacy JavaScript engines (Cannon.js, Ammo.js) versus modern WebAssembly-compiled SIMD engines (Rapier3D by Dimforge). Understand Rigid Body types: Dynamic (affected by forces, impulses, gravity), Static (immovable scenery like floors and walls), and Kinematic (controlled by game script or animation, unaffected by external forces but pushing dynamic objects). Deep-dive into Collider Geometries: Primitive Shapes (Spheres, Boxes, Capsules), Convex Hulls, and Trimeshes (concave static terrain). Master the Simulation Loop: synchronizing physics world steps with Three.js rendering loops without frame rate jitter.",
    "conceptInvariant": "Physics-Render Decoupling Invariant: Physics simulations must run at a fixed deterministic frequency (e.g. 60Hz via fixed &Delta;t = 1/60s) with accumulated time sub-stepping; tying physics integration directly to variable rendering frame times introduces non-deterministic physics drift, tunneling, and numerical explosions.",
    "failureMode": "Passing variable render delta time directly to a physics world step; dropping from 60 FPS to 15 FPS causes physics delta to jump to 66ms, causing fast-moving physics objects to tunnel completely through solid floor colliders into the abyss.",
    "tryItFriction": "Integrate Rapier3D (@dimforge/rapier3d) via WASM in TypeScript: create a static ground plane and 100 dynamic rigid body boxes; implement fixed-step physics loop with accumulated delta time; copy Rapier translation/rotation quaternions into Three.js Mesh transforms every frame; and verify rock-solid 60 FPS physics without tunneling.",
    "socraticHints": [
      "Why should you never use concave Trimesh colliders for moving dynamic rigid bodies?",
      "Because trimesh-vs-trimesh collision detection requires O(N &times; M) triangle intersection tests, which is mathematically prohibitive for real-time physics! Trimeshes also lack a closed interior, causing objects to easily penetrate and become trapped!",
      "Dynamic objects must always use convex shapes (Spheres, Capsules, Convex Hulls), reserving Trimeshes strictly for immovable static terrain."
    ],
    "situationalPuzzle": {
      "scenario": "A 3D developer connects a dynamic physics ball to a Three.js mesh. The ball falls and bounces. The developer wants to move the ball to the center of the room when a button is clicked. They set 'mesh.position.set(0, 5, 0)'. On the very next frame, the ball snaps right back to the floor! Why didn't the ball stay at (0, 5, 0)?",
      "options": [
        "Three.js does not support user interaction.",
        "One-Way Physics Authority Inversion: The physics engine is the single source of truth for dynamic objects! Setting 'mesh.position' only updates the rendering node. When the physics step runs, it overwrites 'mesh.position' with the rigid body's internal translation. To teleport a physics object, you must call the physics API directly: 'rigidBody.setTranslation({x: 0, y: 5, z: 0}, true)'!",
        "The gravity uniform was set to infinity.",
        "The browser cached the old position."
      ],
      "answerIdx": 1,
      "debrief": "In physics-driven rendering, transform authority flows strictly from Physics Body &rarr; Render Mesh. Manipulating the visual mesh directly has zero effect on the underlying simulation. You must apply impulses or call body teleportation APIs on the physics engine itself."
    },
    "quests": [
      {
        "id": "cg-m2-d46-q1",
        "name": "Newtonian Rigid Body Mechanics & Inertia Tensors",
        "type": "concept",
        "desc": "Derive the Newton-Euler equations of motion for 3D rigid bodies, defining mass, center of mass, and the 3x3 inertia tensor matrix."
      },
      {
        "id": "cg-m2-d46-q2",
        "name": "Deterministic Fixed-Step Accumulator Benchmarking",
        "type": "detective",
        "desc": "Benchmark physics simulation accuracy under chaotic rendering frame rates (15-144 FPS) with and without fixed-step delta accumulation."
      },
      {
        "id": "cg-m2-d46-q3",
        "name": "Rapier3D WASM Integration with Three.js",
        "type": "mastery",
        "desc": "Build a physics playground in TypeScript combining Rapier3D, 200 dynamic rigid bodies, restitution/friction controls, and visual mesh synchronization."
      },
      {
        "id": "cg-m2-d46-q4",
        "name": "3 AM SRE: Objects Tunneling Through Walls in E-Commerce Game",
        "type": "incident",
        "desc": "Resolve a high-priority bug where fast-moving shopping cart physics bodies clipped through boundary walls during mobile frame drops."
      }
    ]
  },
  {
    "day": 47,
    "month": 2,
    "blockNum": 10,
    "title": "Kinematic Character Controller: Ground Detection, Slope Sliding, Stair Stepping & Jump Physics",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Character Locomotion Physics (KCC Mechanics & Collision Response)",
    "spokenGoal": "Build a responsive, glitch-free 3D Character Controller. Understand why dynamic rigid bodies fail for playable avatars: dynamic spheres roll uncontrollably, slip down gentle inclines, and tip over when bumping into curbs. Enter the Kinematic Character Controller (KCC): an algorithm where the avatar is represented by a kinematic capsule collider whose motion is driven strictly by game logic and customized collision queries. Implement the foundational KCC mechanics: 1) Raycast and Shape-Cast ground detection; 2) Slope sliding and maximum climbable angles (preventing walking up 70-degree cliffs); 3) Automatic stair stepping (stepping up small curbs without bouncing); and 4) Jump and variable gravity curves.",
    "conceptInvariant": "Kinematic Autonomy Invariant: A player character must not be modeled as a pure Newtonian dynamic body; a kinematic controller provides immediate responsiveness (infinite acceleration upon input, zero unwanted inertia) while respecting environmental obstacles through custom shape-casting.",
    "failureMode": "Modeling a player character as a dynamic rigid body with low friction; pressing the forward key accelerates the player like a bowling ball on ice, and walking onto a 5-degree ramp causes the character to helplessly slide to the bottom.",
    "tryItFriction": "Construct a Kinematic Character Controller in TypeScript using Rapier3D: define a 1.8m capsule collider; implement downward raycast ground detection; write slope angle calculation (dot product between ground normal and up vector); clamp climbing to angles &le; 45&deg;; implement smooth 0.3m stair-stepping; and verify responsive WASD movement with zero jitter.",
    "socraticHints": [
      "Why is a capsule shape universally preferred over a box or cylinder for character colliders?",
      "Because a capsule has a rounded bottom hemisphere! When encountering small bumps, curbs, or uneven terrain, the curved hemisphere smoothly glides up over the obstacle instead of catching on sharp edges like a flat cylinder or box!",
      "The vertical cylinder body prevents the character from tipping over."
    ],
    "situationalPuzzle": {
      "scenario": "A player walks their avatar down a 30-degree descending ramp. Instead of smoothly walking down the surface, the avatar repeatedly 'hops' and floats into the air, triggering the falling animation every 2 steps. What algorithmic flaw in the character controller causes ramp hopping?",
      "options": [
        "The gravity value is too weak.",
        "Missing Ground-Snapping / Downward Slope Projection: When moving horizontally forward off a downward slope, the avatar moves faster horizontally than gravity pulls it vertically in a single frame, detaching from the ground! A production KCC implements 'Ground Snapping': when grounded and moving on a downward slope, the controller casts a ray downwards and snaps the avatar's vertical position to the ramp surface if the drop is within snap tolerance (e.g. 0.4m).",
        "Ramps are not supported in 3D games.",
        "The camera angle is too steep."
      ],
      "answerIdx": 1,
      "debrief": "Ground snapping is a mandatory feature of every commercial character controller. Without it, horizontal forward velocity launches the character off downward inclines, creating jarring airborne hops and cycling between grounded and airborne animation states."
    },
    "quests": [
      {
        "id": "cg-m2-d47-q1",
        "name": "Kinematic Character Controller Collision Architecture",
        "type": "concept",
        "desc": "Formulate the collide-and-slide vector projection algorithm for kinematic capsules moving through arbitrary polygonal geometry."
      },
      {
        "id": "cg-m2-d47-q2",
        "name": "Slope Sliding & Step-Up Geometry Profiler",
        "type": "detective",
        "desc": "Profile raycast vs shapecast performance across 1,000 steps of irregular terrain and benchmark stair-stepping edge cases."
      },
      {
        "id": "cg-m2-d47-q3",
        "name": "Production Kinematic Character Controller in Rapier",
        "type": "mastery",
        "desc": "Implement a complete KCC in TypeScript supporting ground snapping, slope sliding, curb stepping, jumping, and third-person camera orbiting."
      },
      {
        "id": "cg-m2-d47-q4",
        "name": "3 AM SRE: Characters Falling Through Elevators in 3D Hub",
        "type": "incident",
        "desc": "Fix a severe production glitch where avatars fell through moving elevator platforms by implementing relative velocity platform parenting."
      }
    ]
  },
  {
    "day": 48,
    "month": 2,
    "blockNum": 10,
    "title": "Inverse Kinematics (IK): Two-Bone Analytical IK, FABRIK & Foot Placement on Uneven Terrain",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Procedural Kinematics (IK Algorithms & Foot Adaptability)",
    "spokenGoal": "Eliminate the immersion-shattering flaw of 3D characters: floating feet and clipping through uneven ground. Contrast Forward Kinematics (FK: rotating parent joints to position the end-effector) with Inverse Kinematics (IK: calculating required joint rotations to place an end-effector at a desired target coordinate). Derive the Two-Bone Analytical IK solver (Law of Cosines) for human limbs (Hip-Knee-Ankle and Shoulder-Elbow-Wrist) with pole vector constraints. Examine iterative IK solvers like FABRIK (Forward And Backward Reaching Inverse Kinematics). Implement Foot Placement IK: cast downward raycasts from each foot, detect uneven slopes, adjust pelvis height, and orient the feet to align perfectly with the surface normal.",
    "conceptInvariant": "Law of Cosines Two-Bone Invariant: For any two-bone kinematic chain of lengths L1 and L2 targeting distance D, the interior joint angle &theta; is uniquely determined by the Law of Cosines: cos(&theta;) = (L1^2 + L2^2 - D^2) / (2 &middot; L1 &middot; L2); if D > L1 + L2, the limb reaches its fully extended singular limit.",
    "failureMode": "Allowing target distance D to exceed L1 + L2 in an analytical IK solver without clamping; the Law of Cosines evaluates acos(value > 1.0), returning NaN and causing the character's legs to instantly vanish from the scene.",
    "tryItFriction": "Implement a Two-Bone IK solver in TypeScript for a 3D character leg: take hip, knee, and ankle bone transforms; compute target foot position via mouse click; clamp reach distance to prevent NaN; calculate analytical knee flexion and hip rotation; align foot orientation with ground normal; and verify smooth procedural leg adaptation.",
    "socraticHints": [
      "What is a 'Pole Vector' in Inverse Kinematics and why is it necessary for a human knee or elbow?",
      "Because when bending a knee to reach a foot target, there are an infinite number of 3D orientations the knee could point (the knee could bend outward, backward, or inward)! A pole vector defines a directional hint (pointing forward for knees, backward for elbows) that locks the bending plane!",
      "Without a pole vector, the character's knees will twist randomly."
    ],
    "situationalPuzzle": {
      "scenario": "A character walks onto a steep 25-degree hill. Foot IK correctly places the uphill foot onto the raised ground, but the character's downhill leg cannot reach the ground because it is too far away, leaving the downhill foot dangling in mid-air. How does production Foot Placement IK solve the reach limit on slopes?",
      "options": [
        "Stretch the downhill leg bones by 200%.",
        "Pelvis Height Displacement (Pelvis Dropping): The foot IK system must lower the character's root Pelvis/Hips bone! By lowering the pelvis toward the lower foot target, the downhill leg can reach the ground, while the uphill leg simply flexes its knee deeper via IK. Both feet remain planted firmly on the surface.",
        "Tilt the entire character 45 degrees.",
        "Disable Foot IK on hills."
      ],
      "answerIdx": 1,
      "debrief": "Foot IK cannot extend bones beyond their physical length. On uneven terrain, the root Pelvis bone must be dynamically lowered based on the lowest foot ground raycast. This guarantees both feet reach the ground, while the higher leg naturally bends its knee."
    },
    "quests": [
      {
        "id": "cg-m2-d48-q1",
        "name": "Two-Bone Analytical IK & FABRIK Derivation",
        "type": "concept",
        "desc": "Derive the mathematical equations for 2-bone analytical IK with pole vectors and contrast with the iterative FABRIK algorithm."
      },
      {
        "id": "cg-m2-d48-q2",
        "name": "Foot Placement Raycasting & Pelvis Offset Linter",
        "type": "detective",
        "desc": "Validate foot ground penetration across procedurally generated heightmaps and benchmark pelvis compensation responsiveness."
      },
      {
        "id": "cg-m2-d48-q3",
        "name": "Procedural Foot Placement IK System in Three.js",
        "type": "mastery",
        "desc": "Build an end-to-end Foot IK system in TypeScript that dynamically adjusts avatar feet and pelvis over rough stairs, rocks, and hills."
      },
      {
        "id": "cg-m2-d48-q4",
        "name": "3 AM SRE: Inverted Knees Glitch on Uneven Virtual Terrain",
        "type": "incident",
        "desc": "Fix an urgent visual bug where avatar knees bent backwards like flamingo legs on rocky surfaces due to unconstrained pole vector singularities."
      }
    ]
  },
  {
    "day": 49,
    "month": 2,
    "blockNum": 10,
    "title": "Ragdoll Physics & Animation Blending: Dynamic Ragdoll Transitions, Joint Limits & Getting Up",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Advanced Character Dynamics (Ragdoll Physics & Kinematic Blending)",
    "spokenGoal": "Bridge kinematic skeletal animation and full dynamic physics: Ragdoll Physics. Dissect how a Ragdoll is constructed: attaching rigid body colliders (capsules, boxes) to each major bone of the skeleton (head, torso, upperArm, lowerArm, thighs, shins) connected by rotational 6-DOF constraints / Ball-Socket joints with anatomical limits. Master the state transitions: 1) Active Animation Mode (colliders follow bones kinematically); 2) Ragdoll Mode (on impact, turn off animation, activate dynamic physics, and inherit bone linear/angular velocities); 3) Blended / Partial Ragdoll (active ragdolls reacting to impacts while staying upright); and 4) Recovery ('Get Up' animation smoothly blending from ragdoll rest pose back to standing).",
    "conceptInvariant": "Velocity Inheritance Invariant: Transitioning a character from kinematic animation to dynamic ragdoll requires calculating instantaneous linear and angular velocities for every bone (v = (p_current - p_prev) / &Delta;t) and transferring them into physics bodies; otherwise, a running character abruptly drops straight down like an unmoving sack of bricks.",
    "failureMode": "Switching a running character to ragdoll mode with zero initial velocity; the character instantly halts all forward inertia and drops vertically onto their knees, completely violating physical conservation of momentum.",
    "tryItFriction": "Construct a 10-bone Ragdoll skeleton in TypeScript using Rapier3D constraints: link torso, head, and limbs with spherical joint limits; run a walking animation; on spacebar press, switch physics bodies to dynamic, copy instantaneous velocities, and watch the character tumble down a flight of stairs with realistic physical momentum.",
    "socraticHints": [
      "Why do ragdoll joints need angular limits (cones and twist limits)?",
      "Because human joints cannot rotate 360 degrees in all directions! Without limits, a ragdoll's head will spin like The Exorcist and its elbows will bend backwards!",
      "Spherical cone limits restrict joint rotation to anatomically possible angles."
    ],
    "situationalPuzzle": {
      "scenario": "A character is knocked down into a ragdoll state. After coming to rest on the ground, the game triggers the 'Get Up' animation clip. As soon as the animation plays, the character's body violently snaps and teleports 3 meters into the air, spinning wildly. What caused this severe animation transition pop?",
      "options": [
        "The ragdoll bodies were deleted too slowly.",
        "Root Position Desynchronization: The ragdoll's physical pelvis rested at (x=10, y=0.1, z=5), but the 'Get Up' animation clip was authored at the model origin (0, 0, 0)! Snapping directly to the clip teleports the character back to origin. The solution: 1) Align the character's root node position and yaw rotation to match the resting ragdoll pelvis; 2) Smoothly blend bone transforms from ragdoll pose to animation keyframes over 300ms using Slerp.",
        "Characters cannot get up once knocked down.",
        "The physics engine ran out of memory."
      ],
      "answerIdx": 1,
      "debrief": "Transitioning from ragdoll back to animation requires matching the coordinate systems. The character's root transformation must be updated to match the resting physical pelvis location, followed by a smooth cross-fade from ragdoll bone transforms to the get-up animation keyframes."
    },
    "quests": [
      {
        "id": "cg-m2-d49-q1",
        "name": "6-DOF Joint Constraint & Cone Limit Formulation",
        "type": "concept",
        "desc": "Formulate the mathematical constraint equations for spherical ball-socket joints with angular swing and twist limits."
      },
      {
        "id": "cg-m2-d49-q2",
        "name": "Momentum Conservation Velocity Transfer Profiler",
        "type": "detective",
        "desc": "Measure kinetic energy and linear momentum transfer during kinematic-to-dynamic ragdoll transitions across various running speeds."
      },
      {
        "id": "cg-m2-d49-q3",
        "name": "Interactive Ragdoll & Get-Up Blending System",
        "type": "mastery",
        "desc": "Build a complete ragdoll system in Three.js + Rapier supporting dynamic impacts, velocity inheritance, and seamless get-up transitions."
      },
      {
        "id": "cg-m2-d49-q4",
        "name": "3 AM SRE: Catastrophic Joint Spasms in Physics Combat Game",
        "type": "incident",
        "desc": "Triage and fix an emergency physics crash where colliding ragdoll limbs triggered constraint solver explosions and NaN coordinates."
      }
    ]
  },
  {
    "day": 50,
    "month": 2,
    "blockNum": 10,
    "title": "Milestone 9: Kinematic Character Controller with Two-Bone IK & Ragdoll Engine",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Block 10 Capstone Project & Architectural Gate",
    "spokenGoal": "Synthesize the entire discipline of real-time 3D physics, kinematic character locomotion, inverse kinematics, and dynamic ragdolls into a unified enterprise character engine: the Kinematic Character Controller & Dynamics Engine. In this milestone, architect a complete character runtime: drive a 3D avatar using a responsive Rapier Kinematic Character Controller with slope sliding, stair stepping, and jump physics; layer Two-Bone Analytical IK on the legs to adapt foot placement and pelvis height over uneven procedural terrain; implement dynamic ragdoll transitions upon high-velocity collisions with momentum inheritance; and prove 60 FPS performance.",
    "conceptInvariant": "Unified Character Locomotion Invariant: A production character architecture must cleanly orchestrate three distinct locomotion regimes (Kinematic Controller &rarr; Procedural IK Layer &rarr; Dynamic Ragdoll) with deterministic state machines and zero transform pops.",
    "failureMode": "Failing the milestone gate when the character controller tunnels through moving ramps, feet clip through stairs, or triggering ragdoll mode teleports the avatar to the origin.",
    "tryItFriction": "Construct and deliver the complete milestone application in TypeScript: navigate a 3D obstacle course featuring 35-degree slopes, stepped stairs, and uneven terrain; demonstrate rock-solid ground snapping and Two-Bone Foot IK; sprint into an obstacle to trigger dynamic ragdoll physics; execute a smooth 300ms blended recovery back to standing; and verify constant 60 FPS rendering.",
    "socraticHints": [
      "How do we prevent physics substeps from causing visual micro-stutter when physics runs at 60Hz and the monitor refreshes at 144Hz?",
      "By implementing Transform Interpolation! When rendering at 144Hz between two 60Hz physics ticks, calculate alpha = accumulatedTime / fixedDeltaTime and linearly interpolate mesh positions between the previous and current physics states!",
      "This guarantees silky smooth rendering on any monitor refresh rate."
    ],
    "situationalPuzzle": {
      "scenario": "During milestone examination, the reviewer sets the monitor refresh rate to 165Hz with FreeSync enabled. The character moves smoothly, but occasionally stutters as if dropped frames occurred, even though the GPU frame time is only 2ms. What causes this 165Hz micro-stutter?",
      "options": [
        "The monitor is defective.",
        "Fixed Timestep Aliasing without State Interpolation: Physics steps at fixed 16.67ms (60Hz), but frames render every 6.06ms (165Hz). Some render frames experience 0 physics ticks, while others experience 1 or 2. Without alpha state interpolation between the previous and current physics transforms, the rendered visual position alternates between duplicated and stepped coordinates, causing visible motion judder.",
        "Three.js does not support high refresh rates.",
        "The browser requires a restart."
      ],
      "answerIdx": 1,
      "debrief": "Fixed-timestep physics engines will always stutter on high-refresh-rate displays (120Hz, 144Hz, 240Hz) unless transform interpolation is implemented. Storing previous and current physics states and interpolating by the frame fraction eliminates all temporal aliasing."
    },
    "quests": [
      {
        "id": "cg-m2-d50-q1",
        "name": "Character Physics & Locomotion Architecture Blueprint",
        "type": "concept",
        "desc": "Produce the comprehensive engineering specification detailing KCC state machines, two-bone IK math, and ragdoll constraint topologies."
      },
      {
        "id": "cg-m2-d50-q2",
        "name": "Terrain Adaptation & Physics Tunneling Stress Harness",
        "type": "detective",
        "desc": "Build an automated testing harness driving capsules across extreme slopes, high-speed collisions, and irregular step geometry to detect tunneling."
      },
      {
        "id": "cg-m2-d50-q3",
        "name": "Kinematic Character Controller with IK & Ragdoll Build",
        "type": "mastery",
        "desc": "Implement the complete working TypeScript engine in Three.js + Rapier featuring KCC locomotion, Foot IK, and ragdoll state transitions."
      },
      {
        "id": "cg-m2-d50-q4",
        "name": "Milestone 9 Viva Gate: Character Dynamics Defense",
        "type": "incident",
        "desc": "Defend the character controller architecture before the graphics board, demonstrating obstacle course traversal and answering deep physics probes."
      }
    ]
  },

  # =========================================================================
  # BLOCK 11: ADVANCED VISUAL EFFECTS, POST-PROCESSING & 3 AM TRIAGE (Days 51-55)
  # =========================================================================
  {
    "day": 51,
    "month": 2,
    "blockNum": 11,
    "title": "Screen-Space Ambient Occlusion (SSAO): Depth/Normal Buffers & Bilateral Blur Filtering",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Advanced Shading & Post-Processing (SSAO Mathematics & Geometry Creases)",
    "spokenGoal": "Infuse 3D scenes with soft contact shadows and depth perception: Screen-Space Ambient Occlusion (SSAO). Understand why standard 3D lighting looks flat and 'floaty': direct lights and simple ambient lights illuminate all exposed geometry uniformly, failing to capture the physical reality that crevices, cracks, and contact points between objects receive less scattered ambient light. Deconstruct the SSAO algorithm: 1) Render scene depths and camera-space normals to off-screen G-buffer textures; 2) For each pixel, reconstruct its 3D position in view space; 3) Sample a hemisphere kernel of 16-64 points oriented along the surface normal; 4) Project sample points back to screen space and compare their depths against the depth buffer; 5) Compute occlusion percentage; and 6) Apply a depth-aware Bilateral Blur to eliminate noise while preserving sharp geometric edges.",
    "conceptInvariant": "Depth-Aware Bilateral Filter Invariant: To blur noisy screen-space occlusion without bleeding across object silhouettes, blur weights must depend on both spatial pixel distance and depth/normal differences: W(p, q) = G_spatial(&parallel;p-q&parallel;) &middot; G_depth(|d_p - d_q|); blending across large depth discontinuities produces unnatural dark halos.",
    "failureMode": "Applying a standard Gaussian blur to raw SSAO output; contact shadows bleed across depth boundaries, producing muddy dark halos around foreground characters and smudging distinct silhouettes.",
    "tryItFriction": "Implement an SSAO shader pass in Three.js using custom ShaderPass: render normal and depth textures via WebGLRenderTarget; generate a 32-sample hemisphere kernel with cosine distribution and 4x4 noise texture; compute occlusion factor in GLSL; apply a bilateral blur pass; and demonstrate realistic contact shadows under furniture and in avatar facial creases.",
    "socraticHints": [
      "Why do we rotate the sample kernel using a tiled 4x4 random noise texture?",
      "Because sampling the exact same fixed hemisphere pattern at every pixel produces visible banding and circular banding artifacts! Rotating the kernel randomly across pixels turns banding into high-frequency dither noise, which is easily smoothed out by a bilateral blur pass!",
      "A 4x4 noise texture repeats across the screen, costing almost zero VRAM."
    ],
    "situationalPuzzle": {
      "scenario": "An engineer notices that when a character stands directly in front of a far-away mountain, the character's outer silhouette is surrounded by a thick, ugly black ring ('halo artifact'). What bug in the SSAO depth comparison logic caused this halo?",
      "options": [
        "The light source is too close.",
        "Missing Range Check Falloff: The SSAO shader compared sample depths against the background mountain depth, which was 500 meters behind the character! The shader concluded that the mountain occludes the character, calculating 100% occlusion! The solution: add a Range Check Falloff function (e.g. smoothstep(0.0, 1.0, radius / abs(position.z - sampleDepth.z))) that discards samples whose depth difference exceeds the local occlusion radius.",
        "SSAO cannot be rendered in front of mountains.",
        "The screen resolution was too high."
      ],
      "answerIdx": 1,
      "debrief": "A classic SSAO pitfall is failing to clamp the occlusion range. Without an occlusion radius falloff, geometry miles behind a foreground object will falsely register as an occluder, generating dark halos around silhouettes. Adding an occlusion distance threshold resolves the bug completely."
    },
    "quests": [
      {
        "id": "cg-m2-d51-q1",
        "name": "SSAO Hemisphere Kernel & Depth Reconstruction Proof",
        "type": "concept",
        "desc": "Derive the mathematical equations for view-space position reconstruction from depth buffers and Monte Carlo hemisphere sampling."
      },
      {
        "id": "cg-m2-d51-q2",
        "name": "Bilateral Blur Edge Preservation & Noise Benchmark",
        "type": "detective",
        "desc": "Compare Gaussian vs Bilateral depth-aware filtering across high-contrast edge boundaries to evaluate halo reduction and shader execution time."
      },
      {
        "id": "cg-m2-d51-q3",
        "name": "Custom SSAO Post-Processing Pipeline in Three.js",
        "type": "mastery",
        "desc": "Build a modular SSAO post-processing effect in TypeScript with normal/depth G-buffers, 32-point rotated kernel, and bilateral blur filtering."
      },
      {
        "id": "cg-m2-d51-q4",
        "name": "3 AM SRE: Crashing Mobile Safari on 4K SSAO Render Targets",
        "type": "incident",
        "desc": "Triage and fix an emergency mobile crash where rendering full-resolution 4K float depth/normal buffers exceeded iPad VRAM allocation limits."
      }
    ]
  },
  {
    "day": 52,
    "month": 2,
    "blockNum": 11,
    "title": "Screen-Space Reflections (SSR) & Refractions: Raymarching in Screen Space & Falloffs",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Advanced Real-Time Optics (SSR Raymarching & Specular Reflections)",
    "spokenGoal": "Implement real-time glossy reflections without expensive ray tracing hardware: Screen-Space Reflections (SSR). Understand how SSR works: for every reflective surface pixel, calculate the reflected view vector R = reflect(V, N); march a ray forward in screen space through the depth buffer; detect when the ray intersects geometry; and sample the color buffer at that intersection point to produce real-time dynamic reflections. Master SSR Raymarching algorithms: Linear Search (fixed step size) followed by Binary Search refinement to pinpoint exact surface intersections without aliasing. Handle edge falloffs and off-screen misses by gracefully blending SSR with Image-Based Lighting (IBL) cubemap fallbacks.",
    "conceptInvariant": "Screen-Space Visibility Invariant: SSR can only reflect geometry that is currently visible on screen; rays traveling toward objects behind the camera or occluded by foreground meshes must fall back smoothly to pre-filtered environmental cubemaps to prevent harsh black cutouts.",
    "failureMode": "Failing to implement screen-edge attenuation in an SSR shader; reflections of objects near the edge of the viewport abruptly cut off into sharp black squares as soon as the reflected object moves slightly off-screen.",
    "tryItFriction": "Construct an SSR shader pass in WebGL/Three.js: render a glossy marble floor reflecting dynamic 3D characters; march rays through the depth buffer using 32 linear steps + 8 binary refinement steps; apply screen-edge distance fading; blend SSR color with Cook-Torrance specular PBR; and demonstrate real-time dynamic character reflections.",
    "socraticHints": [
      "Why is Binary Search refinement necessary in screen-space raymarching?",
      "Because taking tiny linear steps across the entire screen would require hundreds of texture samples per pixel, killing frame rates! Taking larger linear steps is fast, but causes jagged stepping artifacts!",
      "Taking coarse linear steps until an intersection is detected, then refining with 5-8 binary search steps gives sub-pixel precision with minimal texture fetches!"
    ],
    "situationalPuzzle": {
      "scenario": "A character walks over a wet asphalt road rendered with SSR. The character's reflection looks stunning on the ground! But as the camera tilts downwards to look straight at the ground, the character's reflection completely vanishes. Why do reflections disappear when tilting the camera down in SSR?",
      "options": [
        "The asphalt material roughness was increased.",
        "Screen-Space Occlusion Limit: When looking straight down at the ground, the character's upper body is no longer in the camera's viewport! Because SSR only samples pixels present in the rendered color buffer, any geometry outside the camera frustum cannot be reflected. The engine must blend seamlessly from SSR into an environmental IBL reflection map based on ray hit confidence.",
        "SSR only works at night.",
        "The depth buffer was cleared."
      ],
      "answerIdx": 1,
      "debrief": "The defining limitation of Screen-Space Reflections is that they cannot reflect what the camera cannot see. Production engines calculate a Fresnel and hit confidence factor, smoothly cross-fading from SSR to Image-Based Lighting cubemaps when reflected rays exit the screen."
    },
    "quests": [
      {
        "id": "cg-m2-d52-q1",
        "name": "Screen-Space Raymarching & Binary Search Formulation",
        "type": "concept",
        "desc": "Derive the mathematics of marching 3D reflection rays projected into 2D clip space and iterative binary depth root-finding."
      },
      {
        "id": "cg-m2-d52-q2",
        "name": "SSR Texture Fetch & Ray Step Optimization Profiler",
        "type": "detective",
        "desc": "Profile GPU execution time across 16, 32, and 64 ray steps comparing naive linear marching versus hierarchical depth buffer (Hi-Z) tracing."
      },
      {
        "id": "cg-m2-d52-q3",
        "name": "Screen-Space Reflections & Glossy Wet Floor System",
        "type": "mastery",
        "desc": "Build an SSR post-processing pipeline in Three.js featuring binary search refinement, roughness-based blur, and IBL cubemap fallbacks."
      },
      {
        "id": "cg-m2-d52-q4",
        "name": "3 AM SRE: Stuttering & Black Cutouts in Virtual Showroom",
        "type": "incident",
        "desc": "Fix a production bug where reflective vehicle windshields exhibited severe flickering black edge artifacts during camera panning."
      }
    ]
  },
  {
    "day": 53,
    "month": 2,
    "blockNum": 11,
    "title": "GPU Particle Systems: Instanced Particles, WebGPU Compute Shaders & Curl Noise Simulation",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Massive Visual Effects & Simulation (GPU Compute & Particle Lifecycles)",
    "spokenGoal": "Simulate millions of dynamic particles for magical spells, fire, smoke, and digital avatar disintegration effects. Contrast CPU-based particles (updating arrays in JavaScript, bottlenecked at ~5,000 particles by main-thread CPU limits and buffer upload bandwidth) with GPU-Accelerated Particle Systems. Explore two GPU architectures: 1) WebGL 2.0 Transform Feedback / Instanced Quads (updating particle positions via vertex shaders); and 2) Modern WebGPU Compute Shaders (simulating 1,000,000+ particles entirely in GPU compute pipelines using WGSL). Implement Curl Noise (the divergence-free curl of a 3D simplex noise vector field) to generate turbulent, fluid-like particle trajectories with zero inter-particle collisions.",
    "conceptInvariant": "Divergence-Free Curl Noise Invariant: Computing the curl of a 3D vector potential (&nabla; &times; &Psi;) yields a divergence-free velocity field (&nabla; &middot; v = 0); advecting particles through curl noise guarantees incompressibility, preventing particles from unnaturally clumping together or creating artificial voids.",
    "failureMode": "Updating 50,000 particle positions in a JavaScript for-loop and re-uploading bufferData every frame; garbage collection pauses freeze the browser for 40ms, dropping frame rates to 8 FPS.",
    "tryItFriction": "Build a GPU particle system in WebGL/Three.js using InstancedBufferGeometry: allocate 100,000 particles; store lifetime, velocity, and birth-time in instanced vertex attributes; write custom GLSL vertex shader evaluating 3D Simplex Curl Noise to advect particles in real time; and render 100,000 swirling embers at a steady 60 FPS.",
    "socraticHints": [
      "Why does standard 3D Perlin noise make particles clump together, while Curl Noise keeps them dispersed?",
      "Because standard noise has non-zero divergence! Particles follow vectors toward local sinks (points where vectors converge), clumping into dense clusters! The mathematical curl operator (&nabla; &times; &Psi;) eliminates divergence, ensuring particles flow like real turbulent fluid!",
      "Curl noise produces stunning organic fluid motions with zero fluid simulation cost."
    ],
    "situationalPuzzle": {
      "scenario": "An engineer creates a 200,000-particle fire explosion effect. In the center of the explosion, the frame rate plummets from 60 FPS to 12 FPS on high-end desktop GPUs, even though vertex shader time is only 1.2ms. What GPU hardware bottleneck was triggered by overlapping transparent particle quads?",
      "options": [
        "VRAM ran out of memory.",
        "Massive Alpha Overdraw (Fill-Rate Exhaustion): Each particle is a camera-facing quad with alpha blending enabled. In the center of the explosion, dozens or hundreds of transparent particles overlap the same screen pixels. The GPU fragment shader must execute 50 to 100 times for every single pixel, exhausting GPU memory fill-rate bandwidth! Optimize by: 1) Tightly bounding particle quad geometry (hexagons/octagons instead of quads to reduce transparent pixel area); 2) Particle sorting and downsampled half-resolution particle rendering.",
        "WebGL does not support fire effects.",
        "The CPU was bottlenecked by draw calls."
      ],
      "answerIdx": 1,
      "debrief": "Overdraw is the primary killer of particle system performance. When hundreds of large transparent quads overlap, fragment shader execution explodes, saturating the GPU's rasterization fill-rate. Using trimmed non-quad geometry or rendering particles to a half-resolution off-screen buffer resolves fill-rate saturation."
    },
    "quests": [
      {
        "id": "cg-m2-d53-q1",
        "name": "Divergence-Free Curl Noise Mathematical Formulation",
        "type": "concept",
        "desc": "Derive the mathematical curl of a 3D vector potential field (&nabla; &times; &Psi;) using finite differences and prove divergence-free velocity."
      },
      {
        "id": "cg-m2-d53-q2",
        "name": "Alpha Overdraw Heatmap & Fill-Rate Analyzer",
        "type": "detective",
        "desc": "Build an overdraw visualization shader counting fragment shader invocations per pixel across 100,000 overlapping blended particles."
      },
      {
        "id": "cg-m2-d53-q3",
        "name": "100,000-Particle GPU Curl Noise Simulation",
        "type": "mastery",
        "desc": "Build an interactive 100,000-particle GPU visual effects system in Three.js featuring curl noise advection, color ramps, and particle recycling."
      },
      {
        "id": "cg-m2-d53-q4",
        "name": "3 AM SRE: Mobile GPU Meltdown from Particle Fill-Rate Saturation",
        "type": "incident",
        "desc": "Resolve a high-severity mobile crash where particle spell effects in a 3D web game caused thermal throttling and frame rates to collapse to 5 FPS."
      }
    ]
  },
  {
    "day": 54,
    "month": 2,
    "blockNum": 11,
    "title": "3 AM 3D Graphics War Room: WebGL Context Loss, Shader Compilation Jitter & Memory Leaks",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Reliability & Incident Triage (3D Graphics SRE War Room)",
    "spokenGoal": "Step into the high-stakes 3 AM SRE War Room of an enterprise real-time 3D web platform. Diagnose, triage, and eradicate the three deadliest production failures in web graphics: 1) Unhandled WebGL Context Loss (`webglcontextlost` and `webglcontextrestored`) triggered by GPU driver resets, sleep mode, or VRAM pressure; 2) Shader Compilation Jitter (hitch frames dropping from 60 FPS to 0 FPS for 250ms when a new material or light appears, blocking the main thread while the browser compiles GLSL to GPU machine code); and 3) Creeping VRAM Memory Leaks (failing to recursively traverse scene graphs to dispose geometries, materials, textures, and render targets, triggering browser tab crashes after 30 minutes of user browsing).",
    "conceptInvariant": "Zero-Jitter Pre-Warming Invariant: All shaders and GPU pipelines must be compiled during initialization or background loading screens via renderer.compile() or WebGL parallel shader compilation (KHR_parallel_shader_compile); zero shaders should be compiled on-demand during active user interaction.",
    "failureMode": "Spawning a new 3D character with custom PBR materials during live gameplay without pre-warming; WebGL freezes the main thread for 350ms to compile 14 shader programs, dropping 21 consecutive frames and causing the audio to stutter.",
    "tryItFriction": "Construct a Production Graphics Watchdog in TypeScript: 1) Implement robust WebGL context loss handling with automatic asset re-instantiation; 2) Build an asynchronous shader pre-warmer utilizing KHR_parallel_shader_compile extension to eliminate all runtime compilation hitches; 3) Build a recursive VRAM leak audit tool that detects un-disposed GPU buffers and proves zero memory drift over 1,000 model loading cycles.",
    "socraticHints": [
      "Why does Three.js delay shader compilation until an object is actually rendered for the very first time?",
      "Because Three.js builds shader programs dynamically based on the exact combination of active lights, shadow maps, and material flags present in the scene! Until an object is inside the camera frustum with active lights, Three.js doesn't know the exact shader configuration!",
      "You must call 'renderer.compile(scene, camera)' ahead of time to force compilation before rendering."
    ],
    "situationalPuzzle": {
      "scenario": "A 3D product showcase website crashes on mobile Safari after users view 15 products. The developer insists: 'I called scene.remove(mesh) and set mesh = null on every product switch!' Why did the mobile browser still crash with an Out-of-Memory (OOM) error?",
      "options": [
        "Setting variables to null is illegal in JavaScript.",
        "GPU VRAM Orphanage: Removing a mesh from the Three.js scene graph only severs the JavaScript scene reference! The underlying GPU vertex buffers, index buffers, and 4K textures remain allocated inside the GPU driver's VRAM permanently! To free VRAM, the developer must explicitly call 'geometry.dispose()', 'material.dispose()', and recursively call 'texture.dispose()' on every map (map, normalMap, roughnessMap, envMap)!",
        "Mobile Safari does not allow viewing more than 5 products.",
        "The garbage collector was disabled."
      ],
      "answerIdx": 1,
      "debrief": "JavaScript garbage collection only manages JavaScript heap memory; it has zero ability to deallocate native GPU VRAM! In WebGL, any geometry, material, texture, or WebGLRenderTarget created must be explicitly released using '.dispose()'. Failing to do so creates silent VRAM leaks that rapidly crash mobile browsers."
    },
    "quests": [
      {
        "id": "cg-m2-d54-q1",
        "name": "WebGL Context Loss & GPU Driver Lifecycle Architecture",
        "type": "concept",
        "desc": "Document the complete browser-GPU lifecycle during context loss, detailing resource invalidation, event loops, and restoration pipelines."
      },
      {
        "id": "cg-m2-d54-q2",
        "name": "Asynchronous Shader Pre-Warming & Hitch Profiler",
        "type": "detective",
        "desc": "Profile frame time hitches during dynamic shader injection and benchmark KHR_parallel_shader_compile vs renderer.compile pre-warming."
      },
      {
        "id": "cg-m2-d54-q3",
        "name": "Production Autonomous Graphics SRE Watchdog",
        "type": "mastery",
        "desc": "Build an enterprise watchdog in TypeScript providing automatic context loss recovery, recursive VRAM disposal, and shader pre-warming."
      },
      {
        "id": "cg-m2-d54-q4",
        "name": "3 AM SRE: Catastrophic Mobile Crash Wave in Live 3D Auction",
        "type": "incident",
        "desc": "Lead the emergency war room resolving high-severity mobile crashes caused by VRAM texture leaks and runtime shader compilation stalls."
      }
    ]
  },
  {
    "day": 55,
    "month": 2,
    "blockNum": 11,
    "title": "Milestone 10: Screen-Space Post-Processing & Autonomous Context Loss Watchdog Engine",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Block 11 Capstone Project & Architectural Gate",
    "spokenGoal": "Synthesize the entire discipline of high-end visual post-processing effects, screen-space optics, massive GPU particle simulations, and production reliability into an enterprise visual engine: the Screen-Space Post-Processing & Graphics Watchdog Engine. In this milestone, architect a complete visual pipeline: integrate Screen-Space Ambient Occlusion (SSAO) with bilateral blur; Screen-Space Reflections (SSR) with binary search depth marching; a 100,000-particle GPU curl noise simulation; and wrap the entire runtime in an Autonomous Graphics SRE Watchdog that guarantees zero VRAM leaks, eliminates runtime shader hitches via asynchronous pre-warming, and automatically recovers from synthetic WebGL context loss within 500ms.",
    "conceptInvariant": "Production Visual Pipeline Invariant: An enterprise post-processing engine must combine photorealistic screen-space optics with rock-solid fault tolerance, maintaining 60 FPS rendering and recovering gracefully from driver crashes with zero data loss.",
    "failureMode": "Failing the milestone gate when SSAO exhibits severe dark halo artifacts, SSR flickers along viewport edges, particle overdraw tanks mobile frame rates, or triggering synthetic context loss crashes the web application permanently.",
    "tryItFriction": "Construct and deliver the complete milestone application in TypeScript: render an architectural interior with reflective glossy floors and dynamic avatars; apply SSAO and SSR post-processing passes; spawn a 100,000-particle turbulent fireplace; inject synthetic WebGL context loss via WEBGL_lose_context extension; prove 100% glitch-free recovery in under 500ms; and verify 60 FPS performance.",
    "socraticHints": [
      "How do we simulate WebGL context loss programmatically to test watchdog recovery?",
      "Using the standard WebGL extension 'WEBGL_lose_context'! Calling 'ext.loseContext()' immediately invalidates all GPU resources and fires the 'webglcontextlost' event! Calling 'ext.restoreContext()' simulates driver recovery!",
      "This enables automated CI/CD chaos testing for 3D graphics."
    ],
    "situationalPuzzle": {
      "scenario": "During the milestone review, the examiner injects synthetic context loss while the 100,000-particle system is running. The watchdog catches the event, prevents default, and restores the context. However, upon restoration, all particles render as invisible black squares. What asset was not re-initialized upon context restoration?",
      "options": [
        "The HTML canvas was deleted.",
        "GPU Texture & Buffer Re-Binding Failure: Upon WebGL context restoration, ALL GPU buffers, VAOs, shaders, and textures are wiped clean from GPU VRAM! The particle system's noise textures and instanced attribute buffers still held stale WebGLBuffer references pointing to deleted memory! The watchdog must explicitly re-upload all vertex buffers, re-compile shader programs, and re-create textures upon 'webglcontextrestored'.",
        "Particles cannot survive context loss.",
        "The computer ran out of electricity."
      ],
      "answerIdx": 1,
      "debrief": "Context restoration gives you a clean slate WebGL context with empty VRAM. Every single WebGLBuffer, WebGLTexture, and WebGLProgram created previously is dead. A robust watchdog must re-initialize all GPU pipelines from cached CPU descriptors upon restoration."
    },
    "quests": [
      {
        "id": "cg-m2-d55-q1",
        "name": "Post-Processing Pipeline & SRE Watchdog Architecture",
        "type": "concept",
        "desc": "Produce the formal engineering specification detailing multi-pass G-buffer rendering, SSAO/SSR math, and context restoration state machines."
      },
      {
        "id": "cg-m2-d55-q2",
        "name": "Automated Context Loss & VRAM Leak Chaos Harness",
        "type": "detective",
        "desc": "Build an automated testing harness injecting repeated WebGL context losses and measuring restoration latency and VRAM recovery fidelity."
      },
      {
        "id": "cg-m2-d55-q3",
        "name": "Screen-Space Effects & SRE Watchdog Engine Build",
        "type": "mastery",
        "desc": "Build and run the complete production engine in TypeScript combining SSAO, SSR, 100k GPU particles, and autonomous context loss recovery."
      },
      {
        "id": "cg-m2-d55-q4",
        "name": "Milestone 10 Viva Gate: Visual Pipeline & SRE Defense",
        "type": "incident",
        "desc": "Defend the post-processing and reliability architecture before the graphics board, demonstrating live context loss recovery and answering deep optical probes."
      }
    ]
  },

  # =========================================================================
  # BLOCK 12: METAVERSE ARCHITECTURE, PRINCIPAL RFC & FINAL CAPSTONE (Days 56-60)
  # =========================================================================
  {
    "day": 56,
    "month": 2,
    "blockNum": 12,
    "title": "Multi-User Collaborative 3D Virtual Worlds: Spatial Audio, Client Prediction & Entity Interpolation",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Distributed Metaverse Systems (Networking, Spatial Audio & Lag Compensation)",
    "spokenGoal": "Scale 3D graphics and avatars into multi-user collaborative virtual spaces. Dissect the distributed architecture of networked 3D worlds: WebSockets and WebRTC DataChannels for low-latency state synchronization. Solve the fundamental networking challenges of real-time multiplayer: 1) Client-Side Prediction (applying local inputs immediately to eliminate input latency); 2) Server Reconciliation (rewinding and re-simulating inputs when authoritative server snapshots disagree); and 3) Entity Interpolation (buffering remote avatar transform snapshots and smoothly interpolating positions over time to eliminate network jitter). Integrate 3D Spatial Audio: using Web Audio API PannerNode with HRTF (Head-Related Transfer Function) and distance attenuation curves to position remote voices accurately in 3D binaural space.",
    "conceptInvariant": "Entity Interpolation Invariant: Remote avatar transforms must be rendered slightly in the past (interpolation delay &Delta;t_interp &approx; 100ms) to allow continuous Hermite or linear interpolation between discrete network snapshots; rendering remote entities at current time with extrapolation causes severe overshooting and rubber-banding.",
    "failureMode": "Extrapolating remote avatar movements forward in time during high packet loss; when a remote player stops running, extrapolation causes their avatar to sprint through a solid wall, before suddenly rubber-banding backwards 5 meters.",
    "tryItFriction": "Construct a networked 3D multi-avatar playground in TypeScript: connect 2 clients over WebRTC/WebSocket; implement 20Hz transform snapshot broadcasting; build client-side entity interpolation buffer with 100ms delay; attach Web Audio PannerNode (HRTF model) to the remote avatar; and verify silky-smooth remote movement and realistic binaural audio panning.",
    "socraticHints": [
      "Why is WebRTC DataChannels preferred over WebSockets for fast multiplayer character transforms?",
      "Because WebRTC DataChannels can be configured for Unreliable and Unordered delivery (UDP-like)! If a character transform packet is dropped, we don't care—a fresher packet is already on the way! WebSockets (TCP) force retransmissions, creating head-of-line blocking and lag spikes!",
      "Use unreliable WebRTC for 20Hz transforms, and reliable WebSockets for chat and room joins."
    ],
    "situationalPuzzle": {
      "scenario": "In a virtual office application, 50 users gather in a single room. The network bandwidth explodes, consuming 15 megabits per second per user, and mobile clients disconnect due to packet congestion. The server was broadcasting all 50 avatar positions to every client at 30Hz. How do enterprise virtual worlds scale networking to 100+ concurrent avatars?",
      "options": [
        "Cap the room size to 4 people.",
        "Area of Interest (AoI) Filtering & Dynamic Bandwidth Tiering: Implement spatial network partitioning: 1) Proximity culling: only send full 30Hz transform updates for avatars within a 15-meter radius; 2) Distance-based tick rates: avatars 15-40 meters away receive updates at 5Hz with client interpolation; 3) Avatars beyond 50 meters or behind walls are culled completely; 4) Delta compression: pack positions into 16-bit quantized integers.",
        "Drop the framerate to 5 FPS.",
        "Turn off user movement completely."
      ],
      "answerIdx": 1,
      "debrief": "Broadcasting all entities to all users scales as O(N^2). Spatial Area of Interest (AoI) filtering, distance-based tick rate throttling, and delta compression reduce network bandwidth by up to 90%, enabling hundreds of concurrent avatars in shared 3D environments."
    },
    "quests": [
      {
        "id": "cg-m2-d56-q1",
        "name": "Client-Side Prediction & Server Reconciliation Architecture",
        "type": "concept",
        "desc": "Formulate the authoritative client-server networking model for 3D physics, detailing snapshot buffers and reconciliation rollbacks."
      },
      {
        "id": "cg-m2-d56-q2",
        "name": "Spatial Audio HRTF Panning & Jitter Benchmark",
        "type": "detective",
        "desc": "Benchmark Web Audio API PannerNode CPU overhead across 50 audio sources and measure packet arrival jitter impact on entity interpolation."
      },
      {
        "id": "cg-m2-d56-q3",
        "name": "Multiplayer 3D Virtual World with Spatial Audio",
        "type": "mastery",
        "desc": "Build an interactive multiplayer 3D environment in TypeScript with WebRTC data synchronization, entity interpolation, and binaural spatial audio."
      },
      {
        "id": "cg-m2-d56-q4",
        "name": "3 AM SRE: Catastrophic Rubber-Banding Wave in Virtual Concert",
        "type": "incident",
        "desc": "Triage and fix an emergency networking outage where 10,000 avatar attendees suffered severe rubber-banding due to TCP head-of-line blocking."
      }
    ]
  },
  {
    "day": 57,
    "month": 2,
    "blockNum": 12,
    "title": "Real-World Architecture Deep Dive: PinIT Career OS 3D AI Interviewer Avatar Engine",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Architecture Case Study (Enterprise AI Virtual Interviewer)",
    "spokenGoal": "Deconstruct the real-world production architecture of the PinIT Career OS 3D AI Interviewer Avatar Engine. Trace the complete end-to-end multi-modal pipeline: 1) LLM streaming response via Server-Sent Events (SSE); 2) Streaming Text-to-Speech (TTS) via ElevenLabs WebSocket emitting PCM audio chunks alongside synchronized phoneme/viseme timestamps; 3) Web Audio API AudioWorklet decoding and playing audio with zero latency; 4) Real-Time 52-Blendshape Facial Rig updating mouth visemes locked to the audio clock; 5) VRM Avatar Runtime evaluating secondary spring bone physics, subtle postural breathing, and procedural eye saccades; and 6) WebRTC camera input analyzing candidate eye contact and facial engagement. Dissect how the engine maintains a strict 150ms glass-to-glass latency budget.",
    "conceptInvariant": "End-to-End Latency Invariant: For human-like conversational presence, total glass-to-glass latency (from user speech end &rarr; LLM token generation &rarr; TTS synthesis &rarr; avatar audio playback and lip-sync start) must remain strictly under 800ms; avatar mouth motion must be synchronized to audio output with &le; 15ms error.",
    "failureMode": "Buffering entire TTS audio sentences before starting avatar lip-sync; the avatar pauses unnaturally for 2.5 seconds before replying, breaking conversational flow and making the candidate feel disconnected.",
    "tryItFriction": "Construct the integrated PinIT AI Interviewer pipeline in TypeScript: stream mock LLM text tokens; feed tokens to an audio/viseme generator; decode streaming audio chunks via Web Audio AudioContext; drive VRM 1.0 interviewer blendshapes in real time; layer procedural gaze tracking candidate cursor/face; and prove seamless, glitch-free conversational playback.",
    "socraticHints": [
      "Why must audio decoding and scheduling run inside an AudioWorklet or Web Audio scheduler rather than setTimeout/setInterval?",
      "Because setTimeout and setInterval run on the main JavaScript thread, which fluctuates with DOM rendering and garbage collection! Audio requires sub-millisecond hardware-clock accuracy!",
      "The Web Audio AudioContext.currentTime clock runs on a dedicated high-priority audio thread, ensuring zero stutter."
    ],
    "situationalPuzzle": {
      "scenario": "During an AI technical interview, the candidate speaks for 30 seconds. When they finish, the LLM generates a response, but the 3D interviewer avatar's mouth starts moving 400 milliseconds BEFORE the audio begins playing through the candidate's headphones. What synchronization bug occurred?",
      "options": [
        "The candidate's headphones are defective.",
        "Audio Output Device Latency Desynchronization: The viseme animation began instantly upon triggering the audio buffer source, but the physical audio hardware (especially Bluetooth headphones like AirPods) has an output buffer delay (100-300ms)! The graphics engine must query 'audioContext.outputLatency' (or estimate Bluetooth buffer delay) and offset the visual viseme timeline to match the actual acoustic air emission time.",
        "The 3D model is moving too fast.",
        "The LLM hallucinated the lip movements."
      ],
      "answerIdx": 1,
      "debrief": "Bluetooth audio devices introduce substantial hardware output latency (often 150ms to 300ms). If an avatar starts lip-syncing the instant the audio buffer is queued, the mouth will move noticeably before the user hears the sound. Querying 'outputLatency' and delaying the visual animation timeline fixes the sync."
    },
    "quests": [
      {
        "id": "cg-m2-d57-q1",
        "name": "PinIT 3D AI Interviewer End-to-End Latency Blueprint",
        "type": "concept",
        "desc": "Produce the comprehensive timing and architectural diagram detailing SSE token streaming, TTS audio chunking, and viseme scheduling."
      },
      {
        "id": "cg-m2-d57-q2",
        "name": "Audio-Visual Latency & Bluetooth Desync Profiler",
        "type": "detective",
        "desc": "Measure glass-to-glass synchronization error between acoustic output and blendshape aperture across wired and Bluetooth audio outputs."
      },
      {
        "id": "cg-m2-d57-q3",
        "name": "PinIT 3D AI Interviewer Avatar Engine Implementation",
        "type": "mastery",
        "desc": "Build the complete end-to-end AI interviewer in TypeScript combining VRM 1.0, streaming TTS viseme lip-sync, procedural gaze, and spring physics."
      },
      {
        "id": "cg-m2-d57-q4",
        "name": "3 AM SRE: Robotic Stuttering in High-Stakes Executive Interviews",
        "type": "incident",
        "desc": "Resolve an urgent production issue where network packet fragmentation caused the AI interviewer's audio and mouth to stutter violently during live interviews."
      }
    ]
  },
  {
    "day": 58,
    "month": 2,
    "blockNum": 12,
    "title": "Real-World Architecture Deep Dive: High-Scale 3D Product Configurator & WebXR / AR Quick Look",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Enterprise Production Systems (3D E-Commerce, PBR Customization & AR)",
    "spokenGoal": "Deconstruct the architecture of an enterprise 3D Product Configurator (e.g. customized automobiles, luxury watches, furniture) serving millions of web users. Architect the customization pipeline: dynamic material swapping (swapping leather, carbon fiber, brushed aluminum PBR textures on demand without rebuilding geometries), variant switching, and camera choreography. Solve the mobile deployment challenge: export dynamic configurations to Augmented Reality on mobile devices: USDZ for iOS AR Quick Look and glTF / Scene Viewer for Android WebXR. Implement automated VRAM management to ensure buttery smooth 60 FPS across desktop, iOS Safari, and Android Chrome.",
    "conceptInvariant": "Material Shared-Geometry Invariant: In high-scale configurators, variant swapping must alter material parameters and texture bindings without cloning or rebuilding underlying vertex buffers; geometric data must remain shared and static in VRAM.",
    "failureMode": "Cloning the entire 200,000-polygon car geometry every time the user selects a new paint color; after changing colors 10 times, the browser runs out of memory and crashes with an unhandled WebGL context loss.",
    "tryItFriction": "Construct an interactive 3D product configurator in TypeScript: load an optimized luxury watch model; build dynamic material swappers for straps (Leather, Steel, Rubber) and dials (Obsidian, Pearl); implement smooth camera transitions to product macro focal points; export the active configuration to USDZ/glTF on the fly; and verify zero VRAM memory growth across 50 configuration changes.",
    "socraticHints": [
      "Why is USDZ required for Augmented Reality on iOS devices instead of glTF?",
      "Because Apple's native iOS Quick Look AR viewer exclusively supports Pixar's Universal Scene Description (USD / USDZ) format! Android supports glTF via Google Scene Viewer or WebXR!",
      "An enterprise configurator must generate or convert active configurations into USDZ on the fly for seamless iOS AR preview."
    ],
    "situationalPuzzle": {
      "scenario": "A luxury furniture retailer launches a 3D configurator. On mobile devices, when users click 'View in My Room' (AR), the 3D model appears in their living room, but the custom fabric color and velvet roughness they just spent 5 minutes configuring reverts back to the default grey plastic! Why did the AR export lose the custom configuration?",
      "options": [
        "AR does not support colors.",
        "Static Model Linking vs Dynamic USDZ/glTF Generation: The website's 'View in AR' button was hardcoded to link to a static pre-baked 'sofa_default.usdz' file on the CDN! Because AR Quick Look opens outside the browser in native iOS, it cannot read the in-memory Three.js canvas state. The engine must either: 1) Dynamically synthesize an in-memory USDZ blob incorporating the selected texture maps using a client-side USDZ exporter; or 2) Request a serverless worker to bake the variant and return a dynamic USDZ URL.",
        "The user's camera was blocked.",
        "Velvet materials are illegal in WebXR."
      ],
      "answerIdx": 1,
      "debrief": "Native AR Quick Look and Scene Viewer are external native applications; they do not share memory with the web browser. To preserve customizations in AR, the application must export the active in-memory scene state into a dynamically generated USDZ / glTF package before launching the AR viewer."
    },
    "quests": [
      {
        "id": "cg-m2-d58-q1",
        "name": "Enterprise 3D Configurator Pipeline Architecture",
        "type": "concept",
        "desc": "Produce the comprehensive systems architecture detailing variant graphs, material swapping state machines, and dynamic USDZ export pipelines."
      },
      {
        "id": "cg-m2-d58-q2",
        "name": "Dynamic Material Swap VRAM & Leak Audit",
        "type": "detective",
        "desc": "Execute automated stress tests performing 500 consecutive material swaps and measure GPU memory allocation stability."
      },
      {
        "id": "cg-m2-d58-q3",
        "name": "Interactive 3D Configurator with AR Quick Look Export",
        "type": "mastery",
        "desc": "Build an enterprise 3D product configurator in TypeScript featuring PBR material swapping, macro camera choreography, and live USDZ export."
      },
      {
        "id": "cg-m2-d58-q4",
        "name": "3 AM SRE: Black Screen AR Exports on E-Commerce Black Friday",
        "type": "incident",
        "desc": "Triage and fix an emergency outage where dynamic USDZ exports rendered as pitch-black models on iOS due to missing sRGB color space flags."
      }
    ]
  },
  {
    "day": 59,
    "month": 2,
    "blockNum": 12,
    "title": "Principal 3D Graphics Architect RFC: Custom WebGL/WebGPU vs Three.js vs Babylon.js vs Unity WebGL",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Principal Engineering Leadership (Trade-Off Analysis, RFC & Strategic Vision)",
    "spokenGoal": "Operate at the highest level of technical leadership: author a Principal 3D Graphics Architect Request for Comments (RFC). Conduct an exhaustive, unvarnished comparative analysis across the modern web graphics technology spectrum: 1) Custom Raw WebGL 2.0 / WebGPU Engine (maximum control, smallest bundle < 50KB, zero framework bloat, but massive engineering overhead); 2) Three.js (industry standard, lightweight, massive ecosystem, excellent for avatars and configurators, but loose architectural opinionation); 3) Babylon.js (comprehensive enterprise game engine, built-in physics/GUI, strong WebGPU support, but larger bundle size); 4) PlayCanvas (cloud-first, entity-component system, exceptional mobile performance); and 5) Unity / Unreal WebGL Export (mature tooling, but massive 30-100MB WASM payloads, terrible cold-start load times, and poor DOM integration). Author the definitive architectural RFC selecting and defending the multi-year technology stack for PinIT Career OS.",
    "conceptInvariant": "Engine Selection Invariant: Web application cold-start load time, VRAM footprint, and seamless DOM/CSS integration supersede desktop-centric rendering features; an enterprise web 3D architecture must guarantee time-to-first-render < 2.0s on 4G mobile networks.",
    "failureMode": "Choosing Unity WebGL export for an e-commerce website; users on mobile devices are greeted with a 45-megabyte WASM download and a 12-second loading spinner, causing a 68% bounce rate before the 3D scene even renders.",
    "tryItFriction": "Author the complete Principal 3D Architecture RFC document: formulate executive summary, technical constraints, deep quantitative benchmark matrix (bundle size, cold start, draw call batching, memory footprint, WebGPU roadmap), and migration plan; defend the decision before an executive engineering panel; and resolve tough architectural challenges.",
    "socraticHints": [
      "Why does a 50MB Unity WebGL build fail for mainstream web applications even if Unity has better 3D graphics tools?",
      "Because web users expect instant loading (< 2 seconds)! In e-commerce and web platforms, every additional second of download time increases user bounce rate by 20%!",
      "Three.js or lightweight custom WebGPU engines load in under 500ms, integrating natively with HTML UI."
    ],
    "situationalPuzzle": {
      "scenario": "A startup's engineering team is debating their next-generation 3D architecture. The CTO wants to rewrite everything in pure raw WebGPU/WGSL to achieve maximum theoretical performance. The VP of Product wants to use Three.js to ship features next month. As Principal Architect, how do you resolve this conflict?",
      "options": [
        "Quit the company.",
        "Pragmatic Layered Architecture with WebGPU Path: Recommend adopting Three.js (using Three.js WebGPURenderer / TSL: Three.js Shading Language) as the primary platform! This provides immediate developer velocity, rich asset loaders (VRM, glTF), and vast community support, while automatically utilizing the high-performance WebGPU backend underneath on supported devices, with seamless WebGL 2.0 fallback for legacy browsers. Custom WGSL compute shaders can still be injected where maximum performance is needed.",
        "Ban 3D graphics entirely.",
        "Flip a coin."
      ],
      "answerIdx": 1,
      "debrief": "A Principal Architect balances business velocity with long-term technical excellence. Rewriting everything from scratch in raw WebGPU wastes months reinventing glTF parsers and camera math. Adopting Three.js with its new WebGPURenderer delivers the best of both worlds: rapid delivery today with bleeding-edge WebGPU hardware acceleration."
    },
    "quests": [
      {
        "id": "cg-m2-d59-q1",
        "name": "Web 3D Engine Comparative Benchmark Matrix",
        "type": "concept",
        "desc": "Produce the comprehensive quantitative evaluation matrix comparing Bundle Size, First Contentful Paint, WebGPU support, and ecosystem tooling."
      },
      {
        "id": "cg-m2-d59-q2",
        "name": "Cold-Start Latency & Bundle Size Automated Audit",
        "type": "detective",
        "desc": "Benchmark production builds of Three.js vs Babylon.js vs Unity WebGL across simulated 3G/4G networks, measuring time-to-interactive."
      },
      {
        "id": "cg-m2-d59-q3",
        "name": "Principal 3D Graphics Architect RFC Publication",
        "type": "mastery",
        "desc": "Author the comprehensive formal RFC establishing the multi-year 3D graphics, avatar animation, and WebGPU technology roadmap for PinIT Career OS."
      },
      {
        "id": "cg-m2-d59-q4",
        "name": "RFC Defense & Executive Architecture Review Board",
        "type": "incident",
        "desc": "Defend the 3D graphics RFC before the Executive Engineering Committee, answering challenging queries regarding WebGPU maturity and browser support."
      }
    ]
  },
  {
    "day": 60,
    "month": 2,
    "blockNum": 12,
    "title": "Master Capstone: ApexAvatar Globally Distributed Interactive 3D Metaverse & Photorealistic Autonomous AI Avatar Platform Master Capstone Viva Gate",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Month 2 Master Capstone & Comprehensive Viva Voce Gate",
    "spokenGoal": "The Ultimate 60-Day Master Capstone and Comprehensive Viva Voce Gate: stand before the Senior Board of 3D Graphics, Computer Vision, and Digital Human Architects to present, demonstrate, and defend ApexAvatar. Demonstrate the complete synthesis of all 60 days of 3D interactive graphics, character rigging, facial blendshapes, physics, and distributed systems: 1) High-performance WebGL 2.0 / WebGPU PBR rendering with HDR IBL and dynamic soft shadows; 2) Full VRM 1.0 avatar runtime with Dual Quaternion skeletal skinning, secondary Verlet spring bone hair dynamics, and procedural gaze; 3) 52-Blendshape ARKit facial rig driven by simultaneous real-time audio viseme lip-sync and live webcam computer vision tracking; 4) Responsive Kinematic Character Controller with Two-Bone Foot Placement IK and dynamic ragdoll physics; 5) Screen-space post-processing (SSAO, SSR, 100k GPU curl noise particles); 6) Multi-user collaborative networking with WebRTC data synchronization, entity interpolation, and binaural 3D spatial audio; and 7) Autonomous SRE Watchdog with zero VRAM leaks and instant WebGL context loss recovery.",
    "conceptInvariant": "Master Metaverse & Digital Human Synthesis Invariant: An enterprise real-time 3D platform must seamlessly unite photorealistic rendering, anatomical digital human animation, responsive physical locomotion, and distributed multi-user collaboration into a cohesive, zero-latency experience that operates flawlessly within mobile browser constraints.",
    "failureMode": "Failing the 60-day capstone defense when the panel injects simulated WebGL context loss during a live multi-user audio interview session and the application crashes, leaks VRAM, or exhibits horrifying facial clipping.",
    "tryItFriction": "Deliver the live end-to-end demonstration and oral defense: host an interactive multi-user 3D virtual environment with photorealistic PBR lighting; control an avatar with responsive KCC and Foot IK; demonstrate live AI speech lip-sync alongside webcam head tracking; trigger dynamic ragdoll physics upon impact; initiate synthetic context loss and demonstrate 100% recovery within 500ms; and defend every mathematical and architectural choice under rigorous oral examination.",
    "socraticHints": [
      "What distinguishes a World-Class 3D Graphics & Avatar Architect from an ordinary web developer?",
      "The master understands the entire physical and mathematical pipeline: from linear algebra and shader compilation, to human anatomy and facial action units, to numerical physics integrators, GPU memory hardware bandwidth, and distributed network synchronization!",
      "They build systems that are visually breathtaking, anatomically convincing, and rock-solid under real-world production stress."
    ],
    "situationalPuzzle": {
      "scenario": "During your final Master Capstone defense, the examination panel executes the ultimate multi-stress chaos test: 1) Connects 4 concurrent users over WebRTC; 2) Triggers a high-velocity physics explosion spawning 100,000 particles; 3) Plays high-speed speech audio through the AI avatar; 4) Injects sudden WebGL context loss; 5) Resizes the viewport to 4K resolution. How does ApexAvatar survive without crashing or dropping below 60 FPS?",
      "options": [
        "The browser crashes and closes immediately.",
        "Flawless Unified System Orchestration: 1) WebRTC entity interpolation smooths remote transforms over network jitter; 2) Particles execute entirely on GPU compute/instanced shaders with overdraw bounding; 3) The viseme scheduler locks speech aperture to the Web Audio clock with Bluetooth delay compensation; 4) The Autonomous SRE Watchdog catches context loss, holds pending network packets, re-instantiates GPU pipelines within 400ms, and resumes 60 FPS rendering; 5) Dynamic resolution scaling protects fill-rate budgets at 4K.",
        "The application turns off all graphics and displays plain text.",
        "The candidate fails the examination."
      ],
      "answerIdx": 1,
      "debrief": "This is the absolute zenith of web graphics and digital human engineering. When rendering pipelines, character kinematics, audio-visual synchronization, physics solvers, and network architectures are designed as a unified, fault-tolerant system, the 3D application delivers an uncompromised experience across any hardware, network, or operating condition."
    },
    "quests": [
      {
        "id": "cg-m2-d60-q1",
        "name": "ApexAvatar Master Metaverse Architecture Blueprint",
        "type": "concept",
        "desc": "Produce the comprehensive end-to-end system blueprint detailing rendering passes, VRM pipelines, FACS visemes, KCC physics, and WebRTC protocols."
      },
      {
        "id": "cg-m2-d60-q2",
        "name": "Full-Stack Graphics & Metaverse Automated Stress Audit",
        "type": "detective",
        "desc": "Execute automated chaos test suites validating zero VRAM leaks, 60 FPS rendering under 4K resolution, and sub-500ms context loss recovery."
      },
      {
        "id": "cg-m2-d60-q3",
        "name": "ApexAvatar Production 3D Metaverse & Avatar Platform Build",
        "type": "mastery",
        "desc": "Deploy and verify the complete working enterprise platform in TypeScript integrating WebGL/WebGPU, VRM 1.0, 52-blendshape visemes, KCC, and WebRTC."
      },
      {
        "id": "cg-m2-d60-q4",
        "name": "Master Capstone Viva Voce & Live Multi-User Defense",
        "type": "incident",
        "desc": "Defend the entire 60-day 3D graphics and digital human architecture before the Senior Architecture Board under live multi-user stress testing."
      }
    ]
  }
]
