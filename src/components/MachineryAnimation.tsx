import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const MachineryAnimation: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. SCENE, CAMERA, RENDERER ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090d, 0.028);

    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(8.2, 5.6, 9.2);
    camera.lookAt(0, 1.35, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- 2. LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xdbe6ff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(8, 14, 9);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.6);
    rimLight.position.set(-9, 6, -8);
    scene.add(rimLight);

    const emberLight = new THREE.PointLight(0xff5500, 5.0, 9, 1.6);
    emberLight.position.set(0, 2.5, 0);
    scene.add(emberLight);

    // --- 3. MATERIALS ---
    const darkTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x161b24,
      metalness: 0.85,
      roughness: 0.28,
    });

    const brushedSteelMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.9,
      roughness: 0.22,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.96,
      roughness: 0.1,
    });

    const alloyBladeMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.88,
      roughness: 0.2,
    });

    const copperCoilMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.85,
      roughness: 0.25,
    });

    const orangeAccentMat = new THREE.MeshStandardMaterial({
      color: 0xff5500,
      emissive: 0xff3300,
      emissiveIntensity: 0.65,
      metalness: 0.4,
      roughness: 0.3,
    });

    const addEdgeHighlight = (
      mesh: THREE.Mesh,
      color = 0x475569,
      opacity = 0.35
    ) => {
      const edges = new THREE.EdgesGeometry(mesh.geometry, 28);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity,
        })
      );
      mesh.add(line);
    };

    const createGearMesh = (
      outerRadius: number,
      innerRadius: number,
      thickness: number,
      teeth: number,
      mat: THREE.Material,
      accentColor = 0xff5500
    ) => {
      const group = new THREE.Group();
      const bodyGeo = new THREE.CylinderGeometry(
        outerRadius * 0.88,
        outerRadius * 0.88,
        thickness,
        36
      );
      const bodyMesh = new THREE.Mesh(bodyGeo, mat);
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      addEdgeHighlight(bodyMesh, accentColor, 0.32);
      group.add(bodyMesh);

      const toothGeo = new THREE.BoxGeometry(
        (outerRadius * 0.36) / (teeth / 12),
        thickness * 0.96,
        outerRadius * 0.24
      );
      for (let i = 0; i < teeth; i++) {
        const angle = (i / teeth) * Math.PI * 2;
        const tooth = new THREE.Mesh(toothGeo, mat);
        tooth.position.set(
          Math.cos(angle) * (outerRadius * 0.9),
          0,
          Math.sin(angle) * (outerRadius * 0.9)
        );
        tooth.rotation.y = -angle;
        group.add(tooth);
      }

      const boreGeo = new THREE.CylinderGeometry(
        innerRadius,
        innerRadius,
        thickness * 1.08,
        24
      );
      const boreMesh = new THREE.Mesh(boreGeo, darkTitaniumMat);
      addEdgeHighlight(boreMesh, 0xff5500, 0.6);
      group.add(boreMesh);

      return group;
    };

    // --- 4. PRECISION WORKCELL BED & SUBTLE GRID ---
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    const gridHelper = new THREE.GridHelper(20, 20, 0x334155, 0x161e2e);
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.25;
    worldGroup.add(gridHelper);

    const bedGeo = new THREE.CylinderGeometry(3.4, 3.7, 0.36, 8);
    const bedMesh = new THREE.Mesh(bedGeo, darkTitaniumMat);
    bedMesh.position.y = 0.18;
    bedMesh.receiveShadow = true;
    addEdgeHighlight(bedMesh, 0x334155, 0.45);
    worldGroup.add(bedMesh);

    const bedRingGeo = new THREE.RingGeometry(2.68, 2.74, 64);
    const bedRingMat = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55,
    });
    const bedRing = new THREE.Mesh(bedRingGeo, bedRingMat);
    bedRing.rotation.x = -Math.PI / 2;
    bedRing.position.y = 0.37;
    worldGroup.add(bedRing);

    // --- 5. CENTER 5-AXIS TRUNNION & TURBINE / PLANETARY CORE ---
    const trunnionBase = new THREE.Group();
    trunnionBase.position.set(0.35, 0.36, 0);
    worldGroup.add(trunnionBase);

    [-1.95, 1.95].forEach((xOffset) => {
      const pillarGeo = new THREE.BoxGeometry(0.42, 1.65, 0.9);
      const pillar = new THREE.Mesh(pillarGeo, darkTitaniumMat);
      pillar.position.set(xOffset, 0.82, 0);
      pillar.castShadow = true;
      addEdgeHighlight(pillar, 0x475569, 0.4);
      trunnionBase.add(pillar);

      const bearingGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.52, 24);
      const bearing = new THREE.Mesh(bearingGeo, brushedSteelMat);
      bearing.rotation.z = Math.PI / 2;
      bearing.position.set(xOffset, 1.35, 0);
      addEdgeHighlight(bearing, 0xff5500, 0.45);
      trunnionBase.add(bearing);
    });

    const trunnionCradle = new THREE.Group();
    trunnionCradle.position.set(0, 1.35, 0);
    trunnionBase.add(trunnionCradle);

    const cradleBridgeGeo = new THREE.BoxGeometry(3.5, 0.28, 1.2);
    const cradleBridge = new THREE.Mesh(cradleBridgeGeo, darkTitaniumMat);
    cradleBridge.position.y = -0.55;
    addEdgeHighlight(cradleBridge, 0x38bdf8, 0.3);
    trunnionCradle.add(cradleBridge);

    // Layer 0: Stator Containment Ring & Copper Stator Coils
    const statorLayer = new THREE.Group();
    trunnionCradle.add(statorLayer);

    const statorRingGeo = new THREE.CylinderGeometry(1.52, 1.58, 0.42, 36, 1, true);
    const statorRing = new THREE.Mesh(statorRingGeo, darkTitaniumMat);
    statorRing.position.y = -0.25;
    addEdgeHighlight(statorRing, 0xff5500, 0.35);
    statorLayer.add(statorRing);

    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const coilGeo = new THREE.BoxGeometry(0.18, 0.34, 0.28);
      const coil = new THREE.Mesh(coilGeo, copperCoilMat);
      coil.position.set(Math.cos(a) * 1.4, -0.25, Math.sin(a) * 1.4);
      coil.rotation.y = -a;
      statorLayer.add(coil);
    }

    // Layer 1: Planetary Gear Train
    const planetaryLayer = new THREE.Group();
    planetaryLayer.position.y = 0.05;
    trunnionCradle.add(planetaryLayer);

    const sunGear = createGearMesh(0.55, 0.22, 0.26, 14, chromeMat, 0xff5500);
    planetaryLayer.add(sunGear);

    const planetCarrier = new THREE.Group();
    planetaryLayer.add(planetCarrier);

    const planetGears: THREE.Group[] = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const pGear = createGearMesh(0.38, 0.14, 0.24, 10, brushedSteelMat, 0x38bdf8);
      pGear.position.set(Math.cos(angle) * 0.94, 0, Math.sin(angle) * 0.94);
      planetCarrier.add(pGear);
      planetGears.push(pGear);

      const pinGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.38, 12);
      const pin = new THREE.Mesh(pinGeo, orangeAccentMat);
      pin.position.copy(pGear.position);
      planetCarrier.add(pin);
    }

    // Layer 2: Aerospace Blisk (Turbine Impeller)
    const bliskLayer = new THREE.Group();
    bliskLayer.position.y = 0.38;
    trunnionCradle.add(bliskLayer);

    const hubGeo = new THREE.CylinderGeometry(0.58, 0.82, 0.45, 32);
    const hubMesh = new THREE.Mesh(hubGeo, chromeMat);
    hubMesh.castShadow = true;
    addEdgeHighlight(hubMesh, 0x38bdf8, 0.35);
    bliskLayer.add(hubMesh);

    const bladeCount = 18;
    const bladeGeo = new THREE.BoxGeometry(0.72, 0.34, 0.055);
    for (let i = 0; i < bladeCount; i++) {
      const angle = (i / bladeCount) * Math.PI * 2;
      const bladePivot = new THREE.Group();
      bladePivot.rotation.y = angle;

      const blade = new THREE.Mesh(bladeGeo, alloyBladeMat);
      blade.position.set(0.95, 0.02, 0);
      blade.rotation.x = 0.52;
      blade.rotation.z = -0.18;
      blade.castShadow = true;
      addEdgeHighlight(blade, 0x94a3b8, 0.3);

      bladePivot.add(blade);
      bliskLayer.add(bladePivot);
    }

    // Layer 3: Upper Retention Nose Cone
    const capLayer = new THREE.Group();
    capLayer.position.y = 0.72;
    trunnionCradle.add(capLayer);

    const noseGeo = new THREE.ConeGeometry(0.52, 0.55, 24);
    const noseMesh = new THREE.Mesh(noseGeo, darkTitaniumMat);
    addEdgeHighlight(noseMesh, 0xff5500, 0.6);
    capLayer.add(noseMesh);

    const noseRingGeo = new THREE.TorusGeometry(0.46, 0.035, 12, 32);
    const noseRing = new THREE.Mesh(noseRingGeo, orangeAccentMat);
    noseRing.rotation.x = Math.PI / 2;
    noseRing.position.y = -0.22;
    capLayer.add(noseRing);

    // --- 6. 6-AXIS ARTICULATED INDUSTRIAL ROBOTIC ARM ---
    const robotBase = new THREE.Group();
    robotBase.position.set(-2.55, 0.36, -0.35);
    worldGroup.add(robotBase);

    const pedestalGeo = new THREE.CylinderGeometry(0.62, 0.78, 0.55, 24);
    const pedestalMesh = new THREE.Mesh(pedestalGeo, darkTitaniumMat);
    pedestalMesh.position.y = 0.275;
    addEdgeHighlight(pedestalMesh, 0xff5500, 0.45);
    robotBase.add(pedestalMesh);

    const robotTurret = new THREE.Group();
    robotTurret.position.y = 0.55;
    robotBase.add(robotTurret);

    const turretBodyGeo = new THREE.BoxGeometry(0.86, 0.68, 0.86);
    const turretBody = new THREE.Mesh(turretBodyGeo, brushedSteelMat);
    turretBody.position.y = 0.34;
    addEdgeHighlight(turretBody, 0x1e293b, 0.45);
    robotTurret.add(turretBody);

    const shoulderPivot = new THREE.Group();
    shoulderPivot.position.set(0, 0.52, 0);
    robotTurret.add(shoulderPivot);

    const shoulderJointGeo = new THREE.CylinderGeometry(0.34, 0.34, 1.05, 24);
    const shoulderJoint = new THREE.Mesh(shoulderJointGeo, darkTitaniumMat);
    shoulderJoint.rotation.x = Math.PI / 2;
    addEdgeHighlight(shoulderJoint, 0xff5500, 0.6);
    shoulderPivot.add(shoulderJoint);

    const lowerArmLen = 2.15;
    [-0.36, 0.36].forEach((zOff) => {
      const strutGeo = new THREE.BoxGeometry(0.28, lowerArmLen, 0.16);
      const strut = new THREE.Mesh(strutGeo, brushedSteelMat);
      strut.position.set(0, lowerArmLen / 2, zOff);
      strut.castShadow = true;
      addEdgeHighlight(strut, 0x38bdf8, 0.25);
      shoulderPivot.add(strut);
    });

    const hydroCylinderGeo = new THREE.CylinderGeometry(0.13, 0.13, 1.1, 16);
    const hydroCylinder = new THREE.Mesh(hydroCylinderGeo, darkTitaniumMat);
    hydroCylinder.position.set(0.22, 0.9, 0);
    hydroCylinder.rotation.z = -0.12;
    shoulderPivot.add(hydroCylinder);

    const hydroPistonGeo = new THREE.CylinderGeometry(0.07, 0.07, 1.0, 16);
    const hydroPiston = new THREE.Mesh(hydroPistonGeo, chromeMat);
    hydroPiston.position.set(0.32, 1.55, 0);
    hydroPiston.rotation.z = -0.12;
    shoulderPivot.add(hydroPiston);

    const elbowPivot = new THREE.Group();
    elbowPivot.position.set(0, lowerArmLen, 0);
    shoulderPivot.add(elbowPivot);

    const elbowJointGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.95, 24);
    const elbowJoint = new THREE.Mesh(elbowJointGeo, darkTitaniumMat);
    elbowJoint.rotation.x = Math.PI / 2;
    addEdgeHighlight(elbowJoint, 0xff5500, 0.6);
    elbowPivot.add(elbowJoint);

    const forearmLen = 1.95;
    const forearmGeo = new THREE.BoxGeometry(forearmLen, 0.3, 0.42);
    const forearmMesh = new THREE.Mesh(forearmGeo, darkTitaniumMat);
    forearmMesh.position.set(forearmLen / 2, 0, 0);
    forearmMesh.castShadow = true;
    addEdgeHighlight(forearmMesh, 0xff5500, 0.4);
    elbowPivot.add(forearmMesh);

    const wristPivot = new THREE.Group();
    wristPivot.position.set(forearmLen, 0, 0);
    elbowPivot.add(wristPivot);

    const wristBodyGeo = new THREE.CylinderGeometry(0.2, 0.24, 0.48, 20);
    const wristBody = new THREE.Mesh(wristBodyGeo, chromeMat);
    wristBody.position.y = -0.18;
    wristPivot.add(wristBody);

    const nozzleConeGeo = new THREE.ConeGeometry(0.18, 0.45, 20);
    const nozzleCone = new THREE.Mesh(nozzleConeGeo, copperCoilMat);
    nozzleCone.rotation.x = Math.PI;
    nozzleCone.position.y = -0.62;
    wristPivot.add(nozzleCone);

    const nozzleTipRingGeo = new THREE.TorusGeometry(0.12, 0.025, 10, 24);
    const nozzleTipRing = new THREE.Mesh(nozzleTipRingGeo, orangeAccentMat);
    nozzleTipRing.rotation.x = Math.PI / 2;
    nozzleTipRing.position.y = -0.52;
    wristPivot.add(nozzleTipRing);

    const nozzleTipAnchor = new THREE.Object3D();
    nozzleTipAnchor.position.set(0, -0.84, 0);
    wristPivot.add(nozzleTipAnchor);

    // --- 7. LASER BEAM, MOLTEN POOL & SPARKS ---
    const laserBeamPts = [new THREE.Vector3(), new THREE.Vector3()];
    const laserBeamGeo = new THREE.BufferGeometry().setFromPoints(laserBeamPts);
    const laserBeamMat = new THREE.LineBasicMaterial({
      color: 0xff5500,
      linewidth: 2,
    });
    const laserBeamLine = new THREE.Line(laserBeamGeo, laserBeamMat);
    worldGroup.add(laserBeamLine);

    const hotspotGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const hotspotMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const hotspotMesh = new THREE.Mesh(hotspotGeo, hotspotMat);
    worldGroup.add(hotspotMesh);

    const hotspotHaloGeo = new THREE.RingGeometry(0.13, 0.3, 32);
    const hotspotHaloMat = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    });
    const hotspotHalo = new THREE.Mesh(hotspotHaloGeo, hotspotHaloMat);
    hotspotHalo.rotation.x = -Math.PI / 2;
    worldGroup.add(hotspotHalo);

    const sparkCount = 65;
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkVelocities: THREE.Vector3[] = [];
    const sparkLives = new Float32Array(sparkCount);

    for (let i = 0; i < sparkCount; i++) {
      sparkPositions[i * 3] = 0;
      sparkPositions[i * 3 + 1] = -10;
      sparkPositions[i * 3 + 2] = 0;
      sparkVelocities.push(new THREE.Vector3());
      sparkLives[i] = Math.random();
    }

    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xff9933,
      size: 0.08,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    worldGroup.add(sparkPoints);

    // --- 8. RESIZE HANDLER ---
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- 9. AUTONOMOUS CHOREOGRAPHED ANIMATION LOOP ---
    let animId: number;
    let clockTime = 0;
    let lastTime = performance.now();

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      clockTime += dt;

      // Smoothly orbit camera gently around the workcell
      const camAngle = 0.72 + Math.sin(clockTime * 0.25) * 0.22;
      const camRadius = 11.2;
      camera.position.x = Math.cos(camAngle) * camRadius;
      camera.position.z = Math.sin(camAngle) * camRadius;
      camera.position.y = 5.4 + Math.sin(clockTime * 0.35) * 0.6;
      camera.lookAt(0, 1.45, 0);

      // Periodic smooth exploded drivetrain cycle every ~10 seconds
      const cycleWave = Math.max(0, Math.sin(clockTime * 0.55 - 0.8));
      const explodeFactor = Math.pow(cycleWave, 2) * 0.75;

      statorLayer.position.y = -0.25 - explodeFactor * 0.45;
      planetaryLayer.position.y = 0.05 + explodeFactor * 0.2;
      bliskLayer.position.y = 0.38 + explodeFactor * 0.95;
      capLayer.position.y = 0.72 + explodeFactor * 1.65;

      // Rotate Turbine Blisk & Planetary Gear Train
      bliskLayer.rotation.y = clockTime * 1.3;
      capLayer.rotation.y = clockTime * 1.3;
      sunGear.rotation.y = -clockTime * 2.6;
      planetCarrier.rotation.y = clockTime * 0.75;
      planetGears.forEach((pg) => {
        pg.rotation.y = -clockTime * 3.1;
      });

      // Tilt 5-Axis Trunnion Cradle smoothly
      trunnionCradle.rotation.x = Math.sin(clockTime * 0.75) * 0.22;

      // Autonomous Laser Target Trajectory on the Blisk Rim
      const bliskWorldPos = new THREE.Vector3();
      bliskLayer.getWorldPosition(bliskWorldPos);

      const laserTargetWorld = new THREE.Vector3(
        bliskWorldPos.x - 0.55 + Math.cos(clockTime * 1.6) * 0.3,
        bliskWorldPos.y + 0.18,
        bliskWorldPos.z + Math.sin(clockTime * 1.6) * 0.3
      );

      // Articulated Robotic Arm Kinematic Tracking
      const robotBaseWorld = new THREE.Vector3();
      robotBase.getWorldPosition(robotBaseWorld);
      const dx = laserTargetWorld.x - robotBaseWorld.x;
      const dz = laserTargetWorld.z - robotBaseWorld.z;
      const turretYaw = Math.atan2(-dz, dx);
      robotTurret.rotation.y = turretYaw * 0.45;

      const reachDist = Math.hypot(dx, dz);
      shoulderPivot.rotation.z =
        -0.38 - Math.sin(clockTime * 1.6) * 0.08 - (reachDist - 2.6) * 0.18;
      elbowPivot.rotation.z =
        0.26 + Math.sin(clockTime * 1.6) * 0.1 + (laserTargetWorld.y - 1.8) * 0.22;
      wristPivot.rotation.z =
        -(shoulderPivot.rotation.z + elbowPivot.rotation.z) - 0.12;

      worldGroup.updateMatrixWorld(true);
      const nozzleWorldPos = new THREE.Vector3();
      nozzleTipAnchor.getWorldPosition(nozzleWorldPos);

      // Update Laser Beam & Molten Hotspot
      const beamPositions = laserBeamGeo.attributes.position as THREE.BufferAttribute;
      beamPositions.setXYZ(0, nozzleWorldPos.x, nozzleWorldPos.y, nozzleWorldPos.z);
      beamPositions.setXYZ(
        1,
        laserTargetWorld.x,
        laserTargetWorld.y,
        laserTargetWorld.z
      );
      beamPositions.needsUpdate = true;

      hotspotMesh.position.copy(laserTargetWorld);
      hotspotHalo.position.copy(laserTargetWorld);
      const pulseScale = 1 + Math.sin(clockTime * 20) * 0.25;
      hotspotHalo.scale.set(pulseScale, pulseScale, 1);

      emberLight.position.copy(laserTargetWorld).add(new THREE.Vector3(0, 0.35, 0));
      emberLight.intensity = 4.2 + Math.sin(clockTime * 25) * 1.4;

      // Update 3D Spark Physics
      const posAttr = sparkGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < sparkCount; i++) {
        sparkLives[i] += dt * (1.8 + (i % 5) * 0.35);
        if (sparkLives[i] >= 1.0) {
          sparkLives[i] = 0;
          posAttr.setXYZ(
            i,
            laserTargetWorld.x,
            laserTargetWorld.y,
            laserTargetWorld.z
          );
          const spreadAngle = Math.random() * Math.PI * 2;
          const speed = 1.1 + Math.random() * 2.2;
          sparkVelocities[i].set(
            Math.cos(spreadAngle) * speed,
            1.3 + Math.random() * 2.0,
            Math.sin(spreadAngle) * speed
          );
        } else {
          let sx = posAttr.getX(i) + sparkVelocities[i].x * dt;
          let sy = posAttr.getY(i) + sparkVelocities[i].y * dt;
          let sz = posAttr.getZ(i) + sparkVelocities[i].z * dt;
          sparkVelocities[i].y -= 6.8 * dt;
          if (sy < 0.38) {
            sy = 0.38;
            sparkVelocities[i].y *= -0.45;
          }
          posAttr.setXYZ(i, sx, sy, sz);
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] bg-[#07090D] rounded-lg overflow-hidden border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.85)] select-none pointer-events-none">
      {/* Subtle Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_50%,rgba(255,85,0,0.1),transparent_65%)]" />

      {/* Clean 3D WebGL Machinery Viewport */}
      <div
        ref={mountRef}
        className="w-full h-full min-h-[380px] sm:min-h-[440px] lg:min-h-[500px]"
      />
    </div>
  );
};
