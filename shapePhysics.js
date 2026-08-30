(function (root) {
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function createEntity(type, x, y, config = {}) {
    const width = config.width ?? 50;
    const height = config.height ?? width;
    const color = config.color ?? { r: 200, g: 200, b: 200 };

    return {
      id: config.id ?? `${type}-${Math.random().toString(16).slice(2)}`,
      type: type || 'square',
      x: x ?? 0,
      y: y ?? 0,
      width,
      height,
      vx: config.vx ?? 1,
      vy: config.vy ?? 1,
      color: {
        r: color.r ?? 200,
        g: color.g ?? 200,
        b: color.b ?? 200,
      },
      bounce: config.bounce ?? 1,
      spin: config.spin ?? 0,
      flash: config.flash ?? 0,
      wobble: config.wobble ?? 0,
      springStretch: config.springStretch ?? 0,
      sproing: config.sproing ?? 0,
      rotation: config.rotation ?? 0,
      trail: [],
    };
  }

  function applyWallBounce(entity, bounds = {}) {
    if (!entity) return entity;

    const next = { ...entity };
    const left = bounds.left ?? 0;
    const right = bounds.right ?? Number.POSITIVE_INFINITY;
    const top = bounds.top ?? 0;
    const bottom = bounds.bottom ?? Number.POSITIVE_INFINITY;

    const hitLeft = Boolean(bounds.hitLeft) || next.x <= left;
    const hitRight = Boolean(bounds.hitRight) || next.x + next.width >= right;
    const hitTop = Boolean(bounds.hitTop) || next.y <= top;
    const hitBottom = Boolean(bounds.hitBottom) || next.y + next.height >= bottom;

    const impactBoost = next.type === 'circle' ? 1.18 : next.type === 'spring' ? 1.08 : 1;

    if (hitLeft && next.vx < 0) {
      next.vx = Math.abs(next.vx) * impactBoost;
      next.x = left;
    }

    if (hitRight && next.vx > 0) {
      next.vx = -Math.abs(next.vx) * impactBoost;
      next.x = right - next.width;
    }

    if (hitTop && next.vy < 0) {
      next.vy = Math.abs(next.vy) * impactBoost;
      next.y = top;
    }

    if (hitBottom && next.vy > 0) {
      next.vy = -Math.abs(next.vy) * impactBoost;
      next.y = bottom - next.height;
    }

    if (next.type === 'circle') {
      next.flash = 1;
      next.spin = (next.vx < 0 ? -1 : 1) * (Math.abs(next.vx) * 9 + 8);
      next.vx *= 1.05;
      next.vy *= 1.05;
      next.wobble = 1;
    }

    if (next.type === 'spring') {
      next.springStretch = Math.max(next.springStretch ?? 0, 0.35) + 0.6;
      next.sproing = 1.5;
      next.wobble = 1.2;
      next.vx *= 0.9;
      next.vy *= 0.92;
    }

    if (next.type === 'rectangle') {
      next.wobble = 1.3;
      next.rotation = next.rotation + (next.vx >= 0 ? 0.22 : -0.22);
    }

    return next;
  }

  function updateEntity(entity, bounds = {}) {
    if (!entity) return entity;

    const next = { ...entity };
    next.x += next.vx;
    next.y += next.vy;

    const collision = {
      hitLeft: next.x <= (bounds.left ?? 0),
      hitRight: next.x + next.width >= (bounds.right ?? Number.POSITIVE_INFINITY),
      hitTop: next.y <= (bounds.top ?? 0),
      hitBottom: next.y + next.height >= (bounds.bottom ?? Number.POSITIVE_INFINITY),
    };

    const updated = applyWallBounce({ ...next }, { ...bounds, ...collision });

    updated.rotation = updated.rotation || 0;
    updated.flash = clamp((updated.flash ?? 0) - 0.08, 0, 1);
    updated.spin *= 0.82;
    updated.wobble *= 0.86;

    if (updated.type === 'spring') {
      updated.springStretch *= 0.82;
      updated.sproing *= 0.82;
    }

    if (updated.type === 'rectangle') {
      updated.rotation += updated.vx * 0.02;
    }

    return updated;
  }

  root.createEntity = createEntity;
  root.applyWallBounce = applyWallBounce;
  root.updateEntity = updateEntity;
  root.clamp = clamp;

  if (typeof module !== 'undefined') {
    module.exports = {
      createEntity,
      applyWallBounce,
      updateEntity,
      clamp,
    };
  }
})(typeof window !== 'undefined' ? window : globalThis);
