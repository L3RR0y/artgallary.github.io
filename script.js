// Функция для просмотра портфолио художника
function viewPortfolio(artistId) {
    const artist = artistsPortfolio[artistId];
    if (!artist) {
        showNotification('Портфолио художника не найдено.', 'error');
        return;
    }
    
    // Скрываем основные секции И футер
    document.getElementById('home').style.display = 'none';
    document.getElementById('gallery').style.display = 'none';
    document.querySelector('.filters').style.display = 'none';
    document.querySelector('.mission-section').style.display = 'none';
    document.querySelector('.stats-section').style.display = 'none';
    document.querySelector('.cta-section').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    
    // Скрываем анимированный фон вместо установки градиента
    document.querySelector('.parallax-bg').style.display = 'none';

        // Блокируем прокрутку body при открытом модальном окне
    document.body.style.overflow = 'hidden';
    
    // Создаем HTML для портфолио
    const portfolioHTML = `
        <div class="artist-portfolio">
            <div class="artist-header">
                <div class="artist-image">
                    <img src="${artist.portrait || `artist-${getArtistImageIndex(artistId)}.jpg`}" alt="${artist.name}">
                </div>
                <div class="artist-info">
                    <h1>${artist.name}</h1>
                    <p class="specialization">${artist.specialization}</p>
                    <p class="dates">${artist.birth} - ${artist.death}</p>
                </div>
            </div>
            
            <div class="artist-bio">
                <h2>Биография</h2>
                <p>${artist.bio}</p>
            </div>
            
            <div class="artist-works">
                <h2>Работы художника</h2>
                <div class="works-grid">
                    ${artist.works.map((work, index) => `
                        <div class="work-item" onclick="openModal('${work.image}', currentArtworks)">
                            <img src="${work.image}" alt="${work.title}">
                            <div class="work-info">
                                <h4>${work.title}</h4>
                                <p>${work.year} ${work.technique ? `, ${work.technique}` : ''}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Устанавливаем текущие работы для навигации
    currentArtworks = artist.works;
    
    // Показываем портфолио
    document.getElementById('portfolioContent').innerHTML = portfolioHTML;
    document.getElementById('portfolioContainer').style.display = 'block';
    
    // Прокручиваем наверх портфолио
    document.getElementById('portfolioContainer').scrollTop = 0;
}

// Переменные для модального окна с изображениями
let currentArtworkIndex = 0;
let currentArtworks = [];

// Открытие модального окна с изображением
function openModal(imageSrc, artworks = null) {
    if (artworks) {
        currentArtworks = artworks;
        currentArtworkIndex = artworks.findIndex(art => art.image === imageSrc);
    }
    
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    if (!modal || !modalImg) {
        console.error('Modal elements not found');
        return;
    }
    
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    modalImg.alt = currentArtworks[currentArtworkIndex]?.title || 'Artwork';
    
}

// Закрытие модального окна
function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Навигация по произведениям искусства
function navigateArtwork(direction) {
    if (!currentArtworks || currentArtworks.length === 0) return;
    
    currentArtworkIndex += direction;
    
    // Зацикливаем навигацию
    if (currentArtworkIndex < 0) {
        currentArtworkIndex = currentArtworks.length - 1;
    } else if (currentArtworkIndex >= currentArtworks.length) {
        currentArtworkIndex = 0;
    }
    
    const modalImg = document.getElementById('modalImage');
    if (modalImg && currentArtworks[currentArtworkIndex]) {
        modalImg.src = currentArtworks[currentArtworkIndex].image;
        modalImg.alt = currentArtworks[currentArtworkIndex].title || 'Artwork';
    }
}

