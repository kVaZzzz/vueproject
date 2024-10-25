<template>
  <div class="dashboard">
    <h2>Личный кабинет студента</h2>

    <h3>Ваш прогресс обучения:</h3>
    <ul v-if="progress.length">
      <li v-for="item in progress" :key="item.id">{{ item.title }} - {{ item.status }}</li>
    </ul>
    <p v-else>Нет данных о прогрессе.</p>

    <h3>Уведомления:</h3>
    <ul v-if="notifications.length">
      <li v-for="note in notifications" :key="note.id">{{ note.message }}</li>
    </ul>
    <p v-else>Нет уведомлений.</p>

    <h3>Документы:</h3>
    <ul v-if="documents.length">
      <li v-for="doc in documents" :key="doc.id"><a :href="doc.link">{{ doc.name }}</a></li>
    </ul>
    <p v-else>Нет доступных документов.</p>

  </div></template>

<script>
export default {
  data() {
    return {
      progress: [
        { id: '1', title: 'Занятие по вождению', status: 'Пройдено' },
        { id: '2', title: 'Тест по теории', status: 'Не пройдено' },
      ],
      notifications: [
        { id: '1', message: 'Следующее занятие - понедельник в 10 утра.' },
      ],
      documents: [
        { id: '1', name: 'Договор', link: '#' },
        { id: '2', name: 'Квитанция об оплате', link: '#' },
      ],
    };
  },
};
</script>

<style scoped>
.dashboard {
  max-width:600px;
  margin:auto;
}

.dashboard h3 {
  margin-top:.5rem;
}

.dashboard ul {
  list-style-type:none;
  padding-left:.5rem;
}

.dashboard a {
  color:#007bff;
  text-decoration:none;
}

.dashboard a:hover {
  text-decoration:none;
}
</style>
