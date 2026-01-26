<template>
  <div class="image-row">
    <slot />
  </div>
</template>

<style>
.image-row {
  display: flex;
  gap: 10px;
  /* flex-wrap: wrap; Removed to enforce single row */
  align-items: flex-start;
  margin: 1rem 0;
}

/* Handle images that might be wrapped in paragraphs by Markdown */
.image-row :deep(p) {
  display: contents;
  margin: 0;
}

.image-row :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 0;
  flex: 1; /* Distribute space equally */
  min-width: 0; /* Allow shrinking below intrinsic width */
  object-fit: contain;
}
</style>
