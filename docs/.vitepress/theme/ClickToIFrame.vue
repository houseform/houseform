<script setup>
import { ref } from "vue";

const props = defineProps(["src", "title"]);

const shouldBeOpen = ref(false);

function open() {
  shouldBeOpen.value = true;
}
</script>

<template>
  <div class="click-to-iframe-container">
    <iframe v-if="shouldBeOpen" :src="props.src" />
    <div v-if="!shouldBeOpen" class="iframe-replacement-container">
      <svg
        class="iframe-replacement-icon"
        width="158"
        height="158"
        viewBox="0 0 158 158"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M79 158C122.63 158 158 122.63 158 79C158 35.3695 122.63 0 79 0C35.3695 0 0 35.3695 0 79C0 122.63 35.3695 158 79 158ZM77.2 112.333L91.9333 97.7334C96.1333 93.5334 98.4667 87.9333 98.4667 81.9333C98.4667 75.9333 96.1333 70.3334 91.9333 66.0668C89.7333 63.9333 85.8667 63.8667 83.6667 66.0668C83.1184 66.6064 82.683 67.2499 82.3858 67.9595C82.0886 68.6691 81.9355 69.4307 81.9355 70.2001C81.9355 70.9694 82.0886 71.7311 82.3858 72.4407C82.683 73.1503 83.1184 73.7937 83.6667 74.3334C85.6667 76.4 86.8667 79 86.8667 81.9333C86.8667 84.8 85.6667 87.5334 83.6667 89.6001L69 104.2C64.9333 108.333 57.8667 108.333 53.8 104.2C52.7897 103.209 51.9872 102.026 51.4393 100.721C50.8915 99.4164 50.6093 98.0154 50.6093 96.6001C50.6093 95.1848 50.8915 93.7837 51.4393 92.4788C51.9872 91.1738 52.7897 89.9912 53.8 89L56.4667 86.2667L56.1333 85.2667C55.0667 82.3334 54.5333 79 54.6 75.6667L54.6667 71.6667L45.6667 80.7334C36.8 89.5334 36.8 103.733 45.6667 112.333C49.9333 116.8 55.6667 119 61.4 119C67.1333 119 72.8667 116.8 77.2 112.333ZM103.4 86.3334L112.333 77.2667C116.667 73 119 67.4 119 61.4C119 55.4 116.667 49.8 112.333 45.6667C110.278 43.5691 107.825 41.9027 105.118 40.7651C102.41 39.6274 99.5033 39.0415 96.5667 39.0415C93.6301 39.0415 90.723 39.6274 88.0156 40.7651C85.3083 41.9027 82.8552 43.5691 80.8 45.6667L66.0667 60.2667C61.8727 64.4688 59.5172 70.1632 59.5172 76.1001C59.5172 82.037 61.8727 87.7313 66.0667 91.9333C67.2 93.0668 68.7333 93.6001 70.2 93.6001C70.9653 93.6122 71.7253 93.4711 72.4352 93.1848C73.1451 92.8986 73.7905 92.473 74.3333 91.9333C75.4667 90.8667 76.0667 89.4 76.0667 87.8C76.0667 86.2001 75.4667 84.7334 74.3333 83.6667C72.3333 81.6001 71.1333 79 71.1333 76.0668C71.1333 73.2001 72.3333 70.4667 74.3333 68.4667L89 53.8C93 49.7334 100.133 49.6667 104.2 53.8C105.21 54.7911 106.013 55.9738 106.561 57.2788C107.109 58.5837 107.391 59.9847 107.391 61.4C107.391 62.8153 107.109 64.2164 106.561 65.5214C106.013 66.8263 105.21 68.0089 104.2 69L101.533 71.8L101.867 72.7334C102.933 75.6667 103.467 79 103.4 82.3334V86.3334Z"
          fill="var(--vp-c-bg)"
        />
      </svg>
      <p class="iframe-replacement-title">
        <span class="visually-hidden">An embedded webpage:</span
        >{{ props.title }}
      </p>
      <button class="iframe-replacement-button" @click="open()">
        Run embed
      </button>
    </div>
  </div>
</template>

<style scoped>
.click-to-iframe-container > * {
  width: 100%;
  height: 500px;
}

.click-to-iframe-container > iframe {
  border: 1px solid var(--vp-c-brand);
  border-radius: 8px;
}

.iframe-replacement-icon {
    height: 50px;
    width: 50px;
    position: absolute;
    top: 1rem;
    left: 1rem;
}

.iframe-replacement-title {
    position: absolute;
    width: calc(100% - 3rem - 50px);
    right: 1rem;
    line-height: 1rem !important;
    top: calc(.5rem + 25px);
    margin: 0 !important;
    font-weight: 500;
}

.iframe-replacement-container {
  background: var(--vp-c-brand);
  color: var(--vp-c-bg);
  border-radius: 0.5rem;
  position: relative;
  box-sizing: border-box;
}

.iframe-replacement-button {
  padding: 1rem;
  font-weight: bold;
  height: fit-content;
  background: var(--vp-c-mute-dark);
  color: var(--vp-c-brand-darker);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%) translateY(-50%);
  border-radius: 0.5rem;
}

.iframe-replacement-button:hover {
  background: var(--vp-c-mute);
}

.iframe-replacement-button:active {
  background: var(--vp-c-mute-darker);
}
</style>
