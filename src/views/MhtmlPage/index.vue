<template>
  <div class="mhtml-page">
    <MhtmlViewer />
  </div>
</template>

<script>
import MhtmlViewer from '@/views/MhtmlPage/components/MhtmlViewer/index.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    MhtmlViewer
  }
});
</script>
