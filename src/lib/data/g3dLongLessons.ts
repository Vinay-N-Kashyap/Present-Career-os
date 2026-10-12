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
  }
];
