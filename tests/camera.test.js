import test from 'node:test';
import assert from 'node:assert/strict';
import {cameraPose} from '../src/scene/camera-rig.js';

test('every scroll/pointer/viewport combination stays in the front supported view',()=>{
  for(const aspect of [.45,.7,1,1.6,2.4])for(let p=0;p<=1;p+=.025)for(const pointer of [-10,-1,0,1,10]) {
    const pose=cameraPose(p,pointer,aspect);
    assert.ok(pose.yaw>=5&&pose.yaw<=21);
    assert.ok(pose.position[2]>39,'camera remains in front of the facade');
    assert.ok(pose.position[1]>=16,'camera never crosses the ground');
    assert.ok(pose.position.every(Number.isFinite));
  }
});
test('desktop approach enlarges the building and shifts framing to the left',()=>{
  const start=cameraPose(0,0,1.6),end=cameraPose(1,0,1.6);
  assert.ok(end.position[2]<start.position[2]);
  assert.ok(end.shiftX>start.shiftX);
  assert.deepEqual(cameraPose(0,0,1.6),start,'the choreography is reversible');
});
test('pointer influence reduces near the facade and is disabled for reduced motion',()=>{
  assert.ok(cameraPose(1,1,1.6).yaw-cameraPose(1,0,1.6).yaw<cameraPose(0,1,1.6).yaw-cameraPose(0,0,1.6).yaw);
  assert.deepEqual(cameraPose(.5,1,1.6,true),cameraPose(.5,-1,1.6,true));
});
