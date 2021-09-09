const HtmlElementResizer = (function(){
	let state = {
		rect_org:{width:-1,height:-1},
		xy_org:{x:-1,y:-1},
		down:false,
		herBar:'', //news
		target:null,
		container:null,
	}

	let ontouchstart = function(event){
		if(!state.down && !event.target.classList.contains('her-bar')){
			// if(HtmlElementResizer.debug) console.log(event.type,'continue',event.target);
			return;
		}
		event.stopPropagation();
		// event.stopImmediatePropagation();
		if (event.cancelable) event.preventDefault();
		if(HtmlElementResizer.debug) console.log(event.type,'stop',event.target);
		return false;
	}
	let onpointerdown = function(event){
		if(!event.target.classList.contains('her-bar')){return;}
		let container = event.target.closest('.her-container');
		if(!container){
			if(HtmlElementResizer.debug) console.log('no her-container');
			return;
		}
		let target = null;
		if(container.classList.contains('her-target')){
			target = container;
		}else{
			target = container.querySelector('.her-target');
		}
		if(!target){
			if(HtmlElementResizer.debug) console.log('no her-target');
			return;
		}
		

		event.stopPropagation();
		if (event.cancelable) event.preventDefault();
		
		state.down = true;
		state.rect_org = target.getBoundingClientRect();
		state.xy_org.x = event.x;
		state.xy_org.y = event.y;
		state.container = container;
		state.target = target;
		
		state.herBar = event.target.dataset.herBar;
		state.container.dataset.herBar=state.herBar;
		state.container.ownerDocument.body.dataset.herBar=state.herBar;

		if(HtmlElementResizer.debug) console.log(event.type,state);
	}
	let onpointermove = function(event){
		if(!state.down){return;}
		event.stopPropagation();
		if (event.cancelable) event.preventDefault();
		let x = event.x;
		let y = event.y;
		let w = null;
		let h = null;
		if(state.herBar.indexOf('e')>-1){
			w = state.rect_org.width+x-state.xy_org.x
		}else if(state.herBar.indexOf('w')>-1){
			w = state.rect_org.width-x+state.xy_org.x
		}
		if(state.herBar.indexOf('s')>-1){
			h = state.rect_org.height+y-state.xy_org.y
		}else if(state.herBar.indexOf('n')>-1){
			h = state.rect_org.height-y+state.xy_org.y
		}
		
		if(w!==null) state.target.style.width = w+'px';
		if(h!==null) state.target.style.height = h+'px';


		if(HtmlElementResizer.debug) console.log(event.type);
	}
	let onpointerup = function(event){
		if(!state.down){return;}
		delete state.container.dataset.herBar;
		delete state.container.ownerDocument.body.dataset.herBar;
		state.down = false;
		state.herBar = '';
		state.container = null;
		state.target = null;
		if(HtmlElementResizer.debug) console.log(event.type,state);
	}
	HtmlElementResizer_on = false;
	class HtmlElementResizer{
		static debug = false;
		
		static addEvents(d){
			if(HtmlElementResizer_on){return}
			if(!d) d = document;
			d.addEventListener('touchstart',ontouchstart,{passive: false})
			d.addEventListener('pointerdown',onpointerdown)
			d.defaultView.addEventListener('touchmove',ontouchstart,{passive: false})
			d.addEventListener('pointermove',onpointermove)
			d.addEventListener('pointerup',onpointerup)
			HtmlElementResizer_on = !HtmlElementResizer_on;
		}
		static removeEvents(d){
			if(!HtmlElementResizer_on){return}
			if(!d) d = document;
			d.removeEventListener('touchstart',ontouchstart)
			d.removeEventListener('pointerdown',onpointerdown)
			d.defaultView.removeEventListener('touchmove',ontouchstart)
			d.removeEventListener('pointermove',onpointermove)
			d.removeEventListener('pointerup',onpointerup)
			HtmlElementResizer_on = !HtmlElementResizer_on;
		}
	}
	return HtmlElementResizer;
})()