uniform vec2 uScale;

varying vec2 vUv;
varying vec2 vUv1;

void main() {
    vec2 _uv = uv - 0.5;
    vUv1 = _uv;
    vUv1 *= uScale.xy;
    vUv1 += 0.5;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = vec4(position, 1.0);
    // gl_Position = projectedPosition;

    vUv = uv;
}