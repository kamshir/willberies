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
const modal = document.querySelector('.overlay')
const more = document.querySelector('.more')
const navigationLink = document.querySelectorAll('.navigation-link')
const longGoodsList = document.querySelector('.long-goods-list')
const cartTableGoods = document.querySelector('.cart-table__goods')
const cartTableTotal = document.querySelector('.card-table__total')
const buttonTextCartCount = document.querySelector('.cart-count')
const clearCart = document.querySelector('.btn-clear')

const getGoods = async function () {
	const result = await fetch('db/db.json');
	if (!result.ok){
		throw 'Ошибка: ' + result.status;
	}
	return await result.json();
}

const cart = {
	cartGoods: [],

	renderCart(){
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({id, name, price, count}) => {
			const trGood = document.createElement('tr')
			trGood.className = 'cart-item';
			trGood.dataset.id = id;

			trGood.innerHTML = `
				<td>${name}</td>
				<td>${price}</td>
				<td><button class="cart-btn-minus">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus">+</button></td>
				<td>${price * count}</td>
				<td><button class="cart-btn-delete">x</button></td>
			`;
			cartTableGoods.append(trGood)
		})

		const totalPrice = this.cartGoods.reduce((sum, item) => {
			return sum + item.price * item.count;
		}, 0)

		cartTableTotal.textContent = totalPrice + '$';
		this.totalCount()
	},

	deleteGood(id) {
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart()
	},

	minusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				if (item.count <= 1) {
					this.deleteGood(id)
				} else {
					item.count--;
				}
				break;
			}
		}
		this.renderCart()
	},

	plusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				item.count++;
				break;
			}
		}
		this.renderCart()
	},

	addCartGoods(id) {
		const goodItem = this.cartGoods.find(item => item.id === id);
		if (goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({id, name, price}) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1
					});
				});
		}
	},

	totalCount() {
		const totalCount = this.cartGoods.reduce((count, item) => {
			return count + item.count;
		}, 0);
		buttonTextCartCount.textContent = totalCount;
	},

	clearCart() {
		this.cartGoods = []
		this.renderCart()
	}
}

document.body.addEventListener('click', event => {
	const addToCart = event.target.closest('.add-to-cart')

	if (addToCart){
		cart.addCartGoods(addToCart.dataset.id)
	}
})

cartTableGoods.addEventListener('click', event => {
	const target = event.target;

	if (target.tagName === "BUTTON") {
		const id = target.closest('.cart-item').dataset.id;

		if (target.classList.contains('cart-btn-delete')){
			cart.deleteGood(id);
		}
		if (target.classList.contains('cart-btn-minus')){
			cart.minusGood(id);
		}
		if (target.classList.contains('cart-btn-plus')){
			cart.plusGood(id);
		}
	}
})

// Открываем окно
const openModal = () => {
	modalCart.classList.add('show')
}

// Закрываем окно
const closeModal = event => {
	const target = event.target;
	if (target.classList.contains('modal-close') || target.classList.contains('overlay')){
		modalCart.classList.remove('show')
	}
}

// scroll smooth

{
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
}

// При клике по кнопке корзины - открываем окно с корзиной
buttonCart.addEventListener('click', openModal)
// При клике по крестику в окне - закрываем окно с корзиной
modal.addEventListener('click', closeModal)

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

clearCart.addEventListener('click', event => {
	event.preventDefault()
	cart.clearCart()
})

const filterCards = function(field, value) {
	getGoods()
		.then(data => data.filter(good => good[field] === value))
		.then(renderCards)
}

// buttons
navigationLink.forEach(link => {
	link.addEventListener('click', event => {
		event.preventDefault()
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value)
	})
});