// Закрытие модального окна при клике вне изображения
document.addEventListener('click', function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Функция для отправки сообщения в чат поддержки
function sendMessage() {
    const input = document.getElementById('messageInput');
    if (!input) return;
    
    const message = input.value.trim();
    
    if (message === '') return;
    
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    // Добавляем сообщение пользователя
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message';
    userMessageDiv.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(userMessageDiv);
    
    // Очищаем поле ввода
    input.value = '';
    
    // Прокручиваем чат вниз
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Имитируем ответ бота
    setTimeout(() => {
        const botResponse = getBotResponse(message);
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'message bot-message';
        botMessageDiv.innerHTML = `<p>${botResponse}</p>`;
        chatMessages.appendChild(botMessageDiv);
        
        // Прокручиваем чат вниз
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// Плавная прокрутка к якорям
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Функция для сохранения портфолио
function savePortfolio(event) {
    if (event) event.preventDefault();
    
    // Получаем значения из формы
    const artistName = document.getElementById('artistName').value;
    const specialization = document.getElementById('artistSpecialization').value;
    const birthDate = document.getElementById('birthDate').value;
    const deathDate = document.getElementById('deathDate').value;
    const bio = document.getElementById('artistBio').value;
    const portraitFile = document.getElementById('artistPortrait').files[0];
    const artworkFiles = document.getElementById('artworks').files;
    const workDescriptions = document.getElementById('workDescriptions').value;
    
    // Валидация
    if (!artistName || !specialization || !birthDate || !bio || !portraitFile || artworkFiles.length === 0) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    if (artworkFiles.length > 9) {
        showNotification('Можно загрузить не более 9 работ', 'error');
        return;
    }
    
    // Для демонстрации просто показываем уведомление об успехе
    showNotification('Портфолио успешно создано!', 'success');
    
    // Через 2 секунды перенаправляем на главную страницу
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Функция для показа уведомлений
function showNotification(message, type) {
    const notificationContainer = document.getElementById('notificationContainer') || document.body;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notificationContainer.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Функция для предпросмотра загружаемых изображений
function initImagePreviews() {
    const portraitInput = document.getElementById('artistPortrait');
    const artworksInput = document.getElementById('artworks');
    
    if (portraitInput) {
        portraitInput.addEventListener('change', function() {
            previewImage(this, 'portrait');
        });
    }
    
    if (artworksInput) {
        artworksInput.addEventListener('change', function() {
            previewImage(this, 'artworks');
        });
    }
}

// Функция предпросмотра изображения
function previewImage(input, type) {
    if (input.files && input.files[0]) {
        let previewContainer = document.getElementById(`${type}-preview`);
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.id = `${type}-preview`;
            previewContainer.className = 'image-preview';
            input.parentNode.appendChild(previewContainer);
        } else {
            if (type === 'portrait') {
                previewContainer.innerHTML = '';
            }
        }
        
        if (type === 'artworks') {
            previewContainer.innerHTML = '';
            for (let i = 0; i < input.files.length; i++) {
                const file = input.files[i];
                createPreviewItem(file, previewContainer);
            }
        } else {
            createPreviewItem(input.files[0], previewContainer);
        }
    }
}

// Создание элемента предпросмотра
function createPreviewItem(file, container) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Preview';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '&times;';
        removeBtn.onclick = function() {
            container.removeChild(previewItem);
            // TODO: Добавить логику удаления файла из input
        };
        
        previewItem.appendChild(img);
        previewItem.appendChild(removeBtn);
        container.appendChild(previewItem);
    };
    
    reader.readAsDataURL(file);
}

// Система частиц для фона
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 100;
    const colors = ['#6c5ce7', '#a29bfe', '#fd79a8', '#00b894', '#fdcb6e'];
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(108, 92, 231, ${1 - distance/100})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 3D эффект для карточек при движении мыши
function initCardTilt() {
    const cards = document.querySelectorAll('.artist-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Фильтрация художников
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const artistCards = document.querySelectorAll('.artist-card:not(.add-new)');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            artistCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    const specialization = card.querySelector('p:nth-of-type(1)').textContent.toLowerCase();
                    // Для исторической и религиозной живописи используем частичное совпадение
                    if (filter === 'историческая' && specialization.includes('историческая')) {
                        card.style.display = 'block';
                    } else if (filter === 'религиозная' && specialization.includes('религиозная')) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = specialization.includes(filter) ? 'block' : 'none';
                    }
                }
            });
        });
    });
}

// Индикатор прогресса прокрутки
function initScrollIndicator() {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (!scrollProgress) return;
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset;
        const progress = (scrollTop / documentHeight) * 100;
        
        scrollProgress.style.width = `${progress}%`;
    });
}

// Эффект печатающегося текста для заголовка
function initTypingEffect() {
    const heroText = document.querySelector('.hero p');
    if (!heroText) return;
    
    const originalText = heroText.textContent;
    heroText.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < originalText.length) {
            heroText.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    setTimeout(typeWriter, 1000);
}

// Анимация появления при скролле
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });
    
    animatedElements.forEach(element => observer.observe(element));
}

