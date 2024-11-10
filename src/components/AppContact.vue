<template>
  <div class="contact">
    <h2>Контактная информация и карта проезда</h2>

    <h3>Контакты:</h3>
    <p><strong>Email:</strong> info@autoschool.com</p>
    <p><strong>Телефон:</strong> +7 (123) 456-78-90</p>
    <p><strong>Адрес:</strong> г. Москва, ул. Примерная, д.1</p>
  </div>
</template>

<style scoped>
.contact {
  max-width: 600px;
  margin: auto;
  padding: 20px; /* Добавляем отступы для лучшего восприятия */
}

.contact h2 {
  font-size: 28px; /* Размер заголовка */
  text-align: center; /* Центрируем заголовок */
}

.contact h3 {
  margin-top: 1rem;
  font-size: 24px; /* Размер подзаголовка */
}

.contact p {
  font-size: 16px; /* Размер текста */
}

.contact input,
.contact textarea {
  width: 100%;
  margin-bottom: .5rem;
  padding: 10px; /* Добавляем внутренние отступы для удобства ввода */
  border: 1px solid #ccc;
  border-radius: 4px;
}

.contact button {
  margin-top: .5rem;
  padding: 10px; /* Добавляем внутренние отступы для кнопки */
  background-color: #007bff; /* Цвет кнопки */
  color: white; /* Цвет текста на кнопке */
  border: none;
  border-radius: 4px;
  cursor: pointer; /* Указываем, что это кнопка */
}

.contact button:hover {
  background-color: #0056b3; /* Цвет кнопки при наведении */
}

.map-placeholder {
  width: 100%;
  height: 300px;
  background-color: #eaeaea;
}

/* Адаптивные стили */
@media (max-width: 600px) {
  .contact {
    width: calc(100% - 40px);
    padding: 15px;
  }

  .contact h2 {
    font-size: 24px;
  }

  .contact h3 {
    font-size: 20px;
  }

  .contact p {
    font-size: 14px;
  }

  .contact input,
  .contact textarea,
  .contact button {
    font-size: 14px;
    padding: 8px;
  }
}
</style>
