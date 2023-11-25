// interface PtrSettings {
// 	mlang: string;
// 	mode: string;
// }

// interface PtrMessages {
// 	[key: string]: {
// 		pullToRefresh: string;
// 		loading: string;
// 	};
// }

// interface PtrElement {
// 	box: HTMLDivElement;
// 	container: HTMLDivElement;
// 	image: HTMLDivElement;
// 	text: HTMLDivElement;
// }

// interface Ptr {
// 	scrollable_parent: boolean | number;
// 	scrollables: HTMLCollectionOf<Element>;
// 	settings: PtrSettings;
// 	messages: PtrMessages;
// 	init: (language?: string) => void;
// }

// const ptr: Ptr = {
// 	scrollable_parent: false,
// 	scrollables: document.getElementsByClassName('ptr_scrollable'),
// 	settings: { mlang: 'en', mode: 'mail' },
// 	messages: {
// 		en: { pullToRefresh: 'Pull to refresh', loading: 'Loading ...' },
// 	},
// 	init: function (language?: string) {
// 		'use strict';
// 		let i = 0;
// 		if (language !== undefined) {
// 			this.settings.mlang = language;
// 		}

// 		this.scrollable_parent = false;
// 		this.scrollables = document.getElementsByClassName('ptr_scrollable');

// 		if (window.hasOwnProperty('ontouchstart') || window.navigator.msPointerEnabled) {
// 			document.getElementsByTagName('body')[0].className += ' touch';
// 		} else {
// 			document.getElementsByTagName('body')[0].className += ' notouch';
// 		}

// 		for (i = 0; i < this.scrollables.length; i += 1) {
// 			if (this.scrollables[i].hasAttribute('data-url') !== false) {
// 				const ptrElement: PtrElement = {
// 					box: document.createElement('div'),
// 					container: document.createElement('div'),
// 					image: document.createElement('div'),
// 					text: document.createElement('div'),
// 				};

// 				ptrElement.box.appendChild(ptrElement.container);
// 				ptrElement.container.appendChild(ptrElement.image);
// 				ptrElement.container.appendChild(ptrElement.text);
// 				ptrElement.text.innerHTML = this.messages[this.settings.mlang].pullToRefresh;

// 				ptrElement.box.className = 'ptr_box';
// 				ptrElement.box.style.right = '99%';
// 				ptrElement.container.className = 'ptr_container';
// 				ptrElement.image.className = 'ptr_image';
// 				ptrElement.text.className = 'ptr_text';

// 				if (this.scrollables[i]?.firstElementChild?.firstChild != null) {
// 					this.scrollables[i].firstElementChild?.insertBefore(
// 						ptrElement.box,
// 						this.scrollables[i].firstElementChild!.firstChild,
// 					);
// 				}
// 			}
// 		}

// 		document.addEventListener('touchstart', function (e) {
// 			const parent = e.target as HTMLElement;

// 			if (parent.className === undefined) {
// 				return false;
// 			}

// 			for (i = 0; i < 10; i += 1) {
// 				if (parent.className !== undefined) {
// 					if (parent.className.match('ptr_scrollable')) {
// 						ptr.scrollable_parent = i;
// 						i = 10;

// 						if (parent.hasAttribute('data-url') !== false) {
// 							if (parent.getElementsByClassName('ptr_box')[0] === undefined) {
// 								const ptrElement: PtrElement = {
// 									box: document.createElement('div'),
// 									container: document.createElement('div'),
// 									image: document.createElement('div'),
// 									text: document.createElement('div'),
// 								};

// 								ptrElement.box.appendChild(ptrElement.container);
// 								ptrElement.container.appendChild(ptrElement.image);
// 								ptrElement.container.appendChild(ptrElement.text);
// 								ptrElement.text.innerHTML = ptr.messages[ptr.settings.mlang].pullToRefresh;

// 								ptrElement.box.className = 'ptr_box';
// 								ptrElement.box.style.right = '99%';
// 								ptrElement.container.className = 'ptr_container';
// 								ptrElement.image.className = 'ptr_image';
// 								ptrElement.text.className = 'ptr_text';

