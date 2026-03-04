import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';

function App() {
  const form = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);

  // ✅ ДЛЯ VITE: используем import.meta.env
  const EMAILJS_CONFIG = {
    serviceId: import.meta.env.REACT_APP_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.REACT_APP_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.REACT_APP_EMAILJS_PUBLIC_KEY
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(currentProgress);

      const sections = ['home', 'about', 'services', 'portfolio', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Проверка EmailJS при загрузке
  useEffect(() => {
    console.log('✅ EmailJS конфигурация:');
    console.log('Service ID:', EMAILJS_CONFIG.serviceId);
    console.log('Template ID:', EMAILJS_CONFIG.templateId);
    console.log('Public Key:', EMAILJS_CONFIG.publicKey);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Валидация полей
    if (!formData.name.trim()) {
      setErrorMessage('Пожалуйста, введите ваше имя');
      setIsLoading(false);
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Пожалуйста, введите ваш email');
      setIsLoading(false);
      return;
    }
    if (!formData.email.includes('@')) {
      setErrorMessage('Пожалуйста, введите корректный email');
      setIsLoading(false);
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Пожалуйста, введите ваш телефон');
      setIsLoading(false);
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Пожалуйста, опишите ваш проект');
      setIsLoading(false);
      return;
    }

    console.log('📤 Отправка формы...');
    console.log('Service ID:', EMAILJS_CONFIG.serviceId);
    console.log('Template ID:', EMAILJS_CONFIG.templateId);
    console.log('Данные:', formData);

    // Параметры для отправки
    const templateParams = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company || 'не указана',
      message: formData.message
    };

    // Отправка через EmailJS
    emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    )
    .then((result) => {
      console.log('✅ Успех!', result);
      setIsLoading(false);
      setIsSubmitted(true);
      
      // Очистка формы через 5 секунд
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ 
          name: '', 
          email: '', 
          phone: '', 
          company: '', 
          message: '' 
        });
      }, 5000);
    })
    .catch((error) => {
      console.error('❌ Ошибка:', error);
      setIsLoading(false);
      
      // Понятные сообщения об ошибках
      if (error.status === 400) {
        setErrorMessage('Ошибка в настройках EmailJS. Проверьте Service ID и Template ID');
      } else if (error.status === 401) {
        setErrorMessage('Ошибка авторизации. Проверьте Public Key');
      } else if (error.status === 412) {
        setErrorMessage('Ошибка подключения к Gmail. Переподключите аккаунт в EmailJS');
      } else {
        setErrorMessage('Не удалось отправить сообщение. Пожалуйста, попробуйте позже');
      }
    });
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  const projects = [
    { id: 1, title: 'Интернет-магазин "ТехноМарт"', category: 'E-commerce', image: '🛍️', description: 'Полноценный интернет-магазин с корзиной и оплатой' },
    { id: 2, title: 'Банковское приложение "Финанс"', category: 'FinTech', image: '🏦', description: 'Мобильное приложение для управления финансами' },
    { id: 3, title: 'CRM система "БизнесКонтроль"', category: 'CRM', image: '📊', description: 'Система управления взаимоотношениями с клиентами' },
    { id: 4, title: 'Образовательная платформа "Знания"', category: 'EdTech', image: '🎓', description: 'Платформа для онлайн-обучения с видеоуроками' },
    { id: 5, title: 'Медицинский портал "Здоровье"', category: 'MedTech', image: '🏥', description: 'Портал для записи к врачам и консультаций' },
    { id: 6, title: 'Логистическая система "Путь"', category: 'Logistics', image: '🚚', description: 'Система отслеживания и управления поставками' }
  ];

  const teamMembers = [
    { id: 1, name: 'Александр Петров', role: 'Ведущий разработчик', experience: '8 лет', image: '👨‍💻' },
    { id: 2, name: 'Елена Соколова', role: 'UI/UX дизайнер', experience: '6 лет', image: '👩‍🎨' },
    { id: 3, name: 'Дмитрий Иванов', role: 'Backend разработчик', experience: '7 лет', image: '👨‍🔧' },
    { id: 4, name: 'Анна Смирнова', role: 'Project Manager', experience: '9 лет', image: '👩‍💼' }
  ];

  return (
    <div className="app">
      {/* Прогресс бар */}
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }}></div>

      {/* Шапка */}
      <header className="header">
        <nav className="nav">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            Digital<span className="logo-highlight">Pro</span>
          </div>
          <ul className="nav-menu">
            <li className={activeSection === 'home' ? 'active' : ''}>
              <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Главная</a>
            </li>
            <li className={activeSection === 'about' ? 'active' : ''}>
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>О нас</a>
            </li>
            <li className={activeSection === 'services' ? 'active' : ''}>
              <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Услуги</a>
            </li>
            <li className={activeSection === 'portfolio' ? 'active' : ''}>
              <a href="#portfolio" onClick={(e) => { e.preventDefault(); scrollToSection('portfolio'); }}>Портфолио</a>
            </li>
            <li className={activeSection === 'contact' ? 'active' : ''}>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Контакты</a>
            </li>
          </ul>
          <button className="nav-button" onClick={() => scrollToSection('contact')}>
            Начать проект
          </button>
        </nav>
      </header>

      {/* Главная секция */}
      <section id="home" className="hero">
        <div className="hero-background">
          <div className="gradient-circle"></div>
          <div className="gradient-circle"></div>
          <div className="gradient-circle"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">🏆 Лидер цифровой трансформации 2024</div>
          <h1 className="hero-title">
            Создаем <span className="gradient-text">цифровые продукты</span><br />
            которые меняют бизнес
          </h1>
          <p className="hero-subtitle">
            Полный цикл разработки: от идеи до масштабирования. 
            Более 150 успешных проектов в различных отраслях.
          </p>
          <div className="hero-buttons">
            <button className="primary-button" onClick={() => scrollToSection('contact')}>
              Обсудить проект
              <span className="button-arrow">→</span>
            </button>
            <button className="secondary-button" onClick={() => scrollToSection('portfolio')}>
              Наши работы
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-value">8+</span>
              <span className="stat-label">Лет на рынке</span>
            </div>
            <div className="hero-stat">
              <span className="stat-value">150+</span>
              <span className="stat-label">Проектов</span>
            </div>
            <div className="hero-stat">
              <span className="stat-value">50+</span>
              <span className="stat-label">Специалистов</span>
            </div>
            <div className="hero-stat">
              <span className="stat-value">98%</span>
              <span className="stat-label">Клиентов рекомендуют</span>
            </div>
          </div>
        </div>
      </section>

      {/* О нас */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <span className="section-badge">О КОМПАНИИ</span>
              <h2 className="section-title">
                Мы создаем технологии,<br />
                <span className="gradient-text">которые работают на вас</span>
              </h2>
              <p className="about-text">
                DigitalPro — это команда энтузиастов, объединенных страстью к созданию 
                инновационных цифровых решений. Мы помогаем бизнесу расти и развиваться 
                с помощью современных технологий.
              </p>
              
              <div className="features">
                <div className="feature">
                  <div className="feature-icon">🚀</div>
                  <div className="feature-text">
                    <h4>Инновационный подход</h4>
                    <p>Используем передовые технологии и методологии разработки</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-icon">💡</div>
                  <div className="feature-text">
                    <h4>Экспертность</h4>
                    <p>Команда опытных специалистов с глубокой экспертизой</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-icon">🤝</div>
                  <div className="feature-text">
                    <h4>Прозрачность</h4>
                    <p>Открытая коммуникация и понятные процессы на всех этапах</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-stats">
              <div className="stats-card">
                <div className="stat-big">
                  <span className="stat-number">8+</span>
                  <span className="stat-text">лет опыта</span>
                </div>
                <div className="stat-big">
                  <span className="stat-number">150+</span>
                  <span className="stat-text">проектов</span>
                </div>
                <div className="stat-big">
                  <span className="stat-number">50+</span>
                  <span className="stat-text">специалистов</span>
                </div>
                <div className="stat-big">
                  <span className="stat-number">98%</span>
                  <span className="stat-text">довольных клиентов</span>
                </div>
              </div>
              
              <div className="about-quote">
                <div className="quote-icon">“</div>
                <p className="quote-text">Мы не просто пишем код — мы создаем решения, которые помогают бизнесу расти</p>
                <div className="quote-author">— Александр Петров, CEO DigitalPro</div>
              </div>
            </div>
          </div>

          {/* Команда */}
          <div className="team-section">
            <h3 className="team-title">Наша команда профессионалов</h3>
            <div className="team-grid">
              {teamMembers.map(member => (
                <div key={member.id} className="team-card">
                  <div className="member-avatar">{member.image}</div>
                  <h4 className="member-name">{member.name}</h4>
                  <p className="member-role">{member.role}</p>
                  <p className="member-experience">Опыт: {member.experience}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Услуги */}
      <section id="services" className="services">
        <div className="container">
          <div className="services-header">
            <span className="section-badge">ЧТО МЫ ПРЕДЛАГАЕМ</span>
            <h2 className="section-title">
              Комплексные решения<br />
              <span className="gradient-text">для вашего бизнеса</span>
            </h2>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="card-icon">💻</div>
              <h3>Веб-разработка</h3>
              <p>Создаем сайты любой сложности: от лендингов до корпоративных порталов и маркетплейсов</p>
              <ul className="service-features">
                <li>✓ Интернет-магазины</li>
                <li>✓ Корпоративные сайты</li>
                <li>✓ Веб-приложения</li>
                <li>✓ CRM системы</li>
              </ul>
            </div>

            <div className="service-card popular">
              <div className="popular-badge">Популярное</div>
              <div className="card-icon">📱</div>
              <h3>Мобильные приложения</h3>
              <p>Нативные и кросс-платформенные приложения для iOS и Android</p>
              <ul className="service-features">
                <li>✓ iOS приложения</li>
                <li>✓ Android приложения</li>
                <li>✓ Кросс-платформа</li>
                <li>✓ Поддержка и обновления</li>
              </ul>
            </div>

            <div className="service-card">
              <div className="card-icon">🎨</div>
              <h3>UI/UX Дизайн</h3>
              <p>Создаем удобные и красивые интерфейсы, которые нравятся пользователям</p>
              <ul className="service-features">
                <li>✓ UX исследования</li>
                <li>✓ Прототипирование</li>
                <li>✓ Визуальный дизайн</li>
                <li>✓ Анимация интерфейсов</li>
              </ul>
            </div>

            <div className="service-card">
              <div className="card-icon">📊</div>
              <h3>Бизнес автоматизация</h3>
              <p>Оптимизируем бизнес-процессы с помощью современных IT решений</p>
              <ul className="service-features">
                <li>✓ CRM интеграция</li>
                <li>✓ Битрикс24</li>
                <li>✓ 1С интеграция</li>
                <li>✓ Бизнес-аналитика</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Портфолио */}
      <section id="portfolio" className="portfolio">
        <div className="container">
          <div className="portfolio-header">
            <span className="section-badge">НАШИ РАБОТЫ</span>
            <h2 className="section-title">
              Проекты, которыми<br />
              <span className="gradient-text">мы гордимся</span>
            </h2>
          </div>

          <div className="portfolio-grid">
            {projects.map(project => (
              <div key={project.id} className="portfolio-card">
                <div className="portfolio-image">{project.image}</div>
                <div className="portfolio-content">
                  <span className="portfolio-category">{project.category}</span>
                  <h3 className="portfolio-title">{project.title}</h3>
                  <p className="portfolio-description">{project.description}</p>
                  <div className="portfolio-footer">
                    <span className="portfolio-link">Подробнее →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Контакты - с EmailJS интеграцией */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="contact-wrapper">
            {/* Левая часть с информацией */}
            <div className="contact-info">
              <span className="section-badge">КОНТАКТЫ</span>
              <h2 className="contact-title">
                Давайте 
                <span className="gradient-text"> обсудим</span>
                <br />ваш проект
              </h2>
              
              <div className="info-blocks">
                <div className="info-block">
                  <div className="info-icon">✉️</div>
                  <div className="info-content">
                    <h4>Email</h4>
                    <a href="mailto:info@digitalpro.ru">info@digitalpro.ru</a>
                    <a href="mailto:sales@digitalpro.ru">sales@digitalpro.ru</a>
                  </div>
                </div>

                <div className="info-block">
                  <div className="info-icon">🕒</div>
                  <div className="info-content">
                    <h4>Режим работы</h4>
                    <p>Пн-Пт: 9:00 - 20:00</p>
                    <p>Сб-Вс: по записи</p>
                  </div>
                </div>
              </div>

              <div className="contact-social">
                <span className="social-label">Мы в соцсетях:</span>
                <div className="social-mini">
                  <a href="#" className="social-mini-link">📘</a>
                  <a href="#" className="social-mini-link">📷</a>
                  <a href="#" className="social-mini-link">🐦</a>
                </div>
              </div>
            </div>

            {/* Правая часть с формой */}
            <div className="contact-form-block">
              <div className="form-header">
                <h3 className="form-title">Оставьте заявку</h3>
                <p className="form-subtitle">Заполните форму и мы свяжемся с вами в течение 30 минут</p>
              </div>
              
              {isSubmitted ? (
                <div className="success-mini">
                  <div className="success-mini-icon">✓</div>
                  <h4>Спасибо!</h4>
                  <p>Мы свяжемся с вами в ближайшее время</p>
                </div>
              ) : (
                <>
                  {errorMessage && (
                    <div className="error-message-mini">
                      <span className="error-icon">⚠️</span>
                      <p>{errorMessage}</p>
                    </div>
                  )}
                  
                  <form ref={form} className="mini-form" onSubmit={handleSubmit}>
                    <div className="form-row-mini">
                      <div className="input-group">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Ваше имя *"
                          required
                        />
                      </div>
                      <div className="input-group">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email *"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row-mini">
                      <div className="input-group">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Телефон *"
                          required
                        />
                      </div>
                      <div className="input-group">
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Компания (необязательно)"
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Опишите ваш проект или задачу *"
                        rows="4"
                        required
                      ></textarea>
                    </div>

                    <div className="form-footer-mini">
                      <label className="checkbox-mini">
                        <input type="checkbox" required />
                        <span>Согласен на обработку данных</span>
                      </label>
                      
                      <button type="submit" className="submit-mini" disabled={isLoading}>
                        {isLoading ? 'Отправка...' : 'Отправить'}
                        {!isLoading && <span className="arrow">→</span>}
                      </button>
                    </div>
                    
                    <p className="form-note-mini">* — обязательные поля</p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-info">
              <div className="footer-logo">
                <span className="logo-icon">⚡</span>
                Digital<span className="logo-highlight">Pro</span>
              </div>
              <p className="footer-description">
                Создаем цифровые продукты, которые помогают бизнесу расти и развиваться.
              </p>
              <div className="footer-social">
                <a href="https://t.me/digitalpro" target="_blank" rel="noopener noreferrer" className="social-link">📱</a>
                <a href="#" className="social-link">📘</a>
                <a href="#" className="social-link">📷</a>
                <a href="#" className="social-link">🐦</a>
              </div>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Компания</h4>
                <ul>
                  <li><a href="#about">О нас</a></li>
                  <li><a href="#team">Команда</a></li>
                  <li><a href="#careers">Карьера</a></li>
                  <li><a href="#blog">Блог</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Услуги</h4>
                <ul>
                  <li><a href="#services">Веб-разработка</a></li>
                  <li><a href="#services">Мобильные приложения</a></li>
                  <li><a href="#services">UI/UX дизайн</a></li>
                  <li><a href="#services">Автоматизация</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Поддержка</h4>
                <ul>
                  <li><a href="#faq">FAQ</a></li>
                  <li><a href="#docs">Документация</a></li>
                  <li><a href="#privacy">Политика конфиденциальности</a></li>
                  <li><a href="#terms">Условия использования</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 DigitalPro. Все права защищены.</p>
            <p>Сделано с ❤️ в Москве</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;