import './styles.css';

const params = new URLSearchParams(window.location.search)
const auth0domain = params.get('auth0_domain')
const state = params.get('state')
console.log(auth0domain, state)

const $form = document.getElementById('form-agree')
if (auth0domain !== null && state !== null) {
    $form.action = encodeURI(`${auth0domain}/continue?state=${state}`);
} else {
    alert("잘못된 접근입니다.")
    history.back();
}