// 								parent.firstElementChild?.insertBefore(
// 									ptrElement.box,
// 									parent.firstElementChild.firstChild,
// 								);
// 							} else {
// 								parent.getElementsByClassName('ptr_box')[0].style.opacity = 1.0;
// 								if (
// 									parent.getElementsByClassName('ptr_text')[0].innerHTML !==
// 									ptr.messages[ptr.settings.mlang].loading
// 								) {
// 									parent.getElementsByClassName('ptr_text')[0].innerHTML =
// 										ptr.messages[ptr.settings.mlang].pullToRefresh;
// 								}
// 							}
// 						} else if (parent.getElementsByClassName('ptr_box')[0] !== undefined) {
// 							parent.removeChild(parent.getElementsByClassName('ptr_box')[0]);
// 						}

// 						if (parent.scrollTop === 0) {
// 							parent.scrollTop = 1;
// 							parent.getElementsByClassName('ptr_wrap')[0].style.top = '1px';
// 						} else if (parent.scrollTop + parent.offsetHeight === parent.scrollHeight) {
// 							parent.scrollTop = parent.scrollTop - 1;
// 						}
// 					}
// 				}

// 				if (parent.parentNode.tagName === undefined) {
// 					i = 10;
// 					return false;
// 				}
// 				if (parent.parentNode.tagName === 'BODY' || parent.parentNode.tagName === 'HTML') {
// 					i = 10;
// 					return false;
// 				}

// 				parent = parent.parentNode;
// 			}
// 		});

// 		document.addEventListener('touchmove', function (e) {
// 			const parent = e.target as HTMLElement;
// 			const scroll = false;
// 			const rotate = 90;

// 			let top;
// 			let time;
// 			let insert;
// 			let inserted;
// 			let ajax;
// 			let ajaxTimeout: number;
// 			let requestUrl;

// 			if (ptr.scrollable_parent === false) {
// 				e.preventDefault();
// 				return false;
// 			}

// 			for (i = 0; i < ptr.scrollable_parent; i += 1) {
// 				parent = parent.parentNode;
// 			}

// 			if (ptr.scrollable_parent !== false && parent.hasAttribute('data-url') !== false) {
// 				scroll = true;
// 				ptr.element = parent;
// 				ptr.wrapelement = ptr.element.getElementsByClassName('ptr_wrap')[0];
// 				top = ptr.element.scrollTop;
// 				ptr.box = ptr.element.getElementsByClassName('ptr_box')[0];
// 				if (
// 					ptr.wrapelement.className.indexOf(' active') === -1 &&
// 					!ptr.wrapelement.getElementsByClassName('ptr_image')[0].className.match('ptr_loading') &&
// 					ptr.element.scrollTop < 1
// 				) {
// 					if (ptr.element.scrollTop < -25) {
// 						rotate = top < -40 ? -90 : 130 + parseInt(top * 12 + 270, 10);
// 					}

// 					if (ptr.element.scrollTop < 0) {
// 						ptr.box.style.right = '0px';
// 						ptr.wrapelement.getElementsByClassName('ptr_image')[0].style['-webkit-transform'] =
// 							'scale(1) rotate(' + rotate + 'deg)';
// 					}

// 					if (ptr.element.scrollTop < -51) {
// 						if (ptr.wrapelement.className.indexOf(' ptr_active') === -1) {
// 							ptr.box.style.right = '0px';
// 							ptr.wrapelement.className += ' ptr_active';
// 							ptr.wrapelement.getElementsByClassName('ptr_text')[0].innerHTML =
// 								ptr.messages[ptr.settings.mlang].loading;
// 							ptr.wrapelement.getElementsByClassName('ptr_image')[0].className += ' ptr_loading';

// 							if (parent.getAttribute('data-url') === 'reload') {
// 								window.location.reload(true);
// 								return false;
// 							}

// 							ptr.element = parent;
// 							ptr.wrapelement = ptr.element.getElementsByClassName('ptr_wrap')[0];
// 							ptr.eleId = parent.id;
// 							time = new Date();

