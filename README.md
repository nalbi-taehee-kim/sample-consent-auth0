# sample-consent
Auth0 에서 약관 동의 페이지로 리다이렉트시키는 과정을 테스트하기 위한 프로젝트입니다.
[깃허브 페이지](https://studious-fiesta-vr3jyko.pages.github.io/) 로 약관 동의 페이지를 호스팅하고 있습니다. 

## 약관 동의 페이지 url
https://studious-fiesta-vr3jyko.pages.github.io/

## 초기 설정
아래 명령어로 종속성 설치
```bash
yarn
```

## 빌드 및 배포
아래 명령어를 실행하면 gh-pages 에 자동으로 배포되며, 잠시 후 깃허브 페이지가 업데이트된다.
```bash
yarn build
yarn deploy
```


## auth0 쪽 설정
login action 에 `Redirect to consent` 라는 제목으로 아래와 같은 커스텀 액션을 등록한다.
secrets 에 `CONSENT_FORM_URL` 라는 이름으로 약관 동의 페이지 url 을 등록한다.
```javascript
/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
  const { consentGiven } = event.user.user_metadata || {};

  // redirect to consent form if user has not yet consented
  if (!consentGiven) {
    const options = {
      query: {
        auth0_domain: `${event.tenant.id}.auth0.com`,
      },
    };
    api.redirect.sendUserTo(event.secrets.CONSENT_FORM_URL, options);
  }
};

/**
* Handler that will be invoked when this action is resuming after an external redirect. If your
* onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
// exports.onContinuePostLogin = async (event, api) => {
// };

exports.onContinuePostLogin = async (event, api) => {
  if (event.request.body.confirm === "yes") {
    api.user.setUserMetadata("consentGiven", true);
    api.user.setUserMetadata("consentTimestamp", Date.now());
    return;
  } else {
    return api.access.deny("User did not consent");
  }
};
```
