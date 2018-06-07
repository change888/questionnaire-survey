<template>
  <div class="nas-page-content">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'NasPageContent'
}
</script>

<style>
  .nas-page-content{
    padding: 20px;
    min-height: 600px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
