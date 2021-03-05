(function () {
    var db = firebase.firestore();

    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    new Vue({
        el: '#app',
        data: {
            authorized: true,
            user: null,
            userEmail: null,
            userEmailError: { dirty: false },
            emailSend: false,
            evento: null,
            eventoID: null,
        },
        created: function () {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    this.user = user;
                    this.authorized = true;
                    this.fetchEvent();
                } else {
                    this.authorized = false;
                }
            });
        },
        methods: {
            sendResetPassword: function () {
                this.userEmailError = { dirty: true };
                if (this.validEmail(this.userEmail)) {
                    firebase.auth().sendPasswordResetEmail(this.userEmail)
                        .then(res => this.emailSend = true)
                        .catch(err => this.userEmailError = { dirty: true, email: err.message });
                } else {
                    this.userEmailError.email = 'Introduce un email válido.'
                }
            },
            validEmail: function (email) {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
            },
            login() {
                ui.start('#firebaseui-auth-container', {
                    signInFlow: 'popup',
                    signInOptions: [
                        firebase.auth.EmailAuthProvider.PROVIDER_ID
                    ],
                    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
                });
            },
            fetchEvent: function () {
                db.collection('eventos')
                    .where('organizador', '==', this.user.email)
                    .get()
                    .then(querySnapshot => {
                        if (!querySnapshot.empty) {
                            var doc = querySnapshot.docs[0];
                            var data = doc.data();
                            data.fecha = data.fecha.toDate();
                            this.evento = data;
                            this.eventoID = doc.id;
                        }
                    });
            }
        }
    });
})();