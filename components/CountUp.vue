<template>
  <span ref="root">{{ display }}</span>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  end: { type: Number, required: true },
  start: { type: Number, default: 0 },
  duration: { type: Number, default: 900 }, // ms
  delay: { type: Number, default: 0 }, // ms
  decimals: { type: Number, default: 0 },
  prefix: { type: String, default: "" },
  suffix: { type: String, default: "" },
  once: { type: Boolean, default: true },
});

const root = ref(null);
const started = ref(false);
const value = ref(props.start);

let rafId = null;
let observer = null;

const display = computed(() => {
  const v =
    props.decimals > 0 ? value.value.toFixed(props.decimals) : Math.round(value.value).toString();
  return `${props.prefix}${v}${props.suffix}`;
});

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animate() {
  if (started.value && props.once) return;
  started.value = true;

  const from = props.start;
  const to = props.end;
  const startTime = performance.now() + props.delay;

  const tick = (now) => {
    const t = (now - startTime) / props.duration;

    if (t <= 0) {
      rafId = requestAnimationFrame(tick);
      return;
    }

    const p = Math.min(1, t);
    value.value = from + (to - from) * easeOutCubic(p);

    if (p < 1) rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
}

onMounted(() => {
  if (!root.value) return;

  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e?.isIntersecting) {
          animate();
          if (props.once && observer) observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(root.value);
  } else {
    animate();
  }
});

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
  if (observer) observer.disconnect();
});
</script>
