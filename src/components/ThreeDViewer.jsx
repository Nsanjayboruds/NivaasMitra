import React, { useRef, useState, Suspense, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  useProgress,
  useGLTF,
  useFBX,
} from "@react-three/drei";
import * as THREE from "three";
import "./ThreeDViewer.css";

// Loading component
function Loader() {
  const { progress } = useProgress();
  return React.createElement(
    Html,
    { center: true },
    React.createElement(
      "div",
      { className: "loader" },
      React.createElement(
        "div",
        { className: "loader-text" },
        `Loading 3D Model... ${progress.toFixed(0)}%`
      ),
      React.createElement(
        "div",
        { className: "loader-bar" },
        React.createElement("div", {
          className: "loader-progress",
          style: { width: `${progress}%` },
        })
      )
    )
  );
}

// GLTF Model for specific properties (e.g., Property 1)
function PropertyGLTFModel({ url, targetSize = 8, onFit }) {
  const gltf = useGLTF(url);
  // Clone once to avoid StrictMode double-mount duplications
  const clonedScene = React.useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const groupRef = React.useRef();
  const fittedRef = React.useRef(false);

  React.useEffect(() => {
    if (!groupRef.current) return;

    // Clear any previous children (defensive against StrictMode)
    groupRef.current.clear();
    groupRef.current.add(clonedScene);

    // Only fit/scale once
    if (fittedRef.current) return;
    fittedRef.current = true;

    clonedScene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          // Ensure correct material update
          obj.material.side = THREE.FrontSide;
          obj.material.needsUpdate = true;
          // Enable vertex colors if present
          if (obj.geometry && obj.geometry.getAttribute("color")) {
            obj.material.vertexColors = true;
          }
          // Normalize texture color space
          if (obj.material.map) {
            obj.material.map.colorSpace = THREE.SRGBColorSpace;
          }
          if (obj.material.emissiveMap) {
            obj.material.emissiveMap.colorSpace = THREE.SRGBColorSpace;
          }
        }
      }
    });

    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / maxDim;

    groupRef.current.scale.setScalar(scale);
    const baseOffsetY = box.min.y * scale;
    groupRef.current.position.set(
      -center.x * scale,
      -baseOffsetY,
      -center.z * scale
    );

    const radius = maxDim * 0.5 * scale;
    onFit && onFit({ box, size, center, scale, radius });
  }, [clonedScene, targetSize, onFit]);

  return React.createElement("group", { ref: groupRef });
}

// Preload known models
useGLTF.preload("/models/apartments/scene.gltf");
// (Removed incorrect villa GLTF preload; now using FBX for property 2)
useGLTF.preload("/models/modern_office_building/scene.gltf");
// Removed preloads for models that are not present in public to avoid 404s in production
// Preload FBX villa model
useFBX.preload(
  "/models/modern-luxury-villa-house-building-with-pool/source/42.fbx"
);

// FBX Model Loader (Modern Luxury Villa for Property 2)
function PropertyFBXModel({ url, targetSize = 22, onFit }) {
  const fbx = useFBX(url);
  const cloned = React.useMemo(() => fbx.clone(true), [fbx]);
  const groupRef = React.useRef();
  const fittedRef = React.useRef(false);

  React.useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.clear();
    groupRef.current.add(cloned);
    if (fittedRef.current) return;
    fittedRef.current = true;

    cloned.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => {
              m.side = THREE.FrontSide;
              m.needsUpdate = true;
              if (m.map) m.map.colorSpace = THREE.SRGBColorSpace;
            });
          } else {
            obj.material.side = THREE.FrontSide;
            obj.material.needsUpdate = true;
            if (obj.material.map) obj.material.map.colorSpace = THREE.SRGBColorSpace;
          }
        }
      }
    });

    // Fit & scale similar to GLTF loader
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / maxDim;
    groupRef.current.scale.setScalar(scale);
    const baseOffsetY = box.min.y * scale;
    groupRef.current.position.set(-center.x * scale, -baseOffsetY, -center.z * scale);
    const radius = maxDim * 0.5 * scale;
    onFit && onFit({ box, size, center, scale, radius });
  }, [cloned, targetSize, onFit]);

  return React.createElement("group", { ref: groupRef });
}

// Helper component to smoothly fit camera to loaded model bounds
function AutoCameraFit({ modelFit }) {
  const { camera } = useThree();
  const doneRef = useRef(false);
  useFrame(() => {
    if (!modelFit || doneRef.current) return;
    const { radius } = modelFit;
    const fov = camera.fov * (Math.PI / 180);
    const targetDist = (radius / Math.sin(fov / 2)) * 1.25; // margin
    const targetPos = new THREE.Vector3(
      targetDist,
      targetDist * 0.6,
      targetDist
    );
    camera.position.lerp(targetPos, 0.08);
    camera.near = 0.05;
    camera.far = Math.max(400, radius * 40);
    camera.updateProjectionMatrix();
    if (camera.position.distanceTo(targetPos) < 0.15) {
      camera.position.copy(targetPos);
      doneRef.current = true; // stop adjusting once close
    }
  });
  return null;
}

