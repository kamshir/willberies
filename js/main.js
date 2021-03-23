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
const modal = document.querySelector('.modal')

const openModal = () => {
	modalCart.classList.add('show')
}

const closeModal = event => {
	const target = event.target;
	if (target.classList.contains('modal-close')){
		modalCart.classList.remove('show')
	}
}

buttonCart.addEventListener('click', openModal)
modal.addEventListener('click', closeModal)

// scroll mooth
(function(){
	const scrollLinks = document.querySelectorAll('.a.scroll-link')

	for (let i = 0; i < scrollLinks.length; i++){
		scrollLinks[i].addEventListener('click', event => {
			event.preventDefault()
			const id = scrollLinks[i].getAttribute('href')
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			})
		})
	}
})()