"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { ChemicalElement, Simulation } from "@/types";
import { chemicalElements } from "@/data/catalog";
import { electronShells } from "@/lib/chemistry/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { SimulationLayout } from "@/components/simulation/simulation-layout";
import { PeriodicTable } from "@/components/chemistry/periodic-table";
import { ZoomableVisual } from "@/components/simulation/zoom/zoomable-visual";
import { useI18n } from "@/lib/i18n/use-i18n";

function useAtomScene(containerRef: React.RefObject<HTMLDivElement | null>, element: ChemicalElement) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020617");
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 4);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const light = new THREE.PointLight(0xffffff, 1.4);
    light.position.set(4, 4, 5);
    scene.add(light);

    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.38 + Math.min(0.5, element.atomicNumber * 0.01), 32, 32),
      new THREE.MeshStandardMaterial({ color: "#f97316", emissive: "#7c2d12" })
    );
    scene.add(nucleus);

    const electrons: { mesh: THREE.Mesh; radius: number; speed: number; offset: number }[] = [];
    electronShells(element).forEach((count, shellIndex) => {
      const radius = 0.9 + shellIndex * 0.55;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.006, 8, 96), new THREE.MeshBasicMaterial({ color: "#94a3b8" }));
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      for (let electronIndex = 0; electronIndex < count; electronIndex += 1) {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 16, 16),
          new THREE.MeshStandardMaterial({ color: "#38bdf8", emissive: "#075985" })
        );
        scene.add(mesh);
        electrons.push({ mesh, radius, speed: 0.7 + shellIndex * 0.2, offset: (electronIndex / count) * Math.PI * 2 });
      }
    });

    let frame = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      electrons.forEach((electron) => {
        const time = elapsed * electron.speed + electron.offset;
        electron.mesh.position.set(Math.cos(time) * electron.radius, Math.sin(time) * electron.radius, Math.sin(time * 0.7) * 0.25);
      });
      controls.update();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

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
  }, [containerRef, element]);
}

export function AtomModel3D({ simulation }: { simulation: Simulation }) {
  const [element, setElement] = useState(chemicalElements[5]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  useAtomScene(containerRef, element);

  return (
    <SimulationLayout simulation={simulation} parameters={{}} setParameter={() => undefined}>
      <div className="space-y-4">
        <PeriodicTable onSelect={setElement} />
        <Card>
          <CardContent className="grid gap-4 p-4 lg:grid-cols-[1fr_280px]">
            <ZoomableVisual
              title={`${simulation.title}: ${element.symbol}`}
              subject={simulation.subject}
              safetyNote={simulation.safetyNote}
              instructions={[
                "Chọn nguyên tố hóa học bất kỳ từ bảng tuần hoàn ở phía trên.",
                "Nhấp chuột trái và kéo để xoay góc nhìn 3D của đám mây electron và hạt nhân.",
                "Sử dụng con lăn chuột để phóng to hạt nhân nguyên tử hoặc thu nhỏ để xem lớp vỏ ngoài.",
                "Quan sát số lượng electron ở các phân lớp s, p, d tuần tự tăng lên."
              ]}
            >
              <div ref={containerRef} className="h-[420px] overflow-hidden rounded-lg border border-border bg-slate-950" />
            </ZoomableVisual>
            <div className="space-y-3 text-sm">
              <h3 className="text-xl font-semibold">{element.symbol} - {element.name}</h3>
              <p>{t("atomModelNote")}</p>
              <p className="rounded-md bg-muted p-3">{t("electronConfiguration")}: {element.electronConfiguration}</p>
              <p>{t("protonNumber")}: {element.atomicNumber}. {t("atomicMassApprox")}: {element.atomicMass}.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </SimulationLayout>
  );
}
