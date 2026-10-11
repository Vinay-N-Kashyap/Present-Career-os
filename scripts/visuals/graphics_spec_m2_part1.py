# scripts/visuals/graphics_spec_m2_part1.py
# Course 15: 3D Interactive Graphics & Avatar Animation (course-3d-graphics)
# Month 2: Days 31-45 (Blocks 7-9) - 60 Quests Total

GRAPHICS_M2_PART1 = [
  # =========================================================================
  # BLOCK 7: SKELETAL RIGGING, JOINT HIERARCHIES & SKINNING MATRICES (Days 31-35)
  # =========================================================================
  {
    "day": 31,
    "month": 2,
    "blockNum": 7,
    "title": "Skeletal Rigging Anatomy: Bone Hierarchies, Bind Pose vs Rest Pose & Inverse Bind Matrices",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Skeletal Kinematics (Joint Trees & Coordinate Transformations)",
    "spokenGoal": "Step into character animation and virtual humans. A 3D avatar cannot be deformed realistically by moving mesh vertices independently. Enter Skeletal Rigging: a tree hierarchy of virtual 'Bones' (Joints) that drive mesh deformation. Distinguish between Rest Pose (the original undeformed skeleton), Bind Pose (the exact skeletal transform when vertices were permanently attached to bones), and Current Pose. Deconstruct the mathematical cornerstone of character skinning: the Inverse Bind Matrix (IBM). Understand why every joint must store its inverse global transform at bind time, transforming mesh vertices from global model space into local bone coordinates before current animation matrices move them back.",
    "conceptInvariant": "Inverse Bind Matrix Invariant: To animate a vertex relative to a bone, it must first be transformed into that bone's local coordinate space using the Inverse Bind Matrix: v_local = IBM_joint &times; v_bind; subsequent multiplication by the joint's current world matrix moves the vertex to its animated world position.",
    "failureMode": "Omitting the Inverse Bind Matrix in a custom skinning shader; vertices are multiplied directly by current bone world matrices, causing the character mesh to violently explode across world space or double-transform into an unrecognizable spiky silhouette.",
    "tryItFriction": "Implement a 3-joint kinematic finger skeleton in TypeScript with Three.js Bone and Skeleton classes; calculate manual Inverse Bind Matrices at rest pose; apply a 45-degree rotation to the middle knuckle joint; and prove that child joints inherit the parent rotation cleanly while the base knuckle remains stationary.",
    "socraticHints": [
      "Why can't we simply multiply the vertex by the bone's current world transform matrix?",
      "Because the vertex coordinates are already in Model Space! If you multiply by Bone World Matrix directly, you apply the bone's position on top of the vertex's existing position, displacing it twice as far from the origin!",
      "The Inverse Bind Matrix cancels out the bone's original rest position, placing the vertex relative to the joint center."
    ],
    "situationalPuzzle": {
      "scenario": "A technical artist imports an FBX character rig into Three.js. As soon as the animation plays, the character's mesh instantly shrinks to 1% scale and flies 500 units into the sky, while the bone wireframes stay at the origin. What caused this catastrophic transform misalignment?",
      "options": [
        "The browser does not support WebGL 2.0 bones.",
        "Bind Pose Transform Desynchronization: The FBX file had unapplied scale/translation on the mesh object that differed from the skeleton's root transform when the skin was bound in Maya/Blender. The Inverse Bind Matrices baked into the glTF/FBX do not match the mesh's root transform matrix, multiplying mismatched coordinate systems.",
        "Three.js SkinnedMesh requires quad meshes only.",
        "The vertex buffer has corrupt UV coordinates."
      ],
      "answerIdx": 1,
      "debrief": "In 3D character pipelines, the mesh and skeleton must have identical transform transforms (0 translation, 0 rotation, 1,1,1 scale) when binding occurs ('Freeze Transformations' in Maya / 'Apply All Transforms' in Blender). If the mesh has a hidden 100x scale factor, the Inverse Bind Matrix will multiply against mismatched space, projecting vertices into deep space."
    },
    "quests": [
      {
        "id": "cg-m2-d31-q1",
        "name": "Inverse Bind Matrix Mathematical Derivation",
        "type": "concept",
        "desc": "Derive the coordinate frame transformations proving that v_animated = Joint_current &times; IBM_joint &times; v_bind."
      },
      {
        "id": "cg-m2-d31-q2",
        "name": "glTF 2.0 Skin & Joint Hierarchy Parser",
        "type": "detective",
        "desc": "Inspect raw glTF 2.0 JSON buffers: extract the 'skins' array, decode the float32 InverseBindMatrices accessor, and reconstruct the bone hierarchy."
      },
      {
        "id": "cg-m2-d31-q3",
        "name": "Three.js SkinnedMesh & Skeleton Architecture",
        "type": "mastery",
        "desc": "Construct a procedural cylindrical worm mesh, rig it with a 5-bone hierarchical skeleton, bind with Skeleton and SkinnedMesh, and animate bending waves."
      },
      {
        "id": "cg-m2-d31-q4",
        "name": "3 AM SRE: Exploding Character Mesh on Rig Pose Loading",
        "type": "incident",
        "desc": "Diagnose and fix a production avatar service incident where uploaded FBX character models explode due to unapplied transform deltas in the bind pose matrix."
      }
    ]
  },
  {
    "day": 32,
    "month": 2,
    "blockNum": 7,
    "title": "Linear Blend Skinning (LBS): Bone Indices, Weight Normalization & GPU Matrix Palettes",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Vertex Skinning Algorithms (LBS Mathematics & Shader Palettes)",
    "spokenGoal": "Master the core algorithm powering 99% of real-time 3D games and animated avatars: Linear Blend Skinning (LBS). Examine how every vertex in a SkinnedMesh is influenced by up to 4 bones (or 8 bones for high-fidelity rigs) stored in vertex attributes: `skinIndex` (vec4 unsigned integers) and `skinWeight` (vec4 normalized floats). Prove why the sum of skin weights for every single vertex must strictly equal exactly 1.0. Dive into the GPU implementation: how bone transformation matrices are packed into a 2D Texture or Uniform Buffer Object (UBO) known as the 'Bone Matrix Palette', and write the custom GLSL vertex shader that blends 4 bone matrices per vertex in parallel.",
    "conceptInvariant": "Partition of Unity Invariant: For every vertex, the sum of its bone skinning weights must equal exactly 1.0 (&sum; w_i = 1.0); any deviation causes vertices to inflate, collapse toward the origin, or drift during skeletal articulation.",
    "failureMode": "Importing a character model where vertex skin weights sum to 0.72 due to naive artist painting; moving the elbow joint causes the forearm mesh to shrink and deflate like a punctured balloon because the vertex only moves 72% of the bone's distance.",
    "tryItFriction": "Write a raw GLSL skinning vertex shader in WebGL 2.0: bind an array of 64 bone matrices as uniform mat4 u_boneMatrices[64]; read in_boneIndices (ivec4) and in_boneWeights (vec4); compute blendedSkinMatrix = &sum; in_boneWeights[i] * u_boneMatrices[in_boneIndices[i]]; transform the vertex; and verify 100% smooth deformation across a bending cylinder.",
    "socraticHints": [
      "Why do game engines and WebGL restrict the number of bone influences per vertex to 4?",
      "Because GPU vertex attributes are natively formatted in 4-component vectors (vec4: xyzw)! Storing 4 bone indices and 4 bone weights fits perfectly into two 16-byte GPU vertex buffer attributes!",
      "If a vertex needs 8 bones, the engine must bind secondary attributes (skinIndex2, skinWeight2), doubling the attribute bandwidth."
    ],
    "situationalPuzzle": {
      "scenario": "A mobile WebGL avatar viewer renders character models smoothly on desktop, but on mid-range Android devices, characters fail to render entirely with WebGL shader error: 'uniform array u_boneMatrices exceeds maximum uniform vector count (MAX_VERTEX_UNIFORM_VECTORS = 128)'. A 70-bone humanoid skeleton requires 70 * 4 = 280 uniform vectors. How do modern engines support 100+ bones on low-end mobile GPUs?",
      "options": [
        "Reduce the skeleton to 15 bones.",
        "Bone Matrix Texture (Data Texture Palette): Instead of storing bone matrices in uniform vectors, pack the 16 float values of each bone matrix into 4 pixels of a floating-point 2D DataTexture (RGBA32F). In the vertex shader, fetch bone matrices via texelFetch(u_boneTexture, ...)! This supports hundreds of bones with zero uniform limit constraints.",
        "Run the skinning calculation entirely on the CPU in JavaScript.",
        "Render the avatar as a static unmoving statue."
      ],
      "answerIdx": 1,
      "debrief": "Three.js and high-end engines default to packing bone matrices into a floating-point DataTexture ('boneTexture'). Because textures are sampled via 'texelFetch', the 128 uniform vector hardware limit is bypassed completely, enabling full 150-bone humanoid rigs with fingers and face bones on any mobile device."
    },
    "quests": [
      {
        "id": "cg-m2-d32-q1",
        "name": "Linear Blend Skinning Mathematical Formulation",
        "type": "concept",
        "desc": "Formulate the linear combination equation for vertex positions and normal vectors: v' = &sum; w_i * (M_i * B_i^-1) * v."
      },
      {
        "id": "cg-m2-d32-q2",
        "name": "Automated Skin Weight Normalization Linter",
        "type": "detective",
        "desc": "Build a validator that iterates over 50,000 vertices in a BufferGeometry, detects vertices where &sum; weights &ne; 1.0, and re-normalizes them."
      },
      {
        "id": "cg-m2-d32-q3",
        "name": "Raw GLSL GPU Skinning Vertex Shader",
        "type": "mastery",
        "desc": "Implement a custom Three.js ShaderMaterial or raw WebGL skinning shader reading bone matrices from a 2D DataTexture with normal transformation."
      },
      {
        "id": "cg-m2-d32-q4",
        "name": "3 AM SRE: Crashing Mobile WebGL from Uniform Vector Overflow",
        "type": "incident",
        "desc": "Triage and fix an emergency mobile crash where high-fidelity 95-bone avatars broke uniform vector limits on Mali/Adreno GPUs."
      }
    ]
  },
  {
    "day": 33,
    "month": 2,
    "blockNum": 7,
    "title": "Skinning Artifacts & Dual Quaternion Skinning (DQS): Candy-Wrapper Volume Loss Mitigation",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Advanced Skinning Mathematics (Dual Quaternions vs LBS Degeneracies)",
    "spokenGoal": "Confront the fundamental mathematical flaw of Linear Blend Skinning: the notorious 'Candy-Wrapper' artifact (joint collapse and volume loss under severe twisting, such as rotating a wrist 180 degrees). Understand why LBS fails: linearly interpolating two rotation matrices does not produce a valid rotation matrix—it causes the interpolated matrix to scale toward zero at 180 degrees! Enter Dual Quaternion Skinning (DQS): representing rigid body transformations (rotation + translation) as 8-component Dual Quaternions (a real quaternion for orientation and a dual quaternion for position). Derive Dual Quaternion Linear Blending (DLB) and verify how DQS preserves 100% of joint volume during extreme rotational twists.",
    "conceptInvariant": "Dual Quaternion Invariant: Rigid body spatial transformations form the Lie group SE(3); interpolating transformations via normalized Dual Quaternions guarantees that the resulting transform remains an exact rigid motion with zero volume compression or scale distortion.",
    "failureMode": "Deploying standard LBS on a VR character waving their hands; twisting the wrist joint causes the character's forearm to pinch into a pencil-thin point (candy-wrapper collapse), destroying realism and triggering user immersion failure.",
    "tryItFriction": "Construct a twisting forearm mesh in Three.js; apply a 170-degree axial twist to the wrist bone under standard LBS and measure cross-sectional volume loss; implement Dual Quaternion Skinning in a custom vertex shader; and demonstrate that the forearm retains its exact muscular circumference throughout the full 170-degree twist.",
    "socraticHints": [
      "Why does averaging two opposite rotation matrices cause a mesh to collapse?",
      "Because a 0-degree rotation is identity I, and a 180-degree rotation around Z has negative diagonal terms [-1, -1, 1]! Averaging them yields [0, 0, 1]—a degenerate matrix with zero scale in X and Y!",
      "Dual Quaternions preserve the spherical geometry of rotation space, ensuring the blended transform never degenerates."
    ],
    "situationalPuzzle": {
      "scenario": "An engineer switches a character shader from LBS to Dual Quaternion Skinning (DQS). The wrist twist now preserves volume perfectly! However, whenever the character bends their knee to 90 degrees, a bizarre bulging bulge appears on the opposite side of the joint ('joint bulging artifact'). Why does pure DQS produce bulging on bending joints?",
      "options": [
        "The GPU driver has a floating-point bug.",
        "DQS Rigid Volume Preservation Behavior: Pure Dual Quaternion Skinning strictly preserves distance and volume everywhere. On the inner side of a bending joint (like the back of a knee or inside of an elbow), natural flesh is supposed to compress, but DQS forces it to maintain rigid volume, producing an unnatural bulging crease. High-end engines solve this with Hybrid Skinning (blending LBS and DQS based on joint bend angle).",
        "The skeleton needs more bones.",
        "Dual quaternions cannot handle angles greater than 45 degrees."
      ],
      "answerIdx": 1,
      "debrief": "Dual Quaternions are mathematically ideal for axial twists (wrists, shoulders, spine), but can over-preserve volume on acute flexion bends (knees, elbows). Production character engines frequently utilize Hybrid Skinning or blend DQS weights with standard LBS to achieve realistic flesh compression alongside volume preservation."
    },
    "quests": [
      {
        "id": "cg-m2-d33-q1",
        "name": "Dual Quaternion Mathematics & Clifford Algebra",
        "type": "concept",
        "desc": "Derive the algebra of dual numbers (&epsilon;^2 = 0) and dual quaternions q_hat = q_r + &epsilon; * q_d for rigid body transformations."
      },
      {
        "id": "cg-m2-d33-q2",
        "name": "Volume Preservation Metric & Benchmarking Suite",
        "type": "detective",
        "desc": "Compute mesh convex hull volume across 0 to 180 degree joint rotations comparing LBS versus DQS to quantify volume decay."
      },
      {
        "id": "cg-m2-d33-q3",
        "name": "Dual Quaternion Skinning GLSL Shader Implementation",
        "type": "mastery",
        "desc": "Write a complete WebGL 2.0 vertex shader implementing Dual Quaternion Linear Blending (DLB) with Antipodal alignment handling."
      },
      {
        "id": "cg-m2-d33-q4",
        "name": "3 AM SRE: Distorted Avatar Hands in VR Streaming App",
        "type": "incident",
        "desc": "Resolve a high-profile VR application bug where avatar forearms severely pinched during real-time hand-tracking twists by implementing dual quaternion blending."
      }
    ]
  },
  {
    "day": 34,
    "month": 2,
    "blockNum": 7,
    "title": "Skeletal Animation Tracks: Keyframe Interpolation, Slerp & Three.js AnimationMixer Blending",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Animation Runtime Architecture (Clips, Mixers & Cross-Fading)",
    "spokenGoal": "Bring rigged skeletons to life with dynamic animation clips. Dissect how skeletal animation data is formatted in glTF: `KeyframeTrack` arrays containing discrete timestamps and transform values (VectorKeyframeTrack for positions/scales, QuaternionKeyframeTrack for rotations). Master interpolation modes: Linear, Step, and Cubic Spline. Emphasize why rotational tracks must be interpolated using Spherical Linear Interpolation (Slerp) rather than Lerp. Deconstruct the Three.js `AnimationMixer` engine: instantiate `AnimationAction` controllers, execute smooth cross-fading (`crossFadeTo`) between conflicting animations (e.g., Idle to Run to Jump), and configure additive animation blending layers.",
    "conceptInvariant": "Quaternion Slerp Invariant: Rotational keyframes must be interpolated along the shortest geodesic arc of the 4D unit hypersphere using Slerp: slerp(q1, q2, t) = (sin((1-t)&theta;) * q1 + sin(t&theta;) * q2) / sin(&theta;); linear interpolation (Lerp) distorts angular velocity and causes unnatural rotational speed spikes.",
    "failureMode": "Using linear vector interpolation (Lerp) without normalization to blend two 180-degree character turn quaternions; the interpolated quaternion passes near the origin (0,0,0,0), causing the character's torso to suddenly shrink, twist wildly, and snap back.",
    "tryItFriction": "Build an animation state machine in TypeScript using Three.js AnimationMixer: load 'Idle', 'Walk', and 'Sprint' clips from a glTF avatar; bind keyboard controls (W, Shift); execute seamless 300ms cross-fades between states with action.fadeIn() and action.fadeOut(); and ensure foot-sliding is minimized via synchronized clip weight blending.",
    "socraticHints": [
      "What happens if the dot product of two quaternions q1 &middot; q2 is negative before running Slerp?",
      "In quaternion space, q and -q represent the exact same 3D physical orientation! But if their dot product is negative, interpolating between them travels the long 270-degree arc around the hypersphere instead of the short 90-degree path!",
      "You must check 'if (dot < 0) q2 = -q2;' before Slerp to ensure shortest-path rotation."
    ],
    "situationalPuzzle": {
      "scenario": "A character is playing a 'Running' animation clip. The game triggers an 'Attack' animation. When the attack starts, the character's legs instantly freeze in place, sliding across the floor like an ice skater while the torso swings the sword. How does production character animation allow a character to run and attack simultaneously?",
      "options": [
        "Play both animations on two separate character models.",
        "Layered / Masked Animation Blending: The animation system isolates bone tracks into masks (e.g. LowerBody vs UpperBody). The 'Running' clip is applied with 100% weight to pelvis, hips, and leg bones, while the 'Attack' clip is applied with 100% weight to spine, chest, arms, and head! The mixer blends the two clips concurrently across distinct bone subtrees.",
        "Speed up the running animation by 200%.",
        "Record 500 separate animations for every possible running attack combination."
      ],
      "answerIdx": 1,
      "debrief": "Layered and masked animation blending is a foundational industry technique. By creating bone-specific animation tracks or masking out bone hierarchies, an avatar can blend an upper-body gesture (aiming, waving, attacking) on top of lower-body locomotion (walking, crouching) with zero asset duplication."
    },
    "quests": [
      {
        "id": "cg-m2-d34-q1",
        "name": "Quaternion Spherical Linear Interpolation (Slerp) Proof",
        "type": "concept",
        "desc": "Derive the mathematical formula for Slerp and prove that constant angular velocity is maintained across the entire keyframe interval."
      },
      {
        "id": "cg-m2-d34-q2",
        "name": "AnimationMixer Delta-Time Synchronizer & Profiler",
        "type": "detective",
        "desc": "Profile CPU time consumed by AnimationMixer.update(delta) across 50 animated characters and identify bone matrix recalculation bottlenecks."
      },
      {
        "id": "cg-m2-d34-q3",
        "name": "Locomotion State Machine with Masked Upper-Body Actions",
        "type": "mastery",
        "desc": "Build an interactive character animation controller featuring Idle-Walk-Run blending, jump transitions, and simultaneous upper-body waving."
      },
      {
        "id": "cg-m2-d34-q4",
        "name": "3 AM SRE: Stuttering & Foot Sliding in Multiplayer Metaverse",
        "type": "incident",
        "desc": "Resolve a high-visibility metaverse bug where remote avatars exhibited severe animation popping and foot sliding due to un-normalized Slerp quaternions."
      }
    ]
  },
  {
    "day": 35,
    "month": 2,
    "blockNum": 7,
    "title": "Milestone 6: Dual Quaternion Skeletal Animation & Joint Skinning Engine",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Block 7 Capstone Project & Architectural Gate",
    "spokenGoal": "Synthesize the complete mathematical and architectural discipline of skeletal rigging and real-time character skinning into a high-performance engine: the Dual Quaternion Skeletal Animation Engine. In this milestone, architect an end-to-end character animation pipeline from scratch: parse glTF 2.0 skinning hierarchies and bone textures; construct a multi-channel AnimationMixer supporting smooth cross-fading and upper-body masking; implement custom GPU Dual Quaternion Linear Blending (DQS) in GLSL to eliminate candy-wrapper volume loss; and benchmark rendering 40 fully animated rigged avatars simultaneously at 60 FPS.",
    "conceptInvariant": "Engine Rigging Invariant: A production skeletal engine must decouple animation evaluation (CPU keyframe Slerp) from mesh skinning deformation (GPU matrix/dual-quaternion palette blending) to ensure linear O(1) rendering scaling per character instance.",
    "failureMode": "Failing the milestone gate when character wrist twists collapse into razor-thin points under 180-degree rotation, or when playing 20 concurrent avatars drops frame rates from 60 FPS to 14 FPS due to redundant CPU-side skinning calculations.",
    "tryItFriction": "Construct and deliver the complete TypeScript + WebGL milestone engine: load a full 65-bone humanoid avatar glTF; bind bone matrices to a 2D float texture palette; execute real-time cross-fades between Walk and Martial Arts Kick clips; demonstrate zero wrist volume loss during a 180-degree hand twist via DQS; and maintain rock-solid 60 FPS across 40 animated characters.",
    "socraticHints": [
      "How do we render 40 instances of the same animated character without evaluating 40 duplicate skeletons?",
      "If the characters share the same animation phase, they share the exact same bone texture! If they have different animation times, each character updates a separate row or slice in a shared Texture2DArray palette!",
      "This prevents rebinding textures and enables instanced skinned mesh rendering."
    ],
    "situationalPuzzle": {
      "scenario": "During the milestone review, the lead architect asks: 'Why did you store bone transforms as 2x4 dual quaternions (8 floats) instead of 4x4 affine matrices (16 floats) in your GPU bone texture?' What is the primary memory bandwidth advantage?",
      "options": [
        "Matrices are deprecated in WebGL.",
        "50% VRAM Bandwidth Reduction: An affine rigid transform matrix has 16 floats (64 bytes). A unit dual quaternion represents the exact same rigid transform (rotation + translation) in only 8 floats (32 bytes)! This cuts the GPU memory bandwidth required to fetch bone transforms by exactly 50%, doubling vertex shader cache efficiency on mobile GPUs.",
        "Dual quaternions eliminate the need for vertex shaders.",
        "Floating point textures only support 8 floats maximum."
      ],
      "answerIdx": 1,
      "debrief": "Memory bandwidth is the primary bottleneck in mobile GPU skinning. By packing bone transforms into dual quaternions (two vec4s: rotation quaternion + translation dual), you cut texture fetch traffic in half, drastically improving battery life and frame rates on mobile devices."
    },
    "quests": [
      {
        "id": "cg-m2-d35-q1",
        "name": "Skeletal Rigging & Dual Quaternion Architecture Specification",
        "type": "concept",
        "desc": "Produce the formal engineering design document detailing bone hierarchy traversal, IBM extraction, DQS vertex math, and palette textures."
      },
      {
        "id": "cg-m2-d35-q2",
        "name": "Volume Retention & Skeletal Performance Test Suite",
        "type": "detective",
        "desc": "Build automated unit tests verifying 0% volume loss during extreme twists and benchmark CPU-GPU transfer latency across 40 avatar rigs."
      },
      {
        "id": "cg-m2-d35-q3",
        "name": "Dual Quaternion Skeletal Animation Engine Implementation",
        "type": "mastery",
        "desc": "Build and run the complete production engine in TypeScript featuring glTF skinning, AnimationMixer cross-fading, and DQS vertex shaders."
      },
      {
        "id": "cg-m2-d35-q4",
        "name": "Milestone 6 Viva Gate: Rigging Architecture Defense",
        "type": "incident",
        "desc": "Defend the skinning engine before the graphics panel, demonstrating live DQS volume preservation and answering deep mathematical probes."
      }
    ]
  },

  # =========================================================================
  # BLOCK 8: MORPH TARGETS, BLENDSHAPES & FACIAL ANIMATION (Days 36-40)
  # =========================================================================
  {
    "day": 36,
    "month": 2,
    "blockNum": 8,
    "title": "Morph Targets Architecture: Vertex Position Deltas, Normal Deltas & GPU Attribute Buffers",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Mesh Deformation Systems (Morph Targets & Vertex Deltas)",
    "spokenGoal": "Transition from skeletal bone movement to high-fidelity surface deformations: Morph Targets (also known as Blendshapes). Understand why skeletal rigging is insufficient for nuanced facial expressions, muscle bulges, and speech: bones create rigid regional movements, whereas expressions require non-linear geometric deformation. Dissect how Morph Targets work mathematically: storing vertex position and normal *deltas* (&Delta;p, &Delta;n) relative to a base mesh. Explore how WebGL 2.0 and Three.js handle morph targets: traditional attribute buffers versus modern DataTexture / Texture2DArray morph palettes. Write the GPU vertex shader that sums weighted morph deltas: v' = v_base + &sum; w_i * &Delta;v_i.",
    "conceptInvariant": "Morph Delta Invariant: Morph targets store displacement vectors (&Delta;v = v_target - v_base), not absolute positions; this allows multiple independent morph targets (e.g. smile + blink + jawOpen) to be linearly combined without overwriting one another.",
    "failureMode": "Storing absolute vertex positions instead of deltas for facial morphs; activating 'mouthOpen' and 'smile' simultaneously causes the two shapes to battle for absolute coordinates, resulting in severe polygon tearing and jagged facial collapse.",
    "tryItFriction": "Construct a procedural 3D sphere mesh in Three.js; generate two morph target deltas: 1) 'Squash' (Z compression, XY expansion), and 2) 'Spike' (protruding vertex spikes); configure mesh.morphTargetInfluences; and demonstrate smooth real-time blending from 0.0 to 1.0 of both targets simultaneously without vertex jitter.",
    "socraticHints": [
      "Why is storing morph targets as deltas more memory-efficient than storing full target meshes?",
      "Because most morph targets only affect a small subset of the mesh! An eyebrow raise only displaces 500 vertices out of a 20,000-vertex face mesh! Sparse delta encoding only needs to store non-zero offsets!",
      "Furthermore, deltas are additive, enabling infinite combinations of expressions."
    ],
    "situationalPuzzle": {
      "scenario": "A 3D character artist creates 64 facial blendshapes for realistic speech. In WebGL 1.0, the engine crashes with: 'Maximum number of vertex attributes exceeded (MAX_VERTEX_ATTRIBS = 16)'. A mesh can only bind ~8 morph attributes before running out of hardware vertex registers. How does Three.js support 64+ simultaneous morph targets in modern WebGL 2.0?",
      "options": [
        "Delete 48 of the blendshapes.",
        "Morph Target Texture Array: In WebGL 2.0, Three.js packs all morph target position and normal deltas into a high-precision 2D Texture2DArray or DataTexture. The vertex shader reads morph deltas using 'texelFetch' indexed by vertex ID and morph index, bypassing the hardware attribute limit entirely and supporting 100+ blendshapes concurrently.",
        "Compute morph blending on the CPU every frame.",
        "Convert all morph targets into bones."
      ],
      "answerIdx": 1,
      "debrief": "Modern Three.js automatically utilizes 'morphTargetsTexture' when WebGL 2.0 is available. All morph target deltas are baked into texture slices, allowing characters to evaluate 60 to 120 facial blendshapes simultaneously with zero vertex attribute register pressure."
    },
    "quests": [
      {
        "id": "cg-m2-d36-q1",
        "name": "Morph Target Linear Combination Formulation",
        "type": "concept",
        "desc": "Formulate the mathematical summation for positions, normals, and tangents under N active morph target weights."
      },
      {
        "id": "cg-m2-d36-q2",
        "name": "Sparse Morph Delta Texture Packer",
        "type": "detective",
        "desc": "Analyze glTF morph target accessors, compute memory footprints of dense vs sparse delta encodings, and verify normal re-normalization."
      },
      {
        "id": "cg-m2-d36-q3",
        "name": "Procedural Facial Blendshape Mesh in Three.js",
        "type": "mastery",
        "desc": "Build a procedural humanoid face geometry with morph attributes for smile, frown, blink, and jaw drop with real-time UI sliders."
      },
      {
        "id": "cg-m2-d36-q4",
        "name": "3 AM SRE: Vertex Exploding on Custom glTF Morph Import",
        "type": "incident",
        "desc": "Fix an avatar rendering bug where importing a Blender glTF avatar caused facial vertices to detach due to mismatched morph target indices."
      }
    ]
  },
  {
    "day": 37,
    "month": 2,
    "blockNum": 8,
    "title": "ARKit / FACS 52 Facial Blendshapes: Action Units, Micro-Expressions & Normalization",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Facial Anatomy & Industry Standards (Apple ARKit & FACS)",
    "spokenGoal": "Master the global gold standard for 3D digital humans and avatar facial animation: the Apple ARKit 52 Blendshape Standard, grounded in Paul Ekman's Facial Action Coding System (FACS). Deconstruct the 52 standardized Action Units (AUs): EyeBlinkLeft/Right, JawOpen, MouthSmileLeft/Right, BrowDownLeft, CheekPuff, and TongueOut. Analyze how human facial musculature decomposes into isolated, anatomically accurate geometric channels. Understand expression normalization: clamping weights between [0.0, 1.0], implementing mutually exclusive expressions (e.g. preventing 'mouthSmile' and 'mouthFrown' from causing unnatural facial tearing), and constructing high-level emotional poses (Joy, Anger, Surprise, Contempt) from raw Action Unit combinations.",
    "conceptInvariant": "FACS Orthogonality Invariant: Each of the 52 ARKit blendshapes corresponds to an isolated, physiologically independent facial muscle action unit; complex human emotional expressions are linear superpositions of these orthogonal basis shapes.",
    "failureMode": "Applying raw additive blendshape weights without muscular conflict clamping; driving 'eyeBlinkLeft = 1.0' and 'eyeWideLeft = 1.0' simultaneously causes the eyelid geometry to intersect inside the eyeball, producing severe black z-fighting and nightmarish visual glitches.",
    "tryItFriction": "Load an ARKit-compatible 3D avatar head in Three.js; implement an Expression Controller that exposes high-level emotional presets ('Happy', 'Surprised', 'Skeptical'); mathematically map preset values to the underlying 52 blendshape channels with automated conflict resolution; and verify anatomically believable facial posing.",
    "socraticHints": [
      "Why are eye blinks, smiles, and brow movements split into Left and Right channels (e.g. eyeBlinkLeft vs eyeBlinkRight)?",
      "Because human faces are inherently asymmetric! Natural micro-expressions, winks, smirks, and quizzical brow raises require unilateral muscle control!",
      "If left and right were merged into a single channel, the avatar would look like a robotic mannequin."
    ],
    "situationalPuzzle": {
      "scenario": "An AI avatar platform receives streaming blendshape weights from an external neural network. Occasionally, the neural network outputs negative weights (-0.3) or excessively large weights (2.5) during fast speech. When these unconstrained weights hit Three.js morphTargetInfluences, the avatar's jaw disconnects from its skull and the eyes invert into the brain. How must an enterprise avatar engine sanitize streaming blendshape weights?",
      "options": [
        "Ignore the frames entirely.",
        "Non-Linear Normalization & Muscular Clamping Pipeline: Pass all incoming weights through an anatomical sanity filter: 1) Clamp each channel strictly to [0.0, 1.0]; 2) Apply a soft-knee exponential falloff curve near extremes; 3) Execute mutual exclusion rules (e.g., if mouthSmile > 0.5, attenuate mouthFrown by (1.0 - mouthSmile)); 4) Apply temporal smoothing (EMA / low-pass filter) to eliminate single-frame neural network jitter.",
        "Only allow 5 blendshapes to be active.",
        "Reload the 3D model whenever an invalid weight is received."
      ],
      "answerIdx": 1,
      "debrief": "Raw animation weights from neural networks or computer vision trackers are noisy and prone to extreme outliers. Production avatar systems always route streaming inputs through a physiological clamping and smoothing pipeline to maintain visual anatomical integrity under all conditions."
    },
    "quests": [
      {
        "id": "cg-m2-d37-q1",
        "name": "FACS 52 Action Unit Anatomical Mapping Reference",
        "type": "concept",
        "desc": "Document the complete 52 ARKit blendshape taxonomy, mapping each shape to its physical facial muscle and emotional role."
      },
      {
        "id": "cg-m2-d37-q2",
        "name": "Blendshape Conflict & Clipping Audit Filter",
        "type": "detective",
        "desc": "Build an algorithmic validator that detects geometric interpenetration when conflicting blendshape channels are fired simultaneously."
      },
      {
        "id": "cg-m2-d37-q3",
        "name": "ARKit 52 Emotional Preset State Machine",
        "type": "mastery",
        "desc": "Implement a full TypeScript controller mapping 7 primary emotional states into blended 52-channel weights with temporal interpolation."
      },
      {
        "id": "cg-m2-d37-q4",
        "name": "3 AM SRE: Horrifying Eyeball Clipping on Live Streamed Avatar",
        "type": "incident",
        "desc": "Emergency fix an avatar streaming glitch where concurrent blink and squint weights caused avatar eyelids to invert inside the eye sockets."
      }
    ]
  },
  {
    "day": 38,
    "month": 2,
    "blockNum": 8,
    "title": "Real-Time Audio-to-Lip-Sync (Visemes): Phoneme Classification, MFCC & Speech Curves",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Audio-Visual Synchronization (Speech-Driven Avatar Animation)",
    "spokenGoal": "Empower avatars to speak with convincing, real-time lip synchronization. Unpack the relationship between spoken acoustics and visual mouth shapes: Phonemes (acoustic speech units like /p/, /t/, /k/, /aa/) versus Visemes (the visual mouth shapes that correspond to those phonemes, such as 'viseme_PP', 'viseme_aa', 'viseme_O'). Explore two lip-sync pipelines: 1) Real-time Web Audio API frequency analysis via Fast Fourier Transform (FFT) and Mel-Frequency Cepstral Coefficients (MFCC); and 2) Transcript-based phoneme alignment (using forced aligners or text-to-speech phoneme timestamps from ElevenLabs/OpenAI). Master dynamic Viseme Blending Curves: coarticulation (how preceding and succeeding phonemes shape the current mouth pose) to prevent robotic stuttering.",
    "conceptInvariant": "Coarticulation Invariant: In human speech, mouth shapes anticipate upcoming sounds and linger after prior sounds; viseme transitions must use overlapping sigmoid or cubic Bézier blending curves with forward lookahead to prevent rigid robotic snapping.",
    "failureMode": "Snapping viseme weights instantly to 1.0 on phoneme onset and 0.0 on phoneme release; the avatar's mouth violently twitches and chatters like a malfunctioning animatronic doll, completely destroying speech believability.",
    "tryItFriction": "Construct a real-time speech lip-sync engine in TypeScript: feed a pre-recorded voice audio track through Web Audio AnalyserNode; extract real-time RMS amplitude and spectral centroid; map acoustic energy to 5 core viseme blendshapes ('aa', 'ih', 'ou', 'E', 'oh'); apply exponential smoothing (&alpha; = 0.25); and demonstrate natural talking animation synchronized to audio playback.",
    "socraticHints": [
      "Why can't simple audio volume (RMS energy) alone produce convincing lip-sync?",
      "Because humming with your mouth closed produces high volume, but your lips don't open! Different vowels ('oo' vs 'aa') have identical volume but completely different mouth shapes!",
      "Spectral frequency distribution (formants) or phoneme classification is necessary to distinguish mouth opening from lip puckering."
    ],
    "situationalPuzzle": {
      "scenario": "An AI interview bot streams TTS audio chunks over WebSockets. The audio plays smoothly, but the avatar's mouth movements lag behind the speech by 180 milliseconds, causing a distracting 'bad kung-fu dub' effect. Profiling reveals that the lip-sync module waits for audio chunks to finish decoding before calculating visemes. How does a production engine achieve zero-latency lip synchronization?",
      "options": [
        "Speed up the avatar's rendering loop to 120 FPS.",
        "Predictive Phoneme Stream Alignment: Instead of analyzing raw audio after arrival, the TTS backend sends aligned phoneme timing metadata (timestamps and durations) alongside the audio stream! The client-side audio player uses the Web Audio AudioContext.currentTime clock as the master synchronization timeline, scheduling viseme weight curves exactly at audio buffer playback timestamps with sub-millisecond precision.",
        "Mute the audio so users don't notice the delay.",
        "Delay the video stream by 10 seconds."
      ],
      "answerIdx": 1,
      "debrief": "Top-tier conversational avatar platforms (like PinIT Career OS and Unreal Engine MetaHumans) do not rely on lagging client-side audio sniffing for TTS. The TTS engine emits timestamped phoneme/viseme events in parallel with audio packets, allowing the graphics engine to schedule mouth animations precisely locked to the audio hardware clock."
    },
    "quests": [
      {
        "id": "cg-m2-d38-q1",
        "name": "Phoneme-to-Viseme Acoustic Mapping Taxonomy",
        "type": "concept",
        "desc": "Map the 44 English phonemes (CMU Pronouncing Dictionary) to the 15 standard Disney/Oculus visemes and ARKit blendshape channels."
      },
      {
        "id": "cg-m2-d38-q2",
        "name": "Web Audio Spectral Formant Analyzer",
        "type": "detective",
        "desc": "Build an audio analysis module extracting first and second formants (F1, F2) from microphone input to estimate vowel mouth shapes."
      },
      {
        "id": "cg-m2-d38-q3",
        "name": "Coarticulated Viseme Animation Controller",
        "type": "mastery",
        "desc": "Build an audio-synchronized lip-sync engine in Three.js that takes timestamped viseme cues and executes smooth Bézier coarticulation curves."
      },
      {
        "id": "cg-m2-d38-q4",
        "name": "3 AM SRE: Desynchronized Lip-Sync on AI Video Generation",
        "type": "incident",
        "desc": "Debug and fix a production avatar streaming pipeline where network jitter caused audio and mouth movements to drift out of sync by 350ms."
      }
    ]
  },
  {
    "day": 39,
    "month": 2,
    "blockNum": 8,
    "title": "Camera-Based Facial Tracking Integration: MediaPipe 468 Landmarks & Kalman Filter Smoothing",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Computer Vision & Motion Capture (Webcam-Driven Avatar Control)",
    "spokenGoal": "Drive 3D avatar facial animation directly from a user's webcam in real time. Deconstruct the vision-to-graphics pipeline: capture webcam video via `navigator.mediaDevices.getUserMedia()`; feed video frames into Google MediaPipe Face Mesh running via WebAssembly/WebGPU; extract 468 3D facial landmarks (normalized XYZ coordinates); and calculate head rotation matrix (Pitch, Yaw, Roll) using the Perspective-n-Point (PnP) algorithm on rigid facial landmarks (nose bridge, eye corners). Solve the fundamental challenge of webcam motion capture: sensor noise and jitter. Implement a 1D/6D Kalman Filter and One Euro Filter to eliminate camera noise while preserving snappy micro-expressions.",
    "conceptInvariant": "One Euro Filter Invariant: Adaptive low-pass filtering dynamically varies its cutoff frequency based on movement speed: at low velocities, cutoff frequency drops to eliminate static jitter; at high velocities, cutoff increases to eliminate tracking lag.",
    "failureMode": "Mapping raw MediaPipe landmark positions directly to avatar blendshapes without filtering; the avatar's face constantly twitches with high-frequency micro-jitter (15-30Hz camera noise), making the avatar appear terrified or hyperactive.",
    "tryItFriction": "Integrate MediaPipe Face Mesh in TypeScript: process webcam video; calculate eye openness ratio (distance between upper and lower eyelid landmarks divided by eye width); feed the raw value through a One Euro Filter; drive an avatar's 'eyeBlinkLeft' blendshape; and verify rock-solid jitter-free blinking with zero perceptible lag.",
    "socraticHints": [
      "Why does a standard static low-pass filter (exponential moving average) fail for facial tracking?",
      "Because if you set the smoothing high enough to eliminate jitter, fast motions (like sudden blinks or rapid head turns) suffer from heavy, sluggish lag!",
      "An adaptive filter like the One Euro Filter solves this by smoothing aggressively when stationary, but opening up instantly during fast movement."
    ],
    "situationalPuzzle": {
      "scenario": "A user turns their head 45 degrees to the right while using a webcam-driven avatar. MediaPipe continues tracking landmarks, but the avatar suddenly starts winking its left eye and opening its mouth sideways! What caused the facial expression tracking to distort during head rotation?",
      "options": [
        "The webcam resolution was too low.",
        "Perspective Projection Distortion without Head Pose Decoupling: MediaPipe landmark coordinates were measured in 2D image pixel space! When the head turns, the distance between left eyelid landmarks in the 2D camera image shrinks due to perspective foreshortening. The engine interpreted this geometric perspective shrink as an intentional eye blink! To fix this, landmark coordinates must be transformed into the head's local canonical coordinate frame using the estimated 3D head pose before computing blendshapes.",
        "The avatar model's neck bone is inverted.",
        "Webcams cannot track turned faces."
      ],
      "answerIdx": 1,
      "debrief": "Perspective projection causes severe foreshortening when a face rotates relative to the camera. Production facial tracking systems always estimate the 6-DOF head pose first, un-rotate landmarks into canonical face space, and only then calculate blendshape activations."
    },
    "quests": [
      {
        "id": "cg-m2-d39-q1",
        "name": "Perspective-n-Point (PnP) Head Pose Estimation",
        "type": "concept",
        "desc": "Derive the mathematics of estimating 3D camera pose from 2D facial feature correspondences using rigid skull landmarks."
      },
      {
        "id": "cg-m2-d39-q2",
        "name": "One Euro Filter Mathematical Jitter Benchmark",
        "type": "detective",
        "desc": "Implement the One Euro Filter in TypeScript, simulate noisy 30 FPS landmark streams, and benchmark latency vs jitter reduction."
      },
      {
        "id": "cg-m2-d39-q3",
        "name": "MediaPipe Webcam-to-Avatar Real-Time Rig",
        "type": "mastery",
        "desc": "Build an end-to-end web application capturing webcam input, extracting MediaPipe landmarks, filtering noise, and driving an ARKit 3D avatar head."
      },
      {
        "id": "cg-m2-d39-q4",
        "name": "3 AM SRE: Head Tracking Drift in Virtual Conference App",
        "type": "incident",
        "desc": "Triage and resolve a customer complaint where avatar head rotations accumulated continuous drift due to un-clamped Euler angle gimbal lock."
      }
    ]
  },
  {
    "day": 40,
    "month": 2,
    "blockNum": 8,
    "title": "Milestone 7: Real-Time 52-Blendshape Facial Rig & Audio-Driven Lip-Sync Engine",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Block 8 Capstone Project & Architectural Gate",
    "spokenGoal": "Synthesize the complete discipline of facial animation, morph targets, FACS standards, audio visemes, and computer vision tracking into an enterprise-grade engine: the Real-Time 52-Blendshape Facial Rig. Build a unified digital human facial runtime: pack 52 ARKit blendshapes into GPU texture arrays; implement a dual-driver animation pipeline supporting both live webcam motion capture (MediaPipe with One Euro filtering) and autonomous speech-driven lip-sync (coarticulated visemes from Web Audio / TTS); incorporate procedural micro-expressions (natural blinking and breathing); and demonstrate 60 FPS rendering under concurrent facial deformation.",
    "conceptInvariant": "Unified Facial Driver Invariant: A production facial engine must support multiple concurrent animation sources (e.g. webcam head tracking + TTS speech lip-sync + procedural blinking) by blending them through a prioritized layer stack with muscular conflict resolution.",
    "failureMode": "Failing the milestone gate when speech audio plays but mouth shapes conflict with webcam tracking inputs, causing the mouth to spasm between speech visemes and camera tracking data, or dropping frame rates below 60 FPS due to CPU blendshape evaluations.",
    "tryItFriction": "Construct and deliver the complete milestone application in TypeScript + Three.js: load a high-fidelity photorealistic 3D avatar head; bind all 52 ARKit blendshapes; play a 15-second speech audio track with coarticulated visemes driving the mouth; layer procedural eye blinks and micro-saccades on top; accept live webcam input to steer head orientation; and prove 60 FPS performance.",
    "socraticHints": [
      "How do we prevent webcam mouth tracking from fighting with speech audio lip-sync when both are active?",
      "By implementing a channel-masking priority layer! When the avatar is speaking audio, mouth and jaw blendshapes are driven exclusively by the speech viseme pipeline, while the upper face (eyes, brows, head pose) is driven by the webcam!",
      "When speech stops, mouth control smoothly cross-fades back to the webcam."
    ],
    "situationalPuzzle": {
      "scenario": "During milestone evaluation, the examiner plays a high-speed speech track containing 12 phonemes per second. The avatar's mouth fails to open fully on vowels because the previous consonant's closing viseme hasn't finished blending. How does a production viseme mixer handle rapid speech without swallowing vowels?",
      "options": [
        "Skip every other word in the audio.",
        "Dynamic Viseme Duration Scaling & Vowel Priority Weighting: The viseme scheduler scales transition blend durations inversely with speech tempo. Furthermore, vowel visemes ('aa', 'oh', 'ee') receive a higher blending priority weight over transient consonants, ensuring the mouth aperture achieves its target openness peak before transitioning to the next phoneme.",
        "Slow down audio playback by 50%.",
        "Lock the mouth open permanently."
      ],
      "answerIdx": 1,
      "debrief": "High-speed human speech involves significant vowel elongation relative to rapid consonant closures. Production lip-sync schedulers prioritize vowel opening peaks and dynamically shorten blend curves during fast speech to prevent acoustic swallowing."
    },
    "quests": [
      {
        "id": "cg-m2-d40-q1",
        "name": "52-Blendshape Facial Engine Architecture Specification",
        "type": "concept",
        "desc": "Produce the comprehensive architectural design specification detailing GPU morph texture layouts, layer blending stacks, and priority masks."
      },
      {
        "id": "cg-m2-d40-q2",
        "name": "Viseme Latency & Conflict Resolution Verification Suite",
        "type": "detective",
        "desc": "Build automated tests asserting zero muscular conflicts across 1,000 randomized emotional and speech combinations and measuring audio-visual sync error."
      },
      {
        "id": "cg-m2-d40-q3",
        "name": "Real-Time 52-Blendshape Facial Engine Build",
        "type": "mastery",
        "desc": "Implement the complete working TypeScript engine integrating 52 ARKit blendshapes, audio viseme blending, procedural blinks, and webcam head tracking."
      },
      {
        "id": "cg-m2-d40-q4",
        "name": "Milestone 7 Viva Gate: Digital Human Facial Rig Defense",
        "type": "incident",
        "desc": "Defend the facial animation engine before the Senior Graphics Panel, proving real-time 60 FPS performance under dual audio-webcam streaming."
      }
    ]
  },

  # =========================================================================
  # BLOCK 9: THE VRM AVATAR STANDARD & SPRING BONE PHYSICS (Days 41-45)
  # =========================================================================
  {
    "day": 41,
    "month": 2,
    "blockNum": 9,
    "title": "The VRM 3D Avatar Standard: glTF Extension, Humanoid Bone Mapping & First-Person Filtering",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Avatar Standards & Interoperability (The VRM Specification)",
    "spokenGoal": "Master the industry-standard 3D avatar format for the open metaverse, virtual influencers, and AI agents: the VRM Standard (VRM 0.0 and VRM 1.0). Deconstruct why raw glTF/FBX models fail for interoperable avatars: every 3D modeler names bones differently ('Bip01_Head', 'mixamorig:Head', 'DEF-head'), meaning an animation made for one avatar breaks on every other! Analyze how VRM solves this by extending glTF 2.0 with a standardized `humanoid` bone map (standardizing hips, spine, head, upperArm, etc.). Deep-dive into VRM's first-person view layer filtering: how the engine automatically hides the avatar's own head mesh in VR/first-person view while keeping shadows and body meshes visible.",
    "conceptInvariant": "Humanoid Standardization Invariant: The VRM specification maps arbitrary proprietary bone naming conventions to a strict, standardized Humanoid Bone Tree; any VRM-compliant animation or pose can be retargeted to any VRM avatar with zero manual bone re-mapping.",
    "failureMode": "Loading an arbitrary glTF character into a virtual reality app without first-person mesh filtering; the VR headset camera is placed inside the character's head, clipping through the inside of the eyeballs and teeth, horrifying the user.",
    "tryItFriction": "Load a VRM 1.0 avatar in Three.js using @pixiv/three-vrm; query the standardized humanoid skeleton via vrm.humanoid.getNormalizedBoneNode('head'); apply a procedural 30-degree tilt; configure first-person mesh annotations; and verify that the head mesh is invisible to camera layer 1 while remaining visible in shadow maps and third-person cameras.",
    "socraticHints": [
      "Why does VRM define a 'normalized' bone orientation (T-pose with specific axis alignment)?",
      "Because if Avatar A has its arm bones oriented along +X and Avatar B has them oriented along +Y, applying the same rotational quaternion to both will bend one arm forward and the other arm into the ceiling!",
      "VRM normalizes bone rest orientations so a rotation of (0, 0, 45) produces identical physical movement on all models."
    ],
    "situationalPuzzle": {
      "scenario": "A 3D developer loads a VRM avatar created by a Japanese artist. The developer tries to apply an animation clip recorded in Blender on a Mixamo character. The avatar's arms twist backwards and its legs cross into a pretzel. What crucial step was skipped?",
      "options": [
        "The model file is corrupt.",
        "Animation Retargeting via VRM Humanoid Bone Mapping: The Mixamo animation was baked with proprietary bone axes and bind poses. The developer must run the animation through a VRM Retargeting Pipeline: 1) Sample rotational deltas relative to the source rest pose; 2) Convert rotations into normalized VRM Humanoid space; 3) Apply the retargeted quaternions to the standardized VRM humanoid bone nodes.",
        "VRM avatars do not support running animations.",
        "The developer must re-rig the avatar manually in Maya."
      ],
      "answerIdx": 1,
      "debrief": "Skeletal retargeting is essential when sharing animations across diverse characters. The VRM standard simplifies this by providing normalized bone nodes, allowing retargeting libraries to calculate rotational deltas relative to a standardized T-pose."
    },
    "quests": [
      {
        "id": "cg-m2-d41-q1",
        "name": "VRM 1.0 vs 0.0 Specification Architecture",
        "type": "concept",
        "desc": "Compare VRM 0.0 and VRM 1.0 specifications: coordinate spaces (Z-up vs Y-up), glTF extension schemas, and humanoid bone trees."
      },
      {
        "id": "cg-m2-d41-q2",
        "name": "Automated Humanoid Bone Retargeting Validator",
        "type": "detective",
        "desc": "Build an algorithmic parser that inspects uploaded glTF files, detects arbitrary bone nomenclature, and maps them to VRM humanoid standards."
      },
      {
        "id": "cg-m2-d41-q3",
        "name": "Three-VRM Avatar Loader & Controller in TypeScript",
        "type": "mastery",
        "desc": "Build an interactive web application loading VRM 1.0 models with @pixiv/three-vrm, controlling humanoid poses, and toggling first-person layers."
      },
      {
        "id": "cg-m2-d41-q4",
        "name": "3 AM SRE: Broken Metaverse Avatars After VRM 1.0 Migration",
        "type": "incident",
        "desc": "Fix an emergency regression where upgrading a metaverse platform from VRM 0.0 to 1.0 inverted character coordinate axes across 50,000 user models."
      }
    ]
  },
  {
    "day": 42,
    "month": 2,
    "blockNum": 9,
    "title": "VRM Spring Bone Physics: Secondary Animation, Verlet Integration & Collision Spheres",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Secondary Motion & Physics (Spring Bones for Hair & Clothing)",
    "spokenGoal": "Give avatars life and organic physical presence through secondary motion: VRM Spring Bone Physics. Understand why manual keyframe animation for long hair, skirts, ribbons, and capes is impractical: secondary motion must react dynamically to character velocity, gravity, and wind. Deconstruct the numerical solver behind Spring Bones: Verlet Integration (computing new position from current and previous positions: x_next = 2x - x_prev + a &middot; &Delta;t^2). Examine spring parameters: Stiffness (restoring force toward bind pose), Drag / Damping (air resistance), and Gravity. Master Collision Detection: defining spherical colliders on the head, shoulders, and chest to prevent dynamic hair strands from clipping through the avatar's body.",
    "conceptInvariant": "Verlet Stability Invariant: Verlet integration maintains unconditional stability for constrained secondary physics because velocity is implicitly encoded in the displacement between consecutive time steps (v &approx; (x - x_prev) / &Delta;t), eliminating energy drift common in explicit Euler integration.",
    "failureMode": "Using explicit Euler integration with variable delta time for hair physics; a momentary frame rate dip to 15 FPS causes &Delta;t to spike, causing hair bones to explode outwards to infinity and wrap around the avatar's neck.",
    "tryItFriction": "Construct a 4-bone hanging ponytail chain in Three.js; implement a Verlet integration solver with gravity, stiffness, and drag; attach a collision sphere representing the head; move the avatar's head rapidly in circles; and prove that the ponytail swings with realistic inertia while bouncing cleanly off the head collider without clipping.",
    "socraticHints": [
      "Why is Verlet integration preferred over Euler integration for cloth and hair physics?",
      "Because Verlet integration is time-reversible and conserves energy much better! Distance constraints (keeping bones at a fixed length) are enforced simply by pushing vertex positions apart, which Verlet handles without introducing artificial kinetic energy!",
      "Euler integration easily accumulates numerical energy error, causing springs to vibrate uncontrollably."
    ],
    "situationalPuzzle": {
      "scenario": "A 3D game featuring VRM avatars drops from 60 FPS to 18 FPS on mobile when a character with complex twin-tail hair and a multi-layered skirt walks on screen. Profiling shows that VRM Spring Bone collision checks consume 70% of the entire frame time. There are 120 spring bones and 40 collision spheres. How do we optimize spring bone collision detection?",
      "options": [
        "Disable all secondary physics on mobile.",
        "Spatial Partitioning & Hierarchical Bounding Spheres: 120 bones &times; 40 colliders = 4,800 sphere-sphere distance checks every substep! Optimize by: 1) Grouping colliders by body part (head colliders only test against hair bones; leg colliders only test against skirt bones); 2) Substep clamping: run spring physics at fixed 60Hz timesteps instead of variable sub-stepping; 3) SIMD / WebAssembly: move the Verlet solver to WASM or GPU compute.",
        "Make the character bald.",
        "Lower the screen resolution."
      ],
      "answerIdx": 1,
      "debrief": "Pairwise collision testing scales as O(N &times; M). In VRM models with high bone counts, testing every hair bone against every finger and toe collider is pure waste. Partitioning colliders into localized groups (Hair-vs-Head, Skirt-vs-Thighs) eliminates 90% of redundant distance calculations."
    },
    "quests": [
      {
        "id": "cg-m2-d42-q1",
        "name": "Verlet Integration & Distance Constraint Derivation",
        "type": "concept",
        "desc": "Derive the mathematical equations for Verlet position integration and iterative Jakobsen distance constraint enforcement for bone chains."
      },
      {
        "id": "cg-m2-d42-q2",
        "name": "Spring Bone Collision Benchmark & Profiler",
        "type": "detective",
        "desc": "Profile CPU execution time of 500 spring bones across varying collision sphere counts and quantify algorithmic speedups from spatial filtering."
      },
      {
        "id": "cg-m2-d42-q3",
        "name": "Custom Verlet Spring Bone Physics Solver",
        "type": "mastery",
        "desc": "Build a modular TypeScript secondary physics solver for Three.js bone chains supporting stiffness, drag, gravity, wind, and sphere colliders."
      },
      {
        "id": "cg-m2-d42-q4",
        "name": "3 AM SRE: Exploding Hair Bones on Lag Spikes in Production",
        "type": "incident",
        "desc": "Fix an avatar glitch where hair bones flew into outer space during network lag spikes by implementing fixed-timestep substep clamping."
      }
    ]
  },
  {
    "day": 43,
    "month": 2,
    "blockNum": 9,
    "title": "Procedural Gaze, Saccadic Eye Movements & Autonomous Micro-Behaviors",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Autonomous Behavioral Animation (Gaze, Saccades & Life-Like Presence)",
    "spokenGoal": "Cross the uncanny valley by infusing 3D avatars with autonomous procedural behaviors. Understand why a static avatar looks dead: human beings are never stationary. Even when staring at an object, the human eye performs rapid ballistic micro-jumps called Saccades (10-30ms jumps occurring 2-3 times per second) and continuous tiny tremors (Fixational eye movements). Implement Procedural Gaze: calculating LookAt target vectors with spherical eye rotation clamping (restricting eye rotation to human limits: &plusmn;35&deg; yaw, &plusmn;25&deg; pitch) and coordinated head-eye tracking (eyes lead the movement, followed by neck and head rotation). Layer autonomous breathing cycles and spontaneous blinking to establish genuine lifelike presence.",
    "conceptInvariant": "Vestibulo-Ocular & Saccadic Invariant: Natural visual attention combines high-frequency ballistic saccades (discrete jumps) with smooth pursuit tracking; locking an avatar's eyes to a fixed coordinate with continuous linear interpolation produces a terrifying, unblinking zombie stare.",
    "failureMode": "Aiming avatar eyes directly at the user's camera with rigid LookAt math; the avatar stares unblinkingly without saccades or micro-movements, triggering severe uncanny valley distress and discomfort in human users.",
    "tryItFriction": "Construct a Procedural Gaze Controller in Three.js for a VRM avatar: take a dynamic target (mouse pointer); implement coordinated eye-head kinematics (eyes rotate 70% toward target, head rotates 30%); add a Poisson-distributed timer that triggers random &plusmn;2&deg; saccadic eye jumps every 1.5 seconds; and layer a periodic 4-second sinusoidal chest breathing cycle.",
    "socraticHints": [
      "Why should the eyes turn faster than the head when looking at a new target?",
      "In human biology, the eye muscles have very low mass and orient instantly (ballistic saccade)! The head has significant mechanical inertia and follows hundreds of milliseconds later!",
      "Reversing this order or moving them simultaneously at the same speed looks completely robotic."
    ],
    "situationalPuzzle": {
      "scenario": "An AI virtual companion avatar uses LookAt to track the user's cursor. When the user moves the cursor behind the avatar's back, the avatar's neck rotates 180 degrees backwards like an owl, snapping through its collarbones. How must natural gaze kinematics be constrained?",
      "options": [
        "Do not allow the cursor to move behind the avatar.",
        "Kinematic Gaze Cone Hierarchy with Deadzones: Structure gaze tracking into hierarchical angular limits: 1) Eye Gaze Cone (&plusmn;30&deg;): eyes track first; 2) Neck Gaze Cone (&plusmn;50&deg;): neck turns if target exceeds eye limit; 3) Chest/Hips: body turns if target exceeds neck limit; 4) If target falls outside the total human field of regard (> 110&deg;), smoothly drop tracking target and return head to forward rest pose.",
        "Turn off neck bones completely.",
        "Flip the avatar 180 degrees instantly."
      ],
      "answerIdx": 1,
      "debrief": "Anatomical constraints are non-negotiable for believable characters. Dividing gaze into concentric angular cones (Eyes -> Neck -> Chest -> Full Body) ensures that the avatar behaves like a real person, naturally breaking eye contact when a target moves behind them."
    },
    "quests": [
      {
        "id": "cg-m2-d43-q1",
        "name": "Human Oculomotor Kinematics & Saccade Mathematics",
        "type": "concept",
        "desc": "Model the mathematical kinematics of ocular saccades (main sequence relationship between amplitude, peak velocity, and duration)."
      },
      {
        "id": "cg-m2-d43-q2",
        "name": "Uncanny Valley Perception & Gaze Anomaly Detector",
        "type": "detective",
        "desc": "Analyze gaze tracking trajectories, detecting unnatural continuous linear staring and quantifying saccadic frequency distributions."
      },
      {
        "id": "cg-m2-d43-q3",
        "name": "Autonomous Gaze, Blinking & Breathing Controller",
        "type": "mastery",
        "desc": "Build a complete TypeScript procedural life-presence system for VRM avatars featuring hierarchical LookAt, saccades, and breathing cycles."
      },
      {
        "id": "cg-m2-d43-q4",
        "name": "3 AM SRE: Nightmare Owl-Neck Glitch in AI Interview Session",
        "type": "incident",
        "desc": "Fix an urgent bug during an executive demo where the 3D interviewer's head rotated 180 degrees into its chest due to missing angular clamp guards."
      }
    ]
  },
  {
    "day": 44,
    "month": 2,
    "blockNum": 9,
    "title": "Avatar Optimization & LOD Simplification: Bone Pruning, Atlas Merging & Mobile VRAM Budgets",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Production Optimization (VRAM Budgets & Mesh Decimation for Scale)",
    "spokenGoal": "Take high-fidelity 3D avatars into mass-market production across mobile browsers, low-end laptops, and battery-constrained VR headsets. Confront real-world hardware limits: mobile browsers enforce strict VRAM caps (< 100MB per tab) and draw call budgets (< 50 draw calls per frame). Deconstruct the Avatar Optimization Pipeline: 1) Material Atlas Merging (baking 12 separate clothing, skin, and hair materials into a single unified 2048x2048 PBR texture atlas to reduce draw calls from 12 to 1); 2) Bone Pruning (collapsing tiny twist bones and finger joints into parent nodes for background avatars); 3) Mesh Simplification & LODs (using Quadric Error Metrics to decimate 100,000 polygons to 15,000 for LOD1 and 3,000 for LOD2); and 4) KTX2/Draco compression.",
    "conceptInvariant": "Avatar VRAM Budget Invariant: The total uncompressed VRAM footprint of an avatar mesh and its texture maps must not exceed 45MB on mobile devices (Width &times; Height &times; 4 bytes per texture mipmap layer); draw calls per avatar must be strictly &le; 2.",
    "failureMode": "Deploying raw artist-exported 150MB VRM avatars with 18 uncompressed 4K textures in a multiplayer virtual classroom; 5 students joining crashes all mobile Safari tabs instantly with 'WebProcess exceeded memory limit (Jetsam OOM)'.",
    "tryItFriction": "Construct an automated avatar optimization pipeline script using gltf-transform in Node.js: take a heavy 80MB VRM avatar; run texture compression to KTX2 ETC1S/UASTC; merge materials into a single draw call with 'palette' / 'join'; decimate geometry by 60% with 'weld' and 'simplify'; and demonstrate that the final avatar loads in under 6MB while looking indistinguishable at standard viewing distances.",
    "socraticHints": [
      "Why does a 10MB JPG texture file consume 64MB of GPU VRAM when loaded into WebGL?",
      "Because JPG and PNG are storage compression formats! To render a texture, the GPU must fully decompress it into raw uncompressed RGBA pixel buffers in VRAM (2048x2048 &times; 4 bytes = 16MB; with mipmaps = 21.3MB; at 4K = 85.3MB)!",
      "Only GPU-native compressed textures (KTX2 / Basis Universal) stay compressed directly inside VRAM!"
    ],
    "situationalPuzzle": {
      "scenario": "A 3D developer merges all avatar meshes into a single SkinnedMesh to reduce draw calls to 1. However, when the avatar plays an animation, the eye blendshapes stop working, and semi-transparent hair renders behind opaque face skin. What two technical traps occur when naively merging avatar meshes?",
      "options": [
        "Three.js does not support single-mesh avatars.",
        "Morph Target Dropping & Alpha Blending Sorting Conflicts: 1) If the hair mesh had 0 morph targets and the face had 52, merging buffers naively drops or pads morph targets incorrectly; 2) Merging transparent materials (hair/eyelashes) into an opaque mesh breaks depth sorting, causing alpha-tested hair to occlude face skin incorrectly. The solution: keep exactly two draw calls—one fully opaque SkinnedMesh (face + body + clothing) and one alpha-blended SkinnedMesh (hair + lashes).",
        "Single-mesh avatars cannot wear clothes.",
        "WebGL only allows merging cube geometries."
      ],
      "answerIdx": 1,
      "debrief": "Merging everything into 1 draw call often breaks alpha blending and morph targets. The industry gold standard for mobile avatars is a '2-Draw-Call Architecture': 1 opaque PBR draw call for all solid surfaces (skin, clothes, shoes), and 1 transparent/alpha-cutout draw call for hair, eyelashes, and semi-transparent fabrics."
    },
    "quests": [
      {
        "id": "cg-m2-d44-q1",
        "name": "Mobile VRAM & Draw Call Budget Engineering",
        "type": "concept",
        "desc": "Calculate theoretical and practical memory footprints across mipmaps, vertex buffers, and bone palettes for 50 concurrent avatars."
      },
      {
        "id": "cg-m2-d44-q2",
        "name": "Automated VRM Decimation & Atlas Profiler",
        "type": "detective",
        "desc": "Benchmark gltf-transform simplification passes, measuring triangle reduction, texture atlas packing efficiency, and PSNR image loss."
      },
      {
        "id": "cg-m2-d44-q3",
        "name": "Node.js Headless Avatar Optimization CLI",
        "type": "mastery",
        "desc": "Build a production Node.js CLI tool taking heavy VRM models and outputting optimized, KTX2-compressed 2-draw-call LOD avatars."
      },
      {
        "id": "cg-m2-d44-q4",
        "name": "3 AM SRE: iOS Safari Jetsam OOM Crash Wave in Virtual Auditions",
        "type": "incident",
        "desc": "Triage and fix a catastrophic production outage where 4K texture uploads crashed 100% of iOS Safari users during a live avatar audition event."
      }
    ]
  },
  {
    "day": 45,
    "month": 2,
    "blockNum": 9,
    "title": "Milestone 8: Production VRM Avatar Runtime & Spring Bone Dynamics Engine",
    "stageName": "Stage 3: Advanced Specialization & Scale",
    "stageNum": 3,
    "pedagogicalRole": "Block 9 Capstone Project & Architectural Gate",
    "spokenGoal": "Synthesize the entire discipline of VRM 3D avatars, standardized humanoid kinematics, secondary spring bone physics, procedural gaze, and production optimization into an enterprise runtime: the Production VRM Avatar Runtime Engine. In this milestone, architect an end-to-end avatar system capable of loading any compliant VRM 0.0/1.0 avatar; applying retargeted humanoid locomotion clips; evaluating secondary spring bone physics (hair, ribbons) with Verlet integration and collision spheres; driving procedural gaze and saccadic micro-movements; and maintaining flawless 60 FPS performance within a 45MB mobile VRAM footprint.",
    "conceptInvariant": "Autonomous Avatar Runtime Invariant: An enterprise avatar runtime must present a unified, decoupled facade where animation, secondary physics, facial expressions, and procedural gaze are computed across dedicated modular stages before issuing minimal GPU draw calls.",
    "failureMode": "Failing the milestone gate when an arbitrary uploaded VRM avatar exhibits exploding hair bones, fails to retarget walking clips, clips its eyes when looking at targets, or consumes more than 100MB of VRAM on mobile.",
    "tryItFriction": "Construct and deliver the complete milestone application in TypeScript: load an un-optimized VRM 1.0 avatar; execute real-time optimization to 2 draw calls; run a full humanoid locomotion state machine; activate Verlet spring bone hair physics with head collision; layer procedural gaze tracking and natural breathing; and verify 60 FPS performance across desktop and mobile viewports.",
    "socraticHints": [
      "What is the single most common failure point when loading community-created VRM models?",
      "Inconsistent coordinate axes, inverted collision sphere radii, or hair bones assigned invalid parent joints!",
      "A resilient engine must validate and sanitize all VRM metadata upon loading, substituting safe defaults for corrupt values."
    ],
    "situationalPuzzle": {
      "scenario": "During the milestone viva, the panel injects a chaotic stress test: they load a VRM avatar with 240 spring bones and drop the browser tab into the background (hidden tab) for 30 seconds. When the user switches back, the avatar violently shakes and crashes the browser. What happened and how does the engine prevent it?",
      "options": [
        "The browser ran out of virtual memory.",
        "Delta Time Explosion on Tab Resumption: In background tabs, requestAnimationFrame halts or throttles to 1Hz. When resumed, delta time spikes to 30.0 seconds! The Verlet physics solver takes a single 30-second step, multiplying velocity by 30^2 = 900, causing bone positions to explode to infinity! The fix: strictly clamp delta time to a maximum threshold (e.g. Math.min(delta, 0.05)), discard stale delta time on visibilitychange, and clamp maximum physics substeps.",
        "The VRM file was deleted while in the background.",
        "WebGL does not support background tabs."
      ],
      "answerIdx": 1,
      "debrief": "Tab backgrounding is a notorious failure mode in web physics. Browsers throttle or pause timer execution. Resuming without clamping delta time introduces massive time deltas that instantly shatter numerical integration schemes. Clamping delta to 50ms ensures rock-solid stability."
    },
    "quests": [
      {
        "id": "cg-m2-d45-q1",
        "name": "VRM Production Architecture & Dynamics Specification",
        "type": "concept",
        "desc": "Produce the formal architectural blueprint detailing VRM humanoid mapping, Verlet spring bone pipelines, and 2-draw-call optimization passes."
      },
      {
        "id": "cg-m2-d45-q2",
        "name": "Avatar Dynamics & Chaos Test Automation Suite",
        "type": "detective",
        "desc": "Build an automated testing harness injecting extreme motion impulses, delta-time spikes, and collision tests across 20 distinct VRM models."
      },
      {
        "id": "cg-m2-d45-q3",
        "name": "Production VRM Avatar Runtime Engine Implementation",
        "type": "mastery",
        "desc": "Build and run the complete production avatar engine in TypeScript featuring VRM 1.0 support, spring bone physics, and procedural gaze."
      },
      {
        "id": "cg-m2-d45-q4",
        "name": "Milestone 8 Viva Gate: Avatar Architecture Defense",
        "type": "incident",
        "desc": "Defend the avatar runtime architecture before the graphics board, demonstrating live spring physics stability and answering deep memory probes."
      }
    ]
  }
]
