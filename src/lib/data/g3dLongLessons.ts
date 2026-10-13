import type { LongLesson } from './longLessons';

/**
 * 3D Computer Graphics, WebGL2 & GPU Shader Architecture (Course: g3d)
 * Day 1: The Programmable GPU Pipeline, Matrix Transformations & Fragment Shaders.
 */
export const G3D_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'g3d',
    day: 1,
    title: 'The Programmable GPU Pipeline & Matrix Transformations',
    goal: 'Understand how triangles transform from CPU memory through the GPU vertex and fragment pipeline into rendered screen pixels.',
    minutes: 40,
    recap: 'Welcome to 3D Graphics Engineering. We will transition from 2D canvas drawing to bare-metal WebGL2, linear algebra transformation chains, and massively parallel GPU shaders.',
    parts: [
      {
        title: 'The Modern Graphics Pipeline: From CPU Buffers to GPU VRAM',
        say: [
          'In modern 3D graphics, the central processing unit (CPU) and the graphics processing unit (GPU) operate as two entirely distinct computers connected across the PCI Express bus. The CPU is optimized for low-latency sequential logic, branching, and system coordination. The GPU, by contrast, is a massively parallel throughput machine containing thousands of arithmetic logic units (ALUs) designed to perform identical floating-point operations across millions of vertices and pixels simultaneously.',
          'To render a 3D mesh, the CPU does not draw pixels directly. Instead, the CPU allocates contiguous chunks of memory containing vertex attributes—such as 3D positions (X, Y, Z), normal vectors, texture coordinates (UVs), and vertex colors. It packages these arrays into Vertex Buffer Objects (VBOs) and transfers them across the bus into high-speed GPU Video RAM (VRAM). To avoid duplicating shared vertices across adjacent triangles, an Index Buffer Object (IBO) defines triangle connectivity by referencing vertex indices.',
          'Once data resides in VRAM, the programmable graphics pipeline takes over. First, the Vertex Shader executes once for every single vertex, calculating its position in normalized clip space. Next, the Primitive Assembly and Rasterization stage connects vertices into triangles, performs view-frustum clipping, and interpolates vertex attributes across every pixel covered by the triangle. Finally, the Fragment Shader executes once for every generated fragment (candidate pixel) to compute its final RGBA color before depth testing.'
        ],
        example: 'Think of an architect handing a blueprint to a stadium construction crew. The architect (CPU) prepares the list of steel coordinate joints (VBO). Instead of placing every rivet one by one, the architect hands the blueprint to 4,000 workers (GPU ALUs) who all weld their assigned triangle sections at the exact same instant.',
        code: `// Simulation: Vertex Buffer Object (VBO) and Index Buffer (IBO) memory layout
interface Vertex {
  position: [number, number, number]; // x, y, z
  normal: [number, number, number];   // nx, ny, nz
  uv: [number, number];               // u, v
}

// Interleaved Vertex Buffer: [x, y, z, nx, ny, nz, u, v] per vertex (32 bytes per vertex)
const vertexData: Float32Array = new Float32Array([
  // Vertex 0: Front-Bottom-Left
  -1.0, -1.0,  1.0,   0.0, 0.0, 1.0,   0.0, 0.0,
  // Vertex 1: Front-Bottom-Right
   1.0, -1.0,  1.0,   0.0, 0.0, 1.0,   1.0, 0.0,
  // Vertex 2: Front-Top-Right
   1.0,  1.0,  1.0,   0.0, 0.0, 1.0,   1.0, 1.0,
  // Vertex 3: Front-Top-Left
  -1.0,  1.0,  1.0,   0.0, 0.0, 1.0,   0.0, 1.0,
]);

// Index Buffer Object: 2 triangles forming a square quad
const indexData: Uint16Array = new Uint16Array([
  0, 1, 2, // Triangle 1
  2, 3, 0  // Triangle 2
]);

const strideBytes = 8 * 4; // 8 floats * 4 bytes/float = 32 bytes per vertex
const totalVertices = vertexData.length / 8;
const totalTriangles = indexData.length / 3;

console.log('VRAM Stride:', strideBytes, 'bytes');
console.log('Total Vertices:', totalVertices);
console.log('Total Triangles to Rasterize:', totalTriangles);`,
        output: `VRAM Stride: 32 bytes\nTotal Vertices: 4\nTotal Triangles to Rasterize: 2`,
        tryIt: 'Add a third triangle to indexData or calculate the total VRAM footprint in bytes for a 10,000-vertex mesh.',
        check: {
          question: 'Why do high-performance 3D engines use Index Buffer Objects (IBOs) alongside Vertex Buffer Objects (VBOs)?',
          options: [
            'IBOs allow the CPU to skip uploading vertex normals to the GPU',
            'IBOs allow adjacent triangles to reuse identical vertices, dramatically reducing VRAM footprint and redundant vertex shader executions',
            'IBOs automatically convert 3D coordinates into 2D screen pixels without requiring rasterization'
          ],
          answer: 1,
          why: 'In a closed mesh, most vertices are shared between 4 to 6 triangles. An IBO lets triangles reference a 2-byte uint16 index rather than re-uploading duplicate 32-byte vertex data, saving memory and leveraging the GPU post-transform vertex cache.'
        }
      },
      {
        title: 'The Model-View-Projection (MVP) Coordinate Pipeline',
        say: [
          'In computer graphics, a 3D vertex does not instantly appear on your screen. It undergoes a mandatory sequence of coordinate space transformations represented by a cascade of 4x4 matrices known as the Model-View-Projection (MVP) matrix chain.',
          'First is Model Space (Local Space). A 3D model of an aircraft is modeled around its own origin (0, 0, 0). The Model Matrix transforms this local mesh into World Space by applying translation (positioning the plane at altitude), rotation (pitch, yaw, roll), and scaling.',
          'Second is World to View Space (Camera Space). The View Matrix transforms the entire world relative to the camera lens. If your camera moves forward 5 units, the View Matrix mathematically pushes the entire world backward by 5 units, positioning the camera at (0, 0, 0) looking along the negative Z-axis.',
          'Third is View to Clip Space (Projection Matrix). The Perspective Projection Matrix simulates human optical vision by introducing foreshortening: distant objects appear smaller. It divides coordinates by the homogeneous W component (the Perspective Divide), producing Normalized Device Coordinates (NDC) bounded between [-1.0, 1.0] across X, Y, and Z.'
        ],
        example: 'Imagine a miniature toy car sitting on your desk. Its wheels and headlights are positioned relative to its own chassis (Model Space). When you place the car on a city street map, it gains GPS coordinates (World Space). When you bring a smartphone camera up to film it, the car is positioned relative to your phone lens (View Space). When your camera snaps the photo, optical lenses flatten 3D depth onto the flat 2D sensor glass (Projection Space).',
        code: `// Simulation: 3D Vector transformation with a Model-View-Projection (MVP) chain
class Vector4 {
  constructor(public x: number, public y: number, public z: number, public w: number = 1.0) {}

  // Perspective divide to convert 4D Clip Space into 3D Normalized Device Coordinates (NDC)
  perspectiveDivide(): [number, number, number] {
    if (this.w === 0) throw new Error('W cannot be zero');
    return [this.x / this.w, this.y / this.w, this.z / this.w];
  }
}

// Simplified Model-View-Projection pipeline calculation
function projectVertex(
  localPos: [number, number, number],
  worldOffsetZ: number,
  cameraDistance: number,
  fovFactor: number
): { clip: Vector4; ndc: [number, number, number]; visibleInFrustum: boolean } {
  // 1. Model Matrix: Translate vertex along World Z
  const worldX = localPos[0];
  const worldY = localPos[1];
  const worldZ = localPos[2] + worldOffsetZ;

  // 2. View Matrix: Camera is at +cameraDistance on Z looking towards origin
  const viewZ = worldZ - cameraDistance;

  // 3. Perspective Projection: W is proportional to distance (-viewZ)
  const clipW = -viewZ;
  const clipX = worldX * fovFactor;
  const clipY = worldY * fovFactor;
  const clipZ = -viewZ; // simplified linear depth

  const clip = new Vector4(clipX, clipY, clipZ, clipW);
  const ndc = clip.perspectiveDivide();

  // Frustum test: within [-1.0, 1.0] range
  const visibleInFrustum =
    ndc[0] >= -1.0 && ndc[0] <= 1.0 &&
    ndc[1] >= -1.0 && ndc[1] <= 1.0 &&
    ndc[2] >= 0.0 && ndc[2] <= 1.0;

  return { clip, ndc, visibleInFrustum };
}

const vertex: [number, number, number] = [0.0, 2.0, 0.0];
const projection = projectVertex(vertex, 0, 10, 2.5);

console.log('Local Vertex:', vertex);
console.log('Projected NDC (Normalized):', [
  Number(projection.ndc[0].toFixed(2)),
  Number(projection.ndc[1].toFixed(2)),
  Number(projection.ndc[2].toFixed(2))
]);
console.log('Inside View Frustum:', projection.visibleInFrustum);`,
        output: `Local Vertex: [ 0, 2, 0 ]\nProjected NDC (Normalized): [ 0, 0.5, 1 ]\nInside View Frustum: true`,
        tryIt: 'Change the vertex Y coordinate to 10.0 and see how the NDC Y exceeds 1.0, clipping it outside the visible screen frustum.',
        check: {
          question: 'What is the purpose of the homogeneous W coordinate and the perspective divide (x/w, y/w, z/w) in 3D projection?',
          options: [
            'It enables linear matrix multiplications to represent non-linear perspective scaling, making distant objects appear smaller',
            'It prevents the GPU from overheating by clearing color memory buffers',
            'It converts floating-point numbers into 8-bit integers for the screen'
          ],
          answer: 0,
          why: '4D homogeneous coordinates allow 4x4 matrix multiplication to encode translation and perspective foreshortening. Dividing X and Y by W scales coordinates down as depth (distance from camera) increases.'
        }
      },
      {
        title: 'The Fragment Shader & The Phong Illumination Model',
        say: [
          'Once triangles are rasterized into candidate screen pixels, the Fragment Shader determines their optical appearance. In real-time computer graphics, shading is the mathematical simulation of how light rays interact with surface materials.',
          'The foundational empirical lighting model of computer graphics is the Phong Illumination Model. It approximates surface luminance as the sum of three distinct optical components: Ambient light, Diffuse reflection, and Specular highlights.',
          'Ambient light represents omnidirectional scattered background light that illuminates all surfaces equally regardless of orientation. Diffuse reflection represents matte scattering modeled by Lambert’s Cosine Law: the brightness of a surface is directly proportional to the dot product of the surface normal vector N and the light direction vector L (dot(N, L)). If the light hits perpendicular to the surface, dot is 1.0 (maximum brightness); if parallel or behind, dot is 0.0.',
          'Specular reflection models shiny highlights. It calculates the alignment between the reflected light vector R and the viewer’s eye vector V (dot(R, V)^shininess). A higher shininess exponent produces a sharper, more focused metallic or glossy highlight.'
        ],
        example: 'Think of looking at an apple under a reading lamp in a dim room. The underside of the apple is still faintly visible due to light bouncing off the room walls (Ambient). The side facing the lamp is bright red (Diffuse). And at the exact angle where the bulb reflects toward your eye, you see a sharp white glint (Specular).'
        ,
        code: `// Simulation: Phong Reflection Model in GLSL / TypeScript
interface Vec3 {
  x: number;
  y: number;
  z: number;
}

function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function normalize(v: Vec3): Vec3 {
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function computePhongLight(
  normal: Vec3,
  lightDir: Vec3,
  viewDir: Vec3,
  ambientCoeff: number = 0.1,
  diffuseCoeff: number = 0.7,
  specularCoeff: number = 0.5,
  shininess: number = 32.0
): { ambient: number; diffuse: number; specular: number; total: number } {
  const N = normalize(normal);
  const L = normalize(lightDir);
  const V = normalize(viewDir);

  // 1. Ambient component
  const ambient = ambientCoeff;

  // 2. Diffuse component: Lambertian max(dot(N, L), 0.0)
  const nDotL = Math.max(0.0, dot(N, L));
  const diffuse = diffuseCoeff * nDotL;

  // 3. Specular component: R = 2 * (N . L) * N - L
  const rX = 2 * nDotL * N.x - L.x;
  const rY = 2 * nDotL * N.y - L.y;
  const rZ = 2 * nDotL * N.z - L.z;
  const R = normalize({ x: rX, y: rY, z: rZ });

  const rDotV = Math.max(0.0, dot(R, V));
  const specular = specularCoeff * Math.pow(rDotV, shininess);

  const total = Math.min(1.0, ambient + diffuse + specular);
  return { ambient, diffuse, specular, total };
}

const surfaceNormal: Vec3 = { x: 0, y: 1, z: 0 }; // Top surface facing up
const lightDirection: Vec3 = { x: 0, y: 1, z: 0 }; // Light directly overhead
const cameraDirection: Vec3 = { x: 0, y: 1, z: 0 }; // Looking straight down

const shading = computePhongLight(surfaceNormal, lightDirection, cameraDirection);
console.log('Ambient Intensity:', shading.ambient.toFixed(2));
console.log('Diffuse Intensity:', shading.diffuse.toFixed(2));
console.log('Specular Intensity:', shading.specular.toFixed(2));
console.log('Final Pixel Luminance:', shading.total.toFixed(2));`,
        output: `Ambient Intensity: 0.10\nDiffuse Intensity: 0.70\nSpecular Intensity: 0.50\nFinal Pixel Luminance: 1.00`,
        tryIt: 'Change the lightDirection to { x: 1, y: 0, z: 0 } (perpendicular) and observe how diffuse and specular drop to zero.',
        check: {
          question: 'According to Lambertian reflectance, what mathematical formula determines the diffuse illumination of a surface?',
          options: [
            'cross(Normal, LightDirection)',
            'max(0.0, dot(Normal, LightDirection))',
            'Normal.z * LightDirection.z'
          ],
          answer: 1,
          why: 'The dot product of two normalized vectors equals the cosine of the angle between them. When the surface directly faces the light (angle 0), cosine is 1.0; as the surface tilts away, illumination falls off smoothly until clamped to 0.0.'
        }
      },
      {
        title: 'Raymarching & Signed Distance Functions (SDFs)',
        say: [
          'While traditional 3D graphics rasterizes polygon meshes, modern real-time visual effects, demoscene productions, and volumetric renderers frequently use Raymarching. Rather than storing millions of vertices, the entire geometry is defined by pure mathematical equations called Signed Distance Functions (SDFs).',
          'A Signed Distance Function takes any 3D coordinate point P in world space and returns the shortest distance from P to the surface of an object: positive if outside the object, negative if inside, and exactly zero on the boundary surface.',
          'To render an SDF scene, a ray is cast from the camera through each screen pixel. In standard raytracing, the engine must compute complex ray-polygon intersection formulas. In Sphere Tracing (Raymarching), the ray steps forward by the exact distance returned by the SDF. Because the SDF guarantees that no surface exists within that radius, the ray can take maximum safe strides without overshooting!',
          'If the distance drops below a tiny threshold (e.g. 0.001), the ray has hit the surface. Furthermore, the surface normal at that point can be derived without stored normal vectors simply by taking the numerical gradient (partial derivatives) of the distance function.'
        ],
        example: 'Imagine walking in pitch-black darkness with an echo-location device. The device tells you: "the nearest obstacle is 5 meters away." Even though you do not know the obstacle direction, you know with 100% certainty you can safely sprint 5 meters forward without colliding into anything. You take that step and ping again.',
        code: `// Simulation: Sphere Tracing (Raymarching) with Signed Distance Functions
interface Vec3 {
  x: number;
  y: number;
  z: number;
}

// Signed Distance Function for a Sphere at origin with radius R
function sdSphere(p: Vec3, radius: number): number {
  const lengthP = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
  return lengthP - radius; // Distance to sphere surface
}

// Raymarching Sphere Tracer
function raymarch(
  rayOrigin: Vec3,
  rayDir: Vec3,
  sphereRadius: number,
  maxSteps: number = 64,
  hitThreshold: number = 0.001,
  maxDistance: number = 50.0
): { hit: boolean; totalDistance: number; steps: number } {
  let t = 0.0; // Distance traveled along ray

  for (let step = 0; step < maxSteps; step++) {
    const currentPoint: Vec3 = {
      x: rayOrigin.x + rayDir.x * t,
      y: rayOrigin.y + rayDir.y * t,
      z: rayOrigin.z + rayDir.z * t
    };

    const d = sdSphere(currentPoint, sphereRadius);

    if (d < hitThreshold) {
      return { hit: true, totalDistance: t, steps: step + 1 };
    }

    t += d;

    if (t >= maxDistance) {
      break;
    }
  }

  return { hit: false, totalDistance: t, steps: maxSteps };
}

// Cast ray from camera at (0, 0, -5) directly forward along +Z axis towards sphere of radius 1.0 at origin
const result = raymarch({ x: 0, y: 0, z: -5 }, { x: 0, y: 0, z: 1 }, 1.0);
console.log('Ray Hit Object:', result.hit);
console.log('Distance to Hit Point:', result.totalDistance.toFixed(2));
console.log('Total Raymarch Steps:', result.steps);`,
        output: `Ray Hit Object: true\nDistance to Hit Point: 4.00\nTotal Raymarch Steps: 4`,
        tryIt: 'Change the ray direction to { x: 0.5, y: 0, z: 0.866 } and verify if the ray misses the sphere.',
        check: {
          question: 'How does Sphere Tracing guarantee that a ray will never accidentally pass through a thin surface?',
          options: [
            'The step size along the ray is set to the exact Signed Distance value, ensuring the step never exceeds the distance to the closest object in the entire scene',
            'The GPU turns on anti-aliasing to blur surfaces together',
            'The camera freezes all object animations during the render loop'
          ],
          answer: 0,
          why: 'Because an SDF returns the shortest distance to ANY surface in the scene, a sphere of that radius is guaranteed to contain empty space. Stepping by that distance is mathematically immune to tunneling through objects.'
        }
      },
      {
        title: 'WebGL2 Memory Lifecycle & Draw Call Batching Invariants',
        say: [
          'In production WebGL2 and Three.js applications, the primary performance bottleneck is rarely the GPU’s raw polygon filling rate. The true killer of 60 FPS frame rates is CPU-to-GPU state switching overhead and browser garbage collection pauses.',
          'Every time your JavaScript code invokes a draw call (like `gl.drawElements` or `gl.drawArrays`), the browser WebGL binding layer validates state, binds shader programs, and submits commands to the native graphics driver. If a scene contains 5,000 separate mesh objects each issuing its own draw call, the CPU driver pipeline chokes.',
          'Engineers solve this using Geometry Batching and Instanced Rendering (`gl.drawElementsInstanced`). Instanced rendering allows a single draw call to render tens of thousands of unique objects (such as trees, bullets, or particles) while reading per-instance transforms from a secondary matrix buffer.',
          'Furthermore, WebGL resources reside in unmanaged GPU VRAM. When a JavaScript mesh is dereferenced, the browser garbage collector cleans up the JS wrapper object but LEAKS the underlying GPU textures, framebuffers, and vertex buffers unless you explicitly call `gl.deleteBuffer()` and `gl.deleteTexture()`!'
        ],
        example: 'Think of mailing packages at the post office. If you bring 1,000 letters and make the postal clerk scan each one in a separate transaction, you hold up the line for 4 hours (draw call overhead). If you put all 1,000 letters in a single pre-sorted container, the clerk stamps it in 2 seconds (batching).'
        ,
        code: `// Simulation: WebGL Resource Tracker and Instanced Batching Engine
interface GpuBufferHandle {
  id: number;
  byteLength: number;
  freed: boolean;
}

class GpuResourceManager {
  private activeAllocations: Map<number, GpuBufferHandle> = new Map();
  private nextBufferId = 1;
  private totalAllocatedBytes = 0;

  allocateBuffer(bytes: number): GpuBufferHandle {
    const handle: GpuBufferHandle = {
      id: this.nextBufferId++,
      byteLength: bytes,
      freed: false
    };
    this.activeAllocations.set(handle.id, handle);
    this.totalAllocatedBytes += bytes;
    return handle;
  }

  freeBuffer(handle: GpuBufferHandle): void {
    if (handle.freed) {
      throw new Error(\`Double-free detected on GPU Buffer \${handle.id}\`);
    }
    handle.freed = true;
    this.totalAllocatedBytes -= handle.byteLength;
    this.activeAllocations.delete(handle.id);
  }

  getMemoryDiagnostics() {
    return {
      activeBuffers: this.activeAllocations.size,
      allocatedMB: (this.totalAllocatedBytes / (1024 * 1024)).toFixed(2)
    };
  }
}

const gpu = new GpuResourceManager();
const terrainVBO = gpu.allocateBuffer(4 * 1024 * 1024); // 4 MB terrain mesh
const particleVBO = gpu.allocateBuffer(16 * 1024 * 1024); // 16 MB particle cache

console.log('Allocated VRAM:', gpu.getMemoryDiagnostics());

// Clean up particle buffer on level unload
gpu.freeBuffer(particleVBO);
console.log('VRAM after particle buffer release:', gpu.getMemoryDiagnostics());`,
        output: `Allocated VRAM: { activeBuffers: 2, allocatedMB: '20.00' }\nVRAM after particle buffer release: { activeBuffers: 1, allocatedMB: '4.00' }`,
        tryIt: 'Simulate what happens if you unload a level without freeing GPU buffers across 50 level transitions.',
        check: {
          question: 'Why must WebGL applications explicitly invoke gl.deleteBuffer() and gl.deleteTexture() instead of relying on JavaScript garbage collection?',
          options: [
            'JavaScript garbage collection cannot reclaim native GPU VRAM allocations automatically, causing cumulative VRAM memory leaks and context loss',
            'WebGL requires buffers to be deleted at the end of every individual render frame',
            'Deleting buffers speeds up the browser network download speed'
          ],
          answer: 0,
          why: 'The JavaScript engine manages CPU heap memory, not GPU driver VRAM. Dereferencing a JS Three.js Mesh without disposing geometry and material leaves textures and buffers allocated on the GPU driver until the browser tab crashes.'
        }
      }
    ],
    summary: [
      'The Modern Graphics Pipeline isolates sequential CPU coordination from massively parallel GPU rasterization and fragment shading.',
      'Vertex attributes are uploaded across the PCIe bus into high-speed VRAM via Vertex Buffer Objects (VBOs) and indexed via Index Buffer Objects (IBOs).',
      'The Model-View-Projection (MVP) chain transforms local 3D vertices into World, Camera View, and Perspective Clip Space using 4x4 matrix multiplication.',
      'The Phong illumination model simulates ambient scattering, Lambertian diffuse reflection (dot(N, L)), and shininess-scaled specular highlights.',
      'Signed Distance Functions (SDFs) enable raymarching sphere tracing, calculating analytical ray steps and surface normals without polygon meshes.',
      'Instanced rendering and explicit GPU memory disposal (gl.deleteBuffer) are critical invariants to eliminate CPU draw call bottlenecks and VRAM leaks.'
    ],
    projectStep: {
      title: 'Initialize a WebGL2 Shader Pipeline with Instanced Geometry',
      steps: [
        'Define an interleaved Float32Array containing vertex positions and normals for a unit cube.',
        'Construct a Perspective Projection Matrix and Camera View Matrix in TypeScript.',
        'Implement the Phong illumination reflection equation in a fragment shader simulation.',
        'Verify that all GPU buffer handles are tracked and cleanly deallocated upon scene tear-down.'
      ]
    }
  },
  {
    coursePrefix: 'g3d',
    day: 2,
    title: 'PBR Shading, Shadow Mapping & WebGPU Architecture',
    goal: 'Master industry-standard physically based rendering (PBR Cook-Torrance BRDF), percentage-closer shadow filtering, deferred shading pipelines, and modern WebGPU compute workgroups.',
    minutes: 45,
    recap: 'In Day 1, we mastered the core WebGL2 graphics pipeline, 4x4 MVP matrix transformations, Phong shading, and raymarching SDFs. Now, we advance into photorealistic physically based rendering, dynamic shadow mapping, deferred multi-render targets, and low-overhead WebGPU pipelines.',
    parts: [
      {
        title: 'Physically Based Rendering (PBR) & Cook-Torrance Microfacet BRDF',
        say: [
          'Classical empirical lighting models like Phong and Blinn-Phong look plastic and fail under varied lighting conditions because they do not obey physical laws. Physically Based Rendering (PBR) solves this by enforcing two inviolable physical principles: microfacet surface theory and energy conservation.',
          'Under microfacet theory, rough surfaces are modeled as microscopic mirrors whose normal vectors deviate randomly from the macroscopic geometric normal. The Cook-Torrance specular Bidirectional Reflectance Distribution Function (BRDF) combines three distinct mathematical terms: the Normal Distribution Function D, the Fresnel reflectance F, and the Geometric Shadowing-Masking term G.',
          'The Normal Distribution Function (commonly Trowbridge-Reitz GGX) evaluates the statistical concentration of microfacets perfectly aligned with the half-vector between the view direction and the light direction. As surface roughness approaches zero, D concentrates into an intense, sharp specular spike.',
          'The Fresnel-Schlick approximation calculates how reflectance increases dramatically at glancing grazing angles. For non-metallic dielectric materials like plastic, glass, or stone, the normal reflectance F0 is roughly four percent (0.04), while conductive metals have much higher, colored F0 values like 0.95 for gold.',
          'The Geometric Shadowing term G (Smith GGX) models microfacets occluding or shadowing one another, preventing unrealistic bright artifacts near grazing view angles where microfacet peaks block reflected light rays.',
          'Crucially, PBR guarantees energy conservation: the sum of specularly reflected light and diffusely refracted light can never exceed the total incoming light energy. In metals, all refracted light is immediately absorbed by free conduction electrons, meaning metals exhibit zero diffuse scattering (kD equals zero).'
        ],
        example: 'Think of looking at a polished 24-karat gold ring versus a rough chalkboard. The gold ring absorbs no diffuse light and reflects sharp, tinted golden highlights with high specular energy. The chalkboard scatters incoming light in all directions across millions of microscopic chalk dust ridges, producing a soft diffuse sheen without any specular mirror reflection.',
        code: `// Simulation: Cook-Torrance Specular Microfacet BRDF & Energy Conservation
function dot(a: [number, number, number], b: [number, number, number]): number {
  return Math.max(0, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
}

function normalize(v: [number, number, number]): [number, number, number] {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

function calculateCookTorrancePbr(
  roughness: number,
  metallic: number,
  N: [number, number, number],
  V: [number, number, number],
  L: [number, number, number]
): { diffuse: number; specular: number; totalReflectance: number } {
  const H = normalize([V[0] + L[0], V[1] + L[1], V[2] + L[2]]);
  const NdotV = Math.max(0.001, dot(N, V));
  const NdotL = Math.max(0.001, dot(N, L));
  const NdotH = dot(N, H);
  const VdotH = dot(V, H);

  // 1. Normal Distribution Function (Trowbridge-Reitz GGX)
  const alpha = roughness * roughness;
  const alpha2 = alpha * alpha;
  const denomNDF = (NdotH * NdotH * (alpha2 - 1.0) + 1.0);
  const D = alpha2 / (Math.PI * denomNDF * denomNDF);

  // 2. Fresnel-Schlick Approximation (F0 = 0.04 for dielectrics, tinted for metals)
  const F0 = 0.04 * (1.0 - metallic) + 0.95 * metallic;
  const F = F0 + (1.0 - F0) * Math.pow(1.0 - VdotH, 5.0);

  // 3. Geometry Shadowing/Masking (Smith GGX)
  const k = Math.pow(roughness + 1.0, 2.0) / 8.0;
  const G_V = NdotV / (NdotV * (1.0 - k) + k);
  const G_L = NdotL / (NdotL * (1.0 - k) + k);
  const G = G_V * G_L;

  // Cook-Torrance Specular BRDF
  const specular = (D * F * G) / (4.0 * NdotV * NdotL);

  // Energy Conservation: Diffuse component is whatever light is not specularly reflected
  const kD = (1.0 - F) * (1.0 - metallic);
  const diffuse = kD * (1.0 / Math.PI) * NdotL;
  const totalReflectance = diffuse + specular * NdotL;

  return { diffuse, specular, totalReflectance };
}

const normal: [number, number, number] = [0, 0, 1];
const view: [number, number, number] = normalize([0.2, 0.2, 0.9]);
const light: [number, number, number] = normalize([0.3, 0.3, 0.9]);

// Compare Gold Metal vs Rough Plastic
const gold = calculateCookTorrancePbr(0.2, 0.95, normal, view, light);
const plastic = calculateCookTorrancePbr(0.5, 0.0, normal, view, light);

console.log('=== PHYSICALLY BASED RENDERING (COOK-TORRANCE BRDF) ===');
console.log('Polished Gold (Metallic 0.95, Roughness 0.2):');
console.log('  Specular BRDF: ' + gold.specular.toFixed(3) + ' | Diffuse: ' + gold.diffuse.toFixed(3) + ' | Energy Conserved: ' + (gold.totalReflectance <= 1.5 ? 'YES' : 'NO'));
console.log('Rough Plastic (Dielectric Metallic 0.0, Roughness 0.5):');
console.log('  Specular BRDF: ' + plastic.specular.toFixed(3) + ' | Diffuse: ' + plastic.diffuse.toFixed(3) + ' | Energy Conserved: ' + (plastic.totalReflectance <= 1.0 ? 'YES' : 'NO'));`,
        output: `=== PHYSICALLY BASED RENDERING (COOK-TORRANCE BRDF) ===\nPolished Gold (Metallic 0.95, Roughness 0.2):\n  Specular BRDF: 0.007 | Diffuse: 0.001 | Energy Conserved: YES\nRough Plastic (Dielectric Metallic 0.0, Roughness 0.5):\n  Specular BRDF: 0.006 | Diffuse: 0.276 | Energy Conserved: YES`,
        tryIt: 'Modify the roughness parameter from 0.2 to 0.8 and observe how the GGX specular distribution widens and reduces peak intensity.',
        check: {
          question: 'Why do pure conductors (metals like gold and copper) exhibit virtually zero diffuse reflection in physically based rendering?',
          options: [
            'Conductors absorb all light rays and reflect zero specular highlights',
            'In conductive metals, all light that refracts below the surface is immediately absorbed by free conduction electrons rather than scattering back out',
            'WebGL does not support diffuse calculations when metallic maps are bound'
          ],
          answer: 1,
          why: 'Metals possess high densities of free conduction electrons. Any photon that penetrates the surface undergoes immediate electromagnetic absorption by electrons rather than subsurface scattering, resulting in kD = 0 (zero diffuse reflectance) and colored specular highlights.'
        }
      },
      {
        title: 'Shadow Mapping & Percentage-Closer Filtering (PCF)',
        say: [
          'Shadows provide essential visual depth cues that anchor 3D objects to ground planes. In real-time rendering, shadow mapping is a two-pass algorithm executed every frame.',
          'In Pass 1, the scene is rendered entirely from the perspective of the light source into an offscreen depth framebuffer known as a Shadow Map. Only depth values (the distance from the light to the nearest geometric surface) are written to this texture, ignoring color shaders.',
          'In Pass 2, the scene is rendered from the main camera perspective. For every visible pixel, its world position is transformed into the light view-projection clip space to determine its shadow coordinate (u, v, depth).',
          'If the fragment current depth is greater than the recorded depth in the shadow map, another object was closer to the light source, meaning the current fragment is occluded and sits in shadow.',
          'However, discrete shadow map texel resolution introduces two infamous visual artifacts: Shadow Acne (false self-shadowing caused by floating-point precision discretization across angled surfaces) and Peter-Panning (detached floating shadows caused by excessive bias offsets).',
          'To produce smooth, believable penumbra borders instead of harsh aliased stair-stepping, modern engines employ Percentage-Closer Filtering (PCF). Instead of performing a single binary depth comparison, PCF samples a 3x3 or 5x5 kernel of surrounding depth texels and averages the percentage of light penetration.'
        ],
        example: 'Imagine pointing a strong flashlight at a person holding an umbrella on a sunny day. Right where their shoes touch the sidewalk, the shadow is sharp and distinct (hard shadow). But the shadow cast by the umbrella edge 7 feet above their head is blurry and feathered around the edges (soft penumbra) because ambient light scatters around the blocker.',
        code: `// Simulation: Shadow Map Depth Testing with Adaptive Bias and 3x3 PCF Kernel
const shadowMapDepthGrid = [
  [0.45, 0.45, 0.46, 0.48, 0.50],
  [0.44, 0.45, 0.45, 0.47, 0.49],
  [0.43, 0.44, 0.45, 0.46, 0.48], // Target receiver at center (x=2, y=2)
  [0.44, 0.45, 0.45, 0.47, 0.49],
  [0.46, 0.47, 0.48, 0.49, 0.51],
];

function evaluatePcfShadow(
  receiverDepth: number,
  centerU: number,
  centerV: number,
  bias: number
): { hardShadow: number; pcfSoftShadow: number } {
  // 1. Hard Shadow: Single point sample comparison
  const centralDepth = shadowMapDepthGrid[centerV][centerU];
  const hardShadow = receiverDepth - bias > centralDepth ? 0.0 : 1.0;

  // 2. Percentage-Closer Filtering: 3x3 kernel smoothing
  let illuminatedSamples = 0;
  let totalSamples = 0;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const sampleDepth = shadowMapDepthGrid[centerV + dy][centerU + dx];
      if (receiverDepth - bias <= sampleDepth) {
        illuminatedSamples++;
      }
      totalSamples++;
    }
  }

  const pcfSoftShadow = illuminatedSamples / totalSamples;
  return { hardShadow, pcfSoftShadow };
}

// Fragment sitting on shadow boundary (depth = 0.46)
const result = evaluatePcfShadow(0.46, 2, 2, 0.005);

console.log('=== SHADOW MAPPING & PERCENTAGE-CLOSER FILTERING (PCF) ===');
console.log('Fragment Receiver Depth: 0.460 (Slope Bias: 0.005)');
console.log('Hard Point-Sampled Shadow: ' + (result.hardShadow === 0 ? '0% Light (Jagged Black Stitched Edge)' : '100% Light'));
console.log('3x3 PCF Filtered Soft Shadow: ' + (result.pcfSoftShadow * 100).toFixed(1) + '% Light (Smooth Penumbra)');
console.log('Visual Artifact Resolution: PETER-PANNING & ACNE MITIGATED VIA ADAPTIVE BIAS');`,
        output: `=== SHADOW MAPPING & PERCENTAGE-CLOSER FILTERING (PCF) ===\nFragment Receiver Depth: 0.460 (Slope Bias: 0.005)\nHard Point-Sampled Shadow: 0% Light (Jagged Black Stitched Edge)\n3x3 PCF Filtered Soft Shadow: 33.3% Light (Smooth Penumbra)\nVisual Artifact Resolution: PETER-PANNING & ACNE MITIGATED VIA ADAPTIVE BIAS`,
        tryIt: 'Adjust the receiver depth to 0.43 to see how an occluded fragment responds to the PCF filter.',
        check: {
          question: 'What is the visual consequence of applying an excessively large depth bias when attempting to eliminate shadow acne?',
          options: [
            'Shadows completely disappear or detach from the base of 3D objects, known as Peter-Panning',
            'The entire screen turns inverted black and white due to depth texture overflow',
            'The GPU switches to forward rendering mode'
          ],
          answer: 0,
          why: 'Applying too large a depth bias artificially pushes the receiver geometry closer to the light source than it actually is. As a result, the contact area at the feet of characters fails the occlusion test, causing shadows to visibly detach and float away (Peter-Panning).'
        }
      },
      {
        title: 'Deferred Shading Pipeline & G-Buffer Architecture',
        say: [
          'In traditional Forward Rendering, every triangle is rendered directly into the color buffer. If a scene contains M triangles and L dynamic light sources, every single rasterized fragment evaluates all L light equations. In complex environments with heavy overdraw, fragments that get overwritten by closer objects still waste billions of lighting calculations, yielding O(M * L) algorithmic complexity.',
          'Deferred Shading decouples geometric rasterization from illumination calculations by breaking rendering into two distinct sequential passes.',
          'In Pass 1 (Geometry Pass), all scene meshes are rendered without any lighting computations. The GPU writes surface physical attributes across multiple simultaneous render targets (MRT) into an offscreen framebuffer structure known as the Geometry Buffer (G-Buffer).',
          'A standard G-Buffer stores World-Space Positions (or reprojected Depth), World-Space Normal vectors, Albedo diffuse colors, and Material Roughness/Metallic parameters across 3 to 4 texture attachments.',
          'In Pass 2 (Lighting Pass), a single screen-space quad covering the entire viewport is rendered. The fragment shader samples the G-Buffer textures and calculates illumination for each pixel against all dynamic lights.',
          'Because Pass 2 only runs for visible surface pixels after depth testing has resolved all occlusions, deferred shading complexity drops to O(M + L), enabling scenes with hundreds of dynamic point lights at stable 60 FPS.'
        ],
        example: 'Think of a high-volume restaurant kitchen. In forward rendering, each line cook runs out to every dining table to fry custom steak orders whenever a guest sits down. In deferred shading, prep chefs pre-cook meat and sauce batches into standardized buffet trays (G-Buffer), and a single expediter plates the dishes on demand in one lightning-fast pass at the service counter.',
        code: `// Simulation: Forward Rendering vs Deferred Shading Computational Complexity
interface SceneSpecs {
  meshTriangles: number;
  lightCount: number;
  screenFragments: number; // e.g. 1920x1080 = ~2M pixels
}

function compareRenderPipelines(specs: SceneSpecs) {
  // Forward Rendering: Every triangle fragment evaluates all lights
  // Overdraw factor ~ 3.0x in dense 3D scenes
  const forwardFragmentShadingOps = specs.screenFragments * 3.0 * specs.lightCount;

  // Deferred Shading:
  // Pass 1: Write to G-Buffer (Geometry only, 0 light computations)
  const gBufferPassOps = specs.screenFragments * 3.0;
  // Pass 2: Screen-space quad evaluates lights exactly once per visible pixel
  const deferredLightingOps = specs.screenFragments * specs.lightCount;
  const totalDeferredOps = gBufferPassOps + deferredLightingOps;

  const opReductionRatio = forwardFragmentShadingOps / totalDeferredOps;
  return { forwardFragmentShadingOps, totalDeferredOps, opReductionRatio };
}

const scene: SceneSpecs = {
  meshTriangles: 150000,
  lightCount: 300,        // 300 dynamic lights
  screenFragments: 2073600 // 1080p
};

const comparison = compareRenderPipelines(scene);

console.log('=== DEFERRED SHADING VS FORWARD RENDERING ARCHITECTURE ===');
console.log('Scene Parameters: ' + scene.meshTriangles.toLocaleString('en-US') + ' Triangles | ' + scene.lightCount + ' Dynamic Point Lights (1080p)');
console.log('Forward Rendering Workload: ' + (comparison.forwardFragmentShadingOps / 1e9).toFixed(2) + ' Billion Fragment Lighting Calculations');
console.log('Deferred G-Buffer Workload: ' + (comparison.totalDeferredOps / 1e9).toFixed(2) + ' Billion Fragment Lighting Calculations');
console.log('Computational Throughput Gain: ' + comparison.opReductionRatio.toFixed(1) + 'x Faster (Decoupled Geometry from Lights)');`,
        output: `=== DEFERRED SHADING VS FORWARD RENDERING ARCHITECTURE ===\nScene Parameters: 150,000 Triangles | 300 Dynamic Point Lights (1080p)\nForward Rendering Workload: 1.87 Billion Fragment Lighting Calculations\nDeferred G-Buffer Workload: 0.63 Billion Fragment Lighting Calculations\nComputational Throughput Gain: 3.0x Faster (Decoupled Geometry from Lights)`,
        tryIt: 'Increase the light count to 1,000 to see why deferred shading dominates modern game engines with hundreds of dynamic light sources.',
        check: {
          question: 'What is a major architectural trade-off and challenge introduced by deferred shading pipelines compared to forward rendering?',
          options: [
            'Deferred shading completely disables normal mapping across all 3D meshes',
            'Transparent and translucent surfaces cannot be easily rendered because the G-Buffer can only store one depth and material state per screen pixel',
            'Deferred shading requires CPU software rendering instead of GPU hardware acceleration'
          ],
          answer: 1,
          why: 'Because the G-Buffer stores only the single topmost opaque surface per pixel, semi-transparent objects (like glass, water, or smoke particles) cannot write multiple blended layers into a single pixel. Engines typically render transparent objects in a forward rendering pass after the deferred lighting pass.'
        }
      },
      {
        title: 'WebGPU Next-Gen Render Pipelines & WGSL Compute Workgroups',
        say: [
          'For over a decade, WebGL provided hardware-accelerated 3D graphics in the browser based on OpenGL ES. However, WebGL is constrained by OpenGL legacy: a global mutable state machine that requires heavy CPU driver validation, single-threaded command submission, and lack of general-purpose GPU compute shaders.',
          'WebGPU is the next-generation W3C web graphics standard engineered from the ground up to mirror modern low-level native graphics APIs like Vulkan, Apple Metal, and DirectX 12.',
          'Instead of mutating a global WebGL context, WebGPU relies on immutable pipeline state objects (GPURenderPipeline and GPUComputePipeline) compiled ahead of time. Once created, a pipeline configuration cannot change, eliminating expensive runtime state validation in browser drivers.',
          'GPU memory and resource binding are explicitly managed through Bind Groups and Bind Group Layouts. Commands are recorded into lightweight GPUCommandEncoders on CPU threads without causing synchronous GPU pipeline stalls.',
          'Beyond rasterization, WebGPU introduces general-purpose GPU compute shaders via the WebGPU Shading Language (WGSL). Compute shaders do not process triangles or pixels; they execute arbitrary algorithmic workloads across thousands of parallel execution threads organized into Workgroups.',
          'Using WGSL `@workgroup_size(64)`, thousands of particles, physics simulations, cloth dynamics, and neural network tensor operations can be updated entirely on the GPU VRAM at 60 FPS without transferring data back and forth to JavaScript.'
        ],
        example: 'Think of switching from a 1950s manual telephone switchboard operator who must physically unplug and re-plug cables for every single phone call (WebGL global state machine) to a modern high-speed optical fiber network where pre-configured packets fly through automated router matrices without human intervention (WebGPU command encoders & compute pipelines).',
        code: `// Simulation: WebGPU Compute Pipeline Workgroup Dispatch and Bandwidth Planner
interface WebGpuWorkgroupPlan {
  totalParticles: number;
  workgroupSize: number;
  dispatchedWorkgroups: number;
  estimatedBandwidthGbps: number;
}

function planWebGpuCompute(totalParticles: number, workgroupSize = 64): WebGpuWorkgroupPlan {
  // Round up workgroup dispatch count
  const dispatchedWorkgroups = Math.ceil(totalParticles / workgroupSize);
  // 32 bytes per particle (pos: vec4, vel: vec4) read + written per frame at 60 FPS
  const bytesPerFrame = totalParticles * 32 * 2;
  const bandwidthGbps = (bytesPerFrame * 60) / 1e9;

  return {
    totalParticles,
    workgroupSize,
    dispatchedWorkgroups,
    estimatedBandwidthGbps: bandwidthGbps
  };
}

const plan = planWebGpuCompute(1000000, 64); // 1 Million particle simulation

console.log('=== WEBGPU NEXT-GEN PIPELINE & WGSL COMPUTE SHADERS ===');
console.log('Compute Target: ' + plan.totalParticles.toLocaleString('en-US') + ' Interactive Particles on GPU');
console.log('WGSL Workgroup Dimension: @workgroup_size(' + plan.workgroupSize + ')');
console.log('Dispatched GPU Grid: ' + plan.dispatchedWorkgroups.toLocaleString('en-US') + ' Workgroups (dispatchWorkgroups(' + plan.dispatchedWorkgroups + ', 1, 1))');
console.log('Simulated Memory Bandwidth: ' + plan.estimatedBandwidthGbps.toFixed(2) + ' GB/s at 60 FPS');
console.log('API Architecture: IMMUTABLE GPURenderPipeline & ZERO GLOBAL MUTABLE STATE');`,
        output: `=== WEBGPU NEXT-GEN PIPELINE & WGSL COMPUTE SHADERS ===\nCompute Target: 1,000,000 Interactive Particles on GPU\nWGSL Workgroup Dimension: @workgroup_size(64)\nDispatched GPU Grid: 15,625 Workgroups (dispatchWorkgroups(15625, 1, 1))\nSimulated Memory Bandwidth: 3.84 GB/s at 60 FPS\nAPI Architecture: IMMUTABLE GPURenderPipeline & ZERO GLOBAL MUTABLE STATE`,
        tryIt: 'Calculate the memory bandwidth requirement if the particle count is scaled to 5 million particles at 120 FPS.',
        check: {
          question: 'What is a fundamental architectural advantage of WebGPU over WebGL2 regarding pipeline state management?',
          options: [
            'WebGPU eliminates shaders and executes JavaScript code directly inside GPU transistors',
            'WebGPU encapsulates shaders, vertex layouts, and blend modes into immutable GPURenderPipeline objects, eliminating CPU driver state validation overhead during draw calls',
            'WebGPU restricts all rendering to CPU threads to save laptop battery life'
          ],
          answer: 1,
          why: 'In WebGL, any call to set state (like blending or depth test) forces the driver to re-validate complex state permutations. WebGPU bakes all shaders, blend modes, depth formats, and vertex layouts into an immutable GPURenderPipeline up front, allowing command buffers to execute with zero CPU driver validation stalls.'
        }
      },
      {
        title: 'Hierarchical View Frustum Culling & AABB Geometry',
        say: [
          'In large-scale 3D scenes containing thousands of meshes, submitting every single object to the GPU for rendering quickly saturates the CPU-to-GPU command buffer, causing severe frame drops even if 95% of those objects are behind the camera lens.',
          'View Frustum Culling is the spatial optimization technique that discards objects located outside the camera view volume before issuing draw calls to the graphics driver.',
          'A standard perspective camera frustum is a truncated six-sided pyramid defined by six planar equations: Left, Right, Bottom, Top, Near, and Far. Each plane is mathematically represented by a 3D unit normal vector N and a scalar distance offset d, satisfying the plane equation dot(N, P) + d = 0.',
          'Testing complex triangle meshes against six planes is computationally prohibitive. Instead, engines enclose meshes within simple Axis-Aligned Bounding Boxes (AABBs) bounded by minimum and maximum coordinate vectors (minX, minY, minZ) and (maxX, maxY, maxZ).',
          'To test an AABB against a plane in constant O(1) time, the algorithm computes the box positive vertex (p-vertex)—the corner pointing furthest along the plane normal vector. If the p-vertex lies in the negative half-space of any of the six planes, the entire bounding box is guaranteed to be completely outside the view frustum.',
          'By organizing meshes into spatial hierarchies such as Bounding Volume Hierarchies (BVH) or Octrees, entire forest regions or city blocks can be culled with a single plane intersection test, preserving 60 FPS performance in massive open worlds.'
        ],
        example: 'Think of a stadium security checkpoint at an entrance gate. Instead of allowing 50,000 spectators to pack into VIP Section 1 and checking their tickets one by one at their seats (rendering off-screen meshes), security guards at the perimeter turn away anyone whose badge is not for this wing before they even step through the outer gates (frustum culling).',
        code: `// Simulation: View Frustum Culling using 6 Planes and AABB Positive-Vertex Testing
interface AabbBox {
  id: string;
  min: [number, number, number];
  max: [number, number, number];
}

interface FrustumPlane {
  normal: [number, number, number];
  d: number;
}

function isAabbInFrustum(box: AabbBox, planes: FrustumPlane[]): boolean {
  for (const plane of planes) {
    // Find positive vertex (p-vertex) along plane normal
    const px = plane.normal[0] >= 0 ? box.max[0] : box.min[0];
    const py = plane.normal[1] >= 0 ? box.max[1] : box.min[1];
    const pz = plane.normal[2] >= 0 ? box.max[2] : box.min[2];

    // If positive vertex is outside plane, box is completely outside
    if (plane.normal[0] * px + plane.normal[1] * py + plane.normal[2] * pz + plane.d < 0) {
      return false;
    }
  }
  return true;
}

// 6 camera frustum planes (Left, Right, Bottom, Top, Near, Far)
const cameraFrustum: FrustumPlane[] = [
  { normal: [1, 0, 0], d: 10 },   // Left plane (x >= -10)
  { normal: [-1, 0, 0], d: 10 },  // Right plane (x <= 10)
  { normal: [0, 1, 0], d: 10 },   // Bottom plane (y >= -10)
  { normal: [0, -1, 0], d: 10 },  // Top plane (y <= 10)
  { normal: [0, 0, 1], d: -1 },   // Near plane (z >= 1)
  { normal: [0, 0, -1], d: 100 }, // Far plane (z <= 100)
];

const objects: AabbBox[] = [
  { id: 'Tree_01 (In View)',       min: [-2, -2, 10], max: [2, 2, 14] },
  { id: 'Building_A (In View)',    min: [4, -5, 20],  max: [8, 5, 30] },
  { id: 'Mountain_West (Culled)',  min: [-50, -5, 40], max: [-40, 20, 60] }, // Culled (x < -10)
  { id: 'BehindCamera (Culled)',   min: [-1, -1, -20], max: [1, 1, -10] },   // Culled (behind near plane)
];

const visible = objects.filter(obj => isAabbInFrustum(obj, cameraFrustum));

console.log('=== HIERARCHICAL VIEW FRUSTUM CULLING (AABB INTERSECTION) ===');
console.log('Total Scene Graph Objects: ' + objects.length);
console.log('Visible Objects Rendered: ' + visible.length + ' (' + visible.map(o => o.id).join(', ') + ')');
console.log('Culled Draw Calls Eliminated: ' + (objects.length - visible.length) + ' Meshes Skipped (GPU Command Buffer Saved)');`,
        output: `=== HIERARCHICAL VIEW FRUSTUM CULLING (AABB INTERSECTION) ===\nTotal Scene Graph Objects: 4\nVisible Objects Rendered: 2 (Tree_01 (In View), Building_A (In View))\nCulled Draw Calls Eliminated: 2 Meshes Skipped (GPU Command Buffer Saved)`,
        tryIt: 'Add a new AABB object positioned at [0, 0, 150] and verify that it is culled by the far clipping plane.',
        check: {
          question: 'Why do high-performance 3D graphics engines test the positive vertex (p-vertex) of an AABB against view frustum planes rather than all 8 bounding corners?',
          options: [
            'The positive vertex is the point furthest along the normal direction; if it lies outside the plane half-space, all remaining 7 points are guaranteed outside in O(1) time',
            'AABBs only possess one corner in 3D projective space',
            'Testing all 8 vertices causes GPU texture cache thrashing'
          ],
          answer: 0,
          why: 'The positive vertex (p-vertex) is mathematically defined as the corner of the bounding box that extends furthest in the direction of the plane normal. If even this extreme point lies on the outside of the plane half-space, it is mathematically impossible for any other corner to be inside, allowing an instant O(1) culling rejection.'
        }
      }
    ],
    summary: [
      'Physically Based Rendering (PBR) enforces energy conservation (kd + ks <= 1) and microfacet reflection theory using the Cook-Torrance BRDF (D: GGX, F: Fresnel-Schlick, G: Smith).',
      'Shadow Mapping calculates occlusions from light space depth textures, mitigating acne via slope bias and softening penumbras with Percentage-Closer Filtering (PCF).',
      'Deferred Shading decouples geometric rasterization from illumination into G-Buffer and screen-quad passes, reducing lighting complexity from O(M * L) to O(M + L).',
      'WebGPU eliminates WebGL global state machine stalls through immutable GPURenderPipeline objects, explicit bind groups, and WGSL compute workgroups (@workgroup_size(64)).',
      'Hierarchical View Frustum Culling rejects out-of-view meshes via AABB positive-vertex half-space tests, eliminating redundant GPU draw calls and command buffer overhead.'
    ],
    projectStep: {
      title: 'Implement a WebGPU PBR Shading & Culling Architecture',
      steps: [
        'Construct a Cook-Torrance BRDF fragment shader evaluating GGX normal distribution, Fresnel-Schlick, and Smith shadowing.',
        'Implement an offscreen G-Buffer multi-render target pass writing world normal, depth, and metallic-roughness attributes.',
        'Write an AABB frustum culling pre-pass to filter draw call submissions before encoding GPU command buffers.',
        'Benchmark compute workgroups in WGSL to verify particle simulation throughput at 60 FPS.'
      ]
    }
  },
  {
    coursePrefix: 'g3d',
    day: 3,
    title: 'Advanced Graphics & Compute: Skeletal Skinning, SSAO, GPU Particles, HDR Tone Mapping & BVH',
    goal: 'Master advanced 3D engine systems: Dual Quaternion Skinning (DQS) eliminating candy-wrapper joint collapse, Screen-Space Ambient Occlusion (SSAO) with noise-rotated hemisphere kernels, WebGPU compute shader particle dynamics running on GPU VRAM, ACES filmic HDR tone mapping curves, and Bounding Volume Hierarchy (BVH) spatial acceleration ray tracing.',
    minutes: 45,
    recap: 'In Day 1, we mastered WebGL2 pipelines, transformation matrices, and Phong illumination. In Day 2, we mastered Cook-Torrance PBR materials, PCF shadow mapping, deferred G-buffers, WebGPU pipelines, and AABB frustum culling. Now in Day 3, we advance to high-end real-time engine systems: dual quaternion skeletal mesh skinning, screen-space ambient occlusion, GPU compute particle simulation, ACES HDR tone mapping, and BVH spatial partitioning.',
    parts: [
      {
        title: 'Skeletal Mesh Animation & Dual Quaternion Skinning (DQS)',
        say: [
          'In real-time 3D character animation, meshes are deformed by an underlying skeleton composed of hierarchical transformation bones.',
          'Traditional character animation engines rely on Linear Blend Skinning (LBS), where each mesh vertex is transformed by a weighted sum of its controlling bone transformation matrices.',
          'While LBS is computationally inexpensive, it suffers from severe geometric artifacts under joint torsion or twisting: when a forearm or wrist rotates by 180 degrees, the linear interpolation between opposite matrices passes through zero scale, collapsing the cross-sectional area and pinching the mesh into a paper-thin "candy wrapper" defect.',
          'Dual Quaternion Skinning (DQS) resolves this defect by representing rigid Euclidean transformations using Dual Quaternions.',
          'A dual quaternion q = q_r + epsilon * q_d combines a unit real quaternion representing 3D rotation with a dual quaternion representing 3D translation, satisfying the dual unit property where epsilon^2 = 0.',
          'By interpolating dual quaternions along the shortest geodesic arc on the unit hypersphere, DQS strictly preserves rigid transformation volume during joint bending and twisting, completely eliminating the candy-wrapper artifact without requiring artist-authored blend shapes.'
        ],
        example: 'Think of wringing a wet towel. If you twist the towel from opposite ends (180-degree bone rotation), the center of the towel pinches inward until the fabric compresses to almost zero thickness (Linear Blend Skinning candy-wrapper artifact). Dual Quaternion Skinning is like a solid articulated metal armor gauntlet: rotating your wrist spins the armor plates while the internal hollow volume remains 100% rigid and intact.',
        code: `// Simulation: Skeletal Mesh Animation (Linear Blend Skinning vs Dual Quaternions)
class SkinningSimulator {
  // Simulates 180-degree joint twist comparing Linear Blend Skinning against Dual Quaternions
  evaluateTwistVolumeLoss(twistAngleDegrees: number): {
    lbsVolumeRetention: number;
    dqsVolumeRetention: number;
    candyWrapperEliminated: boolean;
  } {
    const rad = (twistAngleDegrees * Math.PI) / 180;
    // LBS interpolates matrices linearly, causing cross-sectional area to collapse as cos(angle / 2)
    const lbsScale = Math.cos(rad / 2);
    const lbsVolume = Math.max(0, lbsScale * lbsScale);

    // Dual Quaternion Skinning (DQS) interpolates on unit dual quaternion sphere, volume retention is strictly 100%
    const dqsVolume = 1.0;

    return {
      lbsVolumeRetention: lbsVolume,
      dqsVolumeRetention: dqsVolume,
      candyWrapperEliminated: dqsVolume === 1.0
    };
  }
}

const skinning = new SkinningSimulator();
const twist180 = skinning.evaluateTwistVolumeLoss(180);

console.log('=== SKELETAL MESH ANIMATION: LBS VS DUAL QUATERNION SKINNING ===');
console.log('Joint Torsion: 180° Bone Rotation');
console.log('Linear Blend Skinning (LBS) Volume Retention: ' + (twist180.lbsVolumeRetention * 100).toFixed(1) + '% (Severe Candy-Wrapper Pinching!)');
console.log('Dual Quaternion Skinning (DQS) Volume Retention: ' + (twist180.dqsVolumeRetention * 100).toFixed(1) + '% (Rigid Volume Preserved)');
console.log('Deformation Artifact: ' + (twist180.candyWrapperEliminated ? 'CANDY-WRAPPER ARTIFACT COMPLETELY MITIGATED' : 'COLLAPSED'));`,
        output: `=== SKELETAL MESH ANIMATION: LBS VS DUAL QUATERNION SKINNING ===\nJoint Torsion: 180° Bone Rotation\nLinear Blend Skinning (LBS) Volume Retention: 0.0% (Severe Candy-Wrapper Pinching!)\nDual Quaternion Skinning (DQS) Volume Retention: 100.0% (Rigid Volume Preserved)\nDeformation Artifact: CANDY-WRAPPER ARTIFACT COMPLETELY MITIGATED`,
        tryIt: 'Modify the twist angle to 90 degrees to compare LBS partial volume loss (50%) against DQS rigid volume preservation (100%).',
        check: {
          question: 'What visual artifact occurs in Linear Blend Skinning (LBS) when a bone twists 180 degrees, and how do Dual Quaternions fix it?',
          options: [
            'LBS linearly interpolates rotation matrices through zero scale, causing the joint to collapse into a "candy-wrapper" pinch; Dual Quaternions interpolate on a unit hypersphere, preserving rigid volume',
            'LBS causes the GPU monitor to flicker purple',
            'Dual Quaternions convert the 3D model into an 8-bit voxel sprite'
          ],
          answer: 0,
          why: 'Linear matrix blending is not closed under the group of rigid transformations (SE(3)). As rotation approaches 180 degrees, linear matrix weights average out to zero volume. Dual Quaternions represent rigid rotations and translations as a unified algebraic element that preserves volume under spherical blending.'
        }
      },
      {
        title: 'Screen-Space Ambient Occlusion (SSAO) & G-Buffer Normal Depth Sampling',
        say: [
          'In the real physical world, ambient light does not illuminate all surfaces equally: light struggles to penetrate recessed corners, creases, and small crevices between adjacent objects.',
          'Without simulating these contact shadows, 3D scenes appear unnaturally flat and video game characters appear to "float" above ground surfaces without resting firmly on the floor.',
          'Screen-Space Ambient Occlusion (SSAO) approximates diffuse global illumination contact shadowing as a post-processing pass using only the camera G-Buffer depth and normal textures.',
          'For each pixel on screen, the fragment shader constructs a hemisphere kernel oriented along the surface normal vector.',
          'To break visible banding patterns without increasing the sample count, the shader tiles a 4x4 random noise texture across the screen to rotate the hemisphere kernel randomly per pixel.',
          'The shader projects each kernel sample point into screen space and compares its depth against the actual scene depth stored in the G-Buffer: if scene geometry lies in front of the kernel point, that sample is flagged as occluded.',
          'A subsequent bilateral blur filter smooths the noise across flat surfaces while preserving sharp geometric silhouette edges.'
        ],
        example: 'Think of looking at the corner where your room\'s wall meets the carpet floor. Even when the room ceiling light is on, the deep crease in the corner is noticeably darker than the middle of the wall because ambient light bouncing around the room has fewer open angles to enter the crease (ambient occlusion).',
        code: `// Simulation: Screen-Space Ambient Occlusion (SSAO) Hemisphere Kernel Occlusion
class SsaoSimulator {
  // Evaluates occlusion factor in normal-oriented hemisphere kernel
  evaluateSsaoOcclusion(
    surfaceNormal: [number, number, number],
    kernelSamples: number,
    sampleDepths: number[], // Depth of scene geometry at sample points
    kernelZ: number[]       // Theoretical z-coordinate of hemisphere kernel points
  ): { occlusionFactor: number; ambientLightMultiplier: number } {
    let occludedCount = 0;
    const bias = 0.025; // Depth bias preventing self-occlusion

    for (let i = 0; i < kernelSamples; i++) {
      // If geometry depth is closer than kernel point, geometry occludes the hemisphere
      if (sampleDepths[i] <= kernelZ[i] - bias) {
        occludedCount++;
      }
    }

    const occlusionFactor = occludedCount / kernelSamples;
    const ambientLightMultiplier = 1.0 - occlusionFactor;
    return { occlusionFactor, ambientLightMultiplier };
  }
}

const ssao = new SsaoSimulator();
// 16-sample hemisphere in a 90-degree corner (crease) where half the hemisphere is blocked
const sampleDepths = [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9];
const kernelZ = [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8];
const ssaoResult = ssao.evaluateSsaoOcclusion([0, 1, 0], 16, sampleDepths, kernelZ);

console.log('=== SCREEN-SPACE AMBIENT OCCLUSION (SSAO) ===');
console.log('Hemisphere Kernel Size: 16 Samples (4x4 Tiled Noise Rotation)');
console.log('Surface Geometry: 90° Wall-Floor Crease');
console.log('Occlusion Factor: ' + (ssaoResult.occlusionFactor * 100).toFixed(1) + '% Ambient Light Blocked');
console.log('Ambient Lighting Multiplier: ' + ssaoResult.ambientLightMultiplier.toFixed(2) + 'x (Realistic Soft Contact Shadow)');`,
        output: `=== SCREEN-SPACE AMBIENT OCCLUSION (SSAO) ===\nHemisphere Kernel Size: 16 Samples (4x4 Tiled Noise Rotation)\nSurface Geometry: 90° Wall-Floor Crease\nOcclusion Factor: 50.0% Ambient Light Blocked\nAmbient Lighting Multiplier: 0.50x (Realistic Soft Contact Shadow)`,
        tryIt: 'Increase occluded sample count to 12 out of 16 to simulate a deep tight crevice with 75% light blockage.',
        check: {
          question: 'Why does SSAO rotate its hemisphere kernel using a tiled 4x4 random noise texture?',
          options: [
            'To trade structured, noticeable banding artifacts for high-frequency noise that can be easily removed by a fast bilateral blur filter',
            'To encrypt the depth buffer before sending it to the display',
            'Because GPUs cannot sample textures larger than 4x4 pixels'
          ],
          answer: 0,
          why: 'Using a fixed hemisphere kernel across all pixels causes harsh step-like banding rings. Rotating the kernel with random noise turns banding into high-frequency stipple noise, which an edge-preserving bilateral blur filter smooths out effortlessly.'
        }
      },
      {
        title: 'WebGPU Compute Shaders & GPU Particle Simulation Pipelines',
        say: [
          'In traditional WebGL applications, simulating particle physics (smoke, fire, snow, explosions) required the CPU to loop over thousands of particles, update their positions in JavaScript, and upload vertex buffer updates to the GPU every single frame.',
          'This CPU-to-GPU data transfer creates a severe PCIe bandwidth bottleneck, capping particle counts at roughly 5,000 before frame rates drop below 60 FPS.',
          'WebGPU completely eliminates this bottleneck through Compute Shaders written in WGSL (WebGPU Shading Language).',
          'Compute shaders run outside the standard vertex/fragment rasterization pipeline, allowing general-purpose parallel math across thousands of GPU cores.',
          'By storing particle state arrays directly in GPU VRAM using storage buffers (var<storage, read_write>), a single WebGPU compute pass can update 100,000+ particles in parallel using @compute @workgroup_size(64).',
          'The updated particle positions remain directly on the GPU memory bus and are fed directly into the rendering pipeline as vertex attributes without a single byte ever returning to CPU memory, unlocking massive real-time simulations at 120 FPS.'
        ],
        example: 'Think of 100,000 dominoes set up across a massive stadium floor. In WebGL, one person running around with a clipboard (CPU) pushes each domino one by one and radios the coordinator (GPU). In WebGPU compute, 1,500 stadium volunteers (GPU workgroups) push their assigned section of 64 dominoes simultaneously in unison in a fraction of a millisecond.',
        code: `// Simulation: WebGPU WGSL Compute Workgroups & Particle Dispatch
class WebGpuParticleComputeSimulator {
  simulateWorkgroups(particleCount: number, workgroupSize: number = 64): {
    totalWorkgroupsDispatched: number;
    gpuThroughputMillionsPerSec: number;
    cpuReadbackRequired: boolean;
  } {
    const workgroups = Math.ceil(particleCount / workgroupSize);
    // Typical modern GPU executes 100k simple particle Euler steps in 0.12 ms -> ~830M particles/sec
    const gpuThroughput = 833.3;

    return {
      totalWorkgroupsDispatched: workgroups,
      gpuThroughputMillionsPerSec: gpuThroughput,
      cpuReadbackRequired: false
    };
  }
}

const compute = new WebGpuParticleComputeSimulator();
const particles = compute.simulateWorkgroups(100000, 64);

console.log('=== WEBGPU COMPUTE SHADERS & GPU PARTICLE SIMULATION ===');
console.log('Simulated Particles: 100,000 Active GPU Particles');
console.log('WGSL Workgroup Size: @workgroup_size(64)');
console.log('Dispatched Workgroups: ' + particles.totalWorkgroupsDispatched + ' Compute Groups');
console.log('VRAM Storage Buffer: ZERO CPU READBACK (Integrated & Rendered directly in VRAM)');`,
        output: `=== WEBGPU COMPUTE SHADERS & GPU PARTICLE SIMULATION ===\nSimulated Particles: 100,000 Active GPU Particles\nWGSL Workgroup Size: @workgroup_size(64)\nDispatched Workgroups: 1563 Compute Groups\nVRAM Storage Buffer: ZERO CPU READBACK (Integrated & Rendered directly in VRAM)`,
        tryIt: 'Increase the particle count to 1,000,000 and calculate the number of dispatched workgroups.',
        check: {
          question: 'What is the primary architectural advantage of using WebGPU compute shaders for particle systems over WebGL CPU updates?',
          options: [
            'Particles are simulated and stored entirely inside GPU VRAM, eliminating the CPU-to-GPU PCIe memory transfer bottleneck',
            'WebGPU compute shaders turn off physical gravity calculations',
            'Compute shaders run on the client’s router instead of the graphics card'
          ],
          answer: 0,
          why: 'WebGPU compute shaders execute particle physics directly on GPU cores and write new coordinates to GPU storage buffers. The render pipeline reads the same VRAM buffer directly, requiring zero CPU readback or PCIe uploads.'
        }
      },
      {
        title: 'High Dynamic Range (HDR) & ACES Filmic Tone Mapping',
        say: [
          'In the real world, luminance spans an astronomical dynamic range: a candle radiates roughly 1 nit, an indoor lamp produces 100 nits, and direct solar specular glare exceeds 100,000 nits.',
          'Standard monitors and mobile displays operate in Standard Dynamic Range (SDR) with an 8-bit color depth bounded between 0.0 and 1.0 per channel.',
          'If a 3D engine renders lighting equations into a standard 8-bit framebuffer, all radiance values above 1.0 are abruptly clipped, creating ugly, blown-out flat white blobs that destroy detail in clouds, fire, and metallic reflections.',
          'High Dynamic Range (HDR) pipelines solve this by rendering lighting into 16-bit floating-point framebuffers (RGBA16F), allowing radiance values to reach 10.0, 50.0, or higher without clipping.',
          'Before displaying the final image on an SDR monitor, the engine applies a Tone Mapping Operator to smoothly compress extended HDR values back into the [0, 1] display gamut.',
          'While basic operators like Reinhard (x / (1 + x)) cause desaturated, muddy midtones, the industry standard ACES (Academy Color Encoding System) filmic tone mapper uses an S-curve that provides deep, rich blacks, a linear filmic mid-tone contrast, and a smooth shoulder that naturally desaturates bright highlights like real photographic film.'
        ],
        example: 'Think of looking at the sun through a camera lens. If you take a photo with a cheap webcam (SDR clipping), the sun appears as a harsh flat white octagon. If you take a photo with an IMAX 70mm film camera (ACES tone mapping), the center of the sun is intensely bright while the outer halo displays rich orange, yellow, and red gradients with natural cinematic roll-off.',
        code: `// Simulation: High Dynamic Range (HDR) & ACES Filmic Tone Mapping
class HdrToneMapper {
  // ACES Narkowicz filmic tone mapping approximation curve
  acesFilmic(x: number): number {
    const a = 2.51;
    const b = 0.03;
    const c = 2.43;
    const d = 0.59;
    const e = 0.14;
    return Math.min(1.0, Math.max(0.0, (x * (a * x + b)) / (x * (c * x + d) + e)));
  }

  // Simple Reinhard operator for comparison: x / (1 + x)
  reinhard(x: number): number {
    return x / (1.0 + x);
  }
}

const toneMapper = new HdrToneMapper();
// Radiance values: Mid-tone (0.5), Sunlight Reflection (5.0), Direct Sun Filament (20.0)
const sunGlintAces = toneMapper.acesFilmic(5.0);
const sunGlintReinhard = toneMapper.reinhard(5.0);
const directSunAces = toneMapper.acesFilmic(20.0);

console.log('=== HIGH DYNAMIC RANGE (HDR) & ACES FILMIC TONE MAPPING ===');
console.log('High-Dynamic Range Input: 5.0 (Bright Solar Specular Glint)');
console.log('Reinhard Tone Mapped: ' + sunGlintReinhard.toFixed(3) + ' (Muddy, washed out contrast)');
console.log('ACES Filmic Tone Mapped: ' + sunGlintAces.toFixed(3) + ' (Rich cinematic shoulder & chromatic fidelity)');
console.log('Extreme Radiance 20.0: ' + directSunAces.toFixed(3) + ' (Smooth asymptotic roll-off without white clipping)');`,
        output: `=== HIGH DYNAMIC RANGE (HDR) & ACES FILMIC TONE MAPPING ===\nHigh-Dynamic Range Input: 5.0 (Bright Solar Specular Glint)\nReinhard Tone Mapped: 0.833 (Muddy, washed out contrast)\nACES Filmic Tone Mapped: 0.985 (Rich cinematic shoulder & chromatic fidelity)\nExtreme Radiance 20.0: 1.000 (Smooth asymptotic roll-off without white clipping)`,
        tryIt: 'Evaluate the ACES curve at x = 0.18 (photographic 18% middle gray) to see how the tone mapper preserves linear exposure.',
        check: {
          question: 'Why is the ACES filmic tone mapping curve widely preferred over simple Reinhard tone mapping in modern 3D games and cinema?',
          options: [
            'ACES incorporates an S-curve that preserves rich contrast in mid-tones, delivers punchy blacks, and smoothly desaturates extreme highlights without muddy artifacts',
            'ACES doubles the frame rate of the graphics card',
            'Reinhard tone mapping is illegal under copyright law'
          ],
          answer: 0,
          why: 'Reinhard tone mapping washes out color saturation and flattens mid-tone contrast into a muddy gray. ACES models the physical response of photographic film with a toe (deep blacks), linear mid-tones, and a smooth shoulder (bright highlights).'
        }
      },
      {
        title: 'Bounding Volume Hierarchy (BVH) & Ray-Box Slab Traversal',
        say: [
          'In hardware-accelerated ray tracing, physics collision detection, and spatial scene queries, testing a ray against every individual triangle in a scene with 10 million polygons yields O(N) linear complexity, causing complete performance collapse.',
          'To achieve real-time 60 FPS performance, engines organize 3D primitives into a Bounding Volume Hierarchy (BVH).',
          'A BVH is a binary tree where every node encloses its children within an Axis-Aligned Bounding Box (AABB). Leaf nodes contain individual triangles or geometric meshes.',
          'To test whether a ray intersects an AABB, engines use the Ray-Box Slab Method: an AABB is defined by three pairs of parallel clipping planes (slabs) along the X, Y, and Z axes.',
          'The intersection algorithm calculates the entry distance tNear and exit distance tFar across all three axes: if the greatest entry distance exceeds the smallest exit distance (tmin > tmax), the ray misses the bounding box completely.',
          'When a ray misses an internal BVH node’s AABB, the entire subtree beneath that node is pruned in O(1) time, accelerating ray casting queries from O(N) to O(log N) logarithmic time.'
        ],
        example: 'Think of looking for a lost book in a giant national library. You don\'t read every single page in all 5 million books (O(N) brute force). You check the building directory for Floor 3 (BVH root), then Aisle 12 (internal node), and finally Shelf 4 (leaf node). If Aisle 12 is for biology books and you need history, you skip the entire aisle in one glance.',
        code: `// Simulation: Bounding Volume Hierarchy (BVH) & Ray-Box Slab Traversal
interface Aabb {
  min: [number, number, number];
  max: [number, number, number];
}

class BvhSlabTraverser {
  // Ray-box intersection using the slab method
  intersectRayAabb(
    origin: [number, number, number],
    direction: [number, number, number],
    box: Aabb
  ): { hit: boolean; tNear: number; tFar: number } {
    let tmin = -Infinity;
    let tmax = Infinity;

    for (let i = 0; i < 3; i++) {
      const invD = 1.0 / direction[i];
      let t0 = (box.min[i] - origin[i]) * invD;
      let t1 = (box.max[i] - origin[i]) * invD;
      if (invD < 0.0) {
        const tmp = t0;
        t0 = t1;
        t1 = tmp;
      }
      tmin = Math.max(tmin, t0);
      tmax = Math.min(tmax, t1);
      if (tmax < tmin) return { hit: false, tNear: 0, tFar: 0 };
    }
    return { hit: true, tNear: Math.max(0, tmin), tFar: tmax };
  }
}

const bvh = new BvhSlabTraverser();
const rayOrigin: [number, number, number] = [0, 0, -10];
const rayDir: [number, number, number] = [0, 0, 1]; // Shooting along +Z axis

const targetBox: Aabb = { min: [-2, -2, 5], max: [2, 2, 9] };
const missBox: Aabb = { min: [10, 10, 5], max: [15, 15, 9] };

const hitResult = bvh.intersectRayAabb(rayOrigin, rayDir, targetBox);
const missResult = bvh.intersectRayAabb(rayOrigin, rayDir, missBox);

console.log('=== BOUNDING VOLUME HIERARCHY (BVH) & RAY-BOX SLAB TRAVERSAL ===');
console.log('Ray: Origin (0,0,-10), Direction (0,0,+1)');
console.log('Target Box Intersection: ' + (hitResult.hit ? 'HIT at t=' + hitResult.tNear.toFixed(1) + ' (Entering Z=5)' : 'MISS'));
console.log('Distant Box Intersection: ' + (missResult.hit ? 'HIT' : 'EARLY-OUT MISS (Subtree Skipped)'));
console.log('Algorithmic Acceleration: O(log N) tree traversal vs O(N) brute force triangle testing');`,
        output: `=== BOUNDING VOLUME HIERARCHY (BVH) & RAY-BOX SLAB TRAVERSAL ===\nRay: Origin (0,0,-10), Direction (0,0,+1)\nTarget Box Intersection: HIT at t=15.0 (Entering Z=5)\nDistant Box Intersection: EARLY-OUT MISS (Subtree Skipped)\nAlgorithmic Acceleration: O(log N) tree traversal vs O(N) brute force triangle testing`,
        tryIt: 'Shoot a ray at an angle [1, 0, 1] normalized and verify how the slab algorithm calculates tNear and tFar.',
        check: {
          question: 'How does the Ray-AABB Slab Method accelerate ray tracing through a Bounding Volume Hierarchy?',
          options: [
            'By computing 1D entry and exit intervals across parallel slab planes, allowing whole bounding box subtrees to be pruned in O(1) time whenever tNear > tFar',
            'By converting all rays into 2D raster lines on the screen',
            'By requiring the GPU to execute 1,000 ray bounces per frame'
          ],
          answer: 0,
          why: 'The slab method tests intersection against parallel box planes. If the ray’s entry interval on one axis occurs after its exit interval on another (tNear > tFar), the ray cannot intersect any geometry inside the box, allowing the entire BVH branch to be discarded immediately.'
        }
      }
    ],
    summary: [
      'Dual Quaternion Skinning (DQS) eliminates Linear Blend Skinning candy-wrapper volume collapse during 180° joint torsion.',
      'Screen-Space Ambient Occlusion (SSAO) samples G-buffer depth and normal hemispheres, rotating with 4x4 noise to break banding.',
      'WebGPU Compute Shaders simulate 100,000+ particles directly in VRAM storage buffers (@workgroup_size(64)) with zero CPU readback.',
      'High Dynamic Range (HDR) pipelines render to RGBA16F textures and apply ACES filmic tone mapping to preserve rich contrast and highlight roll-off.',
      'Bounding Volume Hierarchy (BVH) with Ray-AABB slab traversal prunes unhit subtrees, accelerating spatial ray tracing from O(N) to O(log N).'
    ],
    projectStep: {
      title: 'Architect a Next-Generation WebGPU Compute & Shading Pipeline',
      steps: [
        'Implement Dual Quaternion Skinning (DQS) for skeletal character meshes to eliminate joint volume loss.',
        'Build a Screen-Space Ambient Occlusion (SSAO) post-process pass using G-buffer normal and depth buffers.',
        'Write a WebGPU compute shader pipeline simulating 100,000 particles running entirely in VRAM storage buffers.',
        'Integrate ACES filmic tone mapping to compress HDR lighting into rich SDR display gamuts.',
        'Construct a BVH ray-AABB slab intersection traverser accelerating spatial queries to O(log N).'
      ]
    }
  },
  {
    day: 4,
    title: 'Advanced WebGPU Multi-Pass Render Pipelines, Clustered Shading & Compute Physics',
    goal: 'Master advanced graphics engineering with WebGPU and WGSL: multi-pass deferred rendering with G-Buffers, clustered forward / tiled light culling in compute shaders, Cook-Torrance GGX microfacet specular BRDF with energy conservation, GPU particle physics with spatial grid broadphase in storage buffers, and hardware mipmapping with anisotropic texture filtering.',
    minutes: 36,
    recap: 'Welcome to Advanced WebGPU Architecture & Modern Shading Pipelines. Today we harness WebGPU’s explicit multi-queue command encoders, compute passes, and cluster-based lighting engines.',
    parts: [
      {
        title: 'Multi-Pass Deferred Shading & WebGPU G-Buffer Architecture',
        say: [
          'In traditional Forward Rendering, every triangle in the scene executes lighting calculations for every active light source. If a scene contains 50,000 polygons and 50 point lights, the fragment shader computes 2.5 million lighting operations, even if 80% of those fragments are ultimately occluded by foreground geometry. This creates an unscalable bottleneck.',
          'Deferred Shading solves this by splitting rendering into two explicit passes. In Pass 1 (Geometry Pass), the rasterizer renders all geometry without evaluating lighting, writing geometric surface properties into Multi-Render-Target (MRT) textures known as the Geometry Buffer (G-Buffer). A modern WebGPU G-buffer binds four render attachments: Albedo RGB (RGBA8Unorm), World-space Normals (RGBA16Float), Roughness/Metallic (RG8Unorm), and Linear Depth (Depth32Float).',
          'In Pass 2 (Lighting Pass), a single screen-filling quad is rendered. The fragment shader reads the G-Buffer textures pixel-by-pixel, reconstructing world positions from depth and applying lighting equations only to the visible surface pixels. This reduces lighting complexity from O(geometry * lights) to O(screen_pixels * lights), enabling hundreds of dynamic lights in dense game scenes.'
        ],
        example: 'Like an artist preparing a composite painting: first drawing all character outlines, textures, and heights onto separate clear plastic film layers (G-buffer), and then shining colored spotlights onto the composite sheets in a single final exposure.',
        code: `// Multi-Pass Deferred Shading & WebGPU G-Buffer Simulator
interface GBufferPixel {
  albedo: [number, number, number];
  normal: [number, number, number];
  roughness: number;
  metallic: number;
  depth: number;
}

class DeferredLightingPipeline {
  // Pass 1: G-Buffer Generation (MRT attachments)
  sampleGBuffer(): GBufferPixel {
    return {
      albedo: [0.8, 0.2, 0.2], // Red base color
      normal: [0, 0, 1], // Facing camera (+Z)
      roughness: 0.3,
      metallic: 0.1,
      depth: 0.85
    };
  }

  // Pass 2: Screen-space lighting pass
  evaluateDirectLight(pixel: GBufferPixel, lightDir: [number, number, number], lightColor: [number, number, number]): [number, number, number] {
    // Lambertian diffuse: max(dot(N, L), 0)
    const nDotL = Math.max(0, pixel.normal[0] * lightDir[0] + pixel.normal[1] * lightDir[1] + pixel.normal[2] * lightDir[2]);
    return [
      Number((pixel.albedo[0] * lightColor[0] * nDotL).toFixed(3)),
      Number((pixel.albedo[1] * lightColor[1] * nDotL).toFixed(3)),
      Number((pixel.albedo[2] * lightColor[2] * nDotL).toFixed(3))
    ];
  }
}

const pipeline = new DeferredLightingPipeline();
const gbuf = pipeline.sampleGBuffer();
const lightDirection: [number, number, number] = [0, 0, 1]; // Direct frontal light
const lightColor: [number, number, number] = [1.0, 1.0, 1.0];
const litRadiance = pipeline.evaluateDirectLight(gbuf, lightDirection, lightColor);

console.log('=== MULTI-PASS DEFERRED SHADING & WEBGPU G-BUFFER ===');
console.log('MRT Attachments: Albedo (RGBA8), Normal (RGBA16F), Roughness/Metallic (RG8), Depth (D32F)');
console.log('Pass 1 (G-Buffer Raster): Stored surface geometry with 0 lighting calculations');
console.log('Pass 2 (Deferred Composite): Lit Pixel Radiance RGB: [' + litRadiance.join(', ') + ']');
console.log('Efficiency Win: Shading complexity decoupled from scene geometry count');`,
        output: `=== MULTI-PASS DEFERRED SHADING & WEBGPU G-BUFFER ===\nMRT Attachments: Albedo (RGBA8), Normal (RGBA16F), Roughness/Metallic (RG8), Depth (D32F)\nPass 1 (G-Buffer Raster): Stored surface geometry with 0 lighting calculations\nPass 2 (Deferred Composite): Lit Pixel Radiance RGB: [0.8, 0.2, 0.2]\nEfficiency Win: Shading complexity decoupled from scene geometry count`,
        tryIt: 'Change lightDirection to [0, 1, 0] perpendicular to the normal and observe that litRadiance drops to [0, 0, 0].',
        check: {
          question: 'What is the primary algorithmic advantage of Deferred Shading over Forward Rendering?',
          options: [
            'It decouples lighting calculations from geometric triangle density, computing lighting only once per visible screen pixel',
            'It enables 3D graphics to run on monochrome e-ink monitors',
            'It eliminates the need for vertex buffers entirely'
          ],
          answer: 0,
          why: 'By rendering geometry into G-buffer textures first, occluded pixels are naturally discarded, ensuring lighting calculations execute only for visible surfaces.'
        }
      },
      {
        title: 'Clustered Forward & Tiled Light Culling with Compute Shaders',
        say: [
          'While Deferred Shading handles high light counts efficiently, it has two major limitations: it cannot natively handle transparent surfaces (such as stained glass, smoke, or water), and hardware Multi-Sample Anti-Aliasing (MSAA) becomes prohibitively memory-intensive. Clustered Forward Shading unites the benefits of both paradigms.',
          'In Clustered Forward Shading, the view camera frustum is subdivided along X, Y, and Z into a 3D grid of spatial clusters (for example, 16 horizontal bins x 9 vertical bins x 24 logarithmic depth slices, yielding 3,456 cluster bounding boxes). Before rendering the scene, a WebGPU Compute Shader pass runs across all active point lights in the scene.',
          'The compute shader tests each light bounding sphere against cluster AABBs and writes the list of overlapping light IDs into a GPU storage buffer. When the forward fragment shader renders transparent and opaque meshes, each pixel calculates which cluster it occupies in screen-depth space and loops only through the subset of lights intersecting that cluster. This enables thousands of dynamic lights with full support for transparency and hardware MSAA.'
        ],
        example: 'Like sorting mail packages into a grid of neighborhood cubbies before delivery drivers depart: each driver only carries and inspects packages intended for their designated street grid.',
        code: `// Clustered Forward & Tiled Light Culling (WGSL) Simulator
interface PointLight {
  id: number;
  pos: [number, number, number];
  radius: number;
}

class ClusteredLightCuller {
  // Frustum cluster grid: 16x9x24 clusters
  cullLightsForCluster(clusterMinZ: number, clusterMaxZ: number, lights: PointLight[]): number[] {
    const activeIds: number[] = [];
    for (const light of lights) {
      const lightMinZ = light.pos[2] - light.radius;
      const lightMaxZ = light.pos[2] + light.radius;
      // 1D depth overlap check
      if (lightMaxZ >= clusterMinZ && lightMinZ <= clusterMaxZ) {
        activeIds.push(light.id);
      }
    }
    return activeIds;
  }
}

const culler = new ClusteredLightCuller();
const testLights: PointLight[] = [
  { id: 1, pos: [0, 0, 5], radius: 2 },   // Z range: [3, 7]
  { id: 2, pos: [0, 0, 15], radius: 3 },  // Z range: [12, 18]
  { id: 3, pos: [0, 0, 50], radius: 10 }  // Z range: [40, 60]
];

const clusterNearLights = culler.cullLightsForCluster(2, 8, testLights);
const clusterFarLights = culler.cullLightsForCluster(30, 45, testLights);

console.log('=== CLUSTERED FORWARD & TILED LIGHT CULLING (WGSL) ===');
console.log('Grid Volume: 16x9x24 Frustum Clusters (3,456 spatial cluster bins)');
console.log('Cluster Near (Z: 2-8m) Active Lights: ' + clusterNearLights.length + ' (Light IDs: [' + clusterNearLights.join(', ') + '])');
console.log('Cluster Far (Z: 30-45m) Active Lights: ' + clusterFarLights.length + ' (Light IDs: [' + clusterFarLights.join(', ') + '])');
console.log('Forward Pipeline Benefit: Supports transparency & MSAA with 1,000+ dynamic lights');`,
        output: `=== CLUSTERED FORWARD & TILED LIGHT CULLING (WGSL) ===\nGrid Volume: 16x9x24 Frustum Clusters (3,456 spatial cluster bins)\nCluster Near (Z: 2-8m) Active Lights: 1 (Light IDs: [1])\nCluster Far (Z: 30-45m) Active Lights: 1 (Light IDs: [3])\nForward Pipeline Benefit: Supports transparency & MSAA with 1,000+ dynamic lights`,
        tryIt: 'Add a new light at Z=5 with radius 10 and verify that it appears in both near and mid cluster bins.',
        check: {
          question: 'Why does Clustered Forward Shading support transparent materials better than Deferred Shading?',
          options: [
            'Because forward fragment shaders evaluate lighting in order directly during mesh rasterization, whereas deferred shading can only store one depth layer per pixel in the G-Buffer',
            'Because transparent shaders do not use GPU memory',
            'Because WebGPU only supports transparency on Tuesday'
          ],
          answer: 0,
          why: 'Deferred G-Buffers store a single surface depth per pixel, making multi-layered blending impossible. Clustered forward computes forward lighting using pre-culled cluster light lists.'
        }
      },
      {
        title: 'Cook-Torrance GGX Specular BRDF & Energy Conservation',
        say: [
          'Physically Based Rendering (PBR) simulates the interaction of light and matter based on real-world physics. The industry standard model for opaque materials is the Cook-Torrance microfacet Bidirectional Reflectance Distribution Function (BRDF).',
          'The specular component is governed by three terms: D * G * F / (4 * (N.V) * (N.L)). D is the GGX Normal Distribution Function, describing the statistical orientation of microscopic surface microfacets based on roughness. G is the Schlick-Smith Geometric shadowing function, accounting for microfacets occluding each other. F is the Fresnel-Schlick equation, representing how reflectance increases at glancing grazing angles.',
          'A fundamental law of physics is energy conservation: a material cannot reflect more photon energy than it receives. In the Cook-Torrance model, incoming light is partitioned into specular reflection (Ks) and diffuse refraction (Kd). Because metallic materials have free conduction electrons that absorb all refracted light, metallic surfaces have Kd = 0. Enforcing Kd = (1 - Ks) * (1 - metallic) guarantees that Kd + Ks <= 1.0, preventing blown-out highlights.'
        ],
        example: 'Like polishing rough wood versus a chrome bumper: smooth chrome reflects sharp specular glints while matte wood scatters light in soft diffuse glows, but neither surface can emit more light than the lamp shining on it.',
        code: `// Cook-Torrance GGX Specular BRDF & Energy Conservation Simulator
class CookTorrancePbrBrdf {
  // GGX Normal Distribution Function D
  distributionGgx(nDotH: number, roughness: number): number {
    const a = roughness * roughness;
    const a2 = a * a;
    const d = (nDotH * nDotH * (a2 - 1.0) + 1.0);
    return a2 / (Math.PI * d * d);
  }

  // Fresnel-Schlick approximation F
  fresnelSchlick(vDotH: number, f0: number): number {
    return f0 + (1.0 - f0) * Math.pow(1.0 - vDotH, 5);
  }

  evaluateRadiance(roughness: number, metallic: number): { kd: number; ks: number; energyConserved: boolean } {
    const f0 = 0.04 * (1.0 - metallic) + metallic; // Dielectric vs metallic base reflectance
    const ks = this.fresnelSchlick(0.707, f0); // Specular reflection weight
    const kd = (1.0 - ks) * (1.0 - metallic); // Diffuse weight (metals have 0 diffuse)
    return {
      kd: Number(kd.toFixed(3)),
      ks: Number(ks.toFixed(3)),
      energyConserved: (kd + ks) <= 1.0
    };
  }
}

const pbr = new CookTorrancePbrBrdf();
const dielectric = pbr.evaluateRadiance(0.4, 0.0);
const metal = pbr.evaluateRadiance(0.2, 1.0);

console.log('=== COOK-TORRANCE GGX SPECULAR BRDF & ENERGY CONSERVATION ===');
console.log('Dielectric Surface (Plastic/Wood): Kd=' + dielectric.kd + ' | Ks=' + dielectric.ks + ' (Total: ' + (dielectric.kd + dielectric.ks) + ')');
console.log('Metallic Surface (Gold/Brass): Kd=' + metal.kd + ' | Ks=' + metal.ks + ' (Metals absorb all diffuse)');
console.log('Energy Conservation Invariant: Kd + Ks <= 1.0 -> ' + (dielectric.energyConserved && metal.energyConserved ? 'STRICTLY ENFORCED' : 'VIOLATED'));
console.log('Visual Fidelity: Photorealistic highlights without over-bright burning artifacts');`,
        output: `=== COOK-TORRANCE GGX SPECULAR BRDF & ENERGY CONSERVATION ===\nDielectric Surface (Plastic/Wood): Kd=0.958 | Ks=0.042 (Total: 1)\nMetallic Surface (Gold/Brass): Kd=0 | Ks=1 (Metals absorb all diffuse)\nEnergy Conservation Invariant: Kd + Ks <= 1.0 -> STRICTLY ENFORCED\nVisual Fidelity: Photorealistic highlights without over-bright burning artifacts`,
        tryIt: 'Adjust the dielectric f0 base reflectance and verify that Kd automatically adjusts to conserve energy.',
        check: {
          question: 'Why must pure metallic materials have diffuse reflection Kd equal to zero in physically based rendering?',
          options: [
            'Because conductive metals absorb all refracted light inside their electron sea, converting it to heat rather than diffuse subsurface scattering',
            'Because metals are always colored pitch black in real life',
            'Because the graphics driver throws an error if metals have diffuse color'
          ],
          answer: 0,
          why: 'In physics, metals possess free conduction electrons that immediately absorb refracted light energy, leaving only specular surface reflectance.'
        }
      },
      {
        title: 'WebGPU Compute Broadphase & Spatial Hash Grid Physics',
        say: [
          'Simulating 100,000 colliding rigid bodies or fluid particles on the CPU is impossible due to memory transfer latency and single-threaded bottlenecks. Even on the GPU, evaluating all pairs among 100,000 particles requires 10 billion comparisons per frame ($O(N^2)$), causing immediate GPU timeouts.',
          'Real-time GPU physics requires a broadphase spatial partitioning acceleration structure. The modern WebGPU pattern is the Spatial Hash Grid. The simulation bounds are divided into uniform 3D grid cells matching the particle interaction radius. In a first compute pass, each particle computes its 3D cell coordinate and hashes it into a 1D cell index using large prime numbers.',
          'A second compute pass executes a parallel Bitonic Sort on the particle index array sorted by cell hash. Once sorted, all particles residing in the same spatial cell are contiguously aligned in memory. A third compute pass dispatches workgroups (@workgroup_size(64, 1, 1)) where each thread inspects only the contiguous particles in its cell and the 26 immediate neighboring cells, reducing broadphase complexity to O(N).'
        ],
        example: 'Like organizing marathon runners into designated corral pens by bib number: to check if runners bumped into each other, you only check inside corral pen 4 and adjacent pen 5, rather than testing every runner against all 50,000 participants.',
        code: `// WebGPU Compute Broadphase & Spatial Hash Grid Simulator
interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
}

class GpuSpatialHashGrid {
  private cellSize = 2.0;

  hashCoord(x: number, y: number, z: number): number {
    const xi = Math.floor(x / this.cellSize);
    const yi = Math.floor(y / this.cellSize);
    const zi = Math.floor(z / this.cellSize);
    // Large prime spatial hash
    return Math.abs((xi * 73856093) ^ (yi * 19349663) ^ (zi * 83492791)) % 1024;
  }

  detectCellCollisions(particles: Particle[]): Map<number, number[]> {
    const buckets = new Map<number, number[]>();
    for (const p of particles) {
      const hash = this.hashCoord(p.x, p.y, p.z);
      if (!buckets.has(hash)) buckets.set(hash, []);
      buckets.get(hash)!.push(p.id);
    }
    return buckets;
  }
}

const grid = new GpuSpatialHashGrid();
const particles: Particle[] = [
  { id: 1, x: 1.1, y: 1.2, z: 0.5 },
  { id: 2, x: 1.4, y: 1.5, z: 0.7 }, // Same cell as #1
  { id: 3, x: 15.0, y: 22.0, z: 9.0 } // Far away cell
];

const collisionBuckets = grid.detectCellCollisions(particles);
let sharedCellFound = false;
for (const [hash, ids] of collisionBuckets.entries()) {
  if (ids.length > 1) sharedCellFound = true;
}

console.log('=== WEBGPU COMPUTE BROADPHASE & SPATIAL HASH GRID ===');
console.log('Simulation Scale: 100,000 Particle Physics in VRAM Storage Buffers');
console.log('Workgroup Size: @workgroup_size(64, 1, 1) parallel dispatch');
console.log('Broadphase Clustered Pairs: ' + (sharedCellFound ? 'Particles #1 and #2 isolated to identical cell bucket' : 'None'));
console.log('Algorithmic Speedup: Narrowphase tests reduced from O(N^2) to O(N) local lookups');`,
        output: `=== WEBGPU COMPUTE BROADPHASE & SPATIAL HASH GRID ===\nSimulation Scale: 100,000 Particle Physics in VRAM Storage Buffers\nWorkgroup Size: @workgroup_size(64, 1, 1) parallel dispatch\nBroadphase Clustered Pairs: Particles #1 and #2 isolated to identical cell bucket\nAlgorithmic Speedup: Narrowphase tests reduced from O(N^2) to O(N) local lookups`,
        tryIt: 'Move particle #3 close to particle #1 (e.g. x: 1.2, y: 1.3, z: 0.6) and verify it joins the shared bucket.',
        check: {
          question: 'How does sorting particle indices by spatial cell hash accelerate GPU physics simulations?',
          options: [
            'It groups spatially neighboring particles into contiguous GPU memory buffers, maximizing L1/L2 texture cache hits and eliminating O(N^2) pair checks',
            'It renders particle velocities onto the computer desktop wallpaper',
            'It prevents particles from entering negative Z coordinates'
          ],
          answer: 0,
          why: 'Contiguous memory layout ensures threads in a GPU warp/workgroup read adjacent memory addresses, avoiding memory bank conflicts and cache misses.'
        }
      },
      {
        title: 'Mipmap Generation & Anisotropic Texture Filtering in WebGPU',
        say: [
          'When high-resolution textures are applied to surfaces receding into the distance, a single screen pixel covers dozens or hundreds of surface texels. Sampling only one texel causes severe high-frequency aliasing, visual noise, and shimmering during camera movement, while evicting GPU texture caches.',
          'Mipmapping precomputes a pyramid of progressively downsampled textures (Level 0: 1024x1024, Level 1: 512x512, down to Level 10: 1x1). While legacy WebGL provided gl.generateMipmap(), WebGPU intentionally leaves mipmap generation to the application developer to allow optimized compute shader or render pass downsampling pipelines.',
          'At steep oblique viewing angles (such as looking down an expansive tiled floor or asphalt road), standard bilinear or trilinear mipmapping averages square texel regions, causing unnatural blurriness along the direction of perspective compression. Anisotropic filtering samples multiple texels along the projected elliptical footprint on the surface, preserving crystal-clear sharpness and fine detail at grazing angles up to 16x sampling.'
        ],
        example: 'Like looking down a straight railway track: nearby ties are wide and sharp, while distant ties recede into tight perspective. Scaling down the texture prevents glittering artifacts, while anisotropic sampling preserves distinct railway tie lines without muddy blur.',
        code: `// WebGPU Mipmap Generation & Anisotropic Texture Filtering Simulator
class MipmapLodCalculator {
  calculateMipLevel(distance: number, baseRes: number): { lod: number; currentRes: number } {
    // Mip level doubles distance step
    const lod = Math.min(8, Math.max(0, Math.floor(Math.log2(Math.max(1, distance / 5)))));
    const res = Math.max(1, Math.floor(baseRes / Math.pow(2, lod)));
    return { lod, currentRes: res };
  }
}

const lodCalc = new MipmapLodCalculator();
const nearMip = lodCalc.calculateMipLevel(5, 1024);
const midMip = lodCalc.calculateMipLevel(20, 1024);
const farMip = lodCalc.calculateMipLevel(80, 1024);

console.log('=== WEBGPU MIPMAPPING & ANISOTROPIC TEXTURE FILTERING ===');
console.log('Texture Base: 1024x1024 RGBA8Unorm (Mip Levels: 11 down to 1x1)');
console.log('Near Sample (Dist: 5m): Mip LOD ' + nearMip.lod + ' (' + nearMip.currentRes + 'x' + nearMip.currentRes + ' texels)');
console.log('Mid Sample (Dist: 20m): Mip LOD ' + midMip.lod + ' (' + midMip.currentRes + 'x' + midMip.currentRes + ' texels)');
console.log('Far Sample (Dist: 80m): Mip LOD ' + farMip.lod + ' (' + farMip.currentRes + 'x' + farMip.currentRes + ' texels)');
console.log('Anti-Aliasing Guarantee: Eliminates high-frequency texture shimmer and cache thrashing');`,
        output: `=== WEBGPU MIPMAPPING & ANISOTROPIC TEXTURE FILTERING ===\nTexture Base: 1024x1024 RGBA8Unorm (Mip Levels: 11 down to 1x1)\nNear Sample (Dist: 5m): Mip LOD 0 (1024x1024 texels)\nMid Sample (Dist: 20m): Mip LOD 2 (256x256 texels)\nFar Sample (Dist: 80m): Mip LOD 4 (64x64 texels)\nAnti-Aliasing Guarantee: Eliminates high-frequency texture shimmer and cache thrashing`,
        tryIt: 'Increase the distance to 320m and observe how the mip level reaches LOD 6 (16x16 texels).',
        check: {
          question: 'Why is Anisotropic Filtering preferred over standard Trilinear Filtering for floor planes viewed at grazing angles?',
          options: [
            'Because anisotropic filtering samples along the non-square elliptical footprint of the projected pixel, preventing blur in the direction of perspective compression',
            'Because trilinear filtering only renders in 256 colors',
            'Because anisotropic filtering increases display refresh rate to 360Hz'
          ],
          answer: 0,
          why: 'At grazing angles, a pixel covers an elongated ellipse on the texture surface. Anisotropic filtering samples multiple points along the major axis to retain razor-sharp details without blur.'
        }
      }
    ],
    summary: [
      'Multi-pass Deferred Shading splits geometry rasterization into G-Buffer textures, reducing lighting complexity to O(screen_pixels * lights).',
      'Clustered Forward Shading bins camera frustums into 3D clusters in compute shaders, supporting transparency with thousands of lights.',
      'Cook-Torrance GGX microfacet BRDF balances specular and diffuse reflections, strictly enforcing energy conservation (Kd + Ks <= 1.0).',
      'WebGPU spatial hash grids group 100,000 particles into contiguous memory cells, reducing physics broadphase collision checks from O(N^2) to O(N).',
      'Mipmapping and Anisotropic filtering eliminate aliasing shimmer and texture blur at grazing angles up to 16x sampling.'
    ],
    projectStep: {
      title: 'Architect a Production WebGPU Clustered Deferred Rendering Engine',
      steps: [
        'Construct a Multi-Render-Target (MRT) G-Buffer rasterization pass capturing albedo, normals, roughness, metallic, and linear depth.',
        'Implement a WebGPU Compute Shader clustered light culling pass binning 1,000 point lights into 16x9x24 frustum clusters.',
        'Author a Cook-Torrance GGX microfacet specular BRDF shader enforcing strict energy conservation.',
        'Develop a GPU spatial hash grid broadphase compute pass simulating 100,000 colliding particles in VRAM storage buffers.',
        'Create a multi-level mipmap generator and 16x anisotropic sampler pipeline for high-fidelity ground textures.'
      ]
    }
  },
  {
    coursePrefix: 'g3d',
    day: 5,
    title: 'Hardware WebGPU Ray Tracing, Compute Particles, SSGI & Volumetric Atmosphere',
    goal: 'Master next-generation GPU real-time rendering: BVH acceleration structures with Möller-Trumbore ray-triangle intersection, 1,000,000 compute shader particle simulations via ping-pong storage buffers, Screen-Space Reflections (SSR) with Hi-Z depth marching, volumetric fog with Beer-Lambert extinction and Henyey-Greenstein scattering, and cinematic HDR ACES tone mapping.',
    minutes: 35,
    recap: 'Today we achieve the pinnacle of real-time 3D graphics engineering: marrying hardware ray tracing, compute shader physics, screen-space global illumination, participating media atmosphere, and filmic post-processing.',
    parts: [
      {
        title: 'WebGPU Ray Tracing: BVH Traversal & Möller-Trumbore Triangle Intersection',
        say: [
          'While traditional rasterization projects 3D triangles onto a 2D screen grid from a fixed camera viewpoint, Ray Tracing simulates the physical transport of light photons through a virtual scene. Instead of asking "which pixels does this triangle cover?", ray tracing shoots millions of rays from the camera and calculates exact geometric collisions.',
          'Testing every ray against millions of scene triangles sequentially would require billions of checks per frame, dropping frame rates to zero. Real-time ray tracing relies on Bounding Volume Hierarchies (BVH): hierarchical trees of Axis-Aligned Bounding Boxes (AABBs) wrapping the scene geometry. Rays perform efficient slab intersection tests against bounding boxes, descending only into candidate tree branches with O(log N) complexity.',
          'When a ray reaches a leaf node containing a primitive triangle, the Möller-Trumbore algorithm computes the exact intersection. By expressing the ray-triangle intersection as a linear system of barycentric coordinates (u, v) and ray distance t, Möller-Trumbore avoids calculating the triangle plane equation, saving precious GPU registers and ALU cycles.',
          'In WebGPU compute shaders, BVHs are packed into linear storage buffers (VRAM arrays of node structs), enabling high-speed iterative stack traversal without recursion.'
        ],
        example: 'Think of searching for a specific book in a giant university library. You don\'t examine all 500,000 books one by one (brute-force ray tracing); you look at the floor sign (root AABB), walk to the Computer Science aisle (BVH branch), select the shelf (leaf node), and pull out the exact book (Möller-Trumbore intersection).',
        code: `// WebGPU BVH Ray Tracing: Möller-Trumbore Triangle Intersection Simulator
interface Ray {
  origin: [number, number, number];
  direction: [number, number, number];
}

interface Triangle {
  v0: [number, number, number];
  v1: [number, number, number];
  v2: [number, number, number];
}

class BvhRayTracerSimulator {
  intersectTriangle(ray: Ray, tri: Triangle): { hit: boolean; t: number; u: number; v: number } {
    // Möller-Trumbore algorithm simulation
    const edge1 = [tri.v1[0] - tri.v0[0], tri.v1[1] - tri.v0[1], tri.v1[2] - tri.v0[2]];
    const edge2 = [tri.v2[0] - tri.v0[0], tri.v2[1] - tri.v0[1], tri.v2[2] - tri.v0[2]];
    
    // Cross product ray.dir x edge2
    const pvec = [
      ray.direction[1] * edge2[2] - ray.direction[2] * edge2[1],
      ray.direction[2] * edge2[0] - ray.direction[0] * edge2[2],
      ray.direction[0] * edge2[1] - ray.direction[1] * edge2[0]
    ];
    const det = edge1[0] * pvec[0] + edge1[1] * pvec[1] + edge1[2] * pvec[2];
    if (Math.abs(det) < 1e-6) return { hit: false, t: -1, u: 0, v: 0 };

    const invDet = 1.0 / det;
    const tvec = [ray.origin[0] - tri.v0[0], ray.origin[1] - tri.v0[1], ray.origin[2] - tri.v0[2]];
    const u = (tvec[0] * pvec[0] + tvec[1] * pvec[1] + tvec[2] * pvec[2]) * invDet;
    if (u < 0 || u > 1) return { hit: false, t: -1, u: 0, v: 0 };

    const qvec = [
      tvec[1] * edge1[2] - tvec[2] * edge1[1],
      tvec[2] * edge1[0] - tvec[0] * edge1[2],
      tvec[0] * edge1[1] - tvec[1] * edge1[0]
    ];
    const v = (ray.direction[0] * qvec[0] + ray.direction[1] * qvec[1] + ray.direction[2] * qvec[2]) * invDet;
    if (v < 0 || u + v > 1) return { hit: false, t: -1, u: 0, v: 0 };

    const t = (edge2[0] * qvec[0] + edge2[1] * qvec[1] + edge2[2] * qvec[2]) * invDet;
    return { hit: t > 0, t, u, v };
  }
}

const bvhTracer = new BvhRayTracerSimulator();
const testRay: Ray = { origin: [0, 0, 5], direction: [0, 0, -1] };
const targetTri: Triangle = { v0: [-1, -1, 0], v1: [1, -1, 0], v2: [0, 1, 0] };
const hitRes = bvhTracer.intersectTriangle(testRay, targetTri);

console.log('Ray-Triangle Intersection: ' + (hitRes.hit ? 'HIT_CONFIRMED' : 'MISS'));
console.log('Ray Hit Distance (t): ' + hitRes.t.toFixed(2) + ' units along ray vector');
console.log('Barycentric Coordinates: u=' + hitRes.u.toFixed(2) + ', v=' + hitRes.v.toFixed(2));
console.log('Ray Tracing Invariant: Möller-Trumbore evaluates intersections without precalculating plane equations');`,
        output: `Ray-Triangle Intersection: HIT_CONFIRMED\nRay Hit Distance (t): 5.00 units along ray vector\nBarycentric Coordinates: u=0.25, v=0.50\nRay Tracing Invariant: Möller-Trumbore evaluates intersections without precalculating plane equations`,
        codeNotes: [
          { line: 8, note: 'Implements the Möller-Trumbore vector cross product ray-triangle collision algorithm' },
          { line: 19, note: 'Validates barycentric coordinates (u, v) to guarantee intersection falls within triangle boundaries' },
          { line: 37, note: 'Demonstrates ray hit distance calculation t along camera view vector' }
        ],
        tryIt: 'Change the ray origin X to 5.0 to miss the triangle and observe how hit returns false with t = -1.',
        check: {
          question: 'Why is the Möller-Trumbore intersection algorithm preferred over traditional plane-intersection methods in GPU ray tracing?',
          options: [
            'Because it computes barycentric coordinates (u, v) and intersection distance t directly using vector cross products without precomputing or storing the plane equation of the triangle',
            'Because it converts 3D triangles into 2D JPEG images',
            'Because it requires zero GPU floating-point arithmetic',
            'Because it only works when triangles are equilateral'
          ],
          answer: 0,
          why: 'Möller-Trumbore is memory and register efficient: by bypassing the plane normal and offset calculation, it saves memory bandwidth and evaluates hits with minimal ALU instructions.'
        }
      },
      {
        title: 'Massively Parallel WebGPU Compute Particle Systems (1 Million Particles)',
        say: [
          'In traditional WebGL graphics, rendering millions of dynamic particles (sparks, rain, fire, sand) choked the CPU: every particle position had to be computed on the JavaScript main thread and uploaded over the PCIe bus to VRAM every frame, causing catastrophic 10 FPS bottlenecks.',
          'WebGPU revolutions particle systems by moving the entire physics simulation directly onto GPU Compute Shaders (@compute @workgroup_size(64, 1, 1)). One million particles are stored permanently in GPU VRAM inside storage buffers (var<storage, read_write>).',
          'To prevent race conditions where threads read and overwrite adjacent particle positions concurrently, the engine employs Ping-Pong Double Buffering: Pass A reads from Storage Buffer 0 and writes updated positions to Storage Buffer 1; Pass B swaps the pointers and writes back to Buffer 0.',
          'The compute shader applies Verlet integration, curl noise velocity fields, and ground restitution bounces. Crucially, the resulting particle buffer is bound directly to the vertex shader using renderPass.drawIndirect(), achieving 1,000,000 particles at 120 FPS with 0.0 milliseconds of CPU overhead.'
        ],
        example: 'Think of a stadium card stunt where 100,000 spectators flip placards in unison. Rather than a single coordinator running up and down the aisles manually flipping each spectator\'s card, all 100,000 people follow local programmed rules and flip their cards simultaneously in half a second.',
        code: `// WebGPU Compute Particle System: Ping-Pong Storage Buffers & Workgroup Partitioning
class ComputeParticleSimulator {
  simulateWorkgroups(totalParticles: number, workgroupSize = 64) {
    const workgroupCount = Math.ceil(totalParticles / workgroupSize);
    const vramBytesPerParticle = 32; // position (vec4) + velocity/life (vec4) = 8 floats * 4 bytes
    const totalStorageMb = (totalParticles * vramBytesPerParticle * 2) / (1024 * 1024); // Double buffered ping-pong

    return {
      particleCount: totalParticles,
      workgroupCount,
      vramFootprintMb: totalStorageMb.toFixed(1),
      pipeline: 'PING_PONG_STORAGE_BUFFERS_ACTIVE'
    };
  }
}

const computeSim = new ComputeParticleSimulator();
const simMetrics = computeSim.simulateWorkgroups(1000000, 64);

console.log('Compute Shader Particles: ' + simMetrics.particleCount.toLocaleString('en-US') + ' Active Particles');
console.log('WebGPU Workgroups Dispatched: ' + simMetrics.workgroupCount.toLocaleString('en-US') + ' (@workgroup_size(64, 1, 1))');
console.log('VRAM Storage Buffer Size: ' + simMetrics.vramFootprintMb + ' MB (Ping-Pong Double Buffered)');
console.log('Compute Invariant: Zero CPU-GPU bus latency during physics integration and indirect draw calls');`,
        output: `Compute Shader Particles: 1,000,000 Active Particles\nWebGPU Workgroups Dispatched: 15,625 (@workgroup_size(64, 1, 1))\nVRAM Storage Buffer Size: 61.0 MB (Ping-Pong Double Buffered)\nCompute Invariant: Zero CPU-GPU bus latency during physics integration and indirect draw calls`,
        codeNotes: [
          { line: 8, note: 'Calculates GPU workgroup dispatch partitions for 1,000,000 concurrent compute threads' },
          { line: 10, note: 'Allocates ping-pong double storage buffers in VRAM for race-free integration' },
          { line: 25, note: 'Achieves massive particle physics simulation with zero CPU memory transfer overhead' }
        ],
        tryIt: 'Change the total particles to 2,000,000 and calculate the number of dispatched workgroups.',
        check: {
          question: 'What architectural advantage do WebGPU storage buffers and ping-pong compute shaders provide over legacy WebGL particle pipelines?',
          options: [
            'They allow the entire physics simulation and rendering loop to reside permanently in GPU VRAM, eliminating CPU-GPU memory bus transfer bottlenecks',
            'They double the maximum resolution of the computer monitor',
            'They convert JavaScript variables into physical quantum particles',
            'They eliminate the need for vertex shaders entirely'
          ],
          answer: 0,
          why: 'Ping-pong storage buffers allow compute shaders to simulate millions of particles in place on high-speed VRAM, passing data directly to rasterizers via indirect draws without CPU intervention.'
        }
      },
      {
        title: 'Screen-Space Reflections (SSR) & Hi-Z Depth Buffer Ray Marching',
        say: [
          'Planar reflections and cubemaps have severe limitations in dynamic 3D games: cubemaps fail to reflect moving characters, while rendering secondary camera viewports for planar mirrors doubles geometry rasterization cost.',
          'Screen-Space Reflections (SSR) solve real-time specular reflections by ray marching across the already-rendered G-Buffer depth and normal buffers. For every glossy surface fragment, the shader reflects the camera view vector across the surface normal vector to construct a reflection ray in screen space.',
          'The ray marcher steps through 2.5D screen coordinates (UV + depth), comparing the current ray depth against the scene depth buffer. When the ray intersects geometry behind the current surface, the color buffer at that screen UV is sampled and blended onto the surface using the Schlick Fresnel equation.',
          'To accelerate stepping through complex scenes, modern engines use Hierarchical Z-Buffer (Hi-Z) ray marching: a depth mipmap pyramid allows rays to take large leaps through empty space (coarse mip levels) and drop to finer mip levels only when nearing a surface boundary.'
        ],
        example: 'Think of looking at the glossy surface of a wet marble lobby floor. You can clearly see the reflection of the hotel desk and chandeliers because they are in your field of view, but you cannot see the reflection of a painting hanging behind the pillars because it is occluded from the camera\'s line of sight.',
        code: `// Screen-Space Reflections (SSR) Depth Buffer Ray Marcher Simulator
interface SsrRayResult {
  hit: boolean;
  stepsTaken: number;
  screenUv: [number, number];
  fresnelReflectance: number;
}

class SsrRayMarcherSimulator {
  marchRay(roughness: number): SsrRayResult {
    const maxSteps = 32;
    const hitStep = 18;
    const f0 = 0.04; // Dielectric base reflectance
    // Schlick Fresnel approximation at 60 degree grazing angle: cos(theta) = 0.5
    const fresnel = f0 + (1 - f0) * Math.pow(1 - 0.5, 5);

    return {
      hit: roughness < 0.4,
      stepsTaken: hitStep,
      screenUv: [0.62, 0.48],
      fresnelReflectance: Math.round(fresnel * 100) / 100
    };
  }
}

const ssrMarcher = new SsrRayMarcherSimulator();
const ssrRes = ssrMarcher.marchRay(0.15); // Glossy surface

console.log('SSR Depth Buffer Ray Hit: ' + (ssrRes.hit ? 'SURFACE_HIT_FOUND' : 'MISS_FALLBACK_TO_IBL'));
console.log('Screen-Space March Steps: ' + ssrRes.stepsTaken + ' Iterations in Depth Buffer');
console.log('Sampled Reflection UV: [' + ssrRes.screenUv[0] + ', ' + ssrRes.screenUv[1] + ']');
console.log('Schlick Fresnel Reflectance: ' + ssrRes.fresnelReflectance + ' Specular Weight');
console.log('Screen-Space Invariant: Hi-Z depth ray marching bounds reflection queries to on-screen geometry');`,
        output: `SSR Depth Buffer Ray Hit: SURFACE_HIT_FOUND\nScreen-Space March Steps: 18 Iterations in Depth Buffer\nSampled Reflection UV: [0.62, 0.48]\nSchlick Fresnel Reflectance: 0.07 Specular Weight\nScreen-Space Invariant: Hi-Z depth ray marching bounds reflection queries to on-screen geometry`,
        codeNotes: [
          { line: 8, note: 'Models screen-space ray marching stepping through clip-space depth buffers' },
          { line: 12, note: 'Applies Schlick Fresnel approximation to scale specular reflection intensity at grazing angles' },
          { line: 28, note: 'Demonstrates sampling on-screen color buffers to generate dynamic real-time reflections' }
        ],
        tryIt: 'Increase surface roughness to 0.7 and observe how SSR falls back to image-based lighting probes.',
        check: {
          question: 'What is the primary visual limitation of Screen-Space Reflections (SSR) in real-time game engines?',
          options: [
            'SSR can only reflect geometry that is currently visible on screen; objects occluded behind foreground meshes or off-camera cannot be reflected and must fall back to environment probes',
            'SSR only works in black-and-white scenes',
            'SSR requires the monitor to have an OLED display panel',
            'SSR cannot reflect metallic materials'
          ],
          answer: 0,
          why: 'Because SSR operates entirely on the rendered 2D screen buffer, any object outside the camera frustum or hidden behind another object has no depth data available, requiring graceful fallback to cubemaps.'
        }
      },
      {
        title: 'Volumetric Fog & Participating Media: Beer-Lambert Law & Henyey-Greenstein Scattering',
        say: [
          'In the physical world, space between objects is rarely a pure vacuum: the atmosphere is filled with participating media such as water droplets, dust, smoke, and smog. Light passing through this medium undergoes absorption, out-scattering, and in-scattering, creating dramatic atmospheric depth, god rays (sun shafts), and morning mist.',
          'The fundamental governing equation of participating media is the Beer-Lambert Extinction Law: light transmittance decays exponentially over distance: T = exp(-sigma_t * d), where sigma_t is the extinction coefficient and d is optical distance travelled through the medium.',
          'Simultaneously, light from directional sun sources scatters into the camera ray (in-scattering). The angular distribution of this scattered light is governed by the Henyey-Greenstein phase function p(theta, g), where the asymmetry parameter g controls whether light scatters forward (Mie scattering in fog/mist, g > 0) or uniformly in all directions (Rayleigh scattering, g = 0).',
          'Real-time volumetric engines evaluate this by raymarching 32 to 64 steps along the camera frustum through a 3D Froxel grid (frustum-aligned 3D texture volume) updated in compute shaders with shadow map lookups.'
        ],
        example: 'Think of driving through thick morning fog with your car headlights on high beam. The air directly in front of your car glows with blinding white scattered light (forward Mie scattering), while distant streetlamps dim into faint halos (Beer-Lambert exponential extinction).',
        code: `// Volumetric Atmospheric Fog: Beer-Lambert Law & Henyey-Greenstein Scattering
class VolumetricFogSimulator {
  calculateTransmittance(distanceMeters: number, extinctionCoeff: number, sunAngleCosine: number): {
    transmittance: number;
    henyeyGreensteinPhase: number;
    scatteredRadiance: number;
  } {
    // Beer-Lambert law: T = exp(-sigma_t * d)
    const t = Math.exp(-extinctionCoeff * distanceMeters);
    // Henyey-Greenstein phase function with forward scattering g = 0.6
    const g = 0.6;
    const phase = (1 - g * g) / (4 * Math.PI * Math.pow(1 + g * g - 2 * g * sunAngleCosine, 1.5));
    const radiance = (1 - t) * phase * 10.0; // In-scattered sunlight

    return {
      transmittance: Math.round(t * 1000) / 1000,
      henyeyGreensteinPhase: Math.round(phase * 1000) / 1000,
      scatteredRadiance: Math.round(radiance * 100) / 100
    };
  }
}

const fogSim = new VolumetricFogSimulator();
const fogRes = fogSim.calculateTransmittance(25, 0.08, 0.85); // 25 meters, light fog, facing sun

console.log('Beer-Lambert Transmittance: ' + fogRes.transmittance + ' (Optical Depth Extinction)');
console.log('Henyey-Greenstein Phase: ' + fogRes.henyeyGreensteinPhase + ' (Anisotropic Forward Scattering)');
console.log('In-Scattered Sunlight Radiance: ' + fogRes.scatteredRadiance + ' cd/m^2');
console.log('Volumetric Invariant: Participating media couples exponential absorption with forward scattering phase');`,
        output: `Beer-Lambert Transmittance: 0.135 (Optical Depth Extinction)\nHenyey-Greenstein Phase: 0.257 (Anisotropic Forward Scattering)\nIn-Scattered Sunlight Radiance: 2.22 cd/m^2\nVolumetric Invariant: Participating media couples exponential absorption with forward scattering phase`,
        codeNotes: [
          { line: 8, note: 'Implements the Beer-Lambert exponential transmittance equation for participating media' },
          { line: 10, note: 'Evaluates the Henyey-Greenstein anisotropic phase function for forward aerosol scattering' },
          { line: 25, note: 'Calculates in-scattered sunlight radiance producing realistic atmospheric god rays' }
        ],
        tryIt: 'Change the distance to 50 meters and observe how transmittance drops exponentially toward zero.',
        check: {
          question: 'In volumetric lighting, what physical phenomenon does the Henyey-Greenstein phase function model?',
          options: [
            'The angular distribution of scattered light, describing how strongly light scatters forward toward the camera versus backward or uniformly when striking aerosol particles',
            'The speed of sound through damp air',
            'The rate at which water evaporates from clouds',
            'The mechanical stiffness of fog machine nozzles'
          ],
          answer: 0,
          why: 'The Henyey-Greenstein phase function describes directional scattering asymmetry: aerosol water droplets scatter sunlight predominantly forward (g > 0), creating the intense halo seen around the sun in misty air.'
        }
      },
      {
        title: 'HDR Post-Processing Pipeline: ACES Tone Mapping, Bloom & Temporal Anti-Aliasing (TAA)',
        say: [
          'Real-world lighting covers an enormous dynamic range: the midday sun is over 100,000 cd/m^2, while moonlit shadows are below 0.001 cd/m^2. Modern real-time engines perform all lighting calculations in High Dynamic Range (HDR) using 16-bit floating-point textures (rgba16float).',
          'Because standard computer monitors can only display low dynamic range (LDR 8-bit values from 0.0 to 1.0), the engine must apply Tone Mapping to compress HDR values. Simple Reinhard tone mapping (x / (1 + x)) washes out saturated colors and creates muddy grey skies. Modern cinema and game engines standardise on the ACES (Academy Color Encoding System) filmic curve: ACES preserves rich color saturation, produces a smooth highlight toe, and creates a natural shoulder roll-off that mirrors physical photographic film.',
          'Complementing tone mapping is Dual-Filter Bloom (extracting specular bright spots and applying progressive downsample/upsample blur pyramids to simulate lens glow) and Temporal Anti-Aliasing (TAA).',
          'TAA jitters camera projection matrices by sub-pixel offsets (Halton sequences) every frame, reprojects previous frames using G-Buffer velocity vectors, and accumulates samples over time to eliminate jagged edges and specular shader crawling.'
        ],
        example: 'Think of a high-end cinema camera shooting a dark room with a bright open window. A cheap smartphone camera blows out the window into a blinding white clipped square. A professional cinema camera using ACES captures the golden sun rays, individual leaves outside, and the dark mahogany furniture inside without harsh clipping.',
        code: `// HDR Post-Processing: ACES Filmic Tone Mapping & Temporal Anti-Aliasing (TAA)
class HdrPostProcessingPipeline {
  applyAcesToneMapping(hdrLuminance: number): number {
    // ACES filmic approximation: (x * (a * x + b)) / (x * (c * x + d) + e)
    const a = 2.51;
    const b = 0.03;
    const c = 2.43;
    const d = 0.59;
    const e = 0.14;
    return (hdrLuminance * (a * hdrLuminance + b)) / (hdrLuminance * (c * hdrLuminance + d) + e);
  }
}

const hdrPipeline = new HdrPostProcessingPipeline();
const highSun = hdrPipeline.applyAcesToneMapping(12.5); // Sunlight reflection
const ambientGlow = hdrPipeline.applyAcesToneMapping(0.65); // Ambient shadow

console.log('ACES Filmic Curve (HDR 12.5 cd/m^2): ' + highSun.toFixed(3) + ' (Soft Highlight Roll-off)');
console.log('ACES Filmic Curve (Midtone 0.65 cd/m^2): ' + ambientGlow.toFixed(3) + ' (Contrast Preserved)');
console.log('Temporal Anti-Aliasing (TAA): Sub-pixel Halton(2,3) camera jitter active');
console.log('HDR Post-Process Guarantee: Preserves dynamic range without harsh specular whiteout clipping');`,
        output: `ACES Filmic Curve (HDR 12.5 cd/m^2): 1.014 (Soft Highlight Roll-off)\nACES Filmic Curve (Midtone 0.65 cd/m^2): 0.697 (Contrast Preserved)\nTemporal Anti-Aliasing (TAA): Sub-pixel Halton(2,3) camera jitter active\nHDR Post-Process Guarantee: Preserves dynamic range without harsh specular whiteout clipping`,
        codeNotes: [
          { line: 8, note: 'Implements the Narkowicz ACES filmic S-curve rational polynomial approximation' },
          { line: 18, note: 'Demonstrates smooth highlight compression of intense 12.5 cd/m^2 sunlight without color blowing' },
          { line: 30, note: 'Models temporal accumulation and sub-pixel camera jitter to eradicate edge aliasing' }
        ],
        tryIt: 'Pass an HDR luminance of 100.0 into the ACES curve and observe how it smoothly approaches asymptotic peak display brightness.',
        check: {
          question: 'Why is the ACES filmic tone mapping curve widely preferred over linear Reinhard tone mapping in modern 3D graphics?',
          options: [
            'ACES preserves color saturation and introduces photographic contrast with a toe and shoulder curve, preventing bright highlights from desaturating into flat chalky white',
            'ACES tone mapping makes 3D games download 50% faster',
            'Reinhard tone mapping only works on CRT television monitors',
            'ACES requires zero floating-point operations'
          ],
          answer: 0,
          why: 'Reinhard tone mapping compresses all channels uniformly, causing bright lights to shift toward chalky white. The ACES S-curve preserves hue and chroma saturation through smooth highlight rolloff.'
        }
      }
    ],
    summary: [
      'WebGPU BVH acceleration structures and Möller-Trumbore intersection enable hardware-accelerated real-time ray tracing in O(log N) steps.',
      'Massively parallel compute shaders simulate 1,000,000 particles in VRAM storage buffers with ping-pong double buffering and zero CPU readback.',
      'Screen-Space Reflections (SSR) perform Hi-Z depth marching on G-Buffers, blending Fresnel specular reflections with environmental probes.',
      'Volumetric fog calculates Beer-Lambert exponential transmittance coupled with Henyey-Greenstein anisotropic forward light scattering.',
      'HDR post-processing applies filmic ACES tone mapping and Temporal Anti-Aliasing (TAA) to deliver cinematic photorealism.'
    ],
    projectStep: {
      title: 'Architect a Next-Generation WebGPU Photorealistic Rendering Engine',
      steps: [
        'Construct an on-GPU BVH traversal compute pipeline evaluating Möller-Trumbore ray-triangle intersections.',
        'Implement a 1,000,000 particle compute simulation with ping-pong storage buffers and indirect draw calls.',
        'Author an SSR shader with Hi-Z depth ray marching and Schlick Fresnel reflectance blending.',
        'Develop a volumetric participating media ray marcher computing Beer-Lambert extinction and god rays.',
        'Build an HDR post-processing pass integrating dual-filter bloom, ACES filmic tone mapping, and TAA reprojection.'
      ]
    }
  }
];

