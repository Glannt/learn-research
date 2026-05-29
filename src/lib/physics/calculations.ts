export const STANDARD_GRAVITY = 9.81;

export function pendulumPeriod(length: number, gravity = STANDARD_GRAVITY) {
  return 2 * Math.PI * Math.sqrt(length / gravity);
}

export function pendulumState(params: {
  length: number;
  mass: number;
  angle0Deg: number;
  gravity: number;
  damping: number;
  time: number;
}) {
  const theta0 = (params.angle0Deg * Math.PI) / 180;
  const omega = Math.sqrt(params.gravity / params.length);
  const decay = Math.exp(-params.damping * params.time);
  const theta = theta0 * decay * Math.cos(omega * params.time);
  const angularVelocity =
    -theta0 * decay * (omega * Math.sin(omega * params.time) + params.damping * Math.cos(omega * params.time));
  const speed = Math.abs(params.length * angularVelocity);
  const height = params.length * (1 - Math.cos(theta));
  const kineticEnergy = 0.5 * params.mass * speed * speed;
  const potentialEnergy = params.mass * params.gravity * height;
  const tangentialAcceleration = -params.gravity * Math.sin(theta);

  return { theta, speed, tangentialAcceleration, kineticEnergy, potentialEnergy };
}

export function kinematicsState(params: { initialPosition: number; initialVelocity: number; acceleration: number; time: number }) {
  const velocity = params.initialVelocity + params.acceleration * params.time;
  const position = params.initialPosition + params.initialVelocity * params.time + 0.5 * params.acceleration * params.time ** 2;
  return { position, velocity, acceleration: params.acceleration };
}

export function newtonLawState(params: { mass: number; force: number; friction: number; angleDeg: number; gravity?: number }) {
  const gravity = params.gravity ?? STANDARD_GRAVITY;
  const angle = (params.angleDeg * Math.PI) / 180;
  const horizontalForce = params.force * Math.cos(angle);
  const verticalForce = params.force * Math.sin(angle);
  const normalForce = Math.max(0, params.mass * gravity - verticalForce);
  const frictionForce = params.friction * normalForce;
  const netForce = Math.max(0, horizontalForce - frictionForce);
  const acceleration = netForce / params.mass;
  return { horizontalForce, verticalForce, normalForce, frictionForce, netForce, acceleration };
}

export function idealGasPressure(params: { n: number; temperature: number; volume: number }) {
  const gasConstant = 8.314;
  return (params.n * gasConstant * params.temperature) / params.volume;
}

export function generateIdealGasParticles(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    x: 10 + ((index * 37) % 280),
    y: 10 + ((index * 61) % 160),
    vx: ((index % 5) - 2) * 0.7 || 0.6,
    vy: (((index + 2) % 5) - 2) * 0.7 || -0.6
  }));
}
