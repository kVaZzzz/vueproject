<template>
  <div class="app-container">
    <div class="content">
      <!-- Основной контент вашего приложения -->
      <router-view></router-view>
    </div>
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Автошкола. Все права защищены.</p>
        <nav class="footer-nav">
          <router-link to="/about">О нас</router-link>
          <router-link to="/courses">Курсы</router-link>
          <router-link to="/contact">Контакты</router-link>
          <router-link to="/privacy">Политика конфиденциальности</router-link>
        </nav>
        <div class="contact-info">
          <p>Телефон: +7 (123) 456-78-90</p>
          <p>Email: info@avtoschool.ru</p>
        </div>
        <div class="social-media">
          <a href="#" target="_blank">Facebook</a>
          <a href="#" target="_blank">Instagram</a>
          <a href="#" target="_blank">VK</a>
        </div>
      </div>
    </footer>
  </div>
</template>
<style scoped>
html, body {
  height: 100%; /* Устанавливаем высоту для html и body */
  margin: 0; /* Убираем отступы */
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Минимальная высота контейнера равна высоте окна */
}

.content {
  flex: 1; /* Позволяет контенту занимать оставшееся пространство */
}

.footer {
  background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(32,5,45,1) 98%, rgba(0,212,255,1) 100%);
  color: white;
  padding: 20px 0; /* Отступы сверху и снизу */
}

.footer-content {
  max-width: 1200px; /* Максимальная ширина содержимого */
  margin: 0 auto; /* Центрируем содержимое */
  text-align: center; /* Центрируем текст */
}

.footer-nav {
  margin: 10px 0; /* Отступы для навигации */
  display: flex;
  justify-content: center;
}
.footer-nav a{
  margin-right: 15px;
  color: white;
  text-decoration: none;
}


.footer-nav router-link {
  color: white;
  text-decoration: none;
  margin: 0 15px; /* Отступы между ссылками */
}

.footer-nav router-link:hover {
  text-decoration: underline; /* Подчеркивание при наведении */
}

.contact-info {
  margin: 10px 0; /* Отступы для контактной информации */
}

.social-media {
  margin-top: 10px; /* Отступ сверху для социальных медиа */
}

.social-media a {
  color: white;
  text-decoration: none;
  margin: 0 10px; /* Отступы между ссылками */
}

.social-media a:hover {
  text-decoration: underline; /* Подчеркивание при наведении */
}
</style>