// Прокрутка к галерее
function scrollToGallery() {
    const gallery = document.getElementById('gallery');
    if (gallery) {
        // Прокручиваем с отступом, чтобы кнопка не мешала
        const offset = 80;
        const elementPosition = gallery.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Функция для получения индекса изображения художника
function getArtistImageIndex(artistId) {
    const artistIds = Object.keys(artistsPortfolio);
    return artistIds.indexOf(artistId) + 1;
}

// Функция для закрытия портфолио
function closePortfolio() {
    document.getElementById('portfolioContainer').style.display = 'none';
    
        // Восстанавливаем прокрутку body
        document.body.style.overflow = 'auto';

    // Показываем скрытые секции И футер
    document.getElementById('home').style.display = 'block';
    document.getElementById('gallery').style.display = 'block';
    document.querySelector('.filters').style.display = 'flex';
    document.querySelector('.mission-section').style.display = 'block';
    document.querySelector('.stats-section').style.display = 'block';
    document.querySelector('.cta-section').style.display = 'block';
    document.querySelector('footer').style.display = 'block';
    
    // Восстанавливаем анимированный фон
    document.querySelector('.parallax-bg').style.display = 'block';
    document.querySelector('.parallax-bg').style.animation = 'gradientBackground 15s ease infinite';
    
    // Прокручиваем наверх для корректного отображения
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
// Данные портфолио художников
const artistsPortfolio = {
    'ivan-khruckiy': {
        name: 'Иван Хруцкий',
        birth: '1810',
        death: '1885',
        specialization: 'Художник-живописец',
        bio: 'Иван Фомич Хруцкий — выдающийся белорусский и русский художник, мастер натюрморта и портрета. Родился в семье греко-католического священника. В 1827 году переехал в Санкт-Петербург, где учился в Императорской Академии художеств у таких мастеров, как К. П. Брюллов и А. Г. Варнек. Хруцкий прославился своими детализированными натюрмортами, которые отличались фотографической точностью и богатством красок. Его работы "Цветы и фрукты", "Плоды и дыня" стали классикой жанра. Художник мастерски передавал фактуру различных материалов — от бархатистости персиков до прозрачности стекла. В 1839 году получил звание академика живописи. В 1840-х годах вернулся на родину, где занимался церковной живописью и портретами. Его творчество оказало значительное влияние на развитие белорусской и русской живописи XIX века.',
        bgStyle: 'linear-gradient(135deg, #8e7cc3 0%, #d5a6bd 100%)',
        portrait: 'artist-1.jpg',
        works: [
            { title: 'Портрет неизвестной с цветами и фруктами', image: 'work-1-1.jpg', year: 1839, technique: 'масло, холст' },
            { title: 'Плоды и дыня', image: 'work-1-2.jpg', year: 1834, technique: 'масло, холст' },
            { title: 'В комнатах усадьбы художника И.Ф. Хруцкого "Захареничи"', image: 'work-1-3.jpg', year: 1842, technique: 'масло, холст' },
            { title: 'В комнате', image: 'work-1-4.jpg', year: 1838, technique: 'масло, холст' },
            { title: 'Портрет неизвестной с корзиной в руках', image: 'work-1-5.jpg', year: 1836, technique: 'масло, холст' },
            { title: 'Портрет мальчика', image: 'work-1-6.jpg', year: 1847, technique: 'масло, холст' },
            { title: 'Натюрморт со свечой', image: 'work-1-7.jpg', year: 1830, technique: 'масло, холст' },
            { title: 'Грибы и овощи', image: 'work-1-8.jpg', year: 1838, technique: 'масло, холст' }
        ]
    },
    'ilya-repin': {
        name: 'Илья Репин',
        birth: '1844',
        death: '1930',
        specialization: 'Художник-реалист',
        bio: 'Илья Ефимович Репин — величайший русский художник-реалист, педагог, профессор. Родился в семье военного поселенца. Учился в Петербургской академии художеств, где его талант был быстро признан. Репин создал галерею портретов современников — от Льва Толстого до Мусоргского. Его исторические полотна "Иван Грозный и сын его Иван", "Запорожцы пишут письмо турецкому султану" стали хрестоматийными. Картина "Бурлаки на Волге" вызвала общественный резонанс, показав тяжелую долю простого народа. После революции оказался в вынужденной эмиграции в Финляндии, где продолжал творить до конца жизни. Репин воспитал целую плеяду talented художников и оставил огромное творческое наследие.',
        bgStyle: 'linear-gradient(135deg, #3d85c6 0%, #96c8f5 100%)',
        portrait: 'artist-2.jpg',
        works: [
            { title: 'Бурлаки на Волге', image: 'work-2-1.jpg', year: 1873, technique: 'масло, холст' },
            { title: 'Запорожцы пишут письмо турецкому султану', image: 'work-2-2.jpg', year: 1891, technique: 'масло, холст' },
            { title: 'Не ждали', image: 'work-2-3.jpg', year: 1885, technique: 'масло, холст' },
            { title: 'Иван Грозный и сын его Иван', image: 'work-2-4.jpg', year: 1888, technique: 'масло, холст' },
            { title: 'Крестный ход в Курской губернии', image: 'work-2-5.jpg', year: 1883, technique: 'масло, холст' },
            { title: 'Портрет Мусоргского', image: 'work-2-6.jpg', year: 1881, technique: 'масло, холст' },
            { title: 'Осенний букет. Портрет Веры Репиной', image: 'work-2-7.jpg', year: 1876, technique: 'масло, холст' },
            { title: 'Садко', image: 'work-2-8.jpg', year: 1887, technique: 'масло, холст' }
        ]
    },
    'kazimir-malevich': {
        name: 'Казимир Малевич',
        birth: '1879',
        death: '1935',
        specialization: 'Супрематизм',
        bio: 'Казимир Северинович Малевич — революционер в искусстве, основатель супрематизма, одна из ключевых фигур авангарда. Родился в Киеве в польской семье. Начал заниматься живописью самостоятельно, затем учился в Москве. В 1915 году создал "Чёрный квадрат" — икону абстрактного искусства, манифест нового направления. Супрематизм Малевича основан на геометрических формах и чистых цветах. Его теоретические работы оказали огромное влияние на развитие современного искусства. Преподавал, был директором института художественной культуры. В поздний период вернулся к фигуративной живописи. Творчество Малевича остается предметом изучения и восхищения во всем мире.',
        bgStyle: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
        portrait: 'artist-3.jpg',
        works: [
            { title: 'Чёрный квадрат', image: 'work-3-1.jpg', year: 1915, technique: 'масло, холст' },
            { title: 'Белое на белом', image: 'work-3-2.jpg', year: 1923, technique: 'масло, холст' },
            { title: 'Красный квадрат', image: 'work-3-3.jpg', year: 1923, technique: 'масло, холст' },
            { title: 'Супрематизм, Беспредметная композиция', image: 'work-3-4.jpg', year: 1916, technique: 'масло, холст' },
            { title: 'Супрематическая композиция: полет аэроплана', image: 'work-3-5.jpg', year: 1918, technique: 'масло, холст' },
            { title: 'Супрематизм', image: 'work-3-6.jpg', year: 1915, technique: 'масло, холст' },
            { title: 'Автопортрет', image: 'work-3-7.jpg', year: 1932, technique: 'масло, холст' },
            { title: 'Супрематизм: Автопортрет в двух измерениях', image: 'work-3-8.jpg', year: 1916, technique: 'масло, холст' }
        ]
    },
    'viktor-vasnetsov': {
        name: 'Виктор Васнецов',
        birth: '1848',
        death: '1926',
        specialization: 'Историческая живопись',
        bio: 'Виктор Михайлович Васнецов — мастер исторической и фольклорной живописи. Родился в семье священника. Учился в Петербургской академии художеств. Создал галерею образов русских сказок и былин: "Алёнушка", "Богатыри", "Иван-царевич на Сером Волке". Его работы пронизаны духом древней Руси, национальным колоритом. Васнецов также занимался церковной живописью — расписывал Владимирский собор в Киеве. Его творчество стало мостом между народным искусством и профессиональной живописью. Васнецов внес огромный вклад в развитие русского модерна.',
        bgStyle: 'linear-gradient(135deg, #8b4513 0%, #d2691e 100%)',
        portrait: 'artist-4.jpg',
        works: [
            { title: 'Три богатыря', image: 'work-4-1.jpg', year: 1898, technique: 'масло, холст' },
            { title: 'Алёнушка', image: 'work-4-2.jpg', year: 1881, technique: 'масло, холст' },
            { title: 'Иван-царевич на Сером Волке', image: 'work-4-3.jpg', year: 1882, technique: 'масло, холст' },
            { title: 'Витязь на распутье', image: 'work-4-4.jpg', year: 1889, technique: 'масло, холст' },
            { title: 'Кащей Бессмертный', image: 'work-4-5.jpg', year: 1880, technique: 'масло, холст' },
            { title: 'Царевна-лягушка', image: 'work-4-6.jpg', year: 1880, technique: 'масло, холст' },
            { title: 'Баян', image: 'work-4-7.jpg', year: 1897, technique: 'масло, холст' },
            { title: 'Снегурочка', image: 'work-4-8.jpg', year: 1896, technique: 'масло, холст' }
        ]
    },
    'aleksey-savrasov': {
        name: 'Алексей Саврасов',
        birth: '1830',
        death: '1897',
        specialization: 'Пейзажист',
        bio: 'Алексей Кондратьевич Саврасов — основоположник лирического пейзажа в русской живописи. Родился в купеческой семье. Учился в Московском училище живописи, ваяния и зодчества. Его картина "Грачи прилетели" стала символом русской весны. Саврасов первым показал поэзию в обыденных сельских пейзажах. Его работы отличаются тонким лиризмом и эмоциональностью. Преподавал в МУЖВЗ, воспитал многих talented пейзажистов. Несмотря на тяжелую жизнь и проблемы с алкоголем, оставил богатое творческое наследие.',
        bgStyle: 'linear-gradient(135deg, #87ceeb 0%, #b0e0e6 100%)',
        portrait: 'artist-5.jpg',
        works: [
            { title: 'Грачи прилетели', image: 'work-5-1.jpg', year: 1871, technique: 'масло, холст' },
            { title: 'Ивы у пруда', image: 'work-5-2.jpg', year: 1873, technique: 'масло, холст' },
            { title: 'Радуга', image: 'work-5-3.jpg', year: 1875, technique: 'масло, холст' },
            { title: 'Закат над болотом', image: 'work-5-4.jpg', year: 1851, technique: 'масло, холст' },
            { title: 'Лосиный остров в Сокольниках', image: 'work-5-5.jpg', year: 1869, technique: 'масло, холст' },
            { title: 'Зима', image: 'work-5-6.jpg', year: 1870, technique: 'масло, холст' },
            { title: 'Весна', image: 'work-5-7.jpg', year: 1883, technique: 'масло, холст' },
            { title: 'Рожь', image: 'work-5-8.jpg', year: 1881, technique: 'масло, холст' }
        ]
    },
    'mikhail-vrubel': {
        name: 'Михаил Врубель',
        birth: '1856',
        death: '1910',
        specialization: 'Символизм',
        bio: 'Михаил Александрович Врубель — гениальный художник-символист. Родился в семье военного юриста. Окончил Петербургский университет, затем Академию художеств. Создал уникальный стиль с кристаллическими формами и мерцающими красками. Его "Демон" стал символом эпохи Серебряного века. Врубель работал в разных техниках — от монументальной живописи до театральных декораций. Трагически закончил жизнь в психиатрической лечебнице, но оставил неизгладимый след в русском искусстве.',
        bgStyle: 'linear-gradient(135deg, #4a154b 0%, #6a0dad 100%)',
        portrait: 'artist-6.jpg',
        works: [
            { title: 'Демон сидящий', image: 'work-6-1.jpg', year: 1890, technique: 'масло, холст' },
            { title: 'Демон поверженный', image: 'work-6-2.jpg', year: 1900, technique: 'масло, холст' },
            { title: 'Царевна-Лебедь', image: 'work-6-3.jpg', year: 1902, technique: 'масло, холст' },
            { title: 'Пан', image: 'work-6-4.jpg', year: 1899, technique: 'масло, холст' },
            { title: 'Голова демона', image: 'work-6-5.jpg', year: 1904, technique: 'масло, холст' },
            { title: 'Сирень', image: 'work-6-6.jpg', year: 1904, technique: 'масло, холст' },
            { title: 'Портрет Н.И. Забелы-Врубель на фоне березок', image: 'work-6-7.jpg', year: 1898, technique: 'масло, холст' },
            { title: 'Свидание Тамары и Демона', image: 'work-6-8.jpg', year: 1893, technique: 'масло, холст' }
        ]
    },
    'vasily-surikov': {
        name: 'Василий Суриков',
        birth: '1848',
        death: '1916',
        specialization: 'Историческая живопись',
        bio: 'Василий Иванович Суриков — великий мастер исторической живописи. Родился в казачьей семье в Красноярске. Учился в Петербургской академии художеств. Его монументальные полотна "Утро стрелецкой казни", "Боярыня Морозова", "Покорение Сибири Ермаком" стали эталоном исторической живописи. Суриков мастерски сочетал масштабность композиции с психологической глубиной образов. Много путешествовал по России, изучая народный быт и историю. Его творчество — это эпическая поэма о русской истории.',
        bgStyle: 'linear-gradient(135deg, #8b0000 0%, #b22222 100%)',
        portrait: 'artist-7.jpg',
        works: [
            { title: 'Утро стрелецкой казни', image: 'work-7-1.jpg', year: 1887, technique: 'масло, холст' },
            { title: 'Боярыня Морозова', image: 'work-7-2.jpg', year: 1881, technique: 'масло, холст' },
            { title: 'Переход Суворова через Альпы', image: 'work-7-3.jpg', year: 1899, technique: 'масло, холст' },
            { title: 'Покорение Сибири Ермаком', image: 'work-7-4.jpg', year: 1883, technique: 'масло, холст' },
            { title: 'Взятие снежного городка', image: 'work-7-5.jpg', year: 1895, technique: 'масло, холст' },
            { title: 'Меншиков в Березове', image: 'work-7-6.jpg', year: 1891, technique: 'масло, холст' },
            { title: 'Вид на Кремль зимой', image: 'work-7-7.jpg', year: 1906, technique: 'масло, холст' },
            { title: 'Степан Разин', image: 'work-7-8.jpg', year: 1912, technique: 'масло, холст' }
        ]
    },
    'alexander-ivanov': {
        name: 'Александр Иванов',
        birth: '1806',
        death: '1858',
        specialization: 'Религиозная живопись',
        bio: 'Александр Андреевич Иванов — художник-философ, создатель грандиозного полотна "Явление Христа народу". Родился в семье профессора Академии художеств. 20 лет работал над своей главной картиной, создав множество эскизов и этюдов. Жил в Италии, где изучал искусство Возрождения. Его творчество — это глубокое религиозно-философское осмысление библейских сюжетов. Не получив признания при жизни, Иванов оказал огромное влияние на развитие русской религиозной живописи.',
        bgStyle: 'linear-gradient(135deg, #daa520 0%, #f0e68c 100%)',
        portrait: 'artist-8.jpg',
        works: [
            { title: 'Явление Христа народу', image: 'work-8-1.jpg', year: 1857, technique: 'масло, холст' },
            { title: 'Авраам просит у Бога знамения', image: 'work-8-2.jpg', year: 1835, technique: 'масло, холст' },
            { title: 'Голова Иоанна Крестителя', image: 'work-8-3.jpg', year: 1834, technique: 'масло, холст' },
            { title: 'Оливы у кладбища в Альбано. Молодой месяц', image: 'work-8-4.jpg', year: 1824, technique: 'масло, холст' },
            { title: 'Хождение по водам', image: 'work-8-5.jpg', year: 1829, technique: 'масло, холст' },
            { title: 'Архангел Гавриил поражает Захарию немотой', image: 'work-8-6.jpg', year: 1840, technique: 'масло, холст' },
            { title: 'Благовещение', image: 'work-8-7.jpg', year: 1840, technique: 'акварель, бумага' },
            { title: 'Братья Иосифа находят чашу в мешке Вениамина', image: 'work-8-8.jpg', year: 1840, technique: 'акварель, бумага' }
        ]
    },
    'fedor-vasilyev': {
        name: 'Федор Васильев',
        birth: '1850',
        death: '1873',
        specialization: 'Пейзажист',
        bio: 'Фёдор Александрович Васильев — гениальный пейзажист, проживший всего 23 года. Родился в бедной семье. Самостоятельно учился живописи, пользуясь советами И. И. Шишкина. Его работы "Оттепель", "Мокрый луг" поражают эмоциональной глубиной и мастерством. Васильев обладал уникальным даром передавать настроение природы. Несмотря на молодость, создал произведения, вошедшие в золотой фонд русской живописи. Умер от туберкулеза, оставив около 100 законченных работ.',
        bgStyle: 'linear-gradient(135deg, #32cd32 0%, #98fb98 100%)',
        portrait: 'artist-9.jpg',
        works: [
            { title: 'Мокрый луг', image: 'work-9-1.jpg', year: 1871, technique: 'масло, холст' },
            { title: 'Оттепель', image: 'work-9-2.jpg', year: 1872, technique: 'масло, холст' },
            { title: 'Перед грозой', image: 'work-9-3.jpg', year: 1873, technique: 'масло, холст' },
            { title: 'В Крымских горах', image: 'work-9-4.jpg', year: 1872, technique: 'масло, холст' },
            { title: 'Деревья', image: 'work-9-5.jpg', year: 1870, technique: 'масло, холст' },
            { title: 'Дорога в берёзовом лесу', image: 'work-9-6.jpg', year: 1868, technique: 'масло, холст' },
            { title: 'Вечер', image: 'work-9-7.jpg', year: 1869, technique: 'масло, холст' },
            { title: 'После грозы', image: 'work-9-8.jpg', year: 1873, technique: 'масло, холст' }
        ]
    },
    'nikolay-rerikh': {
        name: 'Николай Рерих',
        birth: '1874',
        death: '1947',
        specialization: 'Символизм',
        bio: 'Николай Константинович Рерих — художник-философ, путешественник, общественный деятель. Родился в семье нотариуса. Учился одновременно на юридическом факультете и в Академии художеств. Создал уникальный стиль, сочетающий древнерусские традиции с современными тенденциями. Организовал грандиозную Центрально-Азиатскую экспедицию. Инициатор Пакта Рериха о защите культурных ценностей. Его гималайские пейзажи и философские полотна известны во всем мире.',
        bgStyle: 'linear-gradient(135deg, #2f4f4f 0%, #708090 100%)',
        portrait: 'artist-10.jpg',
        works: [
            { title: 'Гималаи (Голубые горы)', image: 'work-10-1.jpg', year: 1901, technique: 'масло, холст' },
            { title: 'Мощь пещер', image: 'work-10-2.jpg', year: 1916, technique: 'темпера, холст' },
            { title: 'Град обреченный', image: 'work-10-3.jpg', year: 1924, technique: 'темпера, холст' },
            { title: 'Гималаи. Утро', image: 'work-10-4.jpg', year: 1930, technique: 'темпера, холст' },
            { title: 'Конь счастья', image: 'work-10-5.jpg', year: 1932, technique: 'темпера, холст' },
            { title: 'Святой Сергий Радонежский', image: 'work-10-6.jpg', year: 1924, technique: 'темпера, холст' },
            { title: 'Звезда Героя', image: 'work-10-7.jpg', year: 1912, technique: 'масло, холст' },
            { title: 'Капли жизни', image: 'work-10-8.jpg', year: 1911, technique: 'темпера, холст' }
        ]
    },
    'igor-grabar': {
        name: 'Игорь Грабарь',
        birth: '1871',
        death: '1960',
        specialization: 'Импрессионизм',
        bio: 'Игорь Эммануилович Грабарь — художник-импрессионист, реставратор, искусствовед. Родился в семье юриста. Учился в Петербургской академии художеств, затем в Мюнхене. Его "Февральская лазурь" и "Мартовский снег" — шедевры русского импрессионизма. Грабарь мастерски передавал игру света и цвета. После революции возглавил реставрационные мастерские, спас множество памятников искусства. Автор фундаментальной "Истории русского искусства".',
        bgStyle: 'linear-gradient(135deg, #ffd700 0%, #fffacd 100%)',
        portrait: 'artist-11.jpg',
        works: [
            { title: 'Мартовский снег', image: 'work-11-1.jpg', year: 1904, technique: 'масло, холст' },
            { title: 'Хризантемы', image: 'work-11-2.jpg', year: 1904, technique: 'масло, холст' },
            { title: 'Февральская лазурь', image: 'work-11-3.jpg', year: 1905, technique: 'масло, холст' },
            { title: 'На озере (фрагмент)', image: 'work-11-4.jpg', year: 1907, technique: 'масло, холст' },
            { title: 'Осень', image: 'work-11-5.jpg', year: 1904, technique: 'масло, холст' },
            { title: 'Дельфиниум (фрагмент)', image: 'work-11-6.jpg', year: 1903, technique: 'масло, холст' },
            { title: 'Цветы и фрукты на рояле', image: 'work-11-7.jpg', year: 1915, technique: 'масло, холст' },
            { title: 'Иней', image: 'work-11-8.jpg', year: 1917, technique: 'масло, холст' }
        ]
    },
    'pavel-korin': {
        name: 'Павел Корин',
        birth: '1892',
        death: '1967',
        specialization: 'Монументалист',
        bio: 'Павел Дмитриевич Корин — мастер портрета и монументальной живописи. Родился в семье иконописцев. Учился у М. В. Нестерова. Его незавершенная картина "Русь уходящая" — реквием по старой России. Корин создал галерею портретов советской интеллигенции. Занимался реставрацией, спас многие шедевры во время войны. Народный художник СССР, лауреат Ленинской премии.',
        bgStyle: 'linear-gradient(135deg, #696969 0%, #a9a9a9 100%)',
        portrait: 'artist-12.jpg',
        works: [
            { title: 'Реквием (Уходящая Русь)', image: 'work-12-1.jpg', year: 1942, technique: 'масло, холст' },
            { title: 'Автопортрет', image: 'work-12-2.jpg', year: 1935, technique: 'масло, холст' },
            { title: 'Дом Кориных в Палехе со стороны огорода', image: 'work-12-3.jpg', year: 1945, technique: 'масло, холст' },
            { title: 'Александр Невский. Центральная часть триптиха «Александр Невский»', image: 'work-12-4.jpg', year: 1947, technique: 'масло, холст' },
            { title: 'Портрет маршала Жукова"', image: 'work-12-5.jpg', year: 1966, technique: 'масло, холст' },
            { title: 'Этюд для картины «Моя Родина»', image: 'work-12-6.jpg', year: 1956, technique: 'масло, холст' },
            { title: 'Портрет Н.А. Пешковой', image: 'work-12-7.jpg', year: 1930, technique: 'масло, холст' },
            { title: 'Наш дом в Палехе', image: 'work-12-8.jpg', year: 1931, technique: 'масло, холст' }
        ]
    },
    'konstantin-korovin': {
        name: 'Константин Коровин',
        birth: '1861',
        death: '1939',
        specialization: 'Импрессионизм',
        bio: 'Константин Алексеевич Коровин — яркий представитель русского импрессионизма. Родился в купеческой семье. Учился в Московском училище живописи. Его "Парижские бульвары" и северные пейзажи поражают свежестью и жизнерадостностью. Коровин также был выдающимся театральным художником — оформлял спектакли для Большого театра и Русских сезонов Дягилева. После революции эмигрировал во Францию, где продолжал творить до конца жизни.',
        bgStyle: 'linear-gradient(135deg, #ff69b4 0%, #ffb6c1 100%)',
        portrait: 'artist-13.jpg',
        works: [
            { title: 'ПСумерки в комнате', image: 'work-13-1.jpg', year: 1911, technique: 'масло, холст' },
            { title: 'Северное сияние', image: 'work-13-2.jpg', year: 1894, technique: 'масло, холст' },
            { title: 'Архангельский порт на Двине', image: 'work-13-3.jpg', year: 1890, technique: 'масло, холст' },
            { title: 'Парижское кафе', image: 'work-13-4.jpg', year: 1886, technique: 'масло, холст' },
            { title: 'Париж', image: 'work-13-5.jpg', year: 1915, technique: 'масло, холст' },
            { title: 'Театральная композиция', image: 'work-13-6.jpg', year: 1912, technique: 'масло, холст' },
            { title: 'Две дамы на террасе', image: 'work-13-7.jpg', year: 1914, technique: 'масло, холст' },
            { title: 'Лунная ночь, зима', image: 'work-13-8.jpg', year: 1887, technique: 'масло, холст' }
        ]
    },
    'mikhail-nesterov': {
        name: 'Михаил Нестеров',
        birth: '1862',
        death: '1942',
        specialization: 'Религиозная живопись',
        bio: 'Михаил Васильевич Нестеров — мастер религиозной живописи и портрета. Родился в купеческой семье. Учился в Московском училище живописи. Его "Видение отроку Варфоломею" стало символом духовных исканий Серебряного века. Нестеров создал галерею портретов выдающихся современников — от Павла Флоренского до Ивана Павлова. Его творчество — это глубокое философское осмысление русской духовности.',
        bgStyle: 'linear-gradient(135deg, #9370db 0%, #d8bfd8 100%)',
        portrait: 'artist-14.jpg',
        works: [
            { title: 'Видение отроку Варфоломею', image: 'work-14-1.jpg', year: 1890, technique: 'масло, холст' },
            { title: 'Отшельник', image: 'work-14-2.jpg', year: 1898, technique: 'масло, холст' },
            { title: 'На Волге', image: 'work-14-3.jpg', year: 1916, technique: 'масло, холст' },
            { title: 'За зельем любви', image: 'work-14-4.jpg', year: 1889, technique: 'масло, холст' },
            { title: 'Портрет дочери', image: 'work-14-5.jpg', year: 1916, technique: 'масло, холст' },
            { title: 'Портрет сына в испанском костюме', image: 'work-14-6.jpg', year: 1935, technique: 'масло, холст' },
            { title: 'Портрет жены', image: 'work-14-7.jpg', year: 1905, technique: 'масло, холст' },
            { title: 'Портрет матери', image: 'work-14-8.jpg', year: 1895, technique: 'масло, холст' }
        ]
    },
    'boris-kustodiev': {
        name: 'Борис Кустодиев',
        birth: '1878',
        death: '1927',
        specialization: 'Жанровая живопись',
        bio: 'Борис Михайлович Кустодиев — певец русской провинциальной жизни. Родился в семье преподавателя. Учился у И. Е. Репина. Его "Купчиха за чаем", "Масленица" — яркие, праздничные образы старой России. Несмотря на тяжелую болезнь (паралич нижней части тела), Кустодиев создал жизнерадостные, полные света работы. Также занимался книжной графикой и театральными декорациями.',
        bgStyle: 'linear-gradient(135deg, #ff4500 0%, #ffa07a 100%)',
        portrait: 'artist-15.jpg',
        works: [
            { title: 'Купец-сундучник', image: 'work-15-1.jpg', year: 1918, technique: 'масло, холст' },
            { title: 'Красавица', image: 'work-15-2.jpg', year: 1916, technique: 'масло, холст' },
            { title: 'Масленица', image: 'work-15-3.jpg', year: 1922, technique: 'масло, холст' },
            { title: 'Купчиха за чаем', image: 'work-15-4.jpg', year: 1915, technique: 'масло, холст' },
            { title: 'Портрет Шаляпина', image: 'work-15-5.jpg', year: 1906, technique: 'масло, холст' },
            { title: 'Портрет Ирины Кустодиевой', image: 'work-15-6.jpg', year: 1923, technique: 'масло, холст' },
            { title: 'Портрет Кирилла Кустодиева', image: 'work-15-7.jpg', year: 1920, technique: 'масло, холст' },
            { title: 'Портрет жены художника', image: 'work-15-8.jpg', year: 1907, technique: 'масло, холст' }
        ]
    },
    'robert-falk': {
        name: 'Роберт Фальк',
        birth: '1886',
        death: '1958',
        specialization: 'Постимпрессионизм',
        bio: 'Роберт Рафаилович Фальк — один из основателей "Бубнового валета", мастер постимпрессионизма. Родился в еврейской семье. Учился в Москве и Париже. Его портреты и натюрморты отличаются сложным, насыщенным колоритом. Фальк выработал уникальный стиль, сочетающий французскую школу с русской традицией. После периода забвения в 1930-е годы, вновь обрел признание в 1950-е.',
        bgStyle: 'linear-gradient(135deg, #2e8b57 0%, #66cdaa 100%)',
        portrait: 'artist-16.jpg',
        works: [
            { title: 'Натюрморт со скрипкой', image: 'work-16-1.jpg', year: 1920, technique: 'масло, холст' },
            { title: 'Портрет жены', image: 'work-16-2.jpg', year: 1927, technique: 'масло, холст' },
            { title: 'Портрет сына', image: 'work-16-3.jpg', year: 1932, technique: 'масло, холст' },
            { title: 'Портрет дочери', image: 'work-16-4.jpg', year: 1916, technique: 'масло, холст' },
            { title: 'Женщина в белой повязке', image: 'work-16-5.jpg', year: 1917, technique: 'масло, холст' },
            { title: 'Автопортрет', image: 'work-16-6.jpg', year: 1950, technique: 'масло, холст' },
            { title: 'Бухта в Балаклаве', image: 'work-16-7.jpg', year: 1919, technique: 'масло, холст' },
            { title: 'Натюрморт с фикусом', image: 'work-16-8.jpg', year: 1957, technique: 'масло, холст' }
        ]
    },
    'isaac-levitan': {
        name: 'Исаак Левитан',
        birth: '1860',
        death: '1900',
        specialization: 'Пейзажист',
        bio: 'Исаак Ильич Левитан — великий мастер лирического пейзажа. Родился в бедной еврейской семье. Учился в Московском училище живописи. Его "Вечерний звон", "Над вечным покоем", "Золотая осень" стали символами русской природы. Левитан обладал уникальным даром передавать настроение в пейзаже. Несмотря на короткую жизнь, создал около 1000 работ, оказав огромное влияние на развитие русской пейзажной живописи.',
        bgStyle: 'linear-gradient(135deg, #87CEEB 0%, #E0F7FA 100%)',
        portrait: 'artist-17.jpg',
        works: [
            { title: 'Солнечный день. Весна', image: 'work-17-1.jpg', year: 1894, technique: 'масло, холст' },
            { title: 'Вечер', image: 'work-17-2.jpg', year: 1895, technique: 'масло, холст' },
            { title: 'Деревня. Зима', image: 'work-17-3.jpg', year: 1895, technique: 'масло, холст' },
            { title: 'Вечер после дождя', image: 'work-17-4.jpg', year: 1892, technique: 'масло, холст' },
            { title: 'Осенний день. Сокольники', image: 'work-17-5.jpg', year: 1892, technique: 'масло, холст' },
            { title: 'Перед грозой', image: 'work-17-6.jpg', year: 1889, technique: 'масло, холст' },
            { title: 'Ветряные мельницы. Поздние сумерки', image: 'work-17-7.jpg', year: 1900, technique: 'масло, холст' },
            { title: 'Дорога в лесу', image: 'work-17-8.jpg', year: 1890, technique: 'масло, холст' }
        ]
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initParticles();
    initCardTilt();
    initFilters();
    initScrollIndicator();
    initTypingEffect();
    initScrollAnimations();
    initSmoothScroll();
    initImagePreviews();
    // В конец функции init
    initCounters(); // Добавляем инициализацию счетчиков
    // Обработка формы создания портфолио
    const portfolioForm = document.getElementById('portfolioForm');
    if (portfolioForm) {
        portfolioForm.addEventListener('submit', savePortfolio);
    }
    
    // Инициализация кнопки закрытия портфолио
    const closeBtn = document.getElementById('closePortfolio');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePortfolio);
    }
    
    // Установка дат
    const birthDateInput = document.getElementById('birthDate');
    const deathDateInput = document.getElementById('deathDate');
    
    if (birthDateInput) {
        const today = new Date().toISOString().split('T')[0];
        birthDateInput.max = today;
    }
    
    if (deathDateInput) {
        const today = new Date().toISOString().split('T')[0];
        deathDateInput.max = today;
        
        if (birthDateInput) {
            birthDateInput.addEventListener('change', function() {
                deathDateInput.min = this.value;
            });
        }
    }
    // Добавьте в обработчик DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...
    
    // Делаем scroll-hint кликабельным
    const scrollHint = document.querySelector('.hero-scroll-hint');
    if (scrollHint) {
        scrollHint.style.cursor = 'pointer';
        scrollHint.addEventListener('click', function() {
            scrollToGallery();
        });
    }
    
    // Добавляем анимацию для привлечения внимания
    setInterval(() => {
        if (scrollHint) {
            scrollHint.style.transform = 'translateX(-50%) scale(1.1)';
            setTimeout(() => {
                scrollHint.style.transform = 'translateX(-50%)';
            }, 500);
        }
    }, 3000);
});
    
    // Привязка функции viewPortfolio к карточкам
    document.querySelectorAll('.artist-card:not(.add-new)').forEach(card => {
        card.addEventListener('click', function() {
            const artistId = this.getAttribute('data-artist-id');
            if (artistId) {
                viewPortfolio(artistId);
            }
        });
    });
});

