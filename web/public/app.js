(function () {

    var db = firebase.firestore();

    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    const app = new Vue({
        el: '#app',
        data: {
            authorized: null
        },
        created() {
            // Operaciones que se ejecutan al inicio
            var self = this;
            firebase.auth().onAuthStateChanged(user => {
                if (!user) {
                    // Configuramos firebaseUI
                    var uiConfig = {
                        signInFlow: 'popup',
                        // signInSuccessUrl: '/',
                        callbacks: {
                            signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                                return false;
                            }
                        },
                        signInOptions: [
                            firebase.auth.EmailAuthProvider.PROVIDER_ID
                        ],
                        CredentialHelper: firebaseui.auth.CredentialHelper.NONE
                    }

                    // The start method will wait until the DOM is loaded.
                    ui.start('#firebaseui-auth-container', uiConfig);

                } else if (user.uid === 'aI2nIe6I8Ngt9K875WYmTFt274A2') {
                    self.authorized = true;
                } else {
                    firebase.auth().signOut();
                }
            })
        },
        methods: {
            // funciones que controlan el flujo de la app
        }
    });

})();