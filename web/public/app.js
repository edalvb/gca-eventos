(function () {

    var db = firebase.firestore();

    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    new Vue({
        el: '#app',
        data: {
            authorized: null,
            eventos: null,
            currentEvent: {
                titulo: "",
                descripcion: "",
                fecha: "",
            },
            currentEventErrors: { dirty: false },
            modal: null
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
                    self.init();
                } else {
                    firebase.auth().signOut();
                }
            });
        },
        methods: {
            // funciones que controlan el flujo de la app
            init() {
                this.fechEventos();
            },
            fechEventos() {
                var self = this;
                db.collection('eventos').onSnapshot(snaptshot => {
                    var eventos = {};
                    snaptshot.forEach(doc => {
                        var evento = doc.data();
                        evento.fecha = evento.fecha.toDate();
                        eventos[doc.id] = evento;
                    });
                    self.eventos = eventos;
                    console.log(eventos);
                });
            },
            guardarEvento() {
                if (this.isValidEvent()) {
                    const milli = Math.floor(moment(this.currentEvent.fecha).valueOf() / 1000);
                    this.currentEvent.fecha = new firebase.firestore.Timestamp(milli, 0);
                    db.collection('eventos')
                        .add(this.currentEvent)
                        .then(docRef => {
                            this.resetEventoForm();
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
            },
            isValidEvent() {
                var isValid = true;
                this.currentEventErrors = { dirty: true };
                if (this.currentEvent.titulo.trim().length == 0) {
                    this.currentEventErrors.titulo = 'Indica un título';
                    isValid = false;
                }

                if (this.currentEvent.descripcion.trim().length == 0) {
                    this.currentEventErrors.descripcion = 'Indica una descripción';
                    isValid = false;
                }

                if (isNaN(Date.parse(this.currentEvent.fecha))) {
                    this.currentEventErrors.fecha = 'Indica una fecha';
                    isValid = false;
                } else if (Date.parse(this.currentEvent.fecha) - Date.parse(new Date) < 0) {
                    this.currentEventErrors.fecha = 'Indica una fecha en el futuro';
                    isValid = false;
                }

                return isValid;

            },
            resetEventoForm() {
                this.modal = new bootstrap.Modal(document.getElementById('eventoFormModal'));
                this.modal.hide();

                this.currentEventErrors = { dirty: false };
                this.currentEvent = {
                    titulo: "",
                    descripcion: "",
                    fecha: "",
                }
            }
        }
    });

})();