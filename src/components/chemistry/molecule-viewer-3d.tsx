"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Molecule, Simulation } from "@/types";
import { molecules } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SimulationLayout } from "@/components/simulation/simulation-layout";
import { ZoomableVisual } from "@/components/simulation/zoom/zoomable-visual";
import { useI18n } from "@/lib/i18n/use-i18n";

const atomColors: Record<string, string> = {
  H: "#e5e7eb",
  C: "#334155",
  O: "#ef4444",
  N: "#3b82f6",
  Na: "#a78bfa",
  Cl: "#22c55e",
  Ca: "#f97316"
};

function useMoleculeScene(containerRef: React.RefObject<HTMLDivElement | null>, molecule: Molecule, animateMotion: boolean) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020617");
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, 5);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const light = new THREE.PointLight(0xffffff, 1.5);
    light.position.set(4, 4, 5);
    scene.add(light);

    const group = new THREE.Group();
    scene.add(group);
    const atomMeshes: { mesh: THREE.Mesh; base: THREE.Vector3; element: string }[] = [];

    molecule.bonds.forEach((bond) => {
      const from = new THREE.Vector3(...molecule.atoms[bond.from].position);
      const to = new THREE.Vector3(...molecule.atoms[bond.to].position);
      const direction = to.clone().sub(from);
      const center = from.clone().add(to).multiplyScalar(0.5);
      const cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, direction.length(), 20),
        new THREE.MeshStandardMaterial({ color: "#cbd5e1" })
      );
      cylinder.position.copy(center);
      cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
      group.add(cylinder);
    });

    molecule.atoms.forEach((atom) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(atom.element === "H" ? 0.18 : 0.28, 32, 32),
        new THREE.MeshStandardMaterial({ color: atomColors[atom.element] ?? "#94a3b8" })
      );
      mesh.position.set(...atom.position);
      group.add(mesh);
      atomMeshes.push({ mesh, base: new THREE.Vector3(...atom.position), element: atom.element });
    });

    let frame = 0;
    const clock = new THREE.Clock();
    const render = () => {
      const elapsed = clock.getElapsedTime();
      if (animateMotion) {
        group.rotation.y = Math.sin(elapsed * 0.35) * 0.22;
        atomMeshes.forEach((atom, index) => {
          const amplitude = atom.element === "H" ? 0.055 : 0.035;
          atom.mesh.position.set(
            atom.base.x + Math.sin(elapsed * 2.2 + index) * amplitude,
            atom.base.y + Math.cos(elapsed * 1.8 + index * 0.7) * amplitude,
            atom.base.z + Math.sin(elapsed * 1.5 + index * 1.1) * amplitude
          );
        });
      }
      controls.update();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    render();

    const resize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material.dispose();
        }
      });
    };
  }, [containerRef, molecule, animateMotion]);
}

export function MoleculeViewer3D({ simulation }: { simulation: Simulation }) {
  const [molecule, setMolecule] = useState<Molecule>(molecules[0]);
  const [animateMotion, setAnimateMotion] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  useMoleculeScene(containerRef, molecule, animateMotion);

  return (
    <SimulationLayout simulation={simulation} parameters={{}} setParameter={() => undefined}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {molecules.map((item) => (
            <Button key={item.id} variant={item.id === molecule.id ? "primary" : "secondary"} onClick={() => setMolecule(item)}>
              {item.formula}
            </Button>
          ))}
        </div>
        <Card>
          <CardContent className="grid gap-4 p-4 lg:grid-cols-[1fr_300px]">
            <ZoomableVisual
              title={`${simulation.title}: ${molecule.formula}`}
              subject={simulation.subject}
              safetyNote={simulation.safetyNote}
              instructions={[
                "Chọn một phân tử bất kỳ ở danh sách phía trên.",
                "Nhấp chuột trái và kéo để xoay góc nhìn 3D của phân tử.",
                "Sử dụng con lăn chuột để thu phóng và nhấp chuột phải kéo để di chuyển.",
                "Bật/Tắt chế độ dao động nhiệt để quan sát dao động của các liên kết hóa học."
              ]}
            >
              <div ref={containerRef} className="h-[480px] overflow-hidden rounded-lg border border-border bg-slate-950" />
            </ZoomableVisual>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">{molecule.formula}</h3>
              <p className="text-muted-foreground">{molecule.name}</p>
              <p className="rounded-md bg-muted p-3 text-sm">{t("bondingType")}: {molecule.bonding}</p>
              {molecule.bondAngle ? <p className="rounded-md bg-muted p-3 text-sm">{t("bondAngle")}: {molecule.bondAngle}</p> : null}
              <Button variant={animateMotion ? "primary" : "secondary"} onClick={() => setAnimateMotion((value) => !value)}>
                {animateMotion ? t("moleculeMotionOff") : t("moleculeMotionOn")}
              </Button>
              <p className="text-sm text-muted-foreground">{t("rotateZoomPan")}</p>
              <p className="rounded-md border border-border p-3 text-xs text-muted-foreground">{t("moleculeMotionNote")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </SimulationLayout>
  );
}
