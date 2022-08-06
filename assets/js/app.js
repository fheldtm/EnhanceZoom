const zoom = document.querySelector('#zoom');

const startZoomSetting = () => {
  // zoom start function
  const zoomStart = () => {
    const { value } = zoomLinkInput;
    const url = value.trim();
    const defaultZoomLink = 'https://us04web.zoom.us/j/';

    
    // https://us04web.zoom.us/j/78585600920?pwd=raY-HUc-4hIuIpKYfPM0rBkTPSSV9Q.1
    if (value && new RegExp(defaultZoomLink).test(url)) {
      const options = url.split(defaultZoomLink).pop();
      const pwdKey = '?pwd=';
      const idPwd = options.split(pwdKey)
      const id = idPwd[0];
      const pwd = idPwd[1];
      // zoom.src = `https://zoom.us/wc/${id}/join?pwd=${pwd}`;
      // zoom.data = `https://zoom.us/wc/${id}/join?pwd=${pwd}`;
      // zoom.src = `https://zoom.us/wc/${id}/start`;

      window.location.href = `https://zoom.us/wc/${id}/join?pwd=${pwd}`

      // const startZoom = document.querySelector('.start-zoom');
      // startZoom.classList.add('hidden')
      // setTimeout(() => {
      //   startZoom.parentElement.removeChild(startZoom);
      // }, 2000)

      // const root = document.querySelector('#root');
      // root.classList.add('on');
    }
  }

  // zoom link input 이벤트 설정
  const zoomLinkInput = document.querySelector(".start-zoom__link--input");
  let isZoomLink = false;
  const setZoomLinkInput = () => {
    if (isZoomLink) {
      zoomLinkInput.classList.add('content');
    } else {
      zoomLinkInput.classList.remove('content');
    }
  }
  zoomLinkInput.addEventListener("focus", () => {
    isZoomLink = true;
    setZoomLinkInput();
  });
  zoomLinkInput.addEventListener("blur", () => {
    isZoomLink = zoomLinkInput.value !== '';
    setZoomLinkInput();
  });
  zoomLinkInput.addEventListener("keydown", (e) => {
    const key = e.key;
    if (key.toLowerCase() === 'enter') {
      zoomStart()
    }
  })

  // zoom link button 이벤트 설정
  const zoomLinkButton = document.querySelector('.start-zoom__btn');
  zoomLinkButton.addEventListener('click', zoomStart);
}

startZoomSetting();
