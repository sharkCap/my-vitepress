<template>
    <div class="pagehello">
        我是vue页面
        <button @click="clickHandle">按钮</button>
    </div>
</template>
<script lang="ts" setup>
const clickHandle = () => {
    console.log('====clickHandle')
}
</script>
<style>
.pagehello {
    width: 400x;
    height: 400px;
    background: cadetblue;
    color: #fff;
}
</style>
