function createPersonFigure(scene, x, y, opts = {}) {
  const {
    bodyColor = 0x3498db,
    headColor = 0xfcd0a1,
    limbColor = 0x6b4423,
    scale = 1,
    horns = 0,
  } = opts;

  const c = scene.add.container(x, y);

  const leftLeg = scene.add.rectangle(-4 * scale, 4 * scale, 5 * scale, 14 * scale, limbColor).setOrigin(0.5, 0);
  const rightLeg = scene.add.rectangle(4 * scale, 4 * scale, 5 * scale, 14 * scale, limbColor).setOrigin(0.5, 0);

  const body = scene.add.rectangle(0, -4 * scale, 14 * scale, 18 * scale, bodyColor);

  const leftArm = scene.add.rectangle(-9 * scale, -10 * scale, 4 * scale, 14 * scale, limbColor).setOrigin(0.5, 0);
  const rightArm = scene.add.rectangle(9 * scale, -10 * scale, 4 * scale, 14 * scale, limbColor).setOrigin(0.5, 0);

  const head = scene.add.circle(0, -22 * scale, 8 * scale, headColor);
  const leftEye = scene.add.circle(-3 * scale, -23 * scale, 1.4 * scale, 0x000000);
  const rightEye = scene.add.circle(3 * scale, -23 * scale, 1.4 * scale, 0x000000);

  c.add([leftLeg, rightLeg, body, leftArm, rightArm, head, leftEye, rightEye]);

  if (horns === 1) {
    const horn = scene.add.triangle(
      0, -32 * scale,
      -3 * scale, 4 * scale,
      3 * scale, 4 * scale,
      0, -6 * scale,
      0xffffff
    );
    c.add(horn);
  } else if (horns >= 2) {
    const lh = scene.add.triangle(
      -4 * scale, -32 * scale,
      -3 * scale, 4 * scale,
      3 * scale, 4 * scale,
      0, -5 * scale,
      0xffffff
    );
    const rh = scene.add.triangle(
      4 * scale, -32 * scale,
      -3 * scale, 4 * scale,
      3 * scale, 4 * scale,
      0, -5 * scale,
      0xffffff
    );
    c.add([lh, rh]);
  }

  c.parts = { head, body, leftArm, rightArm, leftLeg, rightLeg };
  c.walkTweens = [];
  return c;
}

function startWalking(scene, figure, speedMs = 200) {
  if (figure.walkTweens.length > 0) return;
  const swing = 28;
  figure.walkTweens.push(scene.tweens.add({
    targets: [figure.parts.rightLeg, figure.parts.leftArm],
    angle: { from: -swing, to: swing },
    duration: speedMs, yoyo: true, repeat: -1, ease: 'Sine.InOut',
  }));
  figure.walkTweens.push(scene.tweens.add({
    targets: [figure.parts.leftLeg, figure.parts.rightArm],
    angle: { from: swing, to: -swing },
    duration: speedMs, yoyo: true, repeat: -1, ease: 'Sine.InOut',
  }));
}

function stopWalking(figure) {
  figure.walkTweens.forEach(t => t.stop());
  figure.walkTweens = [];
  ['leftLeg', 'rightLeg', 'leftArm', 'rightArm'].forEach(k => { figure.parts[k].angle = 0; });
}

function faceDirection(figure, dir) {
  const absX = Math.abs(figure.scaleX) || 1;
  figure.scaleX = dir * absX;
}
