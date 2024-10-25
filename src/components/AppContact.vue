<template>
  <div class="contact">
    <h2>Контактная информация и карта проезда</h2>

    <h3>Контакты:</h3>
    <p><strong>Email:</strong> info@autoschool.com</p>
    <p><strong>Телефон:</strong> +7 (123) 456-78-90</p>
    <p><strong>Адрес:</strong> г. Москва, ул. Примерная, д.1</p>

    <h3>Форма обратной связи:</h3>
    <form @submit.prevent="sendMessage">
      <input type="text" v-model="name" placeholder="Ваше имя" required />
      <input type="email" v-model="email" placeholder="Ваш email" required />
      <textarea v-model="message" placeholder="Ваше сообщение" required></textarea>
      <button type="submit">Отправить сообщение!</button>
    </form>

    <h3 style="padding-top: 20px;">Карта проезда:</h3>
    <div class="map-placeholder">
      Здесь будет карта.
      (Используйте Google Maps API или Yandex Maps API)
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      message: '',
    };
  },
  methods: {
    sendMessage() {
      if (this.name && this.email && this.message) {
        alert(`Сообщение отправлено от ${this.name}`);
        this.name = '';
        this.email = '';
        this.message = '';
      } else {
        alert('Пожалуйста, заполните все поля.');
      }
    },
  },
};
</script>

<style scoped>
.contact {
  max-width: 600px;
  margin: auto;
}
.contact h3 {
  margin-top: 1rem;
}
.contact input,
.contact textarea {
  width: 100%;
  margin-bottom: .5rem;
}
.contact button {
  margin-top: .5rem;
}
.map-placeholder {
  width: 100%;
  height: 300px;
  background-color: #eaeaea;
}
</style>
