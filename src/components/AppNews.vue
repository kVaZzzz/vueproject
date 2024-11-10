<template>
  <div class="news">
    <h2>Новости автошколы</h2>
    <ul>
      <li v-for="newsItem in news" :key="newsItem.id">
        <h3>{{ newsItem.title }}</h3>
        <p>{{ newsItem.content }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      news: [
        { id: 1, title: 'Новый курс вождения', content: 'Мы запускаем новый курс вождения с 1 ноября.' },
        { id: 2, title: 'Скидки на обучение', content: 'Скидка 20% на все курсы до конца месяца!' },
      ],
    };
  },
};
</script>

<style scoped>
.news {
  max-width: 600px;
  margin: auto;
}

.news h2 {
  margin-top: 1rem;
}

.news ul {
  list-style-type: none;
  padding-left: 0;
}

.news li {
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}

.news h3 {
  margin: 0;
}

@media (max-width: 600px) {
  .news {
    padding: 15px;
  }

  .news h2 {
    font-size: 24px;
  }

  .news h3 {
    font-size: 20px;
  }

  .news li {
    padding: 8px 0;
  }
}
</style>
