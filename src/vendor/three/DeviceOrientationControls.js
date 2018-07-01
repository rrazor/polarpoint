import {Vector3} from 'three/src/math/Vector3.js';
import {Euler} from 'three/src/math/Euler.js';
import {Quaternion} from 'three/src/math/Quaternion.js';
import {_Math} from 'three/src/math/Math.js';

/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 * @author rrazor / http://github.com/rrazor
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

var DeviceOrientationControls = function (object) {
  var scope = this;

  this.object = object;
  this.object.rotation.reorder('YXZ');

  this.enabled = true;

  this.deviceOrientation = {};
  this.screenOrientation = 0;

  this.alphaOffset = 0; // radians

  this.effectiveAlpha = 0;

  var onDeviceOrientationChangeEvent = function (event) {
    scope.deviceOrientation = {
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma
    };
  };

  var onScreenOrientationChangeEvent = function () {
    scope.screenOrientation = window.orientation || 0;
  };

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

  var setObjectQuaternion = (function () {
    var zee = new Vector3(0, 0, 1);

    var euler = new Euler();

    var q0 = new Quaternion();

    var q1 = new Quaternion(-1 * Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

    return function (quaternion, alpha, beta, gamma, orient) {
      euler.set(beta, alpha, -1 * gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler(euler); // orient the device

      quaternion.multiply(q1); // camera looks out the back of the device, not the top

      quaternion.multiply(q0.setFromAxisAngle(zee, -1 * orient)); // adjust for screen orientation
    };
  })();

  this.connect = function () {
    onScreenOrientationChangeEvent(); // run once on load

    window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);
    window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

    scope.enabled = true;
  };

  this.disconnect = function () {
    window.removeEventListener('orientationchange', onScreenOrientationChangeEvent, false);
    window.removeEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

    scope.enabled = false;
  };

  this.update = function () {
    if (scope.enabled === false) return;

    var device = scope.deviceOrientation;

    if (device) {
      var alpha = device.alpha ? _Math.degToRad(device.alpha) + scope.alphaOffset : 0; // Z

      var beta = device.beta ? _Math.degToRad(device.beta) : 0; // X'

      var gamma = device.gamma ? _Math.degToRad(device.gamma) : 0; // Y''

      var orient = scope.screenOrientation ? _Math.degToRad(scope.screenOrientation) : 0; // O

      this.effectiveAlpha = alpha;

      setObjectQuaternion(scope.object.quaternion, alpha, beta, gamma, orient);
    }
  };

  this.dispose = function () {
    scope.disconnect();
  };

  this.connect();
};

export default DeviceOrientationControls;
