const keycloak = new Keycloak({
  url: "https://keycloak.sbot.pro",
  realm: "hang",
  clientId: "mydemoclient",
});

function initKeycloak() {
    keycloak.init({onLoad: 'login-required'}).then(function() {
        constructTableRows(keycloak.idTokenParsed);
        pasteToken(keycloak.token);
    }).catch(function() {
        console.log('failed to initialize');
    });
}

function constructTableRows(keycloakToken) {
    document.getElementById('row-username').innerHTML = keycloakToken.preferred_username;
    document.getElementById('row-firstName').innerHTML = keycloakToken.given_name;
    document.getElementById('row-lastName').innerHTML = keycloakToken.family_name;
    document.getElementById('row-name').innerHTML = keycloakToken.name;
    document.getElementById('row-email').innerHTML = keycloakToken.email;
    document.getElementById('row-verify').innerHTML = keycloakToken["verify-document"];
}

function pasteToken(token){
    document.getElementById('ta-token').value = token;
    document.getElementById('ta-refreshToken').value = keycloak.refreshToken;
}

var refreshToken = function() {
    keycloak.updateToken(-1)
    .then(function(){
        document.getElementById('ta-token').value = keycloak.token;
        document.getElementById('ta-refreshToken').value = keycloak.refreshToken;
    });
}

var logout = function() {
    keycloak.logout({"redirectUri":"http://localhost:5500/logout.html"});
}

var checkAccess = async function() {
    const url = "https://9dry6fle9j.execute-api.ap-southeast-1.amazonaws.com/dev/demo-resource";
    try {
        const response = await fetch(url, {
            headers: {
                "auth-token": keycloak.token,
            },
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.error(error.message);
    }
}