// Modern House Model Component using Three.js primitives (fallback / dynamic generator)
function ModernHouse({ property }) {
  const groupRef = useRef();

  // Create a modern house based on property data
  const createModernHouse = () => {
    const group = new THREE.Group();

    // Main structure
    const mainGeometry = new THREE.BoxGeometry(6, 3, 4);
    const mainMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.7,
      metalness: 0.1,
    });
    const mainStructure = new THREE.Mesh(mainGeometry, mainMaterial);
    mainStructure.position.y = 1.5;
    mainStructure.castShadow = true;
    mainStructure.receiveShadow = true;
    group.add(mainStructure);

    // Roof based on property type
    const normalizedType = (property?.type || "").toLowerCase();
    const roofHeight = normalizedType === "apartment" ? 0.8 : 2;
    const roofGeometry = new THREE.ConeGeometry(4.5, roofHeight, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: normalizedType === "villa" ? "#8B4513" : "#696969",
      roughness: 0.8,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 3 + roofHeight / 2;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    // Windows based on property size
    const windowCount = property?.bedrooms || 3;
    const windowGeometry = new THREE.PlaneGeometry(0.8, 1.2);
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: "#87CEEB",
      transparent: true,
      opacity: 0.7,
      emissive: "#404040",
      emissiveIntensity: 0.1,
    });

    // Front windows
    for (let i = 0; i < Math.min(windowCount, 4); i++) {
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.position.set(-2 + i * 1.3, 2, 2.01);
      group.add(window);
    }

    // Door
    const doorGeometry = new THREE.PlaneGeometry(1, 2.2);
    const doorMaterial = new THREE.MeshStandardMaterial({
      color: "#8B4513",
      roughness: 0.6,
    });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(2.5, 1.1, 2.01);
    group.add(door);

    // Door handle
    const handleGeometry = new THREE.SphereGeometry(0.08);
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: "#FFD700",
      metalness: 0.8,
      roughness: 0.2,
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(2.8, 1.1, 2.02);
    group.add(handle);

    // Add amenities if property has them
    if (
      property?.amenities?.includes("Parking") ||
      property?.amenities?.includes("Garage")
    ) {
      const garageGeometry = new THREE.BoxGeometry(3, 2.5, 3);
      const garageMaterial = new THREE.MeshStandardMaterial({
        color: "#f0f0f0",
        roughness: 0.7,
      });
      const garage = new THREE.Mesh(garageGeometry, garageMaterial);
      garage.position.set(-5, 1.25, 0);
      garage.castShadow = true;
      garage.receiveShadow = true;
      group.add(garage);

      // Garage door
      const garageDoorGeometry = new THREE.PlaneGeometry(2.5, 2);
      const garageDoorMaterial = new THREE.MeshStandardMaterial({
        color: "#696969",
        roughness: 0.5,
      });
      const garageDoor = new THREE.Mesh(garageDoorGeometry, garageDoorMaterial);
      garageDoor.position.set(-5, 1, 1.51);
      group.add(garageDoor);
    }

    // Swimming pool for luxury properties
    if (property?.amenities?.includes("Swimming Pool")) {
      const poolGeometry = new THREE.CylinderGeometry(3, 3, 0.3, 16);
      const poolMaterial = new THREE.MeshStandardMaterial({
        color: "#0077BE",
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.1,
      });
      const pool = new THREE.Mesh(poolGeometry, poolMaterial);
      pool.position.set(8, 0.15, -2);
      pool.receiveShadow = true;
      group.add(pool);
    }

    // Garden/Trees
    if (property?.amenities?.includes("Garden")) {
      for (let i = 0; i < 3; i++) {
        const treeGroup = new THREE.Group();

        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2.5);
        const trunkMaterial = new THREE.MeshStandardMaterial({
          color: "#8B4513",
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1.25;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        // Leaves
        const leavesGeometry = new THREE.SphereGeometry(1.2);
        const leavesMaterial = new THREE.MeshStandardMaterial({
          color: "#228B22",
        });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 3;
        leaves.castShadow = true;
        treeGroup.add(leaves);

        treeGroup.position.set(-8 + i * 4, 0, -8 + i * 2);
        group.add(treeGroup);
      }
    }

    return group;
  };

  const [house] = useState(() => createModernHouse());

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return React.createElement(
    "group",
    { ref: groupRef },
    React.createElement("primitive", { object: house })
  );
}

