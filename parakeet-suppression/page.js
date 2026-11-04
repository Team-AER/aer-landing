(function () {
  'use strict';
  var slider = document.getElementById('signal-amount');
  var original = document.getElementById('wave-original');
  var modified = document.getElementById('wave-modified');
  var output = document.getElementById('signal-value');
  if (!slider || !original || !modified || !output) return;
  function wave(center, amount) {
    var points = [];
    for (var x = 0; x <= 600; x += 2) {
      var envelope = Math.pow(Math.sin(Math.PI * x / 600), 1.5);
      var speech = (Math.sin(x * 0.105) * 24 + Math.sin(x * 0.047) * 17 + Math.sin(x * 0.23) * 8) * envelope;
      var change = (Math.sin(x * 0.51) * 13 + Math.sin(x * 0.79) * 7) * amount * envelope;
      points.push((x === 0 ? 'M' : 'L') + x + ' ' + (center + speech + change).toFixed(2));
    }
    return points.join(' ');
  }
  function render() {
    var amount = Number(slider.value) / 100;
    modified.setAttribute('d', wave(255, amount));
    var label = amount === 0 ? 'None' : amount < 0.4 ? 'Subtle' : amount < 0.75 ? 'Moderate' : 'Pronounced';
    output.textContent = label;
    slider.setAttribute('aria-valuetext', label + ' visual variation');
  }
  original.setAttribute('d', wave(112, 0));
  document.querySelector('.signal-control').hidden = false;
  slider.addEventListener('input', render);
  render();
})();
