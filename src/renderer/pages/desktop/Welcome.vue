<template>
  <full-parent class="all-center main" >
    <div style="text-align:center">
      <router-link to="/desktop/word_book" style="text-decoration: none">
        <img src="../../assets/word_book.png" >
      </router-link>
      <div>
        <h2 class="title">学好英语，从听懂单词开始！</h2>
      </div>
    </div>
  </full-parent>
</template>

<script>

import FullParent from "../../components/FullParent";

export default {
  name: "Welcome",
  components: {FullParent},
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped>
.category {
  display: flex;
}

.category .item {
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
  color: #67C23A;
  cursor: pointer;
}

.category .item:hover {
  transform: scale(1.1);
}


.category .item i {
  font-size: 64px;
}

.title{
  margin-top: 50px;
  color: white;
}

.main{
  background: #00d2ff; /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #00d2ff, #928dab); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #00d2ff, #928dab);
}

</style>
