<template>
    <div class="pagehello">
        我是vue页面
        <button @click="clickHandle">按钮</button>
    </div>
</template>
<script lang="ts" setup>
const clickHandle = () => {
    console.log('====clickHandle')
    fetch('http://127.0.0.1:9969/list')
    .then((res) => res.json())
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log(err)
    })
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
