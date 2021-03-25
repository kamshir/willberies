const mySwiper = new Swiper('.swiper-container', {
	loop: true,
	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// buttons

const buttonCart = document.querySelector('.button-cart')
const modalCart = document.querySelector('#modal-cart')
const modalClose = document.querySelector('.modal-close')

// Открываем окно
const openModal = () => {
	modalCart.classList.add('show')
}

// Закрываем окно
const closeModal = event => {
	const target = event.target;
	modalCart.classList.remove('show')
}

// scroll smooth

(function(){
	const scrollLinks = document.querySelectorAll('a.scroll-link')

	for (const scrollLink of scrollLinks){
		scrollLink.addEventListener('click', event => {
			event.preventDefault()
			const id = scrollLink.getAttribute('href')
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		});
	}
})()

// При клике по кнопке корзины - открываем окно с корзиной
buttonCart.addEventListener('click', openModal)
// При клике по крестику в окне - закрываем окно с корзиной
modalClose.addEventListener('click', closeModal)

// goods

const more = document.querySelector('.more')
const navigationItem = document.querySelectorAll('.navigation-item')
const longGoodsList = document.querySelector('.long-goods-list')

const getGoods = async function () {
	const result = await fetch('db/db.json');
	if (!result.ok){
		throw 'Ошибка: ' + result.status;
	}
	return await result.json();
}

const createCard = function(objCard) {
	const card = document.createElement('div')
	card.className = 'col-lg-3 col-sm-6';

	// Получаем данные товара
	const {label, name, img, description, id, price} = objCard;

	card.innerHTML = `
		<div class="goods-card">
			${label ? 
				`<span class="label">${label}</span>` :
				''
			}
			<img src="db/${img}" alt="${name}" class="goods-image">
			<h3 class="goods-title">${name}</h3>
			<p class="goods-description">${description}</p>
			<button class="button goods-card-btn add-to-cart" data-id="${id}">
				<span class="button-price">$${price}</span>
			</button>
		</div>
	`;

	return card;
}

// Появление карточек
const renderCards = function(data) {
	longGoodsList.textContent = ''; // Очистка всех товаров
	const cards = data.map(createCard)
	longGoodsList.append(...cards) // Добавляем в массив
	document.body.classList.add('show-goods')
}

more.addEventListener('click', event => {
	event.preventDefault()
	more.scrollIntoView({
		behavior: 'smooth',
		block: 'start',
	})
	getGoods().then(renderCards)
})

const filterCards = function(field, value) {
	getGoods()
		.then(data => {
			const filterGoods = data.filter(good => {
				return good[field] === value
			})
			return filterGoods
		})
		.then(renderCards)
}

// buttons

const all = document.getElementById("all")
all.addEventListener('click', event => {
	event.preventDefault()
	all.scrollIntoView({
		behavior: 'smooth',
		block: 'start',
	})
	getGoods().then(renderCards)
})

// Аксессуары
const acsessories = document.querySelector('.acsessories')
acsessories.addEventListener('click', event => {
	event.preventDefault()
	filterCards("Accessories", "Womens")
})

// Одежда
const closes = document.querySelector('.closes')
closes.addEventListener('click', event => {
	event.preventDefault()
	filterCards("Clothing", "Mens")
})