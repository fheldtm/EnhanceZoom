(function () {
  let wcContent, wcContentRight, wsContentFrag, wcDashboard;
  let dashboard, dashboardHeader, dashboardTitle, dashboardTitleSpan;
  let btnWrapper, btnList, btnHost;
  let participants, participantsList;
  let participantCondition = {
    host: 'all',
    video: 'all',
    audio: 'all'
  };

  let hostReg = new RegExp('호스트');

  function createButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    const classes = ['button-margin-right', 'ax-outline-blue', 'btn', 'btn-xs'];
    classes.forEach(_class => {
      btn.classList.add(_class)
    });
    return btn;
  }

  // Header
  function setHeader() {
    dashboardHeader = document.createElement('div');
    dashboardHeader.classList.add('dashboard-header__header');
    dashboard.appendChild(dashboardHeader);

    dashboardTitle = document.createElement('div');
    dashboardTitle.classList.add('dashboard-header__title');
    dashboardHeader.appendChild(dashboardTitle);

    dashboardTitleSpan = document.createElement('span');
    dashboardTitleSpan.textContent = '대시보드';
    dashboardTitle.appendChild(dashboardTitleSpan);
  }

  function createBtnItem(type, ...btns) {
    const btnItem = document.createElement('div');
    btnItem.classList.add('dashboard-btn__item');
    btnList.appendChild(btnItem);
    
    const itemTitle = document.createElement('p');
    itemTitle.classList.add('dashboard-btn__item__title');
    itemTitle.textContent = type || '';
    btnItem.appendChild(itemTitle);

    const itemBtns = document.createElement('div');
    itemBtns.classList.add('dashboard-btn__item__btns');
    btnItem.appendChild(itemBtns);

    btns.forEach(btn => itemBtns.appendChild(btn));
    return btnItem;
  }

  // buttons
  function setListFileterButton() {
    btnWrapper = document.createElement('div');
    btnWrapper.classList.add('dashboard-btn__wrapper')
    dashboard.appendChild(btnWrapper);

    btnList = document.createElement('div');
    btnList.classList.add('dashboard-btn__list');
    btnList.addEventListener('click', setParticipantsCondition)
    btnWrapper.appendChild(btnList);

    // host
    btnHostAll = createButton();
    btnHostAll.textContent = '전체';
    btnHostAll.setAttribute('data-event', 'hostAll');

    btnHost = createButton();
    btnHost.textContent = '호스트O';
    btnHost.setAttribute('data-event', 'host');

    btnNoHost = createButton();
    btnNoHost.textContent = '호스트X';
    btnNoHost.setAttribute('data-event', 'nohost');

    createBtnItem('호스트', btnHostAll, btnHost, btnNoHost);

    // video
    btnVideoAll = createButton();
    btnVideoAll.textContent = '전체';
    btnVideoAll.setAttribute('data-event', 'videoAll');

    btnVideo = createButton();
    btnVideo.textContent = '비디오O';
    btnVideo.setAttribute('data-event', 'video');

    btnNoVideo = createButton();
    btnNoVideo.textContent = '비디오X';
    btnNoVideo.setAttribute('data-event', 'novideo');

    createBtnItem('비디오', btnVideoAll, btnVideo, btnNoVideo);

    //audio 
    btnAudioAll = createButton();
    btnAudioAll.textContent = '전체';
    btnAudioAll.setAttribute('data-event', 'audioAll');

    btnAudio = createButton();
    btnAudio.textContent = '오디오O';
    btnAudio.setAttribute('data-event', 'audio');

    btnNoAudio = createButton();
    btnNoAudio.textContent = '오디오X';
    btnNoAudio.setAttribute('data-event', 'noaudio');

    btnAudioNoConnect = createButton();
    btnAudioNoConnect.textContent = '오디오 연결X';
    btnAudioNoConnect.setAttribute('data-event', 'audionotconnect');

    createBtnItem('오디오', btnAudioAll, btnAudio, btnNoAudio, btnAudioNoConnect);
  }

  // participants list
  function createParticipantsList() {
    participantsList = document.createElement('div');
    participantsList.classList.add('dashboard-participants-list__wrapper');
    dashboard.appendChild(participantsList);
  }

  // 참가자 마우스 오버 된 상황일때 오버 끄기
  function mouseleaveRightSection(participant) {
    const btns = participant.querySelector('.participants-item__right-section--buttons');
    if (btns) btns.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
  }

  // 화면 여부 조회
  function isVideo(participant) {
    const videoIcons = participant.querySelectorAll('.participants-item__right-section .participants-icon__icon-box:last-child svg path');

    if (videoIcons.length === 1) { // 화면 켠 사람
      return true
    } else if (videoIcons.length === 2) { // 화면 안 켠 사람
      return false
    }
  }

  // 오디오 여부 조회
  function isAudio(participant) {
    const audioBoxs = participant.querySelectorAll('.participants-icon__icon-box');
    if (audioBoxs.length === 1) {
      return 'noConnect'
    }

    const audioBox = audioBoxs[0];
    const paths = audioBox.querySelectorAll('svg path');
    const animate = audioBox.querySelector('svg path animate');
    if (paths.length === 1) {
      return 'audioOn';
    } else if (animate) {
      return 'audioOn';
    } else {
      return 'audioOff';
    }
  }

  function setParticipantsCondition(e) {
    const btn = e.target.closest('button[data-event]');
    if (!btn) return;

    const type = btn.getAttribute('data-event');

    if (type === 'hostAll') {
      participantCondition.host = 'all';
    } else if (type === 'host') {
      participantCondition.host = true;
    } else if (type === 'nohost') {
      participantCondition.host = false;
    } else if (type === 'videoAll') {
      participantCondition.video = 'all';
    } else if (type === 'video') {
      participantCondition.video = true;
    } else if (type === 'novideo') {
      participantCondition.video = false;
    } else if (type === 'audioAll') {
      participantCondition.audio = 'all';
    } else if (type === 'audio') {
      participantCondition.audio = 'audioOn';
    } else if (type === 'noaudio') {
      participantCondition.audio = 'audioOff';
    } else if (type === 'audionotconnect') {
      participantCondition.audio = 'noConnect';
    }
  }
  
  function filterParticipants() {
    participants = participants
      .filter(participant => { // host filter
        if (participantCondition.host === 'all') {
          return true;
        } else if (participantCondition.host === true) {
          return participant.host === true
        } else if (participantCondition.host === false) {
          return participant.host === false
        }
      })
      .filter(participant => { // video filter
        if (participantCondition.video === 'all') {
          return true;
        } else if (participantCondition.video === true) {
          return participant.video === true;
        } else if (participantCondition.video === false) {
          return participant.video === false;
        }
      })
      .filter(participant => { // audio filter
        if (participantCondition.audio === 'all') {
          return true;
        } else if (participantCondition.audio === 'audioOn') {
          return participant.audio === 'audioOn';
        } else if (participantCondition.audio === 'audioOff') {
          return participant.audio === 'audioOff';
        } else if (participantCondition.audio === 'noConnect') {
          return participant.audio === 'noConnect';
        }
      })
    console.log(participants)
  }

  function getParticipants() {
    participants = [];
    const participantItems = document.querySelectorAll('.participants-item-position');
    participantItems.forEach(participant => {
      const nameElement = participant.querySelector('.participants-item__display-name');
      const name = nameElement.textContent;

      const labelElement = participant.querySelector('.participants-item__name-label');
      const label = labelElement.textContent;

      // mouse leave
      mouseleaveRightSection(participant);

      const ishost = hostReg.test(label);
      const audiostatus = isAudio(participant);
      const videostatus = isVideo(participant);

      participants.push({
        name: name,
        host: ishost,
        audio: audiostatus,
        video: videostatus
      })
    })

    // filtering
    filterParticipants();

    setTimeout(getParticipants, 1000);
  }

  // function setAudioOff() {
  //   const overTarget = document.querySelector('.participants-item__right-section');
  //   console.log(overTarget);
  //   overTarget.dispatchEvent(new MouseEvent('mouseover', { 'bubbles': true }));
  // }


  // 
  function init () {
    participants = [];

    wcContentRight = document.querySelector('#wc-container-right');
    if (!wcContentRight) {
      const participantButton = document.querySelector('[feature-type="participants"] button');
      participantButton.click();
    }

    wcContent = document.querySelector('#wc-content');
    wsContentFrag = document.createDocumentFragment();

    wcDashboard = document.createElement('div');
    wcDashboard.id = 'wc-container-dashboard';
    wsContentFrag.appendChild(wcDashboard);

    dashboard = document.createElement('div');
    dashboard.classList.add('dashboard-section-container');
    wcDashboard.appendChild(dashboard);

    setHeader();
    setListFileterButton();
    createParticipantsList();

    getParticipants();

    wcContent.appendChild(wsContentFrag);
  }

  init();
})();