// 							ajax = window.ActiveXObject
// 								? new ActiveXObject('Microsoft.XMLHTTP')
// 								: (XMLHttpRequest && new XMLHttpRequest()) || null;
// 							ajaxTimeout = window.setTimeout(function () {
// 								ajax.abort();
// 								ptr.wrapelement.getElementsByClassName('ptr_text')[0].innerHTML = '';
// 								ptr.wrapelement.className = ptr.wrapelement.className.replace(' ptr_active', '');
// 								ptr.wrapelement.style.top = '0px';
// 								ptr.box = document.getElementById(ptr.eleId).getElementsByClassName('ptr_box')[0];
// 								ptr.box.getElementsByClassName('ptr_image')[0].className = ptr.box
// 									.getElementsByClassName('ptr_image')[0]
// 									.className.replace(' ptr_loading', '');
// 							}, 6000);
// 							ajax.onreadystatechange = function () {
// 								if (ajax.readyState === 4) {
// 									if (ajax.status === 200) {
// 										clearTimeout(ajaxTimeout);
// 										if (ajax.status !== 200) {
// 											ptr.wrapelement.style.top = '0px';
// 											ptr.box.getElementsByClassName('ptr_image')[0].className = ptr
// 												.getElementsByClassName('ptr_image')[0]
// 												.className.replace(' loading', '');
// 											ptr.wrapelement.className = ptr.wrapelement.className.replace(
// 												' ptr_active',
// 												'',
// 											);
// 										} else {
// 											ptr.box = document
// 												.getElementById(ptr.eleId)
// 												.getElementsByClassName('ptr_box')[0];
// 											insert = document.createElement('div');
// 											insert.innerHTML = ajax.responseText;
// 											insert.className = 'ptr_inserted';

// 											ptr.wrapelement.insertBefore(insert, ptr.box.nextSibling);
// 											ptr.wrapelement.style.top = '0px';
// 											ptr.box.getElementsByClassName('ptr_image')[0].className = ptr.box
// 												.getElementsByClassName('ptr_image')[0]
// 												.className.replace(' ptr_loading', '');
// 											ptr.wrapelement.className = ptr.wrapelement.className.replace(
// 												' ptr_active',
// 												'',
// 											);
// 											inserted = document.getElementsByClassName('ptr_inserted')[0];
// 											ptr.element.scrollTop = inserted.clientHeight - 51;
// 											ptr.wrapelement.getElementsByClassName('ptr_text')[0].innerHTML = '';
// 											ptr.box.style.right = '99%';

// 											ptr.wrapelement.getElementsByClassName('ptr_image')[0].className =
// 												ptr.wrapelement
// 													.getElementsByClassName('ptr_image')[0]
// 													.className.replace(' ptr_loading', '');

// 											ptr.scrollable_parent = false;
// 										}
// 									}
// 								}
// 							};
// 							requestUrl = parent.getAttribute('data-url') + '?rt=' + time.getTime();
// 							ajax.open('POST', requestUrl, true);
// 							ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
// 							ajax.send();
// 						}
// 					} else if (ptr.element.scrollTop !== 0) {
// 						if (ptr.wrapelement.className.indexOf(' active') !== -1) {
// 							ptr.wrapelement.className = ptr.wrapelement.className.replace(' ptr_active', '');
// 							ptr.wrapelement.getElementsByClassName('ptr_text')[0].innerHTML =
// 								ptr.messages[ptr.settings.mlang].pullToRefresh;
// 						}
// 					}
// 				}
// 			} else if (ptr.scrollable_parent !== false) {
// 				scroll = true;
// 			}

// 			if (scroll === false) {
// 				e.preventDefault();
// 			}
// 		});

// 		document.addEventListener('touchend', function (e) {
// 			let parent = e.target;

// 			for (i = 0; i < ptr.scrollable_parent; i += 1) {
// 				parent = parent.parentNode;
// 			}

// 			if (parent.hasAttribute('data-url') !== false && ptr.scrollable_parent !== false) {
// 				if (parent.hasAttribute('data-url') !== false) {
// 					ptr.element = parent;
// 					ptr.wrapelement = ptr.element.getElementsByClassName('ptr_wrap')[0];
// 					ptr.eleId = parent.id;
// 					ptr.box = ptr.element.getElementsByClassName('ptr_box')[0];

// 					if (
// 						ptr.wrapelement.getElementsByClassName('ptr_image')[0].className.match('ptr_loading')
// 					) {
// 						ptr.wrapelement.className = ptr.wrapelement.className.replace(' ptr_active', '');
// 						ptr.wrapelement.style.top = '51px';
// 					} else {
// 						ptr.box.style.right = '99%';
// 					}
// 				}
// 			}

// 			ptr.scrollable_parent = false;
// 		});
// 	},
// };

// export default ptr;