// Закрытие модального окна с помощью ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('imageModal');
        if (modal && modal.style.display === 'block') {
            closeModal();
        }
        if (document.getElementById('portfolioContainer')?.style.display === 'block') {
            closePortfolio();
        }
    }
});

// Адаптивность для мобильных устройств
function checkMobile() {
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}

window.addEventListener('resize', checkMobile);
checkMobile();

// Анимация счетчиков статистики
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}
// Добавьте эту функцию
function initScrollHint() {
    const scrollHint = document.querySelector('.hero-scroll-hint');
    if (!scrollHint) return;
    
    // Убедимся, что кнопка кликабельна
    scrollHint.addEventListener('click', function(e) {
        e.stopPropagation();
        scrollToGallery();
    });
    
    // Добавим дополнительную анимацию привлекательности
    setInterval(() => {
        scrollHint.style.transform = 'scale(1.15)';
        setTimeout(() => {
            if (!scrollHint.matches(':hover')) {
                scrollHint.style.transform = 'scale(1)';
            }
        }, 600);
    }, 4000);
}

// Вызовите в DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...
    initScrollHint();
});
// Система хранения и управления счетчиком художников
const ARTISTS_COUNT_KEY = 'artPulse_artists_count';

// Функция для получения текущего количества художников
function getArtistsCount() {
    const savedCount = localStorage.getItem(ARTISTS_COUNT_KEY);
    return savedCount ? parseInt(savedCount) : 17;
}