const ThreeDViewer = ({ property = null }) => {
  const viewerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [modelFit, setModelFit] = useState(null);

  // Fullscreen functionality
  const toggleFullscreen = useCallback(() => {
    if (!viewerRef.current) return;

    if (!document.fullscreenElement) {
      viewerRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error("Error attempting to enable fullscreen:", err);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
        })
        .catch((err) => {
          console.error("Error attempting to exit fullscreen:", err);
        });
    }
  }, []);

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return React.createElement(
    "div",
    {
      className: `threed-viewer ${isFullscreen ? "fullscreen" : ""}`,
      ref: viewerRef,
    },
    React.createElement(
      "div",
      { className: "threed-header" },
      React.createElement(
        "div",
        { className: "header-content" },
        React.createElement(
          "div",
          { className: "header-info" },
          React.createElement("h3", null, "🏡 3D Property View"),
          property &&
            React.createElement(
              "div",
              { className: "property-info" },
              React.createElement(
                "span",
                { className: "property-type" },
                `${property.type} • ${property.bedrooms} bed • ${property.bathrooms} bath`
              )
            )
        ),
        React.createElement(
          "button",
          {
            className: "fullscreen-btn",
            onClick: toggleFullscreen,
            title: isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen",
          },
          isFullscreen ? "🗗" : "⛶"
        )
      )
    ),

    React.createElement(
      Canvas,
      {
        shadows: true,
        dpr: [1, 2],
        gl: ({ canvas }) => {
          const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            logarithmicDepthBuffer: true,
          });
          renderer.outputColorSpace = THREE.SRGBColorSpace;
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.0; // reduce brightness to lessen banding
          renderer.shadowMap.enabled = true; // keep shadows but lower resolution below
          renderer.physicallyCorrectLights = true;
          return renderer;
        },
        camera: { position: [12, 8, 12], fov: 45, near: 0.05, far: 500 },
        style: {
          background:
            "linear-gradient(135deg, #87CEEB 0%, #E0F6FF 50%, #F0F8FF 100%)",
          borderRadius: "15px",
        },
      },
      React.createElement(
        Suspense,
        { fallback: React.createElement(Loader) },
        // Midday Sun Lighting Setup
        // Hemisphere light for ambient sky/ground bounce
        React.createElement("hemisphereLight", {
          skyColor: "#cfe8ff",
          groundColor: "#e0d1b5",
          intensity: 0.85,
        }),
        // Primary sun (strong, high angle)
        React.createElement("directionalLight", {
          castShadow: true,
          position: [35, 55, 18],
          intensity: 1.6, // slightly reduced
          color: "#ffffff",
          shadowBias: -0.0002,
          shadowNormalBias: 0.03,
          "shadow-mapSize-width": 2048,
          "shadow-mapSize-height": 2048,
          "shadow-camera-near": 2,
          "shadow-camera-far": 140,
          "shadow-camera-left": -50,
          "shadow-camera-right": 50,
          "shadow-camera-top": 50,
          "shadow-camera-bottom": -50,
        }),
        // Subtle fill light from opposite side to soften shadows
        React.createElement("directionalLight", {
          position: [-40, 25, -30],
          intensity: 0.3,
          color: "#f0f5ff",
        }),

        // Model selection driven by property.model metadata
        (() => {
          if (!property) return React.createElement(ModernHouse, { property });
          const model = property.model || { type: 'procedural' };
          const targetSize = model.targetSize || 18;
          if (model.type === 'gltf' && model.path) {
            return React.createElement(PropertyGLTFModel, { url: model.path, targetSize, onFit: (fit) => setModelFit(fit) });
          }
          if (model.type === 'fbx' && model.path) {
            return React.createElement(PropertyFBXModel, { url: model.path, targetSize, onFit: (fit) => setModelFit(fit) });
          }
            // procedural fallback
          return React.createElement(ModernHouse, { property });
        })(),

        // Ground
        React.createElement(
          "mesh",
          {
            rotation: [-Math.PI / 2, 0, 0],
            position: [0, -0.1, 0],
            receiveShadow: true,
          },
          React.createElement("planeGeometry", { args: [50, 50] }),
          React.createElement("meshStandardMaterial", { color: "#90EE90" })
        ),

        // Environment and shadows
        React.createElement(ContactShadows, {
          opacity: 0.25,
          scale: 26,
          blur: 1.8,
          far: 4,
          resolution: 256, // lower res for performance
          color: "#000000",
          frames: 60, // cache after initial frames
        }),
  React.createElement(Environment, { preset: "city" }),

        // Enhanced Controls
        React.createElement(AutoCameraFit, { modelFit }),
        React.createElement(OrbitControls, {
          enablePan: true,
          enableZoom: true,
          enableRotate: true,
          minDistance: 4,
          maxDistance: 60,
          minPolarAngle: 0,
          maxPolarAngle: Math.PI / 2.1,
          autoRotate: false,
          autoRotateSpeed: 0.5,
          target: modelFit
            ? [0, modelFit.size.y * modelFit.scale * 0.4, 0]
            : [0, 2, 0],
        })
      )
    ),

    // Instructions
    React.createElement(
      "div",
      { className: "viewer-instructions" },
      React.createElement(
        "div",
        { className: "instruction-row" },
        React.createElement("span", null, "🖱️ Drag to rotate"),
        React.createElement("span", null, "🔄 Scroll to zoom"),
        React.createElement("span", null, "📱 Touch & drag on mobile")
      )
    )
  );
};

export default ThreeDViewer;
