uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uProgress;
uniform vec2 uPoints;
uniform vec2 uAcceleration;
uniform float uTime;

varying vec2 vUv;
varying vec2 vUv1;

vec2 mirrored(vec2 v) {
    vec2 m = mod(v, 2.0);

    return mix(m, 2.0 - m, step(1.0, m));
}

float three(float t) {
    return mix(t, 1.0 - t, step(0.5, t));
}

void main() {
    vec2 uv = gl_FragCoord.xy / uPoints.xy;

    float progress = fract(uProgress);

    float delayValue = progress * 7.0 - uv.y * 2.0 + uv.x - 2.0;
    delayValue = clamp(delayValue, 0.0, 1.0);

    vec2 translateValue = progress + delayValue * uAcceleration;

    vec2 translateValue1 = vec2(-0.5, 1.0) * translateValue;
    vec2 translateValue2 = vec2(-0.5, 1.0) * (translateValue - 1.0 - uAcceleration);

    vec2 wave = sin(sin(uTime) * vec2(0.0, 0.3) + vUv.yx * vec2(0.0, 4.0)) * vec2(0.0, 0.5);
    vec2 distortion = wave * (three(progress) * 0.5 + three(delayValue) * 0.5);

    vec2 uv1 = vUv1 + translateValue1 + distortion;
    vec2 uv2 = vUv1 + translateValue2 + distortion;

    vec4 textureColor1 = texture2D(uTexture1, mirrored(uv1));
    vec4 textureColor2 = texture2D(uTexture2, mirrored(uv2));

    // vec4 textureColor1 = texture2D(uTexture1, vUv1);
    // vec4 textureColor2 = texture2D(uTexture2, vUv1);

    // vec4 textureColor = mix(textureColor2, textureColor1, uProgress);
    vec4 textureColor = mix(textureColor1, textureColor2, delayValue);

    // vec4 textureColor = texture2D(uTexture2, vUv);
    // vec4 textureColor = vec4(r, g, b, 1.0);

    gl_FragColor = textureColor;
    // gl_FragColor = vec4(delayValue);
}