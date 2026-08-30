const test = require('node:test');
const assert = require('node:assert/strict');
const { createEntity, applyWallBounce, updateEntity } = require('./shapePhysics.js');

test('circle physics adds visible bounce energy and spin on collision', () => {
  const circle = createEntity('circle', 10, 10, { width: 40, height: 40, vx: -2, vy: 1 });

  const bounced = applyWallBounce(circle, { left: 0, right: 100, top: 0, bottom: 100, hitLeft: true, hitTop: false });

  assert.ok(bounced.vx > 0);
  assert.ok(bounced.vx > 2);
  assert.ok(bounced.flash > 0);
  assert.ok(Math.abs(bounced.spin) > 0);
});

test('spring physics stretches and rebounds', () => {
  const spring = createEntity('spring', 90, 10, { width: 50, height: 30, vx: 2, vy: -1, springStretch: 0.1 });

  const bounced = applyWallBounce(spring, { left: 0, right: 100, top: 0, bottom: 100, hitRight: true, hitTop: false });

  assert.ok(bounced.springStretch > 0.1);
  assert.ok(bounced.vx < 0);
  assert.ok(bounced.sproing > 0);
});

test('updateEntity advances position using velocity', () => {
  const square = createEntity('square', 25, 25, { width: 20, height: 20, vx: 3, vy: 4 });
  const updated = updateEntity(square, { left: 0, right: 200, top: 0, bottom: 200 });

  assert.equal(updated.x, 28);
  assert.equal(updated.y, 29);
});
