'use strict';

//const NETWORK = 'g'; // https://www.ldcrixtrack.com
const NETWORK = 'cd'; // https://cldrck.com

const LOCALE = 'fr';

const OFFER_SETTINGS = {
    offer: 'Moulinex',
    network: NETWORK,
    country: 'FR'
}

const defaultGetParameters = window.location.search ? window.location.search + '&' : '?';


const SETTINGS = {
  // g: {
  //   YM_ID: '74147650',
  //   VISIT_ID_PARAMETER_NAME: 'sub3',
  //   buildRedirectUrl: () => {
  //     return `${REDIRECT_URL.origin}${REDIRECT_URL.pathname}${defaultGetParameters}sub4=${localStorage.form_mark}%2B${localStorage.form_model}&sub5=${localStorage.form_email.replace(/ /g, '')}%2B${localStorage.form_username}`
  //   }
  // },
  cd: {
    YM_ID: '79156249',
    VISIT_ID_PARAMETER_NAME: 's2',
    buildRedirectUrl: (url) => {

      const TRACKING_DOMAIN_URL = new URL(url);
      const QUERY =  TRACKING_DOMAIN_URL.search && TRACKING_DOMAIN_URL.search.replace(/\?/, "") + (TRACKING_DOMAIN_URL.search[TRACKING_DOMAIN_URL.search.length -1] == "&" ? "" : "&")

      const first_name = localStorage.form_username.split(' ', 1).toString();
      const last_name = localStorage.form_username.split(' ').slice(1).join(' ');
      return `${TRACKING_DOMAIN_URL.origin}${TRACKING_DOMAIN_URL.pathname}${defaultGetParameters}${QUERY}t1=${first_name}&t2=${last_name}&t4=${localStorage.form_email.replace(/ /g, '')}&t5=${localStorage.form_model}&t6=${localStorage.form_mark}`
    }
  }
}

const params = new URLSearchParams(window.location.search);
const VISIT_ID = params.get(SETTINGS[NETWORK].VISIT_ID_PARAMETER_NAME);

/** SCROLL TO TOP BUTTON */
function scrollToTop(delay) {
  $([document.documentElement, document.body]).animate(
    {
      scrollTop: $('#userDataForm').offset().top,
    },
    delay
  );
}

$('*[data-scroll="form"]').each(function( i ) {
  $( this ).click(() => scrollToTop(2000));
});

let scrollToTopBtn = document.querySelector('.scrollToTopBtn');

function handleScroll() {
  let scrollTotal = document.body.scrollHeight - document.body.clientHeight;
  if (window.scrollY / scrollTotal > 0.25) {
    scrollToTopBtn.classList.add('showBtn');
  } else {
    scrollToTopBtn.classList.remove('showBtn');
  }
}

scrollToTopBtn.addEventListener('click', () => scrollToTop(500));
document.addEventListener('scroll', handleScroll);


/** IMAGES */

const imagesPag = $('.intro-img__btn button');
const images = $('.intro-img__img img');
const toggleActiveClass = (i, list) => {
  list.each(function( j ) {
    i === j ? $( this ).addClass( 'active' ) : $( this ).removeClass( 'active' );
  });
}

imagesPag.each(function( i ) {
  $( this ).click(() => {
    toggleActiveClass(i, imagesPag);
    toggleActiveClass(i, images);
  });
});

/** FORM */
const cyrillicCheck = /[\а-я]+/gi;

const emailCheck =
  /^(([^<>()[\]\\.,;:@"]+(\.[^<>()[\]\\.,;:@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9\s]+\.)+[a-zA-Z\s]{2,}))$/;
const emailCheck2 =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

let fields = {};

const validation = {
  email: {
    validation: value => !value.trim().match(cyrillicCheck) && value.trim().match(emailCheck) && value.trim().match(emailCheck2),
    isValid: false,
    inputCallback: () => {
      if ($(fields.email.input).val().length >= 2) {
        $(fields.email.wrapper).addClass('show-hint');
      }
    }
  },
}

$('form input').each(function( index ) {
  const id = $( this ).attr('id');
  fields[id] = {
    input: $( this ),
    wrapper: $(`#${id}Wrapper`),
    ...validation[id]
  }
})

const showError = (field) => {
  $(fields[field].wrapper).addClass('child-invalid');
  $(fields[field].input).addClass('error');
  $(fields[field].wrapper).removeClass('child-valid');
}

const checkValidation = (field, needShowError) => {
  if(fields[field].validation) {
    if (fields[field].validation($(fields[field].input).val())) {
      $(fields[field].wrapper).addClass('child-valid');
      $(fields[field].input).removeClass('error');
      $(fields[field].wrapper).removeClass('child-invalid');
      fields[field].isValid = true;
      if(needShowError){
        $(`#${field}Invalid`).css('display', 'none');
      }
    } else {
      showError(field);
      fields[field].isValid = false;
    }
  }
}
for(const key in fields){
  if(localStorage.getItem(`form_${key}`)){
    fields[key].input.val(localStorage.getItem(`form_${key}`));
    $(fields[key].wrapper).addClass('focused');
    checkValidation(key);
  }
  else{
    if(fields[key].defaultValue){
      fields[key].input.val(fields[key].defaultValue);
      $(fields[key].wrapper).addClass('focused');
    }
  }

  $( fields[key].input ).on('focus', () => {
    $(fields[key].wrapper).addClass('focused');
  })

  $( fields[key].input ).on('blur', () => {
    if($(fields[key].input).val() === ''){
      $(fields[key].wrapper).removeClass('focused');
    }
    $(fields[key].input).removeClass('show-hint');
  })

  $( fields[key].wrapper ).on('input', () => {
    localStorage.setItem(`form_${key}`, fields[key].input.val());
    checkValidation(key, true);
    if(fields[key].inputCallback){
      fields[key].inputCallback();
    }
  })
}

const showEmailDropdown = () => {
  var value = $(fields.email.input).val();

  $('ul').find('li.email').hide();
  $.each($('ul').find('li.email'), function () {
    let str = value;
    if (!value.includes('@')) {
      str = str.split('@').pop();
      let temp = this.innerHTML.split('@')[1];
      this.innerHTML = str.trim() + '@' + temp.trim();
    }
    if (this.innerHTML.includes(value)) $(this).show();
    $(this).on('click', function () {
      if ($(fields.email.input).val().length) {
        $(fields.email.input).val(this.innerHTML.trim());
        localStorage.setItem('form_email', $(fields.email.input).val());
        $(fields.email.wrapper).removeClass('show-hint');
      }
      checkValidation('email', true);
    });
  });
}

$(fields.email.input).on('input', function () {
  showEmailDropdown();
});

$(fields.email.input).on('click', function () {
  showEmailDropdown();
});

$('#userDataForm').submit(function (event) {
  event.preventDefault();


  if (localStorage.form_email) {
    var validEmail = localStorage.form_email.replace(/ /g, '');
  }

  const data = {
    mark: localStorage.form_mark,
    model: localStorage.form_model,
    username: localStorage.form_username,
    email: validEmail,
  }

  if (fields.email.isValid) {

    let url = document.getElementById("submitForm").dataset.href

    const fullRedirectUrl = SETTINGS[NETWORK].buildRedirectUrl(url);
    try {
      window.location.replace(fullRedirectUrl);
    } catch (e) {
      window.location = fullRedirectUrl;
    }

  } else {
    $([document.documentElement, document.body]).animate(
      {
        scrollTop: $('#userDataForm').offset().top,
      },
      100
    );

  }
  if (!fields.email.isValid) {
    showError('email');
    $(`#emailInvalid`).css('display', 'block');
  }
});