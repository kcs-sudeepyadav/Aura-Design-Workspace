import React, { Suspense, useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three-stdlib';
import { FBXLoader } from 'three-stdlib';
import { STLLoader } from 'three-stdlib';
import { ColladaLoader } from 'three-stdlib';
import { ThreeMFLoader } from 'three-stdlib';
import { GLTFLoader } from 'three-stdlib';

// Loader Overlay
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-4 bg-[#020617]/80 backdrop-blur-md p-8 rounded-2xl border border-amber-500/20 shadow-2xl">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#f59e0b] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <div className="text-center">
          <p className="text-white font-medium mb-1">Parsing 3D Geometry</p>
          <p className="text-[#f59e0b] font-mono text-xl">{progress.toFixed(0)}%</p>
        </div>
      </div>
    </Html>
  );
}

// Dynamic Model Component
function DynamicModel({ url, extension }: { url: string; extension: string }) {
  const ext = extension.toLowerCase();
  
  // Choose the right loader
  let LoaderClass: any = null;
  if (ext === 'obj') LoaderClass = OBJLoader;
  else if (ext === 'fbx') LoaderClass = FBXLoader;
  else if (ext === 'stl') LoaderClass = STLLoader;
  else if (ext === 'dae') LoaderClass = ColladaLoader;
  else if (ext === '3mf') LoaderClass = ThreeMFLoader;
  else if (ext === 'glb' || ext === 'gltf') LoaderClass = GLTFLoader;

  if (!LoaderClass) {
    return (
      <Html center>
        <div className="bg-red-900/80 text-white p-6 rounded-lg text-center max-w-sm">
          <p className="font-bold text-lg mb-2">Unsupported Format</p>
          <p className="text-white/70 text-sm">The format .{ext} cannot be rendered natively in the browser without a backend CAD conversion pipeline (e.g. STEP, IGES).</p>
        </div>
      </Html>
    );
  }

  const model = useLoader(LoaderClass, url);
  
  // Extract scene/mesh from different loader returns
  const primitive = useMemo(() => {
    if (ext === 'dae') return (model as any).scene;
    if (ext === 'stl') {
      const geometry = model as THREE.BufferGeometry;
      geometry.computeVertexNormals();
      const material = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5, metalness: 0.5 });
      return new THREE.Mesh(geometry, material);
    }
    if (ext === 'glb' || ext === 'gltf') return (model as any).scene;
    // OBJ, FBX, 3MF return Group
    return model as THREE.Group;
  }, [model, ext]);

  return <primitive object={primitive} />;
}

interface Universal3DViewerProps {
  url: string;
  type: string;
}

export default function Universal3DViewer({ url, type }: Universal3DViewerProps) {
  // Extract extension from URL or type
  const extensionMatch = url.match(/\.([a-zA-Z0-9]+)(?:[\?#]|$)/);
  const extension = extensionMatch ? extensionMatch[1].toLowerCase() : type.toLowerCase();

  return (
    <div className="w-full h-full relative bg-[#020617]">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={['#020617']} />
        <Suspense fallback={<Loader />}>
          <Stage environment="city" intensity={0.6} adjustCamera>
            <DynamicModel url={url} extension={extension} />
          </Stage>
        </Suspense>
        <OrbitControls makeDefault autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}
