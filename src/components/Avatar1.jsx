import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, useAnimations, Html } from "@react-three/drei";

import CanvasLoader from "./Loader";

/* ===================== AVATAR ===================== */

useGLTF.preload("/models/breathing_idle.glb");

const Avatar = ({ isMobile }) => {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/breathing_idle.glb");
  const { actions, names } = useAnimations(animations, group);

  useLayoutEffect(() => {
    if (!actions || names.length === 0) return;

    const key = names[0];
    const action = actions[key];
    if (!action) return;

    action.reset().fadeIn(0.25).play();

    return () => {
      action.fadeOut(0.2);
    };
  }, [actions, names]);

  return (
    <group
      ref={group}
      position={isMobile ? [0, -1.5, 0] : [2.65, -4, 0]}
      scale={isMobile ? 1.4 : 4}
    >
      <hemisphereLight intensity={2} groundColor="#000000" />
      <directionalLight position={[-1, 2, 2]} intensity={2} castShadow />
      <primitive object={scene} />
    </group>
  );
};

/* ===================== RESPONSIVE RIG  ===================== */

function ResponsiveRig({ isMobile, target }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    const pos = isMobile ? [-0.32, 0.52, 3.25] :  [2.013, 1.373, 7.895];

    camera.position.set(pos[0], pos[1], pos[2]);
    camera.updateProjectionMatrix();

    if (controls) {
      controls.target.set(target[0], target[1], target[2]);
      controls.update();
    }

    invalidate();
  }, [isMobile, target, camera, controls, invalidate]);

  return null;
}

function DebugHotkeys({ setEnabled }) {
  const { camera, controls } = useThree();

  useEffect(() => {
    const onKeyDown = (e) => {
      const k = e.key.toLowerCase();

      if (k === "h") {
        setEnabled((v) => !v);
        return;
      }

      if (k === "c") {
        const p = camera.position;
        const t = controls?.target;

        const cam = `[${p.x.toFixed(3)}, ${p.y.toFixed(3)}, ${p.z.toFixed(3)}]`;
        const tgt = t
          ? `[${t.x.toFixed(3)}, ${t.y.toFixed(3)}, ${t.z.toFixed(3)}]`
          : "n/a";

        console.log("COPY -> camera:", cam, "target:", tgt);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [camera, controls, setEnabled]);

  return null;
}

function DebugHelpers({ enabled, target = [0, 1.5, 0] }) {
  if (!enabled) return null;

  return (
    <>
      <axesHelper args={[2]} />
      <gridHelper args={[10, 10]} />

      <mesh position={target}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial />
      </mesh>

      <Html position={[0, 0, 0]} center>
        <div
          style={{
            padding: "2px 6px",
            borderRadius: 6,
            background: "rgba(0,0,0,0.55)",
            color: "white",
            fontSize: 11,
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            pointerEvents: "none",
          }}
        >
          (0,0,0)
        </div>
      </Html>
    </>
  );
}

function DebugHUD({ enabled }) {
  const { camera, controls } = useThree();
  const [text, setText] = useState("");

  useEffect(() => {
    if (!enabled) return;

    const id = setInterval(() => {
      const p = camera.position;
      const t = controls?.target;

      const cam = `[${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}]`;
      const tgt = t
        ? `[${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}]`
        : "n/a";

      setText(`camera: ${cam}\ntarget: ${tgt}\n\n[C] log coords\n[H] toggle debug`);
    }, 150);

    return () => clearInterval(id);
  }, [enabled, camera, controls]);

  if (!enabled) return null;

  return (
    <Html fullscreen>
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 60,
          padding: "10px 12px",
          background: "rgba(0,0,0,0.65)",
          color: "white",
          fontSize: 12,
          borderRadius: 10,
          whiteSpace: "pre",
          pointerEvents: "none",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        }}
      >
        {text}
      </div>
    </Html>
  );
}

/* ===================== CANVAS ===================== */

export default function Avatar1() {
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia("(max-width: 850px)").matches
  );
  const [debug, setDebug] = useState(true);
  const target = useMemo(() => [0, 1.5, 0], []);


  const camPos = useMemo(
    () => (isMobile ? [-0.32, 0.52, 3.25] : [2.013, 1.373, 7.895]),
    [isMobile]
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 850px)");
    const onChange = (e) => setIsMobile(e.matches);

    setIsMobile(mq.matches);

    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        shadows
        className="w-full h-full"
        dpr={[1, 2]}
        camera={{ position: camPos, fov: 40 }}
      >

        
        {/* Debug UI + hotkeys */}
        {/* <DebugHotkeys setEnabled={setDebug} />
        <DebugHelpers enabled={debug} target={target} />
        <DebugHUD enabled={debug} /> */}

        <OrbitControls
          makeDefault
          target={target}
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />

        

        <ResponsiveRig isMobile={isMobile} target={target} />

        <Suspense fallback={<CanvasLoader />}>
          <Avatar isMobile={isMobile} />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
}
