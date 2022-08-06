(function () {
  let wcContent, wsContentFrag, wcDashboard;
  let dashboard, dashboardHeader, dashboardTitle, dashboardTitleSpan;
  let btnWrapper, btnList, btnAll, btnHost, btnNotHost, btnVideoOn, btnVideoOff, btnAudioOn, btnAudioNotConnect;
  let participants, participantsList, participantCondition;

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

  // buttons
  function setListFileterButton() {
    btnWrapper = document.createElement('div');
    btnWrapper.classList.add('dashboard-btn__wrapper')
    dashboard.appendChild(btnWrapper);

    btnList = document.createElement('div');
    btnList.classList.add('dashboard-btn__list');
    btnWrapper.appendChild(btnList);

    btnAll = createButton();
    btnAll.textContent = '전체';
    btnList.appendChild(btnAll);
    btnAll.addEventListener('click', () => {
      setParticipantCondition('all')
    })

    btnHost = createButton();
    btnHost.textContent = '호스트O';
    btnList.appendChild(btnHost);
    btnHost.addEventListener('click', () => {
      setParticipantCondition('host')
    })

    btnNotHost = createButton();
    btnNotHost.textContent = '호스트X';
    btnList.appendChild(btnNotHost);
    btnNotHost.addEventListener('click', () => {
      setParticipantCondition('noHost')
    })

    btnVideoOn = createButton();
    btnVideoOn.textContent = '화면O';
    btnList.appendChild(btnVideoOn);
    btnVideoOn.addEventListener('click', () => {
      setParticipantCondition('video')
    })

    btnVideoOff = createButton();
    btnVideoOff.textContent = '화면X';
    btnList.appendChild(btnVideoOff);
    btnVideoOff.addEventListener('click', () => {
      setParticipantCondition('noVideo')
    })

    btnAudioOn = createButton();
    btnAudioOn.textContent = '오디오O';
    btnList.appendChild(btnAudioOn);
    btnAudioOn.addEventListener('click', () => {
      setParticipantCondition('audio')
    })

    btnAudioNotConnect = createButton();
    btnAudioNotConnect.textContent = '오디오연결X';
    btnList.appendChild(btnAudioNotConnect);
    btnAudioNotConnect.addEventListener('click', () => {
      setParticipantCondition('noAudio')
    })
  }

  // participants list
  function createParticipantsList() {
    participantsList = document.createElement('div');
    participantsList.classList.add('dashboard-participants-list__wrapper');
    dashboard.appendChild(participantsList);
  }

  // 화면 켜지 않은 사람 조회
  function getVideoPersons(condition) {
    participants = [];

    const participantsElement = document.querySelectorAll('#wc-container-right .participants-item-position');
    participantsElement.forEach((participant) => {
      const btns = participant.querySelector('.participants-item__right-section--buttons');
      if (btns) btns.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

      const videoIcon = participant.querySelector('.participants-item__right-section .participants-icon__icon-box:last-child svg')
      const clone = participant.cloneNode(true);

      if (condition && videoIcon.children.length === 1) {
        // 화면 켠 사람
        participants.push(clone);
      } else if (!condition && videoIcon.children.length === 2) {
        // 화면 안 켠 사람
        participants.push(clone);
      }
    })
  }

  function getAudioPersons(condition) {
    participants = [];

    const participantsElement = document.querySelectorAll('#wc-container-right .participants-item-position');
    participantsElement.forEach((participant) => {
      const btns = participant.querySelector('.participants-item__right-section--buttons');
      if (btns) btns.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

      const icons = participant.querySelectorAll('.participants-item__right-section .participants-icon__icon-box')
      const clone = participant.cloneNode(true);

      if (condition === 'audioNotConnect' && icons.length !== 2) {
        participants.push(clone);
      } else if (condition === 'audioOpen' && icons.length == 2) {
        const audioSect = icons[0];
        const audioIcons = audioSect.querySelectorAll('svg path');
        const audioIcon = audioSect.querySelector('svg path:last-child');
        if (audioIcons.length === 1 || audioIcon.children.length !== 0) {
          participants.push(clone);
        }
      }
    })
  }

  function updateParticipants() {
    console.log(participantCondition)
    if (participantCondition === 'video') {
      getVideoPersons(true)
    } else if (participantCondition === 'noVideo') {
      getVideoPersons(false)
    } else if (participantCondition === 'audio') {
      getAudioPersons('audioOpen');
    } else if (participantCondition === 'noAudio') {
      getAudioPersons('audioNotConnect');
    }

    resetParticipants();
    addParticipants();

    setTimeout(updateParticipants, 1000);
  }
  
  function resetParticipants() {
    for (let i = participantsList.children.length; i > 0; i--) {
      const participant = participantsList.children[i - 1];
      participantsList.removeChild(participant);
    }
  }

  function addParticipants() {
    console.log(participants)
    participants.forEach(participant => {
      participant.style.position = '';
      participant.style.top = '';
      participant.style.background = '#fff';
      const btn = participant.querySelector('.participants-item__right-section--buttons');
      const icons = participant.querySelector('.participants-item__right-section--icons');
      if (btn) {
        btn.parentElement.removeChild(btn);
        icons.style.display = 'flex';
      }
      participantsList.appendChild(participant);
    })
  }

  function setParticipantCondition(type) {
    // type
    // all | host | noHost | video | noVideo | audio | noAudio
    participantCondition = type;
  }

  function setAudioOff() {
    const overTarget = document.querySelector('.participants-item__right-section');
    console.log(overTarget);
    overTarget.dispatchEvent(new MouseEvent('mouseover', { 'bubbles': true }));
  }


  // 
  function init () {
    participants = [];

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

    setTimeout(setAudioOff, 2000);

    updateParticipants();

    wcContent.appendChild(wsContentFrag);
  }

  init();
})();