// Функция для сохранения портрета с правильным именем
async function saveArtistPortrait(file) {
    return new Promise((resolve, reject) => {
        const newCount = getArtistsCount() + 1;
        const fileName = `artist-${newCount}.jpg`;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            // Создаем временную ссылку для скачивания
            const link = document.createElement('a');
            link.href = e.target.result;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            resolve(fileName);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Обновите функцию savePortfolio
async function savePortfolio(event) {
    if (event) event.preventDefault();
    
    // Получаем значения из формы
    const artistName = document.getElementById('artistName').value;
    const specialization = document.getElementById('artistSpecialization').value;
    const birthDate = document.getElementById('birthDate').value;
    const deathDate = document.getElementById('deathDate').value;
    const bio = document.getElementById('artistBio').value;
    const portraitFile = document.getElementById('artistPortrait').files[0];
    const artworkFiles = document.getElementById('artworks').files;
    const workDescriptions = document.getElementById('workDescriptions').value;
    
    // Валидация
    if (!artistName || !specialization || !birthDate || !bio || !portraitFile || artworkFiles.length === 0) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    if (artworkFiles.length > 9) {
        showNotification('Можно загрузить не более 9 работ', 'error');
        return;
    }
    
    try {
        // Сохраняем портрет с правильным именем
        const portraitFileName = await saveArtistPortrait(portraitFile);
        
        // Увеличиваем счетчик
        const newCount = getArtistsCount() + 1;
        localStorage.setItem(ARTISTS_COUNT_KEY, newCount.toString());
        
        showNotification(`Портфолио успешно создано! Портрет сохранен как: ${portraitFileName}`, 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } catch (error) {
        showNotification('Ошибка при сохранении портрета: ' + error.message, 'error');
    }
}

// Обновите функцию initCounters
function initCounters() {
    // Обновляем актуальное значение
    const currentCount = getArtistsCount();
    const counterElement = document.getElementById('artists-count');
    if (counterElement) {
        counterElement.setAttribute('data-target', currentCount);
    }
    
    // Затем запускаем обычную анимацию
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...
    updateArtistsCount(); // Обновляем счетчик при загрузке
});
